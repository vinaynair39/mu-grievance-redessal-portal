import React from "react";
import { useQuery, useMutation } from "react-query";
import CommitteeForm from "components/CommitteeForm/CommitteeForm";
import Layout from "containers/Layout/Layout";
import { useHistory } from "react-router-dom";
import { errorMessage } from "utils/modalMessage";
import { Modal } from "antd";
import { getCommittee } from "APIs/user";
import { editCommittee } from "APIs/user";
import { Spinner } from "components/Loaders/Loaders";

const ProfilePage = () => {
  const history = useHistory();
  const id = localStorage.getItem("id");
  const { data, isLoading } = useQuery(["fetchCommitteeMember", id], getCommittee, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 0,
  });

  const [editCommitteeMutation, { isLoading: editLoading }] = useMutation(editCommittee, {
    onSuccess: () => {
      Modal.success({
        title: "Success!",
        content: "Edited your profile sucessfully!",
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
          <h1>Edit Profile</h1>
          <CommitteeForm onSubmit={editCommitteeMutation} edit={true} formValues={data} isLoading={editLoading} />
        </div>
      )}
    </Layout>
  );
};

export default ProfilePage;
