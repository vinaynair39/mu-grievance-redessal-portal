import DynamoDB from "aws-sdk/clients/dynamodb";
import createError from "http-errors";
import validator from "@middy/validator";
import { v4 as uuid } from "uuid";
import commonMiddleware from "../lib/commonMiddleware";
import Status from "../lib/status";
import { uploadDocs } from "../lib/uploadDocs";
import { updateById } from "../lib/updateById";
import { sendMail } from "../lib/sendMail";
import createGrievanceSchema from "../lib/Schema/createGrievanceSchema";

const dynamodb = new DynamoDB.DocumentClient({
  region: process.env.GRIEVANCE_SERVICE_AWS_REGION,
});

async function createGrievance(event, context) {
  const {
    studentInfo: { signature, ...studentInfoRest },
    grievanceInfo: { complaintAgainst, title, description, supportingDocs, cgrcDocs },
  } = event.body;

  const { id: userId, email } = event.requestContext.authorizer;

  const { supportingDocsUrls, cgrcDocsUrls, signatureUrl } = await uploadDocs({
    supportingDocs,
    cgrcDocs,
    signature,
  });

  const studentInfo = {
    signatureUrl,
    ...studentInfoRest,
  };

  if (!!signatureUrl) {
    studentInfo.signatureUrl = signatureUrl;
  }

  const grievance = {
    id: uuid(),
    title,
    description,
    complaintAgainst,
    cgrcDocsUrls: cgrcDocsUrls,
    supportingDocsUrls: supportingDocsUrls,
    authorId: userId,
    authorEmail: email,
    status: Status.new,
    createdAt: new Date().toISOString(),
    updatedAt: null,
    allotedAt: null,
    solvedAt: null,
    againstCollegeName: studentInfo.collegeName,
    meetingType: null,
    meetingStartLink: null,
    meetingJoinLink: null,
    resolutionLetter: [],
    actionTakenByPrincipal: {
      documents: [],
      comments: [],
    },
    actionTakenReport: null,
    comments: [],
  };

  // saving the grievance into the db
  let grievancePromise;
  try {
    grievancePromise = dynamodb
      .put({
        TableName: process.env.GRIEVANCE_TABLE_NAME,
        Item: grievance,
      })
      .promise();
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError("Problem occured while saving the Grievance into the database. Please try again later.");
  }

  let updateExpressionForStudent = "SET";
  let expressionAttributeValuesForStudent = {};
  for (const key in studentInfo) {
    if (!!studentInfo[key]) {
      updateExpressionForStudent += ` studentInfo.${key} = :${key},`;
      expressionAttributeValuesForStudent[`:${key}`] = studentInfo[key];
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

  const studentInfoPromise = updateById(studentParams);

  const notifyStudent = sendMail({
    subject: "Your Grievance has been submitted successfully!",
    email,
    body: `Your Grievance ${title} has been submitted. You can view the status of it on the portal. We will get back to you as soon as possible.`,
  });

  await Promise.all([studentInfoPromise, grievancePromise, notifyStudent]);

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "Successfully submitted!",
      id: grievance.id,
    }),
  };
}

export const handler = commonMiddleware(createGrievance).use(
  validator({
    inputSchema: createGrievanceSchema,
  })
);
