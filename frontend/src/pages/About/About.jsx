import React from "react";
import Navbar from "components/PublicNavbar/PublicNavbar";
import { useQuery } from "react-query";
import { getAllCommitteePublic } from "APIs/user";

import "./About.scss";

const CommitteeCard = ({ imageUrl, name, designation }) => {
  return (
    <div className="CommitteeCard">
      <img src={imageUrl} />
      <div className="info">
        <h2>{name}</h2>
        <p>{designation}</p>
      </div>
    </div>
  );
};
const About = () => {
  const { data = [], isLoading } = useQuery("fetchCommitteeMembers", getAllCommitteePublic);
  return (
    <>
      <div className="About">
        <Navbar />
        {isLoading ? (
          <></>
        ) : (
          <div className="About__content animate__animated animate__fadeIn">
            <div className="About__header">
              <h1>The Board of Student Development</h1>
            </div>
            <div className="About__imagebox">
              <div className="About__images">
                {data.map(({ committeeInfo }) => (
                  <CommitteeCard imageUrl={committeeInfo.imageUrl} designation={committeeInfo.designation} name={committeeInfo.name} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default About;
