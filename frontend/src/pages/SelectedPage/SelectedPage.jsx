import React from "react";
import { useQuery, useMutation } from "react-query";
import List from "containers/List/List";
import { Spinner } from "components/Loaders/Loaders";
import { getGrievances, allocateDate } from "APIs/grievance";
import { successMessage, errorMessage } from "utils/modalMessage";
import Layout from "containers/Layout/Layout";

import "./SelectedPage.scss";
import { validObject } from "utils/validObject";

const SelectedPage = () => {
  const { isLoading, data, refetch } = useQuery(["getGrievances", "SELECTED"], getGrievances, {
    onError: ({ response }) => errorMessage(validObject(response) && response.data),
  });

  const [allocateDateMutation, { isLoading: allocateDateLoading }] = useMutation(allocateDate, {
    onSuccess: ({ data: { message } }) => {
      successMessage(message);
      refetch();
    },
    onError: ({ response }) => errorMessage(validObject(response) && response.data),
  });

  return (
    <Layout>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="animate__animated animate__fadeIn">
          <List grievances={data} allocateDate={allocateDateMutation} isLoading={allocateDateLoading} />}
        </div>
      )}
    </Layout>
  );
};

export default SelectedPage;
