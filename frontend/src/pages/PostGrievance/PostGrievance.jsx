import React, { useState, useEffect } from "react";
import { Steps, Modal } from "antd";
import { useParams, useHistory } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import Step1 from "./Step1";
import Step2 from "./Step2";
import { errorMessage } from "utils/modalMessage";
import { createGrievance, updateGrievance } from "APIs/grievance";
import { getBase64 } from "utils/getBase64";
import Layout from "containers/Layout/Layout";
import { Spinner } from "components/Loaders/Loaders";
import { validObject } from "utils/validObject";
import { blobsToBase64s } from "utils/getBase64";
import "./PostGrievance.scss";
import { fetchStudentDetails } from "APIs/grievance";

const { Step } = Steps;

const PostGrievance = () => {
  const [step, setStep] = useState(1);
  const [signature, setSignature] = useState([]);
  const [supportingDocs, setSupportingDocs] = useState([]);
  const [cgrcDocs, setCgrcDocs] = useState([]);
  const [formData, setFormData] = useState({});
  const { id } = useParams();
  const authorId = localStorage.getItem("id");
  const type = !!id ? "EDIT" : "CREATE";

  const { data: { grievance, student } = {}, isLoading: loadingGrievance } = useQuery(
    ["fetchStudentDetails", type === "EDIT" ? id : authorId, type],
    fetchStudentDetails,
    {
      onSuccess: ({ grievance }) => {
        if (type === "EDIT" && validObject(grievance) && grievance.status !== "NEW" && grievance.status !== "REJECTED") {
          Modal.error({
            title: "Oops!",
            content: "You cannot edit your grievance now.",
            onOk: () => history.goBack(),
          });
        }
      },
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );

  const [createGrievanceMutation, { isLoading: createGrievanceLoading }] = useMutation(createGrievance, {
    onSuccess: () => {
      Modal.success({
        content: "Successfully submitted your grievance",
      });
      history.push("/student");
    },
    onError: ({ response }) => errorMessage(validObject(response) && response.data),
  });

  const [updateGrievanceMutation, { isLoading: updateGrievanceLoading }] = useMutation(updateGrievance, {
    onSuccess: () => {
      Modal.success({
        content: "Successfully submitted your grievance",
      });
      history.push("/student");
    },
    onError: ({ response }) => errorMessage(validObject(response) && response.data),
  });

  const [signatureState, setSignatureState] = useState({
    signaturePreviewVisible: false,
    signaturePreviewImage: "",
    signaturePreviewTitle: "",
    signatureFileList: [],
  });

  const [supportingDocsState, setSupportingDocsState] = useState({
    supportingDocsPreviewVisible: false,
    supportingDocsPreviewImage: "",
    supportingDocsPreviewTitle: "",
    supportingDocsFileList: [],
  });

  const [cgrcDocsState, setCgrcDocsState] = useState({
    cgrcgDocsPreviewVisible: false,
    cgrcgDocsPreviewImage: "",
    cgrcgDocsPreviewTitle: "",
    cgrcDocsFileList: [],
  });

  const history = useHistory();

  useEffect(() => {
    if (validObject(student)) {
      setFormData(() => ({ ...formData, ...grievance, ...student.studentInfo }));
      setSignatureState({
        ...signatureState,
        signatureFileList: validObject(student.studentInfo)
          ? [
              {
                uid: 0,
                size: 1007152,
                type: "image/png",
                url: student.studentInfo.signatureUrl,
                status: "done",
                name: "grievance",
              },
            ]
          : [],
      });
    }

    if (validObject(grievance)) {
      setSupportingDocsState({
        ...supportingDocsState,
        supportingDocsFileList: validObject(grievance)
          ? grievance.supportingDocsUrls.map((ele, index) => ({
              uid: index,
              size: 1007152,
              type: "image/png",
              url: ele,
              status: "done",
              name: "grievance",
            }))
          : [],
      });

      setCgrcDocsState({
        ...cgrcDocsState,
        cgrcDocsFileList: validObject(grievance)
          ? grievance.cgrcDocsUrls.map((ele, index) => ({
              uid: index,
              size: 1007152,
              type: "image/png",
              url: ele,
              status: "done",
              name: "grievance",
            }))
          : [],
      });
    }
  }, [grievance, student]);

  const steps = [
    {
      title: "Start",
    },
    {
      title: "End",
    },
  ];

  const onSubmit = async (data) => {
    const studentInfo = {
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      collegeName: data.collegeName,
      gender: data.gender,
      rollNo: data.rollNo,
      semester: data.semester,
      areaOfStudy: data.areaOfStudy,
      programOfStudy: data.programOfStudy,
      fieldOfStudy: data.fieldOfStudy,
    };

    if (validObject(signature)) {
      const extension = signature[0].type === "image/jpeg" ? "jpg" : signature[0].type.split("/")[1];
      studentInfo.signature = {
        data: await getBase64(signature[0]),
        extension: extension,
      };
    }

    const grievanceInfo = {
      title: data.title,
      description: data.description,
      complaintAgainst: data.complaintAgainst,
    };

    if (validObject(supportingDocs)) {
      grievanceInfo.supportingDocs = await blobsToBase64s(supportingDocs);
    }

    if (validObject(cgrcDocs)) {
      grievanceInfo.cgrcDocs = await blobsToBase64s(cgrcDocs);
    }

    if (!!id) {
      grievanceInfo.supportingDocsUrls = data.supportingDocsUrls;
      grievanceInfo.cgrcDocsUrls = data.cgrcDocsUrls;
      updateGrievanceMutation({ id, grievanceInfo, studentInfo });
    } else createGrievanceMutation({ grievanceInfo, studentInfo });
  };

  const signatureProps = {
    onRemove: () => {
      setSignature([]);
    },
    beforeUpload: (file) => {
      const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
      if (isJpgOrPng) {
        if (file.size <= 1097152) {
          Object.defineProperty(file, "name", {
            writable: true,
            value: `signature`,
          });
          console.log(file);
          setSignature([file]);
        } else {
          Modal.error({
            title: "Please upload an image of size less than 1mb",
          });
        }
      } else {
        Modal.error({
          title: "Only jpg and png format supported!",
        });
      }
      return false;
    },
    fileList: signature,
  };

  const supportingDocsProps = {
    onRemove: (file) => {
      const index = supportingDocs.indexOf(file);
      const newFileList = supportingDocs.slice();
      newFileList.splice(index, 1);
      setSupportingDocs(newFileList);
    },
    beforeUpload: (file) => {
      const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";

      if (isJpgOrPng) {
        if (file.size <= 1097152) {
          Object.defineProperty(file, "name", {
            writable: true,
            value: `grievanceDocument${supportingDocs.length + 1}`,
          });
          setSupportingDocs([...supportingDocs, file]);
        } else {
          Modal.error({
            title: "Please upload an image of size less than 1mb",
          });
        }
      } else {
        Modal.error({
          title: "Only jpeg/jpg and png format supported!",
        });
      }
      return false;
    },
    fileList: supportingDocs,
  };

  const cgrcDocsProps = {
    onRemove: (file) => {
      const index = cgrcDocs.indexOf(file);
      const newFileList = cgrcDocs.slice();
      newFileList.splice(index, 1);
      setCgrcDocs(newFileList);
    },
    beforeUpload: (file) => {
      const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";

      if (isJpgOrPng) {
        if (file.size <= 1097152) {
          Object.defineProperty(file, "name", {
            writable: true,
            value: `cgrcDocument${cgrcDocs.length + 1}`,
          });
          setCgrcDocs([...cgrcDocs, file]);
        } else {
          Modal.error({
            title: "Please upload an image of size less than 1mb",
          });
        }
      } else {
        Modal.error({
          title: "Only jpeg/jpg and png format supported!",
        });
      }
      return false;
    },
    fileList: cgrcDocs,
  };

  return (
    <Layout>
      {loadingGrievance ? (
        <Spinner />
      ) : (
        <div className="PostGrievance animate__animated animate__fadeIn">
          <div className="steps">
            <Steps current={step - 1}>
              {steps.map((item) => (
                <Step key={item.title} title={item.title} />
              ))}
            </Steps>
          </div>
          <div className="heading">
            <h1>Grievance Redressal Form</h1>
          </div>
          {step === 1 ? (
            <Step1
              step={step}
              edit={!!id}
              setStep={setStep}
              signature={signature}
              signatureProps={signatureProps}
              signatureState={signatureState}
              setSignatureState={setSignatureState}
              formData={formData}
              setFormData={setFormData}
            />
          ) : (
            <Step2
              step={step}
              setStep={setStep}
              edit={!!id}
              supportingDocs={supportingDocs}
              cgrcDocs={cgrcDocs}
              supportingDocsProps={supportingDocsProps}
              cgrcDocsProps={cgrcDocsProps}
              supportingDocsState={supportingDocsState}
              setSupportingDocsState={setSupportingDocsState}
              cgrcDocsState={cgrcDocsState}
              setCgrcDocsState={setCgrcDocsState}
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              updateGrievanceLoading={updateGrievanceLoading}
              createGrievanceLoading={createGrievanceLoading}
            />
          )}
        </div>
      )}
    </Layout>
  );
};

export default PostGrievance;
