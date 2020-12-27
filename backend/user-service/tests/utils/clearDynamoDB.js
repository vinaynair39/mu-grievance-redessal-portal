import DynamoDB from "aws-sdk/clients/dynamodb";
import { allEmails } from "./users";

const dynamodb = new DynamoDB.DocumentClient({ region: process.env.USER_SERVICE_AWS_REGION });

const clearDynamoDB = async () => {
  try {
    const { Items: users } = await dynamodb
      .scan({
        TableName: process.env.USER_TABLE_NAME,
      })
      .promise();

    const promises = users.map(({ email, id }) => {
      if (allEmails.includes(email))
        return dynamodb
          .delete({
            TableName: process.env.USER_TABLE_NAME,
            Key: { id },
          })
          .promise();
    });
    await Promise.all(promises);
  } catch (error) {
    console.error(error);
  }
};

export default clearDynamoDB;
