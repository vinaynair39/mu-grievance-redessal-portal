const dotenv = require("dotenv");

// require and configure dotenv, will load vars in .env in PROCESS.ENV
dotenv.config();

module.exports.getEnvVars = () => ({
  ZOOM_API_KEY: process.env.ZOOM_API_KEY,
  ZOOM_API_SECRET: process.env.ZOOM_API_SECRET,
  ZOOM_API_EMAIL: process.env.ZOOM_API_EMAIL,
});
