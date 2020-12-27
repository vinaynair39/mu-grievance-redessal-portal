import status from "../lib/status";
import commonMiddleware from "../lib/commonMiddleware";
import { updateById } from "../lib/updateById";
import { sendMail } from "../lib/sendMail";

async function selectGrievance(event, context) {
  const { id } = event.pathParameters;

  const params = {
    TableName: process.env.GRIEVANCE_TABLE_NAME,
    Key: { id },
    UpdateExpression: "SET #status = :status",
    ExpressionAttributeValues: {
      ":status": status.selected,
    },
    ExpressionAttributeNames: {
      "#status": "status",
    },
    ConditionExpression: "attribute_exists(id)",
    ReturnValues: "ALL_NEW",
  };

  const grievance = await updateById(params);

  await sendMail({
    subject: "Your Grievance has been seen by the Mumbai University Grievance Redressal cell",
    body: "The redressal cell will get back to you as soon as possible to help you with it.",
    email: grievance.authorEmail,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Successfully selected the Grievance",
    }),
  };
}

export const handler = commonMiddleware(selectGrievance);
