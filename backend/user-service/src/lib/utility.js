import jwt from "jsonwebtoken";

// function for generating Jwt token
export async function generateJWT(payload) {
  const newPayload = {
    ...payload,
    iss: process.env.ZOOM_API_KEY,
    exp: new Date().getTime() + 86400000,
  };
  const token = jwt.sign(newPayload, process.env.ZOOM_API_SECRET);
  return token;
}
