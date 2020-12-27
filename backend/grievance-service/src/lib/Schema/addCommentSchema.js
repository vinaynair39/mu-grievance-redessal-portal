const addCommentSchema = {
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
        comment: {
          type: "string",
        },
      },
      required: ["comment"],
    },
  },
  required: ["pathParameters", "body"],
};

export default addCommentSchema;
