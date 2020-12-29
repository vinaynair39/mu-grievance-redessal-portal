import React from "react";
import { useQuery } from "react-query";
import Layout from "containers/Layout/Layout";
import { Spinner } from "components/Loaders/Loaders";
import CustomTable from "components/Table/Table";
import { getGrievances } from "APIs/grievance";
import { errorMessage } from "utils/modalMessage";

const CommitteeMeetingPage = () => {
  const { isLoading, data } = useQuery(["getGrievances", "UNDER_PROCESS"], getGrievances, {
    onError: errorMessage,
    staleTime: 10000,
  });

  return (
    <>
      <Layout>
        {isLoading ? (
          <Spinner />
        ) : (
          <div className="UnderProcess animate__animated animate__fadeIn">
            <>
              {Array.isArray(data) && data.length > 0 && <h1>Scheduled Meetings</h1>}
              <CustomTable data={data} heading1={"Meeting Pending"} heading2={"Meeting Completed"} />
            </>
          </div>
        )}
      </Layout>
    </>
  );
};
export default CommitteeMeetingPage;
