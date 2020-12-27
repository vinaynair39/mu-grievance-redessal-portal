import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import "animate.css";
import reportWebVitals from "./reportWebVitals";
import jwtDecode from "jwt-decode";
import { setAuthorizationHeader } from "APIs/user";
import "react-image-lightbox/style.css";
import { setAuthorizationHeaderForGrievanceService } from "APIs/grievance";

const userType = localStorage.getItem("userType");
const token = localStorage.getItem("token");

const jsx = (userType, token) => {
  return (
    <React.StrictMode>
      <App userType={userType} token={token} />
    </React.StrictMode>
  );
};

let hasRendered = false;
const renderApp = (userType, token) => {
  if (!hasRendered) {
    ReactDOM.render(jsx(userType, token), document.getElementById("root"));
    hasRendered = true;
  }
};

if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp < Date.now()) {
    localStorage.clear();
    renderApp();
  } else {
    setAuthorizationHeader(token, userType);
    setAuthorizationHeaderForGrievanceService(token);
    renderApp(userType, token);
  }
} else {
  renderApp();
}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
