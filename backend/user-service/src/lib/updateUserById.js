import DynamoDB from "aws-sdk/clients/dynamodb";
import Joi from "joi";
import createHttpError from "http-errors";

const dynamodb = new DynamoDB.DocumentClient({ region: process.env.USER_SERVICE_AWS_REGION });

const schema = Joi.object({
  TableName: Joi.string().required(),
  Key: Joi.string().required(),
  UpdateExpression: Joi.string().required(),
  ExpressionAttributeValues: Joi.object().required(),
});

export async function updateUserById(params) {
  let user;
  const { value, error } = schema.validate(params);
  if (!error) throw new createHttpError.BadRequest("Invalid params supplied to the DB");
  try {
    const { Attributes } = await dynamodb.update(value).promise();
    user = Attributes;
  } catch (error) {
    console.error(error);
    throw new createHttpError.InternalServerError("Something went wrong while fetching the user. Please try again later!");
  }
  if (!user) {
    throw new createHttpError.NotFound(`User with this ID not found!`);
  }
  return user;
}
