import React, { useState } from "react";
import { Twirl as Hamburger } from "hamburger-react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

import useWindowSize from "utils/useWindowSize";

import "./PublicNavbar.scss";

const Navbar = () => {
  const [isOpen, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { width } = useWindowSize();

  return (
    <div className="Navbar">
      <Link to="/">
        <div className="Navbar__logo">
          <img src={process.env.PUBLIC_URL + "/logo.png"} alt="" />
          <span>{width > 1000 ? "Grievance Redressal Portal" : "MUGRS"}</span>
        </div>
      </Link>

      <div className="Navbar__hamburger">
        <Hamburger color={"#fff"} rounded size={22} toggled={isOpen} toggle={setOpen} />
      </div>
      <div className={isOpen ? "Navbar__links-opened" : "Navbar__links"}>
        <Link to="/" className={pathname === "/" ? "active" : ""}>
          Home
        </Link>
        <Link to="/about" className={pathname === "/about" ? "active" : ""}>
          About
        </Link>
        <Link to="/contact" className={pathname === "/contact" ? "active" : ""}>
          Contact Us
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
