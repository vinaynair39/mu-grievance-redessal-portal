const rejectGrievanceSchema = {
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
        message: {
          type: "string",
        },
        email: {
          type: "string",
        },
      },
      required: ["message", "email"],
    },
  },
  required: ["body", "pathParameters"],
};

export default rejectGrievanceSchema;
