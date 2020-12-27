import commonMiddleware from "../lib/commonMiddleware";
import { getUserById } from "../lib/getUserById";

async function getUser(event, context) {
  const { id } = event.pathParameters;
  const student = await getUserById(id);
  return {
    statusCode: 200,
    body: JSON.stringify({ student }),
  };
}

export const handler = commonMiddleware(getUser);
