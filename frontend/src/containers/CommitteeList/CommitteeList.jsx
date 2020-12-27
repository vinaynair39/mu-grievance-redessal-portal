import React, { useState, useEffect } from "react";
import CommitteeListItem from "../../components/CommitteeListItem/CommitteeListItem";
import "./CommitteeList.scss";

const CommitteeList = ({ data }) => {
  return (
    Array.isArray(data) &&
    data.length > 0 && (
      <div className="CommitteeList">
        {data.map((item) => (
          <CommitteeListItem key={item._id} {...item} />
        ))}
      </div>
    )
  );
};
export default CommitteeList;
