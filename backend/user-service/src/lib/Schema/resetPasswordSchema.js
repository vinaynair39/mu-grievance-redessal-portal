const resetPasswordSchema = {
  properties: {
    body: {
      type: "object",
      properties: {
        email: {
          type: "string",
        },
        password: {
          type: "string",
        },
        resetCode: {
          type: "string",
        },
      },
      required: ["email", "password", "resetCode"],
    },
  },
  required: ["body"],
};

export default resetPasswordSchema;
