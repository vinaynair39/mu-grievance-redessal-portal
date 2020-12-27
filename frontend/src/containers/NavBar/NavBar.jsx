import React, { useState, useEffect, useContext } from "react";
import { Drawer, Menu } from "antd";
import { useLocation, NavLink } from "react-router-dom";
import {
  DatabaseOutlined,
  ContainerOutlined,
  ArrowLeftOutlined,
  DesktopOutlined,
  TeamOutlined,
  LogoutOutlined,
  CopyOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { Twirl as Hamburger } from "hamburger-react";
import Context from "context/context";
import { logout } from "context/actions";

import "./NavBar.scss";

const { SubMenu } = Menu;

export const Secretary = () => {
  const { dispatch } = useContext(Context);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  let history = useHistory();

  useEffect(() => {
    if (pathname === "/secretary/selected") {
      setOpen(true);
    }
  }, []);

  return (
    <div className="NavBar">
      <Link to={"/secretary"} className="NavBar__logo">
        <img src={process.env.PUBLIC_URL + "/logo.png"} alt="" />
        <span>MUGRC</span>
      </Link>
      <div className="NavBar__hamburger">
        <Hamburger color={"#fff"} rounded size={22} toggled={open} toggle={setOpen} />
      </div>
      <Drawer placement="left" closable={true} onClose={() => setOpen(false)} visible={open}>
        <div className="Layout-logo">
          <img src={process.env.PUBLIC_URL + "/logo.png"} alt="" />
        </div>
        <Menu selectedKeys={[pathname]} defaultOpenKeys={open && ["sub1"]} mode="inline" style={{ marginTop: "1rem", border: "none" }}>
          <Menu.Item style={{ paddingTop: "0", marginBottom: "4vh" }} key="/secretary" icon={<DatabaseOutlined />}>
            <NavLink to="/secretary">View Grievances</NavLink>
          </Menu.Item>
          <SubMenu key="sub1" style={{ marginBottom: "4vh" }} icon={<DesktopOutlined />} title={<span>Activity</span>}>
            <Menu.Item key="/secretary/selected">
              <NavLink to="/secretary/selected">Selected</NavLink>
            </Menu.Item>
            <Menu.Item key="/secretary/processing">
              <NavLink to="/secretary/processing">Meeting</NavLink>
            </Menu.Item>
          </SubMenu>
          <Menu.Item icon={<TeamOutlined />} key="/secretary/committeesstyle" style={{ marginBottom: "4vh" }}>
            <NavLink to="/secretary/committees">Committee</NavLink>
          </Menu.Item>
          <Menu.Item icon={<ContainerOutlined />} key="/secretary/statistics" style={{ marginBottom: "4vh" }}>
            <NavLink to="/secretary/statistics">Statistics</NavLink>
          </Menu.Item>
          <Menu.Item icon={<ContainerOutlined />} key="/secretary/profile" style={{ marginBottom: "4vh" }}>
            <NavLink to="/secretary/profile">Profile</NavLink>
          </Menu.Item>
          <Menu.Item icon={<ArrowLeftOutlined />} style={{ marginBottom: "4vh" }} key="7" onClick={() => history.goBack()}>
            <span>Back</span>
          </Menu.Item>
          <Menu.Item key="8" style={{ marginBottom: "4vh" }} icon={<LogoutOutlined />}>
            <span onClick={() => dispatch(logout())}>Logout</span>
          </Menu.Item>
        </Menu>
      </Drawer>
    </div>
  );
};

export const Committee = () => {
  const { dispatch } = useContext(Context);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  let history = useHistory();

  return (
    <div className="NavBar">
      <Link to={"/committee"} className="NavBar__logo">
        <img src={process.env.PUBLIC_URL + "/logo.png"} alt="" />
        <span>MUGRC</span>
      </Link>
      <div className="NavBar__hamburger">
        <Hamburger color={"#fff"} rounded size={22} toggled={open} toggle={setOpen} />
      </div>
      <Drawer placement="left" closable={true} onClose={() => setOpen(false)} visible={open}>
        <div className="Layout-logo">
          <img src={process.env.PUBLIC_URL + "/logo.png"} alt="" />
        </div>
        <Menu selectedKeys={[pathname]} defaultOpenKeys={open && ["sub1"]} mode="inline" style={{ marginTop: "1rem", border: "none" }}>
          <Menu.Item style={{ marginTop: "4vh", paddingTop: "0", marginBottom: "4vh" }} key="/committee" icon={<DatabaseOutlined />}>
            <NavLink to="/committee">Grievances</NavLink>
          </Menu.Item>
          <Menu.Item style={{ marginTop: "4vh", paddingTop: "0", marginBottom: "4vh" }} key="/committee/meeting" icon={<CopyOutlined />}>
            <NavLink to="/committee/meeting">Meetings</NavLink>
          </Menu.Item>
          <Menu.Item style={{ marginTop: "4vh", paddingTop: "0", marginBottom: "4vh" }} key="/committee/profile" icon={<ProfileOutlined />}>
            <NavLink to="/committee/profile">Profile</NavLink>
          </Menu.Item>
          <Menu.Item icon={<ArrowLeftOutlined />} style={{ marginBottom: "6vh" }} key="7" onClick={() => history.goBack()}>
            <span>Back</span>
          </Menu.Item>
          <Menu.Item key="8" style={{ marginBottom: "6vh" }} icon={<LogoutOutlined />}>
            <span onClick={() => dispatch(logout())}>Logout</span>
          </Menu.Item>
        </Menu>
      </Drawer>
    </div>
  );
};

export const Student = () => {
  const { dispatch } = useContext(Context);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  let history = useHistory();

  return (
    <div className="NavBar">
      <Link to="/student" className="NavBar__logo">
        <img src={process.env.PUBLIC_URL + "/logo.png"} alt="" />
        <span>MUGRC</span>
      </Link>
      <div className="NavBar__hamburger">
        <Hamburger color={"#fff"} rounded size={22} toggled={open} toggle={setOpen} />
      </div>{" "}
      <Drawer placement="left" closable={true} onClose={() => setOpen(false)} visible={open}>
        <div className="Layout-logo">
          <img src={process.env.PUBLIC_URL + "/logo.png"} alt="" />
        </div>
        <Menu selectedKeys={[pathname]} defaultOpenKeys={open && ["sub1"]} mode="inline" style={{ marginTop: "0", border: "none" }}>
          <Menu.Item style={{ marginTop: "8vh", paddingTop: "0", marginBottom: "8vh" }} key="/student/post" icon={<DatabaseOutlined />}>
            <Link to="/student/post">Apply Grievance</Link>
          </Menu.Item>
          <Menu.Item style={{ marginBottom: "8vh" }} icon={<DesktopOutlined />} key="/student/status">
            <Link to="/student/status">View Status</Link>
          </Menu.Item>

          <Menu.Item style={{ marginBottom: "8vh" }} icon={<ArrowLeftOutlined />} key="3" onClick={() => history.goBack()}>
            <span>Back</span>
          </Menu.Item>
          <Menu.Item style={{ marginBottom: "8vh" }} key="4" icon={<LogoutOutlined />}>
            <span onClick={() => dispatch(logout())}>Logout</span>
          </Menu.Item>
        </Menu>
      </Drawer>
    </div>
  );
};
