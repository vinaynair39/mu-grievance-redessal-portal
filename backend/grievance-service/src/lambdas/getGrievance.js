import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";
import { getUserById } from "../lib/getUserById";

const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: process.env.GRIEVANCE_SERVICE_AWS_REGION,
});

export async function getGrievanceById(id) {
  let grievance;
  try {
    const result = await dynamodb
      .get({
        TableName: process.env.GRIEVANCE_TABLE_NAME,
        Key: { id },
      })
      .promise();
    grievance = result.Item;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  if (!grievance) {
    throw new createError.NotFound(`Grievance with ID ${id} not found!`);
  }
  return grievance;
}

async function getGrievance(event, context) {
  const { id } = event.pathParameters;
  const grievance = await getGrievanceById(id);
  const student = await getUserById(grievance.authorId);

  return {
    statusCode: 200,
    body: JSON.stringify({
      grievance,
      student,
    }),
  };
}

export const handler = commonMiddleware(getGrievance);
