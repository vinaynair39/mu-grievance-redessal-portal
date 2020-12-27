import validator from "@middy/validator";
import commonMiddleware from "../lib/commonMiddleware";
import status from "../lib/status";
import rejectGrievanceSchema from "../lib/Schema/rejectGrievanceSchema";
import { updateById } from "../lib/updateById";
import { sendMail } from "../lib/sendMail";

async function rejectGrievance(event, context) {
  const { id } = event.pathParameters;
  const { message, email } = event.body;

  const params = {
    TableName: process.env.GRIEVANCE_TABLE_NAME,
    Key: { id },
    UpdateExpression: "SET #status = :status",
    ExpressionAttributeNames: {
      "#status": "status",
    },
    ExpressionAttributeValues: {
      ":status": status.rejected,
    },
    ConditionExpression: "attribute_exists(id)",
    ReturnValues: "ALL_NEW",
  };

  const grievancePromise = updateById(params);

  const notifyStudentPromise = sendMail({
    subject: "Your Grievance has been rejected by the Mumbai University Grievance Redressal cell!",
    body: message,
    email,
  });

  await Promise.all([grievancePromise, notifyStudentPromise]);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Successfully rejected the Grievance",
    }),
  };
}

export const handler = commonMiddleware(rejectGrievance).use(validator({ inputSchema: rejectGrievanceSchema }));
