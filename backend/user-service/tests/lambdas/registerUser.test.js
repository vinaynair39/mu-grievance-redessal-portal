import { handler } from "../../src/lambdas/registerUser";
import { getUserByEmail } from "../../src/lib/getUserByEmail";
import eventGenerator from "../utils/eventGenerator";
import { studentOne, committeeOne, committeeTwo } from "../utils/users";

describe("Register User Intergration Test", () => {
  test("Should register a student", async () => {
    const event = eventGenerator({
      body: studentOne,
      pathParametersObject: {
        userType: "STUDENT",
      },
    });
    const res = await handler(event);
    expect(res.statusCode).toBe(201);
  });

  test("Should not register user (email already exist)", async () => {
    const event = eventGenerator({
      body: studentOne,
      pathParametersObject: {
        userType: "STUDENT",
      },
    });

    const res = await handler(event);
    expect(res.statusCode).toBe(400);
  });

  test("Should register a committee with image", async () => {
    const event = eventGenerator({
      body: committeeOne,
      pathParametersObject: {
        userType: "COMMITTEE",
      },
    });
    const res = await handler(event);
    expect(res.statusCode).toBe(201);

    const user = await getUserByEmail(committeeOne.email);
    expect(user.committeeInfo).toMatchObject({
      designation: committeeOne.designation,
      collegeName: committeeOne.collegeName,
      phoneNumber: committeeOne.phoneNumber,
      name: committeeOne.name,
    });
    expect(user.committeeInfo.imageUrl).toContain(process.env.USER_BUCKET_NAME.replace("-test", ""));
  });

  test("Should register a committee without an image", async () => {
    const event = eventGenerator({
      body: committeeTwo,
      pathParametersObject: {
        userType: "COMMITTEE",
      },
    });
    const res = await handler(event);
    const user = await getUserByEmail(committeeTwo.email);
    expect(res).toBeDefined();
    expect(res.statusCode).toBe(201);
    expect(user.committeeInfo).toMatchObject({
      designation: committeeTwo.designation,
      collegeName: committeeTwo.collegeName,
      phoneNumber: committeeTwo.phoneNumber,
      name: committeeTwo.name,
    });
    expect(user.committeeInfo.imageUrl).toBe("https://user-bucket-8282-dev.s3.ap-south-1.amazonaws.com/profile.jpg");
  });
});
