import jwt from "jsonwebtoken";
import eventGenerator from "../utils/eventGenerator";
import { handler } from "../../src/lambdas/loginUser";
import { handler as registerUser } from "../../src/lambdas/registerUser";
import { handler as verifyUser } from "../../src/lambdas/verifyUser";
import { getUserByEmail } from "../../src/lib/getUserByEmail";
import { studentThree, committeeThree } from "../utils/users";

beforeAll(async () => {
  let event = eventGenerator({
    body: studentThree,
    pathParametersObject: {
      userType: "STUDENT",
    },
  });
  let event2 = eventGenerator({
    body: committeeThree,
    pathParametersObject: {
      userType: "COMMITTEE",
    },
  });
  await Promise.all([registerUser(event), registerUser(event2)]);
  const { otp, email } = await getUserByEmail(studentThree.email);
  event = eventGenerator({
    body: {
      otp,
      email,
    },
  });
  await verifyUser(event);
});

describe("Login User Intergration Test", () => {
  test("Should login a student", async () => {
    const event = eventGenerator({
      body: {
        email: studentThree.email,
        password: studentThree.password,
      },
    });
    const { body, statusCode } = await handler(event);
    const { token } = JSON.parse(body);
    const decoded = jwt.verify(token, process.env.ZOOM_API_SECRET);
    expect(statusCode).toBe(200);
    expect(decoded.email).toBe(studentThree.email);
  });

  test("Should login a committee member", async () => {
    const event = eventGenerator({
      body: {
        email: committeeThree.email,
        password: committeeThree.password,
      },
    });
    const { body, statusCode } = await handler(event);
    const { token } = JSON.parse(body);
    const decoded = jwt.verify(token, process.env.ZOOM_API_SECRET);
    expect(statusCode).toBe(200);
    expect(decoded.email).toBe(committeeThree.email);
    expect(decoded.userType).toBe("COMMITTEE");
    expect(decoded.imageUrl).toBeDefined();
  });

  test("Should not login a user (Invalid password)", async () => {
    const event = eventGenerator({
      body: {
        email: studentThree.email,
        password: "password",
      },
    });
    const { statusCode, body } = await handler(event);
    expect(body.toLowerCase()).toContain("invalid password");
    expect(statusCode).toBe(401);
  });

  test("Should not login a user (Invalid email)", async () => {
    const event = eventGenerator({
      body: {
        email: "wrongemail@gmail.com",
        password: studentThree.password,
      },
    });
    const { statusCode, body } = await handler(event);
    expect(body.toLowerCase()).toContain("email does not exist");
    expect(statusCode).toBe(401);
  });
});
