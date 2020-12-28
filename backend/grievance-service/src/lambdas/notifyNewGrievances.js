import DynamoDB from "aws-sdk/clients/dynamodb";
import commonMiddleware from "../lib/commonMiddleware";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import utc from "dayjs/plugin/utc"; // dependent on utc plugin
import timezone from "dayjs/plugin/timezone";
import { sendMail } from "../lib/sendMail";

const dynamodb = new DynamoDB.DocumentClient({
  region: process.env.GRIEVANCE_SERVICE_AWS_REGION,
});

dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

async function notifyNewGrievances(event, context) {
  const params = {
    TableName: process.env.GRIEVANCE_TABLE_NAME,
    IndexName: "statusGSI",
    KeyConditionExpression: "#status = :status",
    ExpressionAttributeValues: {
      ":status": "NEW",
    },
    ExpressionAttributeNames: {
      "#status": "status",
    },
  };
  try {
    const { Items } = await dynamodb.query(params).promise();
    let yesterdaysDate = dayjs().subtract(1, "day");
    yesterdaysDate = dayjs(yesterdaysDate).tz("Asia/Kolkata").format("LLL");
    const yesterdaysGrievances = Items.filter(({ createdAt }) => {
      return yesterdaysDate === dayjs(createdAt).tz("Asia/Kolkata").format("LLL");
    });

    const previousGrievanceLength = Items.length - yesterdaysGrievances.length;
    if (yesterdaysGrievances.length > 0 || previousGrievanceLength > 0)
      await sendMail({
        subject: yesterdaysGrievances.length > 0 ? "New Grievances has been posted" : "Pending Grievances",
        body: `${yesterdaysGrievances.length} new grievances were posted yesterday. ${previousGrievanceLength} grievances were previously posted. You Login to the portal to view them`,
        email: "vnnair39@gmail.com",
      });

    return { notifyNewGrievances: yesterdaysGrievances.length, yesterdaysDate };
  } catch (error) {
    console.log(error);
  }
}

export const handler = commonMiddleware(notifyNewGrievances);
