import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getGrievances(event, context) {
  const { status = "NEW" } = event.queryStringParameters;
  let grievances;
  const params = {
    TableName: process.env.GRIEVANCE_TABLE_NAME,
    IndexName: "statusGSI",
    KeyConditionExpression: "#status = :status",
    ExpressionAttributeValues: {
      ":status": status.toUpperCase(),
    },
    ExpressionAttributeNames: {
      "#status": "status",
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

export const handler = commonMiddleware(getGrievances);
