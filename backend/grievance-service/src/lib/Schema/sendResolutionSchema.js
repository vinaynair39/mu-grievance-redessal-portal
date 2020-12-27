const sendResolutionSchema = {
  properties: {
    pathParameters: {
      type: "object",
      properties: {
        id: {
          type: "string",
        },
      },
      required: ["id"],
    },
    body: {
      type: "object",
      properties: {
        subject: {
          type: "string",
        },
        principalEmail: {
          type: "string",
        },
        body: {
          type: "string",
        },
        collegeName: {
          type: "string",
        },
      },
      required: ["subject", "principalEmail", "body", "collegeName"],
    },
  },
  required: ["pathParameters", "body"],
};

export default sendResolutionSchema;
