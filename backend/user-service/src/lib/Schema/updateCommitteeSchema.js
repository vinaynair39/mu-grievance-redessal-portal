const updateCommitteeSchema = {
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
        email: {
          type: "string",
        },
        password: {
          type: "string",
        },
        designation: {
          type: "string",
        },
        phoneNumber: {
          type: "string",
        },
        name: {
          type: "string",
        },
        collegeName: {
          type: "string",
        },
        imageUrl: {
          type: "string",
        },
      },
      required: ["email", "password", "designation", "phoneNumber", "name", "collegeName", "imageUrl"],
    },
  },
  required: ["pathParameters", "body"],
};

export default updateCommitteeSchema;
