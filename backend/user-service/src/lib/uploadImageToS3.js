import S3 from "aws-sdk/clients/s3";
import createError from "http-errors";
import Joi from "joi";

const s3 = new S3({
  region: process.env.USER_SERVICE_AWS_REGION,
});

const schema = Joi.object({
  id: Joi.string().required(),
  data: Joi.string().base64().required(),
  extension: Joi.string().valid("jpg", "png").required(),
});

export async function uploadImageToS3({ id, data, extension }) {
  const base64 = data.replace(/^data:image\/\w+;base64,/, "");
  let imageUrl = null;
  try {
    const { value, error } = schema.validate({ id, data: base64, extension });
    if (!!error) return imageUrl;
    const buffer = Buffer.from(value.data, "base64");
    const result = await s3
      .upload({
        Bucket: process.env.USER_BUCKET_NAME,
        Key: `${value.id}.${value.extension}`,
        Body: buffer,
        ContentEncoding: "base64",
        ContentType: "image/jpeg",
      })
      .promise();
    imageUrl = result.Location;
    return imageUrl;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError("A problem occured while saving the image. Please try again later!");
  }
}
