const verifyUserSchema = {
  properties: {
    body: {
      type: "object",
      properties: {
        email: {
          type: "string",
        },
        otp: {
          type: "string",
        },
      },
      required: ["email", "otp"],
    },
  },
  required: ["body"],
};

export default verifyUserSchema;
