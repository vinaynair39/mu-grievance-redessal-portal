import validator from "@middy/validator";
import commonMiddleware from "../lib/commonMiddleware";
import status from "../lib/status";
import { sendMail } from "../lib/sendMail";
import { updateById } from "../lib/updateById";
import sendResolutionSchema from "../lib/Schema/sendResolutionSchema";

async function sendATR(event, context) {
  const { subject, principalEmail, body, collegeName } = event.body;
  const { id } = event.pathParameters;

  const grievanceParams = {
    TableName: process.env.GRIEVANCE_TABLE_NAME,
    Key: { id },
    UpdateExpression: "SET #status = :status, solvedAt = :solvedAt, actionTakenReport = :actionTakenReport",
    ExpressionAttributeNames: {
      "#status": "status",
    },
    ExpressionAttributeValues: {
      ":actionTakenReport": {
        subject,
        body,
      },
      ":status": status.solved,
      ":solvedAt": new Date().toISOString(),
    },
    ReturnValues: "ALL_NEW",
  };

  const { authorEmail } = await updateById(grievanceParams);

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

  const emailToPrincipalPromise = sendMail({
    subject,
    body,
    email: principalEmail,
  });

  const emailToStudentPromise = sendMail({
    subject,
    body,
    email: authorEmail,
  });

  await Promise.all([contactsPromise, emailToPrincipalPromise, emailToStudentPromise]);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Action Taken Report sent!",
    }),
  };
}

export const handler = commonMiddleware(sendATR).use(validator({ inputSchema: sendResolutionSchema }));
