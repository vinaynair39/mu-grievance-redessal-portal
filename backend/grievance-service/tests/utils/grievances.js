import { imageOne, imageTwo, signatureOne } from "./images";

export const grievanceOne = {
  grievanceInfo: {
    complaintAgainst: "Principal of my college",
    title: "College is not giving me back my fees",
    description: "chika chika chika slim shady",
    supportingDocs: [],
    cgrcDocs: [],
  },
  studentInfo: {
    signature: signatureOne,
    areaOfStudy: "Science",
    collegeName: "RAIT",
    fieldOfStudy: "Computer Engineering",
    fullName: "Vinay Nair",
    gender: "MALE",
    phoneNumber: 7715001084,
    programOfStudy: "undergraduate",
    rollNo: "18CE5013",
    semester: "V",
  },
};

export const grievanceTwo = {
  grievanceInfo: {
    complaintAgainst: "Principal of my RAIT",
    title: "College is not giving me back my fees which I paid earlier",
    description: "Description",
    supportingDocs: [imageTwo, imageOne],
    cgrcDocs: [],
  },
  studentInfo: {
    signature: signatureOne,
    areaOfStudy: "Science",
    collegeName: "RAIT",
    fieldOfStudy: "Computer Engineering",
    fullName: "Vinay Nair",
    gender: "MALE",
    phoneNumber: 7715001084,
    programOfStudy: "undergraduate",
    rollNo: "18CE5013",
    semester: "V",
  },
};
