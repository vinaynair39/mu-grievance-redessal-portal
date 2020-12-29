import React from "react";
import { useQuery, useMutation } from "react-query";
import CommitteeForm from "components/CommitteeForm/CommitteeForm";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { errorMessage } from "utils/modalMessage";
import { Modal } from "antd";
import { registerUser } from "APIs/user";
import { getCommittee } from "APIs/user";
import { editCommittee } from "APIs/user";
import Layout from "containers/Layout/Layout";
import { Spinner } from "components/Loaders/Loaders";
import "./CommitteeViewPage.scss";

const CommitteeViewPage = () => {
  const { id } = useParams();
  const history = useHistory();
  const { pathname } = useLocation();
  const { data, isLoading } = useQuery(["fetchCommitteeMember", id], getCommittee, {
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  const edit = pathname.includes("edit");

  const [registerMutation, { isLoading: registerLoading }] = useMutation(registerUser, {
    onSuccess: () => {
      Modal.success({
        title: "Success!",
        content: "Registered the user successfully!",
      });
      history.goBack();
    },
    onError: errorMessage,
  });

  const [editCommitteeMutation, { isLoading: editLoading }] = useMutation(editCommittee, {
    onSuccess: () => {
      Modal.success({
        title: "Success!",
        content: "Edited the user successfully!",
      });
      history.goBack();
    },
    onError: errorMessage,
  });

  return (
    <Layout>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="CommitteeViewPage animate__animated animate__fadeIn">
          <h1>{edit ? "Edit Profile" : "Add A New Member"}</h1>
          <CommitteeForm
            onSubmit={edit ? editCommitteeMutation : registerMutation}
            edit={edit}
            formValues={data}
            mutationLoading={edit ? editLoading : registerLoading}
            isLoading={isLoading}
          />
        </div>
      )}
    </Layout>
  );
};

export default CommitteeViewPage;
