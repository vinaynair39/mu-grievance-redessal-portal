import validator from "@middy/validator";
import commonMiddleware from "../lib/commonMiddleware";
import invitePrincipalForMeetingSchema from "../lib/Schema/invitePrincipalForMeetingSchema";
import { sendMail } from "../lib/sendMail";
import { updateById } from "../lib/updateById";
import { getGrievanceById } from "./getGrievance";

async function invitePrincipalForMeeting(event, context) {
  const { id, principalEmail, collegeName } = event.body;
  const { meetingType, meetingJoinLink, title } = await getGrievanceById(id);

  console.log(id, principalEmail, collegeName, meetingType, meetingJoinLink, title);

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

  await sendMail({
    subject: "A Grievance has been posted by a student from your college -  Mumbai University Grievance Redressal Cell",
    body: `A grievance stating - "${title}" has been posted in our portal. You can view detailed information about this grievance over here: ${
      process.env.FRONT_END_URL + "/upload/" + id
    }`,
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
