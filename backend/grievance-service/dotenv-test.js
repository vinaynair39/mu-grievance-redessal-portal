import path from "path";
import dotenv from "dotenv";
import "regenerator-runtime";

export default async () => {
  dotenv.config({ path: path.resolve(__dirname, "./.env.test") });
};
