import React, { useState, useEffect, useContext } from "react";
import { useQuery } from "react-query";
import addFilter from "utils/grievanceSelector";
import { errorMessage } from "utils/modalMessage";
import { getGrievances } from "APIs/grievance";
import Context from "context/context";
import { Spinner } from "components/Loaders/Loaders";
import List from "containers/List/List";
import Layout from "containers/Layout/Layout";
import Filters from "components/Filters/Filters";

const CompletedPage = () => {
  const [filteredData, setfilteredData] = useState([]);
  const [type, setType] = useState("SOLVED");
  const {
    state: { filters },
  } = useContext(Context);

  const { isLoading, data } = useQuery(["getGrievances", type], getGrievances, {
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
            <Filters radio onChange={setType} type={type} />
            <List grievances={filteredData} card />
          </div>
        )}
      </Layout>
    </>
  );
};
export default CompletedPage;
