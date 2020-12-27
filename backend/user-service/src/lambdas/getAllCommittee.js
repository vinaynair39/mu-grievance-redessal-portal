import DynamoDB from "aws-sdk/clients/dynamodb";
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";

const dynamodb = new DynamoDB.DocumentClient({ region: process.env.USER_SERVICE_AWS_REGION });

async function getAllCommittee(event, context) {
  const { userType } = event.requestContext.authorizer;
  let committee;

  if (userType !== "SECRETARY") {
    throw new createError.Unauthorized("Unauthorized!");
  }

  const paramsForDB = {
    TableName: process.env.USER_TABLE_NAME,
    IndexName: "userTypeGSI",
    KeyConditionExpression: "userType = :userType",
    ExpressionAttributeValues: {
      ":userType": "COMMITTEE",
    },
  };

  try {
    const result = await dynamodb.query(paramsForDB).promise();
    committee = result.Items;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ committee }),
  };
}

export const handler = commonMiddleware(getAllCommittee);
