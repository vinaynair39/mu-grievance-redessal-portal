import React from "react";
import StudentTable from "components/StudentTable/StudentTable";
import { Spinner } from "components/Loaders/Loaders";
import { useQuery } from "react-query";
import { getGrievancesByEmail } from "APIs/grievance";
import Layout from "containers/Layout/Layout";

import "./StudentGrievanceStatus.scss";

const StudentGrievanceStatus = () => {
  const { data, isLoading } = useQuery("GetGrievancesByEmail", getGrievancesByEmail);
  return (
    <div>
      <Layout>
        {isLoading ? (
          <Spinner />
        ) : (
          <div className="studentView_table Table">
            <>
              <h1>Your Grievances</h1>
              <StudentTable studentGrievances={data} />
            </>
          </div>
        )}
      </Layout>
    </div>
  );
};
export default StudentGrievanceStatus;
