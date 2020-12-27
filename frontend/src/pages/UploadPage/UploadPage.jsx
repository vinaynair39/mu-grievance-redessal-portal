import React, { useState } from "react";
import Navbar from "components/PublicNavbar/PublicNavbar";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Spinner } from "components/Loaders/Loaders";
import CustomCard from "components/Card/Card";
import CustomUpload from "components/Upload/CustomUpload";
import { getGrievance } from "APIs/grievance";
import { sendPrincipalActions } from "APIs/grievance";

import "./UploadPage.scss";
import { errorMessage, successMessage } from "utils/modalMessage";

const UploadPage = ({}) => {
  const { id } = useParams();
  const { isLoading, data } = useQuery(["UploadPageGetGrievance", id], getGrievance, {
    retry: 1,
  });
  const [sendPrincipalActionsMutation, { isLoading: sendPrincipalActionsLoading }] = useMutation(sendPrincipalActions, {
    onError: errorMessage,
    onSuccess: () => successMessage("YOu response has been submitted."),
  });

  return (
    <div className="UploadPage">
      <Navbar />
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="UploadPage">
          <div className="UploadPage__card">
            <CustomCard forPrincipal {...data.grievance} author={data.student} />
          </div>
          <CustomUpload
            actionTakenByPrincipal={data.grievance.actionTakenByPrincipal}
            onSubmit={sendPrincipalActionsMutation}
            isLoading={sendPrincipalActionsLoading}
          />
        </div>
      )}
    </div>
  );
};

export default UploadPage;
