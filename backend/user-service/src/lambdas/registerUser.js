import DynamoDB from "aws-sdk/clients/dynamodb";
import createError from "http-errors";
import bcrypt from "bcryptjs";
import validator from "@middy/validator";
import { v4 as uuid } from "uuid";
import commonMiddleware from "../lib/commonMiddleware";
import generateOtp from "../lib/generateOtp";
import { getUserByEmail } from "../lib/getUserByEmail";
import registerUserSchema from "../lib/Schema/registerUserSchema";
import { sendMail } from "../lib/sendMail";
import { uploadImageToS3 } from "../lib/uploadImageToS3";

const dynamodb = new DynamoDB.DocumentClient({ region: process.env.USER_SERVICE_AWS_REGION });

async function registerUser(event, context) {
  const { email, password } = event.body;
  let { userType } = event.pathParameters;
  let otp;

  userType = userType.toUpperCase();

  // checking if a user with the provided email is already present in the db
  const userFromDB = await getUserByEmail(email);
  if (Object.keys(userFromDB).length > 0) {
    throw new createError.BadRequest(`A user with email ${email} already exists!`);
  }

  //hashing the password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const user = {
    id: uuid(),
    email,
    password: hashedPassword,
    userType: userType,
  };

  /* if the userType is COMMITTEE, then we are expecting additional information to be sent from the front end
  which we are appending to the user object */
  if (userType !== "STUDENT") {
    const { designation, name, phoneNumber, collegeName, image } = event.body;
    let newImageUrl = "";
    if (!!image && Object.keys(image).length > 0) {
      newImageUrl = await uploadImageToS3({
        id: user.id,
        data: image.data,
        extension: image.extension,
      });
    }
    user.committeeInfo = {
      designation,
      name,
      phoneNumber,
      imageUrl: !!newImageUrl ? newImageUrl : "https://user-bucket-8282-dev.s3.ap-south-1.amazonaws.com/profile.jpg",
      collegeName,
    };
  } else {
    // we will be only verifying the email of students.
    otp = generateOtp();
    user.isVerified = false;
    user.otp = otp;
  }

  // saving the user into the db
  try {
    await dynamodb
      .put({
        TableName: process.env.USER_TABLE_NAME,
        Item: user,
      })
      .promise();
  } catch (error) {
    console.rror(error);
    throw new createError.InternalServerError("Problem occured while registering the user. Please try again later!");
  }

  // if we're registering a committee member, then we would also recieve an image of them that we are uplaoding into s3 and storing the url into dynamodb
  if (userType === "STUDENT") {
    sendMail({ recipient: email, subject: "Email Verification for Mumbai University Grievance Redessal System", body: `Your Verification Code: ${otp}` });
  }

  return {
    statusCode: 201,
    headers: {
      /* Required for CORS support to work */
      "Access-Control-Allow-Origin": "*",
      /* Required for cookies, authorization headers with HTTPS */
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({
      message: userType === "STUDENT" ? "An Otp has been sent to your email. Enter that otp to successfully register!" : "Sucessfully Registered!",
    }),
  };
}

export const handler = commonMiddleware(registerUser).use(
  validator({
    inputSchema: registerUserSchema,
  })
);
