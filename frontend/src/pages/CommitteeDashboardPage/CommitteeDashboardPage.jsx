import React, { useState, useEffect, useContext } from "react";
import { useQuery } from "react-query";
import Layout from "containers/Layout/Layout";
import addFilter from "utils/grievanceSelector";
import { errorMessage } from "utils/modalMessage";
import { getGrievances } from "APIs/grievance";
import Context from "context/context";
import { Spinner } from "components/Loaders/Loaders";
import List from "containers/List/List";
import Filters from "components/Filters/Filters";

// import "CommitteeDashboardPage.scss";

const CommitteeDashboardPage = () => {
  const [filteredData, setfilteredData] = useState([]);
  const {
    state: { filters },
  } = useContext(Context);

  const { isLoading, data } = useQuery(["getGrievances", "UNDER_PROCESS"], getGrievances, {
    onError: errorMessage,
  });

  useEffect(() => {
    if (Array.isArray(data)) {
      setfilteredData(addFilter(data, filters));
    }
  }, [data, filters]);

  return (
    <>
      <Layout>
        {isLoading ? (
          <Spinner />
        ) : (
          <div className="animate__animated animate__fadeIn">
            <Filters />
            <List grievances={filteredData} card />
          </div>
        )}
      </Layout>
    </>
  );
};
export default CommitteeDashboardPage;
