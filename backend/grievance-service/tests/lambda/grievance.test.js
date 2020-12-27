import { handler as createGrievance } from "../../src/lambdas/createGrievance";
import { handler as addComment } from "../../src/lambdas/addComment";
import { handler as getGrievance } from "../../src/lambdas/getGrievance";
import { studentOne, secretaryOne } from "../utils/users";
import eventGenerator from "../utils/eventGenerator";
import { grievanceOne } from "../utils/grievances";

describe("Grievance End to End Test", () => {
  let grievanceId = "";

  test("should create a grievance", async () => {
    const event = eventGenerator({
      body: grievanceOne,
      authorizer: {
        ...studentOne,
      },
    });
    const { statusCode, body } = await createGrievance(event);
    const { id } = JSON.parse(body);
    grievanceId = id;
    expect(statusCode).toBe(201);
    const res = await getGrievance(
      eventGenerator({
        pathParametersObject: {
          id,
        },
      })
    );
    const { grievance, student } = JSON.parse(res.body);
    let withoutImageStudent = grievanceOne.studentInfo;
    delete withoutImageStudent.signature;

    expect(res.statusCode).toBe(200);
    expect(grievance).toMatchObject({
      complaintAgainst: grievanceOne.grievanceInfo.complaintAgainst,
      title: grievanceOne.grievanceInfo.title,
      description: grievanceOne.grievanceInfo.description,
    });
    expect(student.studentInfo).toMatchObject({
      ...withoutImageStudent,
    });
    expect(student.studentInfo.signatureUrl).toBeDefined();
  });

  test("should add comment", async () => {
    const { statusCode } = await addComment(
      eventGenerator({
        body: {
          comment: "Nice comment",
        },
        pathParametersObject: {
          id: grievanceId,
        },
        authorizer: secretaryOne,
      })
    );

    const res = await getGrievance(
      eventGenerator({
        pathParametersObject: {
          id: grievanceId,
        },
      })
    );
    const { grievance } = JSON.parse(res.body);

    expect(statusCode).toBe(200);
    expect(grievance.comments[grievance.comments.length - 1]).toMatchObject({
      authorEmail: secretaryOne.email,
      authorId: secretaryOne.id,
      authorImageUrl: "https://www.gstatic.com/tv/thumb/persons/163510/163510_v9_ba.jpg",
      authorName: secretaryOne.name,
      comment: "Nice comment",
    });
  });
});
