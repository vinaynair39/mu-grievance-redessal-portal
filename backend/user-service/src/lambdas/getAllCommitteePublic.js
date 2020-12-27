import DynamoDB from "aws-sdk/clients/dynamodb";
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";

const dynamodb = new DynamoDB.DocumentClient({ region: process.env.USER_SERVICE_AWS_REGION });

const getParams = (userType) => ({
  TableName: process.env.USER_TABLE_NAME,
  IndexName: "userTypeGSI",
  KeyConditionExpression: "userType = :userType",
  ExpressionAttributeValues: {
    ":userType": userType,
  },
  ProjectionExpression: "id, committeeInfo, email",
});

async function getAllCommitteePublic(event, context) {
  let committee = [];
  try {
    const { Items } = await dynamodb.query(getParams("COMMITTEE")).promise();
    committee = Items;
    const { Items: secretary } = await dynamodb.query(getParams("SECRETARY")).promise();
    committee.unshift(...secretary);
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError("Something went wrong, Please try again later!");
  }

  return {
    statusCode: 200,
    body: JSON.stringify(committee),
  };
}

export const handler = commonMiddleware(getAllCommitteePublic);
