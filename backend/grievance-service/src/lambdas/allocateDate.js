import request from "request";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import utc from "dayjs/plugin/utc"; // dependent on utc plugin
import timezone from "dayjs/plugin/timezone";
import commonMiddleware from "../lib/commonMiddleware";
import status from "../lib/status";
import { updateById } from "../lib/updateById";
import { sendMail } from "../lib/sendMail";
import { getGrievanceById } from "./getGrievance";

dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

async function allocateDate(event, context) {
  const { id } = event.pathParameters;
  const { token } = event.requestContext.authorizer;
  let { meetingType, date } = event.body;
  const { title } = await getGrievanceById(id);

  let joinUrl = null;
  let startUrl = null;

  let emailBody = `A Meeting has been scheduled on ${dayjs(date)
    .tz("Asia/Kolkata")
    .format(
      "LLL"
    )} for your grievance to be solved. You will have to come to Fort/Vidyanagari Campus of University of Mumbai/Vidyapeeth Vidyarthi Bhavan, ‘B’ Road, Churchgate, Mumbai`;

  if (meetingType.toUpperCase() === "VIRTUAL") {
    const options = {
      method: "POST",
      url: `https://api.zoom.us/v2/users/${process.env.ZOOM_API_EMAIL}/meetings`,
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: {
        topic: `Regarding grievance ${title}`,
        type: 2,
        password: "12345",
        timezone: "Asia/Kolkata",
        start_time: date,
      },
      json: true,
    };

    const result = new Promise((resolve, reject) => {
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        return resolve(body);
      });
    });

    const { join_url, start_url } = await result;

    joinUrl = join_url;
    startUrl = start_url;
    emailBody = `A Virtual Meeting has been scheduled on ${dayjs(date)
      .tz("Asia/Kolkata")
      .format("LLL")} for your grievance to be solved.The Meeting Link is ${join_url}.`;
  }

  const grievanceParams = {
    TableName: process.env.GRIEVANCE_TABLE_NAME,
    Key: { id },
    UpdateExpression:
      "SET allotedAt = :allotedAt, meetingType = :meetingType, #status = :status, meetingStartLink = :meetingStartLink, meetingJoinLink = :meetingJoinLink",
    ExpressionAttributeValues: {
      ":allotedAt": date,
      ":meetingType": meetingType,
      ":status": status.underProcess,
      ":meetingStartLink": startUrl,
      ":meetingJoinLink": joinUrl,
    },
    ExpressionAttributeNames: {
      "#status": "status",
    },
    ConditionExpression: "attribute_exists(id)",
    ReturnValues: "ALL_NEW",
  };

  const { authorEmail } = await updateById(grievanceParams);

  await sendMail({
    subject: `Regarding your grievance ${title}`,
    email: authorEmail,
    body: emailBody,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "successfully alloted the date",
    }),
  };
}

export const handler = commonMiddleware(allocateDate);
