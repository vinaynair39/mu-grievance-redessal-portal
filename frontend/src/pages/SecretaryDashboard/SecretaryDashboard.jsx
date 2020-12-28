import React, { useState, useEffect, useContext } from "react";

import { useMutation, useQuery } from "react-query";
import addFilter from "utils/grievanceSelector";
import { errorMessage } from "utils/modalMessage";
import { getGrievances } from "APIs/grievance";
import { rejectGrievance, selectGrievance } from "APIs/grievance";
import Context from "context/context";
import { Spinner } from "components/Loaders/Loaders";
import List from "containers/List/List";
import Filters from "components/Filters/Filters";
import { message } from "antd";
import Layout from "containers/Layout/Layout";

const SecretaryDashboard = ({}) => {
  const [filteredData, setfilteredData] = useState([]);
  const {
    state: { filters },
  } = useContext(Context);

  const { isLoading, data, refetch } = useQuery(["getGrievances", "NEW"], getGrievances, {
    onError: errorMessage,
  });

  // post request (mutation) using useQuery to reject the grievance
  const [rejectMutation, { isLoading: rejectGrievanceLoading }] = useMutation(rejectGrievance, {
    onSuccess: () => {
      message.success(`Rejected Successfully!`);
      refetch();
    },
    onError: errorMessage,
  });

  // post request (mutation) using useQuery to select the grievance
  const [selectMutation, { isLoading: selectGrievanceLoading }] = useMutation(selectGrievance, {
    onSuccess: () => {
      message.success(`Selected successfully`);
      refetch();
    },
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
            <List
              grievances={filteredData}
              card
              rejectMutation={rejectMutation}
              selectMutation={selectMutation}
              rejectGrievanceLoading={rejectGrievanceLoading}
              selectGrievanceLoading={selectGrievanceLoading}
            />
          </div>
        )}
      </Layout>
    </>
  );
};
export default SecretaryDashboard;
