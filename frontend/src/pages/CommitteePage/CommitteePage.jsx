import React from "react";
import { Button } from "antd";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { Spinner } from "components/Loaders/Loaders";
import CommitteeList from "containers/CommitteeList/CommitteeList";

import { getAllCommittee } from "APIs/user";
import Layout from "containers/Layout/Layout";
import "./CommitteePage.scss";

const CommitteePage = () => {
  const { isLoading, data } = useQuery("getAllCommitees", getAllCommittee);
  return (
    <Layout>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="CommitteePage__add animate__animated animate__fadeIn">
          <h1>Committee</h1>
          <CommitteeList data={data.committee} />
          {!isLoading && (
            <Link to="committee/register">
              <Button type="primary animated fadeIn delay-1s">Add Committee member</Button>
            </Link>
          )}
        </div>
      )}
    </Layout>
  );
};

export default CommitteePage;
