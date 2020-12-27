// import sgMail from "@sendgrid/mail";
import AWS from "aws-sdk";
import createHttpError from "http-errors";

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const ses = new AWS.SES({ region: "ap-south-1" });

async function sendMail(event, context) {
  const record = event.Records[0];
  if (!record) throw new createHttpError.BadRequest("Record received from queue is invalid");

  const email = JSON.parse(record.body);
  const { subject, body, recipient } = email;

  const params = {
    Source: "vnnair39@gmail.com",
    Destination: {
      ToAddresses: [recipient],
    },
    Message: {
      Body: {
        Text: {
          Data: body,
        },
      },
      Subject: {
        Data: subject,
      },
    },
  };

  try {
    const result = await ses.sendEmail(params).promise();
    return result;
  } catch (error) {
    console.error(error);
  }
}

// async function sendMail(event, context) {
//   const record = event.Records[0];
//   const message = JSON.parse(record.body);
//   try {
//     await sgMail.send(message);
//   } catch (error) {
//     console.error(error);
//     throw new createError.InternalServerError(error);
//   }
// }

export const handler = sendMail;
