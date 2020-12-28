import React, { useState, useEffect } from "react";
import { Spinner } from "components/Loaders/Loaders";
import { useQuery } from "react-query";
import { errorMessage } from "utils/modalMessage";
import "./SecretaryStatsPage.scss";
import { getGrievanceStats } from "APIs/grievance";
import PieChart from "components/Stats/PieChart";
import LineChart from "components/Stats/LineChart";
import Layout from "containers/Layout/Layout";

const SecretaryStats = () => {
  const { isLoading, data } = useQuery("stats", getGrievanceStats, {
    onError: errorMessage,
  });

  return (
    <Layout>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="secretaryStats_Main animate__animated animate__fadeIn">
          <h1>Statistics</h1>
          <div className="secretaryStats_charts">
            <div className="secretaryStats_line">
              <LineChart dataSet={data} />
            </div>

            <div className="secretaryStats_graph">
              <PieChart dataSet={data.stats} />
            </div>
          </div>

          <div className="secretaryStats_content">
            <div className="secretaryStats_card">
              <p>Total Number of Grievances Received:</p>
              <div className="secretaryStats_Inner">
                <span>{data.stats.TOTAL}</span>
              </div>
            </div>
            <div className="secretaryStats_card">
              <p style={{ borderColor: "#2F8ECF" }}>Total Number of Grievances Pending :</p>
              <div className="secretaryStats_Inner">
                <span>{data.stats.UNDER_PROCESS}</span>
              </div>
            </div>
            <div className="secretaryStats_card">
              <p style={{ borderColor: "#3BB2AC" }}>Total Number of Grievances Solved :</p>
              <div className="secretaryStats_Inner">
                <span>{data.stats.SOLVED}</span>
              </div>
            </div>
            <div className="secretaryStats_card">
              <p style={{ borderColor: "#E5445B" }}>Total Number of Grievances Rejected :</p>
              <div className="secretaryStats_Inner">
                <span>{data.stats.REJECTED}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default SecretaryStats;
