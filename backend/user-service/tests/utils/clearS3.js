import S3 from "aws-sdk/clients/s3";

const s3 = new S3({ region: process.env.USER_SERVICE_AWS_REGION });

const clearS3 = async () => {
  try {
    const { Items: users } = await dynamodb
      .scan({
        TableName: process.env.USER_TABLE_NAME,
      })
      .promise();

    const promises = users.map((user) => {
      return dynamodb
        .delete({
          TableName: process.env.USER_TABLE_NAME,
          Key: { id: user.id },
        })
        .promise();
    });
    await Promise.all(promises);
  } catch (error) {
    console.error(error);
  }
};

export default clearS3;
