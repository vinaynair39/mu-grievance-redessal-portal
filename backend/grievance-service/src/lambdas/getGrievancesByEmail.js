import DynamoDB from "aws-sdk/clients/dynamodb";
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";

const dynamodb = new DynamoDB.DocumentClient();

async function getGrievancesByEmail(event, context) {
  const { email } = event.requestContext.authorizer;
  let grievances;

  const params = {
    TableName: process.env.GRIEVANCE_TABLE_NAME,
    IndexName: "authorEmailGSI",
    KeyConditionExpression: "authorEmail = :email",
    ExpressionAttributeValues: {
      ":email": email,
    },
  };
  try {
    const result = await dynamodb.query(params).promise();
    grievances = result.Items;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError("Something went wrong while fetching grievances");
  }

  return {
    statusCode: 200,
    body: JSON.stringify(grievances),
  };
}

export const handler = commonMiddleware(getGrievancesByEmail);
