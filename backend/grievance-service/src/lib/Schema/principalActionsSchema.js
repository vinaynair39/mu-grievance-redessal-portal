const principalActionsSchema = {
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
        comments: {
          type: "array",
        },
        documents: {
          type: "array",
        },
      },
    },
  },
  required: ["pathParameters", "body"],
};

export default principalActionsSchema;
