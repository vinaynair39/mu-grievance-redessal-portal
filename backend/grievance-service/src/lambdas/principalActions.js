import validator from "@middy/validator";
import commonMiddleware from "../lib/commonMiddleware";
import principalActionsSchema from "../lib/Schema/principalActionsSchema";
import { updateById } from "../lib/updateById";
import { uploadDocs } from "../lib/uploadDocs";

async function principalActions(event, context) {
  const { comments, documents } = event.body;
  const { id } = event.pathParameters;

  const { supportingDocsUrls = [] } = await uploadDocs({
    supportingDocs: documents,
  });

  const params = {
    TableName: process.env.GRIEVANCE_TABLE_NAME,
    Key: { id },
    UpdateExpression:
      "SET actionTakenByPrincipal.documents = list_append(actionTakenByPrincipal.documents, :documents), actionTakenByPrincipal.comments = list_append(actionTakenByPrincipal.comments, :comments)",
    ExpressionAttributeValues: {
      ":documents": supportingDocsUrls,
      ":comments": comments,
    },
  };

  await updateById(params);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Submitted Successfully!",
    }),
  };
}

export const handler = commonMiddleware(principalActions).use(validator({ inputSchema: principalActionsSchema }));
