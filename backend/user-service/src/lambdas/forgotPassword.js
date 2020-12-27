import createError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware";
import { getUserByEmail } from "../lib/getUserByEmail";
import generateOtp from "../lib/generateOtp";
import { updateUserById } from "../lib/updateUserById";
import { sendMail } from "../lib/sendMail";

async function forgotPassword(event, context) {
  const { email } = event.pathParameters;
  const userFromDB = await getUserByEmail(email);

  if (Object.keys(userFromDB).length === 0) {
    throw new createError.BadRequest(`A user with ${email} doesn't exist! Try registering.`);
  }

  // if (userFromDB.userType === "STUDENT" && userFromDB.isVerified) throw new createError.BadRequest("Your email is not verified yet!");

  const resetCode = generateOtp();

  const paramsForDB = {
    TableName: process.env.USER_TABLE_NAME,
    Key: { id: userFromDB.id },
    UpdateExpression: "SET resetCode = :resetCode",
    ExpressionAttributeValues: {
      ":resetCode": resetCode,
    },
    ReturnValues: "ALL_NEW",
  };

  const paramsForEmail = { recipient: email, subject: "Your password rest Code for MUGS", body: `reset Code: ${resetCode}` };

  await Promise.all([updateUserById(paramsForDB), sendMail(paramsForEmail)]);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({
      message: "A password reset code has been sent to your Email ID. Enter that code along with your new password",
    }),
  };
}

export const handler = commonMiddleware(forgotPassword);
