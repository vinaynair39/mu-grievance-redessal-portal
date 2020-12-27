import DynamoDB from "aws-sdk/clients/dynamodb";
import createError from "http-errors";

const dynamodb = new DynamoDB.DocumentClient({
  region: process.env.GRIEVANCE_SERVICE_AWS_REGION,
});

export async function updateById(params) {
  let data;
  try {
    const { Attributes } = await dynamodb.update(params).promise();
    data = Attributes;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
  return data;
}
