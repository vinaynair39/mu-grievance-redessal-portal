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
          type: "string",
        },
        documents: {
          type: "string",
        },
      },
      required: ["comments", "documents"],
    },
  },
  required: ["pathParameters", "body"],
};

export default principalActionsSchema;
