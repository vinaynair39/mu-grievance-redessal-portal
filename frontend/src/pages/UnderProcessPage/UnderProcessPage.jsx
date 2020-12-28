import React from "react";
import { useQuery, useMutation } from "react-query";
import { Spinner } from "components/Loaders/Loaders";
import CustomTable from "components/Table/Table";
import { errorMessage } from "utils/modalMessage";
import { getGrievances, allocateDate, sendResolution, sendATR, sendInvite } from "APIs/grievance";

import Layout from "containers/Layout/Layout";

import "./UnderProcessPage.scss";
import { message } from "antd";

const UnderProcessPage = () => {
  const { isLoading, data, refetch } = useQuery(["getGrievances", "UNDER_PROCESS"], getGrievances, {
    onError: errorMessage,
    staleTime: 10000,
  });

  const [createResolutionMutation, { isLoading: createResolutionLoading }] = useMutation(sendResolution, {
    onSuccess: ({ data }) => {
      message.success(data.message);
      refetch();
    },
    onError: errorMessage,
  });

  const [createATRMutation, { isLoading: createATRLoading }] = useMutation(sendATR, {
    onSuccess: ({ data }) => {
      message.success(data.message);
    },
    onError: errorMessage,
  });

  const [createInviteMutation, { isLoading: createInviteLoading }] = useMutation(sendInvite, {
    onSuccess: ({ data }) => {
      message.success(data.message);
    },
    onError: errorMessage,
  });

  const [createMeetingMutation, { isLoading: createMeetingLoading }] = useMutation(allocateDate, {
    onSuccess: ({ data }) => {
      message.success(data.message);
    },
    onError: errorMessage,
  });

  return (
    <>
      <Layout>
        {isLoading ? (
          <Spinner />
        ) : (
          <div className="UnderProcess animate__animated animate__fadeIn">
            <>
              {Array.isArray(data) && data.length > 0 && <h1>Under Process</h1>}
              <CustomTable
                data={data}
                heading1={"Before Resolution"}
                heading2={"After Resolution"}
                createATRMutation={createATRMutation}
                createMeetingMutation={createMeetingMutation}
                createResolutionMutation={createResolutionMutation}
                createInviteMutation={createInviteMutation}
                createResolutionLoading={createResolutionLoading}
                createATRLoading={createATRLoading}
                createInviteLoading={createInviteLoading}
                createMeetingLoading={createMeetingLoading}
              />
            </>
          </div>
        )}
      </Layout>
    </>
  );
};
export default UnderProcessPage;
