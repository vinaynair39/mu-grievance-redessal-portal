import validator from "@middy/validator";
import createError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware";
import { getUserByEmail } from "../lib/getUserByEmail";
import verifyUserSchema from "../lib/Schema/verifyUserSchema";
import { updateUserById } from "../lib/updateUserById";

async function verifyUser(event, context) {
  const { otp: otpFromUser, email } = event.body;
  const { id, otp, isVerified } = await getUserByEmail(email);
  let updatedUser;

  if (!id) throw new createError.BadRequest("Invalid Email. This User Doesn't exist in our system. Try registering!");
  if (isVerified) throw new createError.BadRequest("Your email is already verified. Please login.");
  if (!(otpFromUser.toString() === otp)) throw new createError.BadRequest("Invalid Otp");

  const params = {
    TableName: process.env.USER_TABLE_NAME,
    Key: { id },
    UpdateExpression: "SET isVerified = :verified, otp = :remove",
    ExpressionAttributeValues: {
      ":verified": true,
      ":remove": null,
    },
    ConditionExpression: "attribute_exists(id)",
    ReturnValues: "ALL_NEW",
  };

  await updateUserById(params);

  return {
    statusCode: 200,
    headers: {
      /* Required for CORS support to work */
      "Access-Control-Allow-Origin": "*",
      /* Required for cookies, authorization headers with HTTPS */
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({
      message: "Successfully registered! Now you can login to the system.",
      user: updatedUser,
    }),
  };
}

export const handler = commonMiddleware(verifyUser).use(
  validator({
    inputSchema: verifyUserSchema,
  })
);
