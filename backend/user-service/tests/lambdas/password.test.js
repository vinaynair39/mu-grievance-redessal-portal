import bcrypt from "bcryptjs";
import { handler as resetPassword } from "../../src/lambdas/resetPassword";
import { handler as forgotPassword } from "../../src/lambdas/forgotPassword";
import { handler as registerUser } from "../../src/lambdas/registerUser";
import { handler as verifyUser } from "../../src/lambdas/verifyUser";
import { getUserByEmail } from "../../src/lib/getUserByEmail";
import eventGenerator from "../utils/eventGenerator";
import { studentFour, studentOne } from "../utils/users";

beforeAll(async () => {
  let event = eventGenerator({
    body: studentFour,
    pathParametersObject: {
      userType: "STUDENT",
    },
  });
  await registerUser(event);
  const { otp, email } = await getUserByEmail(studentFour.email);
  event = eventGenerator({
    body: {
      otp,
      email,
    },
  });
  await verifyUser(event);
});

describe("Forgot and reset password Intergration Test", () => {
  test("should generate a reset code on forgot password", async () => {
    const event = eventGenerator({
      pathParametersObject: {
        email: studentFour.email,
      },
    });
    const { statusCode } = await forgotPassword(event);
    const { resetCode } = await getUserByEmail(studentFour.email);
    expect(statusCode).toBe(200);
    expect(resetCode).toBeDefined();
  });

  test("should reset password (wrong otp)", async () => {
    const event = eventGenerator({
      body: {
        email: studentFour.email,
        password: "1234567890",
        resetCode: "12345",
      },
    });
    const { statusCode } = await resetPassword(event);
    expect(statusCode).toBe(400);
  });

  test("should reset password (wrong email)", async () => {
    const event = eventGenerator({
      body: {
        email: studentOne.email,
        password: "1234567890",
        resetCode: "12345",
      },
    });
    const { statusCode } = await resetPassword(event);
    expect(statusCode).toBe(400);
  });

  test("should reset password", async () => {
    const { resetCode } = await getUserByEmail(studentFour.email);
    const event = eventGenerator({
      body: {
        email: studentFour.email,
        password: "1234567890",
        resetCode: resetCode,
      },
    });
    const { statusCode } = await resetPassword(event);
    const user = await getUserByEmail(studentFour.email);
    expect(statusCode).toBe(200);
    expect(user.resetCode).toBeNull();
    const check = bcrypt.compareSync("1234567890", user.password);
    expect(check).toBeTruthy();
  });
});
