import createError from "http-errors";
import AWS from "aws-sdk";

const sqs = new AWS.SQS({
  region: process.env.GRIEVANCE_SERVICE_AWS_REGION,
});

export async function sendMail({ subject, email, body }) {
  try {
    await sqs
      .sendMessage({
        QueueUrl: process.env.MAIL_QUEUE_URL,
        MessageBody: JSON.stringify({
          subject: subject,
          recipient: email,
          body: body,
        }),
      })
      .promise();
  } catch (error) {
    throw new createError.InternalServerError("some error occured while sending the mail to the queue");
  }
}
