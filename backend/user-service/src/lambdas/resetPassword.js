import createError from "http-errors";
import bcrypt from "bcryptjs";
import validator from "@middy/validator";
import commonMiddleware from "../lib/commonMiddleware";
import { getUserByEmail } from "../lib/getUserByEmail";
import { updateUserById } from "../lib/updateUserById";
import { sendMail } from "../lib/sendMail";
import resetPasswordSchema from "../lib/Schema/resetPasswordSchema";

async function resetPassword(event, context) {
  const { email, password, resetCode } = event.body;

  // checking if a user with the provided email is already present in the db
  const userFromDB = await getUserByEmail(email);

  if (Object.keys(userFromDB).length === 0) {
    throw new createError.BadRequest(`A user with ${email} doesn't exists! Try registering.`);
  }

  if (userFromDB.resetCode !== resetCode.toString()) {
    throw new createError.BadRequest(`Invalid reset code ${resetCode}. Please try again!`);
  }

  //hashing the password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const params = {
    TableName: process.env.USER_TABLE_NAME,
    Key: { id: userFromDB.id },
    UpdateExpression: "SET #newPassword = :password, resetCode = :remove",
    ExpressionAttributeValues: {
      ":password": hashedPassword,
      ":remove": null,
    },
    ExpressionAttributeNames: {
      "#newPassword": "password",
    },
    ConditionExpression: "attribute_exists(id)",
    ReturnValues: "ALL_NEW",
  };

  await updateUserById(params);
  await sendMail({
    recipient: email,
    subject: "Password Changed - Mumbai University Grievance Redressal System",
    body: `Your Password has been successfully changed for Mumbai University Grievance Redressal System`,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Your Password has been successfully changed. You can now login with your new password.",
    }),
  };
}

export const handler = commonMiddleware(resetPassword).use(
  validator({
    inputSchema: resetPasswordSchema,
  })
);
