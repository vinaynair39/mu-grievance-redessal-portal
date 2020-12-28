import S3 from "aws-sdk/clients/s3";
import createError from "http-errors";

const s3 = new S3({
  region: process.env.GRIEVANCE_SERVICE_AWS_REGION,
});

export async function uploadImageToS3({ id, data, extension }) {
  const base64 = data.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64, "base64");
  let imageUrl;
  try {
    const result = await s3
      .upload({
        Bucket: process.env.GRIEVANCE_BUCKET_NAME,
        Key: `${id}.${extension}`,
        Body: buffer,
        ContentEncoding: "base64",
        ContentType: "image/jpeg",
      })
      .promise();
    imageUrl = result.Location;
  } catch (error) {
    throw new createError.InternalServerError("A problem occured while saving the image. Please try again later!");
  }

  return imageUrl;
}
