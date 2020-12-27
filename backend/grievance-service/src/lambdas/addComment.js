import validator from "@middy/validator";
import createHttpError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware";
import { getUserById } from "../lib/getUserById";
import addCommentSchema from "../lib/Schema/addCommentSchema";
import { updateById } from "../lib/updateById";

async function addComment(event, context) {
  const { id } = event.pathParameters;
  const { comment } = event.body;
  const { email, id: userId, userType } = event.requestContext.authorizer;
  const { committeeInfo } = await getUserById(userId);

  if (userType === "STUDENT") throw new createHttpError.Forbidden("Unauthorized!");

  const formatedComment = {
    comment,
    authorEmail: email,
    authorId: userId,
    authorName: committeeInfo.name,
    authorImageUrl: committeeInfo.imageUrl,
  };

  const params = {
    TableName: process.env.GRIEVANCE_TABLE_NAME,
    Key: { id },
    UpdateExpression: "SET #comments = list_append(#comments, :comment)",
    ExpressionAttributeValues: {
      ":comment": [formatedComment],
    },
    ExpressionAttributeNames: {
      "#comments": "comments",
    },
    ConditionExpression: "attribute_exists(id)",
    ReturnValues: "ALL_NEW",
  };

  await updateById(params);

  return {
    statusCode: 200,
    body: JSON.stringify("Successfully added the comment!"),
  };
}

export const handler = commonMiddleware(addComment).use(validator({ inputSchema: addCommentSchema }));
