import React from "react";
import Lottie from "lottie-react-web";
import animation from "assets/complete.json";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import "./Loader.scss";

const antIcon = <LoadingOutlined style={{ fontSize: 70 }} spin />;

export const Spinner = () => {
  return (
    <div className="Loader">
      <Spin size="large" indicator={antIcon} className="spin_loader" />
    </div>
  );
};

export const Empty = () => (
  <div className="Loader__completed animated fadeIn">
    <h1>Looks like you have no more Grievances left</h1>
    <div className="Loader__completed-animation">
      <Lottie
        options={{
          animationData: animation,
        }}
      />
    </div>
  </div>
);
