import jwt from "jsonwebtoken";
import { handler } from "../../src/lambdas/updateCommittee";
import { handler as registerUser } from "../../src/lambdas/registerUser";
import { handler as loginUser } from "../../src/lambdas/loginUser";
import { getUserByEmail } from "../../src/lib/getUserByEmail";
import eventGenerator from "../utils/eventGenerator";
import { committeeFour, secretaryOne } from "../utils/users";
import { imageTwo } from "../utils/image";

beforeAll(async () => {
  const event = eventGenerator({
    body: committeeFour,
    pathParametersObject: {
      userType: "COMMITTEE",
    },
  });
  const event2 = eventGenerator({
    body: secretaryOne,
    pathParametersObject: {
      userType: "SECRETARY",
    },
  });
  await Promise.all([registerUser(event), registerUser(event2)]);
});

describe("Update Committee Integration Test", () => {
  test("Should update committee info without image change", async () => {
    const loginEvent = eventGenerator({
      body: {
        email: secretaryOne.email,
        password: secretaryOne.password,
      },
    });

    const { body } = await loginUser(loginEvent);
    const { token } = JSON.parse(body);
    const { id } = await getUserByEmail(committeeFour.email);

    const event = eventGenerator({
      body: {
        ...committeeFour,
        image: null,
        designation: "teacher",
        imageUrl: "https://yt3.ggpht.com/ytc/AAUvwnhrRStY9qD7J5GPEENbaQV0y0LAC8Pn0AuCbdLTfA=s900-c-k-c0x00ffffff-no-rj",
      },
      pathParametersObject: {
        id,
      },
      authorizer: jwt.verify(token, process.env.ZOOM_API_SECRET),
    });
    const res = await handler(event);
    const user = await getUserByEmail(committeeFour.email);
    expect(res.statusCode).toBe(200);
    expect(user.committeeInfo.designation).toBe("teacher");
    expect(user.committeeInfo.imageUrl).toBe("https://yt3.ggpht.com/ytc/AAUvwnhrRStY9qD7J5GPEENbaQV0y0LAC8Pn0AuCbdLTfA=s900-c-k-c0x00ffffff-no-rj");
  });

  test("Should update committee info with image change", async () => {
    const loginEvent = eventGenerator({
      body: {
        email: secretaryOne.email,
        password: secretaryOne.password,
      },
    });

    const { body } = await loginUser(loginEvent);
    const { token } = JSON.parse(body);
    const { id } = await getUserByEmail(committeeFour.email);

    const event = eventGenerator({
      body: {
        ...committeeFour,
        image: imageTwo,
        name: "David Jhonson",
        imageUrl: "https://yt3.ggpht.com/ytc/AAUvwnhrRStY9qD7J5GPEENbaQV0y0LAC8Pn0AuCbdLTfA=s900-c-k-c0x00ffffff-no-rj",
      },
      pathParametersObject: {
        id,
      },
      authorizer: jwt.verify(token, process.env.ZOOM_API_SECRET),
    });
    const res = await handler(event);
    const user = await getUserByEmail(committeeFour.email);
    expect(res.statusCode).toBe(200);
    expect(user.committeeInfo.name).toBe("David Jhonson");
    expect(user.committeeInfo.imageUrl).toBeDefined();
    expect(user.committeeInfo.imageUrl).not.toBe("https://yt3.ggpht.com/ytc/AAUvwnhrRStY9qD7J5GPEENbaQV0y0LAC8Pn0AuCbdLTfA=s900-c-k-c0x00ffffff-no-rj");
  });

  test("Should not update committee info (invalid Id)", async () => {
    const loginEvent = eventGenerator({
      body: {
        email: secretaryOne.email,
        password: secretaryOne.password,
      },
    });

    const { body } = await loginUser(loginEvent);
    const { token } = JSON.parse(body);
    const event = eventGenerator({
      body: {
        ...committeeFour,
        image: imageTwo,
        imageUrl: "",
      },
      pathParametersObject: {
        id: "123456787654",
      },
      authorizer: jwt.verify(token, process.env.ZOOM_API_SECRET),
    });
    const res = await handler(event);
    expect(res.statusCode).toBe(500);
  });
});
