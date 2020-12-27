import createError from "http-errors";
import bcrypt from "bcryptjs";
import validator from "@middy/validator";
import commonMiddleware from "../lib/commonMiddleware";
import { updateUserById } from "../lib/updateUserById";
import { uploadImageToS3 } from "../lib/uploadImageToS3";
import updateCommitteeSchema from "../lib/Schema/updateCommitteeSchema";

async function updateCommittee(event, context) {
  const { id } = event.pathParameters;
  const { email, password, designation, name, phoneNumber, imageUrl, image, collegeName } = event.body;
  const { userType } = event.requestContext.authorizer;

  if (userType !== "SECRETARY") {
    throw new createError.Unauthorized("Unauthorized!");
  }

  //hashing the password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  //  we are uplaoding the image (if provided) into s3 and storing the url into dynamodb
  let newImageUrl = null;
  if (!!image && Object.keys(image).length > 0) {
    newImageUrl = await uploadImageToS3({
      id,
      data: image.data,
      extension: image.extension,
    });
  }

  const params = {
    TableName: process.env.USER_TABLE_NAME,
    Key: { id },
    UpdateExpression: "SET email = :email, password = :password, committeeInfo = :info",
    ExpressionAttributeValues: {
      ":info": { imageUrl: !!newImageUrl ? newImageUrl : imageUrl, designation, phoneNumber, collegeName, name },
      ":email": email,
      ":password": hashedPassword,
    },
    ConditionExpression: "attribute_exists(id)",
    ReturnValues: "ALL_NEW",
  };

  await updateUserById(params);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Successfully Updated ${name}`,
    }),
  };
}

export const handler = commonMiddleware(updateCommittee).use(validator({ inputSchema: updateCommitteeSchema }));
