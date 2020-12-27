const allocateDateSchema = {
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
        meetingType: {
          type: "string",
          enum: ["IN_PERSON, VIRTUAL"],
        },
        date: {
          type: "string",
        },
      },
      required: ["meetingType, date"],
    },
  },
  required: ["pathParameters", "body"],
};

export default allocateDateSchema;
