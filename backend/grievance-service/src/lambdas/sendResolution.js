import validator from "@middy/validator";
import commonMiddleware from "../lib/commonMiddleware";
import sendResolutionSchema from "../lib/Schema/sendResolutionSchema";
import { sendMail } from "../lib/sendMail";
import { updateById } from "../lib/updateById";

async function sendResolution(event, context) {
  const { subject, principalEmail, body, collegeName } = event.body;
  const { id } = event.pathParameters;

  const grievanceParams = {
    TableName: process.env.GRIEVANCE_TABLE_NAME,
    Key: { id },
    UpdateExpression: "SET resolutionLetter = list_append(resolutionLetter, :resolutionLetter)",
    ExpressionAttributeValues: {
      ":resolutionLetter": [
        {
          subject,
          body,
        },
      ],
    },
    ReturnValues: "ALL_NEW",
  };

  const grievancePromise = updateById(grievanceParams);

  const contactsParams = {
    TableName: process.env.CONTACTS_TABLE_NAME,
    Key: { collegeName: collegeName.trim() },
    UpdateExpression: "SET #email = :email",
    ExpressionAttributeNames: {
      "#email": "email",
    },
    ExpressionAttributeValues: {
      ":email": principalEmail,
    },
  };

  const contactsPromise = updateById(contactsParams);

  const emailPromise = sendMail({
    subject,
    body,
    email: principalEmail,
  });

  await Promise.all([grievancePromise, contactsPromise, emailPromise]);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Resolution sent!",
    }),
  };
}

export const handler = commonMiddleware(sendResolution).use(validator({ inputSchema: sendResolutionSchema }));
