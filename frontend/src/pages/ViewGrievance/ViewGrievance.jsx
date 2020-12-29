import React from "react";
import { useQuery, useMutation } from "react-query";
import { useParams, useHistory } from "react-router-dom";
import { message } from "antd";
import Grievance from "components/Grievance/Grievance";
import { Spinner } from "components/Loaders/Loaders";
import { errorMessage, goBackOnError } from "utils/modalMessage";
import { getGrievance, rejectGrievance, selectGrievance } from "APIs/grievance";
import { addComment } from "APIs/grievance";
import Layout from "containers/Layout/Layout";

const ViewGrievance = () => {
  const { id } = useParams();
  const history = useHistory();

  const { isLoading, data, error, refetch } = useQuery(["grievance", id], getGrievance, {
    retry: 1,
    onError: () => goBackOnError(() => history.goBack()),
  });

  const [rejectMutation, { isLoading: rejectMutationLoading }] = useMutation(rejectGrievance, {
    onSuccess: () => {
      message.success(`Rejected Successfully!`);
      history.goBack();
    },
    onError: errorMessage,
  });

  const [selectMutation, { isLoading: selectMutationLoading }] = useMutation(selectGrievance, {
    onSuccess: () => {
      message.success(`Selected successfully`);
      history.goBack();
    },
    onError: errorMessage,
  });

  const [addCommentMutation, { isLoading: addCommentLoading }] = useMutation(addComment, {
    onSuccess: () => {
      refetch();
      message.success(`Comment Added`);
    },
    onError: errorMessage,
  });

  return (
    <Layout>
      {isLoading ? (
        <Spinner />
      ) : (
        !error && (
          <Grievance
            grievance={data.grievance}
            rejectMutation={rejectMutation}
            selectMutation={selectMutation}
            author={data.student}
            addCommentMutation={addCommentMutation}
            addCommentLoading={addCommentLoading}
            selectMutationLoading={selectMutationLoading}
            rejectMutationLoading={rejectMutationLoading}
          />
        )
      )}
    </Layout>
  );
};

export default ViewGrievance;
