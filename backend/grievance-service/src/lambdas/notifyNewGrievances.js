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

  const userParms = {
    TableName: process.env.USER_TABLE_NAME,
    IndexName: "userTypeGSI",
    KeyConditionExpression: "userType = :userType",
    ExpressionAttributeValues: {
      ":userType": "SECRETARY",
    },
    ProjectionExpression: "email",
  };
  try {
    //fetching the grievances
    const { Items } = await dynamodb.query(params).promise();

    //fetching the secretary email
    const { Items: secretary } = await dynamodb.query(userParms).promise();
    const secretaryEmail = secretary.map((ele) => ele.email);

    //finding yesterday's date
    let yesterdaysDate = dayjs().subtract(1, "day");
    yesterdaysDate = dayjs(yesterdaysDate).tz("Asia/Kolkata").format("LLL");

    //finding all the grievances whos createdAt property matches yesterday's date
    const yesterdaysGrievances = Items.filter(({ createdAt }) => {
      return yesterdaysDate === dayjs(createdAt).tz("Asia/Kolkata").format("LLL");
    });

    const previousGrievanceLength = Items.length - yesterdaysGrievances.length;

    if (yesterdaysGrievances.length > 0)
      await sendMail({
        subject: yesterdaysGrievances.length > 0 ? "New Grievances has been posted" : "Pending Grievances",
        body: `${yesterdaysGrievances.length} new grievances were posted yesterday. ${previousGrievanceLength} grievances were previously posted. You Login to the portal to view them`,
        email: secretaryEmail,
      });
    return { notifyNewGrievances: yesterdaysGrievances.length, yesterdaysDate };
  } catch (error) {
    console.log(error);
  }
}

export const handler = commonMiddleware(notifyNewGrievances);
