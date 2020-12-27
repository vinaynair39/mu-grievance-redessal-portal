const registerUserSchema = {
  properties: {
    pathParameters: {
      type: "object",
      properties: {
        userType: {
          type: "string",
          enum: ["STUDENT", "COMMITTEE", "student", "committee", "SECRETARY"],
        },
      },
      required: ["userType"],
    },
    body: {
      type: "object",
      properties: {
        email: {
          type: "string",
        },
        password: {
          type: "string",
        },
      },
      required: ["email", "password"],
    },
  },
  required: ["pathParameters", "body"],
};

export default registerUserSchema;
