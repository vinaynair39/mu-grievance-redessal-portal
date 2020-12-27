import request from "request";
import moment from "moment";
import commonMiddleware from "../lib/commonMiddleware";
import status from "../lib/status";
import { updateById } from "../lib/updateById";
import { sendMail } from "../lib/sendMail";

async function allocateDate(event, context) {
  const { id } = event.pathParameters;
  let { meetingType, date } = event.body;
  const { token } = event.requestContext.authorizer;
  let joinUrl = null;
  let startUrl = null;
  let emailBody = "Fort/Vidyanagari Campus of University of Mumbai/Vidyapeeth Vidyarthi Bhavan, ‘B’ Road, Churchgate, Mumbai";

  const formatedDate = moment(date).format("YYYY-MM-DDTHH:mm:ss");

  if (meetingType.toUpperCase() === "VIRTUAL") {
    const options = {
      method: "POST",
      url: `https://api.zoom.us/v2/users/${process.env.ZOOM_API_EMAIL}/meetings`,
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: {
        topic: "Regarding grievance",
        type: 2,
        password: "12345",
        timezone: "Asia/Kolkata",
        start_time: formatedDate,
      },
      json: true,
    };

    const result = new Promise((resolve, reject) => {
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        return resolve(body);
      });
    });

    const { join_url, start_url, password } = await result;
    joinUrl = join_url;
    startUrl = start_url;
    emailBody = `Meeting Link ${join_url} and password ${password}`;
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
    subject: "Regarding your grievance",
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
