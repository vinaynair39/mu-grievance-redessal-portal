import commonMiddleware from "../lib/commonMiddleware";
import { getUserById } from "../lib/getUserById";
import createError from "http-errors";

async function getCommittee(event, context) {
  const { id } = event.pathParameters;
  const { userType } = event.requestContext.authorizer;

  if (userType === "STUDENT") {
    throw new createError.Unauthorized("Unauthorized!");
  }

  const committee = await getUserById(id);

  if (Object.keys(committee).length === 0) {
    throw new createError.Forbidden(`A user with ID ${id} doesn't exist!`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(committee),
  };
}

export const handler = commonMiddleware(getCommittee);
