import DynamoDB from "aws-sdk/clients/dynamodb";
import createError from "http-errors";

const dynamodb = new DynamoDB.DocumentClient({
  region: process.env.GRIEVANCE_SERVICE_AWS_REGION,
});

export async function getUserById(id) {
  let user;
  try {
    const result = await dynamodb
      .get({
        TableName: process.env.USER_TABLE_NAME,
        Key: { id },
      })
      .promise();
    user = result.Item;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
  if (!user) {
    throw new createError.NotFound(`User with ID ${id} not found!`);
  }
  return user;
}
