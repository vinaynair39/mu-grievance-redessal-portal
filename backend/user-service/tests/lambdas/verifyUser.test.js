import { handler } from "../../src/lambdas/verifyUser";
import { handler as registerUser } from "../../src/lambdas/registerUser";
import { getUserByEmail } from "../../src/lib/getUserByEmail";
import eventGenerator from "../utils/eventGenerator";
import { studentTwo } from "../utils/users";

beforeAll(async () => {
  const event = eventGenerator({
    body: studentTwo,
    pathParametersObject: {
      userType: "STUDENT",
    },
  });
  await registerUser(event);
});

describe("Verify User Integration Test", () => {
  test("Should not verify email of a student (wrong email)", async () => {
    const { otp } = await getUserByEmail(studentTwo.email);
    const event = eventGenerator({
      body: {
        otp,
        email: "wrongemail@gmail.com",
      },
    });
    const res = await handler(event);
    expect(res.statusCode).toBe(400);
  });

  test("Should not verify email of a student (wrong otp)", async () => {
    const event = eventGenerator({
      body: {
        otp: "12345",
        email: studentTwo.email,
      },
    });
    const res = await handler(event);
    expect(res.statusCode).toBe(400);
  });

  test("Should verify email of a student", async () => {
    const { otp, email } = await getUserByEmail(studentTwo.email);
    const event = eventGenerator({
      body: {
        otp,
        email,
      },
    });
    const res = await handler(event);
    const { otp: newOtp } = await getUserByEmail(studentTwo.email);
    expect(res.statusCode).toBe(200);
    expect(newOtp).toBeNull();
  });
});
