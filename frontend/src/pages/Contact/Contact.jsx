import React from "react";
import Navbar from "components/PublicNavbar/PublicNavbar";
import { Typography } from "antd";
import Map from "./map.png";
import { HomeOutlined, PhoneTwoTone } from "@ant-design/icons";

import "./Contact.scss";

const Contact = () => {
  const { Text } = Typography;
  return (
    <>
      <div className="Contact">
        <Navbar />
        <div className="Contact__content animate__animated animate__fadeIn">
          <div className="Contact__map">
            <img src={Map} alt="" />
          </div>
          <div className="Contact__address">
            <div className="Contact__add1">
              <div>
                <h1>Fort Campus - </h1>
              </div>
              <div>
                <p>
                  <HomeOutlined /> - Mahatma Gandhi Road, Fort, Mumbai, Maharashtra 400032.
                </p>
              </div>
              <div>
                <h2>
                  <PhoneTwoTone /> - 022 22708700
                </h2>
              </div>
            </div>
            <div className="Contact__add2">
              <div>
                <h1>Kalina Campus - </h1>
              </div>
              <div>
                <p>
                  <HomeOutlined /> - University of Mumbai,Vidya Nagari, Kalina, Santacruz East, Mumbai, Maharashtra 400098.
                </p>
              </div>
              <div>
                <h2>
                  <PhoneTwoTone /> - 022 26543000
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
