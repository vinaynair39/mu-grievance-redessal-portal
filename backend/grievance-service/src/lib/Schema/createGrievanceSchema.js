const createGrievanceSchema = {
  properties: {
    body: {
      type: "object",
      properties: {
        grievanceInfo: {
          type: "object",
          properties: {
            complaintAgainst: {
              type: "string",
            },
            title: {
              type: "string",
            },
            description: {
              type: "string",
            },
            supportingDocs: {
              type: "array",
            },
            cgrcDocs: {
              type: "array",
            },
          },
          required: ["complaintAgainst", "title", "description"],
        },
        studentInfo: {
          type: "object",
          properties: {
            signature: {
              type: "object",
              properties: {
                data: {
                  type: "string",
                },
                extension: {
                  type: "string",
                  enum: ["jpg", "png"],
                },
              },
              required: ["data", "extension"],
            },
            areaOfStudy: {
              type: "string",
            },
            collegeName: {
              type: "string",
            },
            fieldOfStudy: {
              type: "string",
            },
            fullName: {
              type: "string",
            },
            gender: {
              type: "string",
            },
            phoneNumber: {
              type: "number",
            },
            programOfStudy: {
              type: "string",
            },
            rollNo: {
              type: "string",
            },
            semester: {
              type: "string",
            },
          },
          required: ["areaOfStudy", "collegeName", "fieldOfStudy", "fullName", "gender", "phoneNumber", "programOfStudy", "rollNo", "semester"],
        },
      },
      required: ["grievanceInfo", "studentInfo"],
    },
  },
  required: ["body"],
};

export default createGrievanceSchema;
