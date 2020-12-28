import React, { useContext } from "react";
import { Layout } from "antd";
import { Student, Secretary, Committee } from "containers/NavBar/NavBar";
import SecretarySideBar, { StudentSideBar, CommitteeSidebar } from "containers/Sidebar/Sidebar";
import useWindowSize from "utils/useWindowSize";
import Context from "context/context";

import "./Layout.scss";

const { Content } = Layout;

const DashboardLayout = (props) => {
  const { width } = useWindowSize();
  const {
    state: { userType },
  } = useContext(Context);

  const navbar = () => {
    switch (userType) {
      case "STUDENT":
        return <Student />;
      case "COMMITTEE":
        return <Committee />;
      default:
        return <Secretary />;
    }
  };

  const sideBar = () => {
    switch (userType) {
      case "STUDENT":
        return <StudentSideBar />;
      case "COMMITTEE":
        return <CommitteeSidebar />;
      default:
        return <SecretarySideBar />;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {width >= 700 ? sideBar() : navbar()}
      <Layout>
        <Content style={{ backgroundColor: "#fff" }}>{props.children}</Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
