import SQS from "aws-sdk/clients/sqs";
import createError from "http-errors";

const sqs = new SQS({
  region: process.env.USER_SERVICE_AWS_REGION,
});

export async function sendMail({ subject, recipient, body }) {
  try {
    await sqs
      .sendMessage({
        QueueUrl: process.env.MAIL_QUEUE_URL,
        MessageBody: JSON.stringify({
          subject: subject,
          recipient: recipient,
          body: body,
        }),
      })
      .promise();
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError("Some error occured while sending the mail to the queue");
  }
}
