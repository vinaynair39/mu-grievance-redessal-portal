import validator from "@middy/validator";
import commonMiddleware from "../lib/commonMiddleware";
import invitePrincipalForMeetingSchema from "../lib/Schema/invitePrincipalForMeetingSchema";
import { sendMail } from "../lib/sendMail";
import { updateById } from "../lib/updateById";
import { getGrievanceById } from "./getGrievance";

async function invitePrincipalForMeeting(event, context) {
  const { id, principalEmail, collegeName } = event.body;
  const { meetingType, meetingJoinLink } = await getGrievanceById(id);

  const params = {
    TableName: process.env.CONTACTS_TABLE_NAME,
    Key: { collegeName: collegeName.trim() },
    UpdateExpression: "SET #email = :email",
    ExpressionAttributeNames: {
      "#email": "email",
    },
    ExpressionAttributeValues: {
      ":email": principalEmail,
    },
  };

  await updateById(params);

  let emailBody = "Fort/Vidyanagari Campus of University of Mumbai/Vidyapeeth Vidyarthi Bhavan, ‘B’ Road, Churchgate, Mumbai";

  if (meetingType.toUpperCase() === "VIRTUAL") emailBody = `Meeting Link ${meetingJoinLink} and password ${1234}`;

  await sendMail({
    subject: "Invitation to attend the meeting held to solve the grievance of your student",
    body: emailBody,
    email: principalEmail,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Invite successfully sent",
    }),
  };
}

export const handler = commonMiddleware(invitePrincipalForMeeting).use(validator({ inputSchema: invitePrincipalForMeetingSchema }));
