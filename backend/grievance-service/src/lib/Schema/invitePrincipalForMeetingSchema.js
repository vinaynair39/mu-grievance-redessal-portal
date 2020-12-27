const invitePrincipalForMeetingSchema = {
  properties: {
    body: {
      type: "object",
      properties: {
        id: {
          type: "string",
        },
        principalEmail: {
          type: "string",
        },
        collegeName: {
          type: "string",
        },
      },
      required: ["id", "principalEmail", "collegeName"],
    },
  },
  required: ["body"],
};

export default invitePrincipalForMeetingSchema;
