import React, { useEffect, useState } from "react";
import Lottie from "lottie-react-web";
import animation from "assets/add.json";
import view from "assets/view.json";
import Layout from "containers/Layout/Layout";

import "./StudentDashboardPage.scss";
import { Link } from "react-router-dom";

const StudentDashboardPage = () => {
  return (
    <Layout>
      <div className="StudenntDashboardPage">
        <div className="StudenntDashboardPage__buttons">
          <div className="StudenntDashboardPage__button1">
            <Link to="/student/post">
              <Lottie
                options={{
                  animationData: animation,
                }}
              />
              <h1>Post A Grievance</h1>
            </Link>
          </div>
          <div className="StudenntDashboardPage__button2">
            <Link to="/student/status" className="button2">
              <Lottie
                options={{
                  animationData: view,
                }}
              />
            </Link>
            <h1>View status</h1>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboardPage;
