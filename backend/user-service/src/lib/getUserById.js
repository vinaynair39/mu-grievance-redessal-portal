import DynamoDB from "aws-sdk/clients/dynamodb";
import createHttpError from "http-errors";

const dynamodb = new DynamoDB.DocumentClient({ region: process.env.USER_SERVICE_AWS_REGION });

export async function getUserById(id) {
  if (!id) throw new createHttpError.BadRequest("No ID provided for fetching the user!");
  let user;
  try {
    const { Item } = await dynamodb
      .get({
        TableName: process.env.USER_TABLE_NAME,
        Key: { id },
      })
      .promise();
    user = Item;
  } catch (error) {
    console.error(error);
    throw new createHttpError.InternalServerError("Something went wrong while fetching the user. Please try again later!");
  }
  if (!user) {
    throw new createHttpError.NotFound(`User with ID ${id} not found! ${process.env.USER_TABLE_NAME}`);
  }

  return user;
}
