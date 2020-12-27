import validator from "@middy/validator";
import commonMiddleware from "../lib/commonMiddleware";
import { uploadDocs } from "../lib/uploadDocs";
import { updateById } from "../lib/updateById";
import { sendMail } from "../lib/sendMail";
import updateGrievanceSchema from "../lib/Schema/updateGrievanceSchema";

async function updateGrievance(event, context) {
  const { id } = event.pathParameters;
  const {
    studentInfo: { signature, signatureUrl, ...studentInfoRest },
    grievanceInfo: { supportingDocs = [], cgrcDocs = [], supportingDocsUrls = [], cgrcDocsUrls = [], ...grievanceInfoRest },
  } = event.body;

  const { id: userId, email } = event.requestContext.authorizer;

  const { supportingDocsUrls: newSupportingDocsUrls, cgrcDocsUrls: newCgrcDocsUrls, signatureUrl: newSignatureUrl } = await uploadDocs({
    supportingDocs,
    cgrcDocs,
    signature,
  });

  const student = {
    signatureUrl: !!newSignatureUrl ? newSignatureUrl : signatureUrl,
    ...studentInfoRest,
  };

  const grievance = {
    ...grievanceInfoRest,
    status: "NEW",
    updatedAt: new Date().toISOString(),
  };

  cgrcDocsUrls.push(...newCgrcDocsUrls);
  supportingDocsUrls.push(...newSupportingDocsUrls);

  if (cgrcDocsUrls.length > 0) {
    grievance.cgrcDocsUrls = cgrcDocsUrls;
  }
  if (supportingDocsUrls.length > 0) {
    grievance.supportingDocsUrls = supportingDocsUrls;
  }

  let updateExpressionForGrievance = "SET";
  let expressionAttributeValuesForGrievance = {};
  let expressionAttributeNamesForGrievance = {};

  for (const key in grievance) {
    if (!!grievance[key]) {
      updateExpressionForGrievance += ` #${key} = :${key},`;
      expressionAttributeValuesForGrievance[`:${key}`] = grievance[key];
      expressionAttributeNamesForGrievance[`#${key}`] = key;
    }
  }
  updateExpressionForGrievance = updateExpressionForGrievance.slice(0, -1);

  const grievanceParams = {
    TableName: process.env.GRIEVANCE_TABLE_NAME,
    Key: { id },
    UpdateExpression: updateExpressionForGrievance,
    ExpressionAttributeValues: expressionAttributeValuesForGrievance,
    ExpressionAttributeNames: expressionAttributeNamesForGrievance,
    ReturnValues: "ALL_NEW",
  };

  let updateExpressionForStudent = "SET";
  let expressionAttributeValuesForStudent = {};
  for (const key in student) {
    if (!!student[key]) {
      updateExpressionForStudent += ` studentInfo.${key} = :${key},`;
      expressionAttributeValuesForStudent[`:${key}`] = student[key];
    }
  }

  updateExpressionForStudent = updateExpressionForStudent.slice(0, -1);

  const studentParams = {
    TableName: process.env.USER_TABLE_NAME,
    Key: { id: userId },
    UpdateExpression: updateExpressionForStudent,
    ExpressionAttributeValues: expressionAttributeValuesForStudent,
    ConditionExpression: "attribute_exists(id)",
    ReturnValues: "ALL_NEW",
  };

  const grievancePromise = updateById(grievanceParams);
  const studentInfoPromise = updateById(studentParams);
  const notifyStudent = sendMail({
    subject: "Your Grievance has been updated successfully!",
    email,
    body: `Your Grievance has been updated. You can view the status of it on the dashboard. We will get back to you as soon as possible.`,
  });

  await Promise.all([studentInfoPromise, grievancePromise, notifyStudent]);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Success",
      body: [signatureUrl, supportingDocsUrls, cgrcDocsUrls],
    }),
  };
}

export const handler = commonMiddleware(updateGrievance).use(
  validator({
    inputSchema: updateGrievanceSchema,
  })
);
