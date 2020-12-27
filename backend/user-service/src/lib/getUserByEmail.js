import DynamoDB from "aws-sdk/clients/dynamodb";
import createHttpError from "http-errors";

const dynamodb = new DynamoDB.DocumentClient({ region: process.env.USER_SERVICE_AWS_REGION });

export async function getUserByEmail(email) {
  if (!email || typeof email !== "string") throw new createHttpError.BadRequest("Invalid email provided for fetching the user!");

  const params = {
    TableName: process.env.USER_TABLE_NAME,
    IndexName: "emailGSI",
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": email,
    },
  };

  try {
    const { Items } = await dynamodb.query(params).promise();
    return Items.length > 0 ? Items[0] : {};
  } catch (error) {
    console.error(error);
    throw new createHttpError.InternalServerError("Something went wrong while fetching the user from the database.");
  }
}
