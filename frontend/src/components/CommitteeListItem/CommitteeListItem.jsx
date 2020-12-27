import React from "react";
import "./CommitteeListItem.scss";
import { Link } from "react-router-dom";

const CommitteeListItem = ({ id, committeeInfo: { imageUrl, name, designation } }) => {
  return (
    <Link to={`/secretary/committee/edit/${id}`}>
      <div className="CommitteeListItem">
        <div className="CommitteeListItem__image">
          <img src={imageUrl} alt="" />
        </div>
        <div className="CommitteeListItem__info">
          <p>{name}</p>
          <p>{designation}</p>
        </div>
      </div>
    </Link>
  );
};

export default CommitteeListItem;
