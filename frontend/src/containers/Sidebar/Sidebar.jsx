import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import { useLocation, NavLink } from "react-router-dom";
import {
  DatabaseOutlined,
  ArrowLeftOutlined,
  TeamOutlined,
  LogoutOutlined,
  CarryOutOutlined,
  HistoryOutlined,
  ContainerOutlined,
  CopyOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";

import Context from "context/context";
import { setCollapsed } from "context/actions";
import { logout } from "context/actions";

import "./Sidebar.scss";

const { Sider } = Layout;

const SecretarySideBar = () => {
  const {
    state: { isCollapsed },
    dispatch,
  } = useContext(Context);
  const { pathname } = useLocation();

  const onCollapse = (state) => {
    dispatch(setCollapsed(state));
  };

  return (
    <>
      <Sider collapsible collapsed={isCollapsed} onCollapse={onCollapse} style={{ boxShadow: "2px 0 5px -2px #aaaaaa" }}>
        <div className="SideBar-logo">
          <Link to="/secretary">
            <img src={process.env.PUBLIC_URL + "/logo.png"} alt="" />
          </Link>
        </div>
        <Menu selectedKeys={[pathname]} className="Sidebar__menu" theme="dark" mode="inline" style={{ marginTop: "1rem", border: "none" }}>
          <Menu.Item style={{ marginTop: "0", paddingTop: "0" }} key="/secretary" icon={<DatabaseOutlined />}>
            <NavLink to="/secretary">View Grievances</NavLink>
          </Menu.Item>
          <Menu.Item icon={<CarryOutOutlined />} key="/secretary/selected">
            <NavLink to="/secretary/selected">Selected</NavLink>
          </Menu.Item>
          <Menu.Item icon={<HistoryOutlined />} key="/secretary/processing">
            <NavLink to="/secretary/processing">Meeting</NavLink>
          </Menu.Item>
          <Menu.Item key="/secretary/completed" icon={<CopyOutlined />}>
            <NavLink to="/secretary/completed">Completed</NavLink>
          </Menu.Item>

          <Menu.Item key="/secretary/committee" icon={<TeamOutlined />}>
            <NavLink to="/secretary/committee">Committee</NavLink>
          </Menu.Item>
          <Menu.Item icon={<ContainerOutlined />} key="/secretary/statistics">
            <NavLink to="/secretary/statistics">Statistics</NavLink>
          </Menu.Item>
          <Menu.Item icon={<ProfileOutlined />} key="/secretary/profile">
            <NavLink to="/secretary/profile">Profile</NavLink>
          </Menu.Item>
          {/* <Menu.Item icon={<ArrowLeftOutlined />} key="7" onClick={() => history.goBack()}>
            Back
          </Menu.Item> */}
          <Menu.Item icon={<LogoutOutlined />} key="8" onClick={() => dispatch(logout())}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
    </>
  );
};

const StudentSideBar = () => {
  let history = useHistory();
  const { pathname } = useLocation();
  const {
    state: { isCollapsed },
    dispatch,
  } = useContext(Context);

  const onCollapse = (state) => {
    dispatch(setCollapsed(state));
  };

  return (
    <>
      <Sider collapsible collapsed={isCollapsed} onCollapse={onCollapse} style={{ boxShadow: "2px 0 5px -2px #aaaaaa" }}>
        <div className="SideBar-logo">
          <Link to="/student">
            <img src={process.env.PUBLIC_URL + "/logo.png"} alt="" />
          </Link>
        </div>
        <Menu selectedKeys={[pathname]} className="Sidebar__menu" theme="dark" mode="inline" style={{ marginTop: "5vh", border: "none" }}>
          <Menu.Item style={{ marginTop: "0", paddingTop: "0" }} key="/student/post" icon={<DatabaseOutlined />}>
            <NavLink to="/student/post">Post Grievance</NavLink>
          </Menu.Item>
          <Menu.Item icon={<CarryOutOutlined />} key="/student/status">
            <NavLink to="/student/status">View Status</NavLink>
          </Menu.Item>
          <Menu.Item icon={<ArrowLeftOutlined />} key="7" onClick={() => history.goBack()}>
            Back
          </Menu.Item>
          <Menu.Item icon={<LogoutOutlined />} key="8" onClick={() => dispatch(logout())}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
    </>
  );
};
const CommitteeSidebar = () => {
  const {
    state: { isCollapsed },
    dispatch,
  } = useContext(Context);
  const { pathname } = useLocation();

  const onCollapse = (state) => {
    dispatch(setCollapsed(state));
  };

  return (
    <Sider collapsible collapsed={isCollapsed} onCollapse={onCollapse} style={{ boxShadow: "2px 0 5px -2px #aaaaaa" }}>
      <div className="SideBar-logo">
        <Link to="/committee">
          <img src={process.env.PUBLIC_URL + "/logo.png"} alt="" />
        </Link>
      </div>
      <Menu selectedKeys={[pathname]} theme="dark" mode="inline" style={{ marginTop: "1rem", border: "none" }}>
        <Menu.Item icon={<CarryOutOutlined />} key="/committee">
          <NavLink to="/committee">Grievances</NavLink>
        </Menu.Item>
        <Menu.Item icon={<CopyOutlined />} key="/committee/meeting">
          <NavLink to="/committee/meeting">Meetings</NavLink>
        </Menu.Item>
        <Menu.Item icon={<ProfileOutlined />} key="/committee/profile">
          <NavLink to="/committee/profile">Profile</NavLink>
        </Menu.Item>
        <Menu.Item icon={<LogoutOutlined />} key="5 " onClick={() => dispatch(logout())}>
          Logout
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export { StudentSideBar, CommitteeSidebar, SecretarySideBar as default };
