import React from "react";
import Navbar from "components/PublicNavbar/PublicNavbar";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Spinner } from "components/Loaders/Loaders";
import CustomCard from "components/Card/Card";
import CustomUpload from "components/Upload/CustomUpload";
import { getGrievance } from "APIs/grievance";
import { sendPrincipalActions } from "APIs/grievance";
import { validObject } from "utils/validObject";
import { errorMessage, successMessage } from "utils/modalMessage";

import "./UploadPage.scss";

const UploadPage = () => {
  const { id } = useParams();
  const { isLoading, data } = useQuery(["UploadPageGetGrievance", id], getGrievance, {
    retry: 1,
  });
  const [sendPrincipalActionsMutation, { isLoading: sendPrincipalActionsLoading }] = useMutation(sendPrincipalActions, {
    onError: ({ response }) => errorMessage(validObject(response) && response.data),
    onSuccess: () => successMessage("YOu response has been submitted."),
  });

  return (
    <>
      <Navbar />
      {isLoading ? (
        <div className="Upload__spinner">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="UploadPage__card">
            <CustomCard forPrincipal {...data.grievance} author={data.student} />
          </div>
          <CustomUpload
            actionTakenByPrincipal={data.grievance.actionTakenByPrincipal}
            onSubmit={sendPrincipalActionsMutation}
            isLoading={sendPrincipalActionsLoading}
          />
        </>
      )}
    </>
  );
};

export default UploadPage;
