import commonMiddleware from "../lib/commonMiddleware";
import DynamoDB from "aws-sdk/clients/dynamodb";
import createHttpError from "http-errors";

const dynamodb = new DynamoDB.DocumentClient({
  region: process.env.GRIEVANCE_SERVICE_AWS_REGION,
});

async function getEmailOfPrincipal(event, context) {
  const { collegeName } = event.pathParameters;
  const decodedCollegeName = decodeURI(collegeName).trim();
  let college;
  try {
    const { Item } = await dynamodb
      .get({
        TableName: process.env.CONTACTS_TABLE_NAME,
        Key: { collegeName: decodedCollegeName },
      })
      .promise();
    college = Item;
  } catch (error) {
    console.error(error);
    throw new createHttpError.InternalServerError("Something went wrong while fetching emails");
  }

  if (!!college) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        email: college.email,
        collegeName: college.collegeName,
      }),
    };
  } else {
    throw new createHttpError.BadRequest("College Email Doesn't exist!");
  }
}

export const handler = commonMiddleware(getEmailOfPrincipal);
