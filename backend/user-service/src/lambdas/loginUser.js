import createError from "http-errors";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import validator from "@middy/validator";
import commonMiddleware from "../lib/commonMiddleware";
import { generateJWT } from "../lib/utility";
import { getUserByEmail } from "../lib/getUserByEmail";
import loginUserSchema from "../lib/Schema/loginUserSchema";

async function loginUser(event, context) {
  const { email, password } = event.body;

  const user = await getUserByEmail(email);

  if (Object.keys(user).length === 0) {
    throw new createError.Unauthorized("User with this email does not exist. Try registering!");
  }

  if (user.userType === "STUDENT" && !user.isVerified) {
    throw new createError.Unauthorized(`Your email is not verified yet. Please verify it!`);
  }

  const check = bcrypt.compareSync(password, user.password);

  if (!check) {
    throw new createError.Unauthorized(`Invalid password for ${email}. Try again!`);
  }

  const payload = {
    email,
    userType: user.userType,
    id: user.id,
    sub: uuid(),
  };

  // if the user is committee/secretary, then we want their imageUrl to be added as a payload to the jwt
  if (user.userType !== "STUDENT") {
    // we are checking if the committee member has uploaded his profile image previously
    // if yes then we use the url as the payload else we attach a dummy profile image url
    payload.imageUrl = user.committeeInfo.imageUrl;
  }

  let token = await generateJWT(payload);
  return {
    statusCode: 200,
    headers: {
      /* Required for CORS support to work */
      "Access-Control-Allow-Origin": "*",
      /* Required for cookies, authorization headers with HTTPS */
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({
      message: "User found token sent!",
      token,
    }),
  };
}

export const handler = commonMiddleware(loginUser).use(
  validator({
    inputSchema: loginUserSchema,
  })
);
