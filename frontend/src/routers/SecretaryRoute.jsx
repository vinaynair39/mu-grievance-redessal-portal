import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import Context from "context/context";

const SecretaryRoute = ({ component: Component, ...rest }) => {
  const {
    state: { isAuthenticated, userType },
  } = useContext(Context);
  return <Route {...rest} component={(props) => (isAuthenticated && userType === "SECRETARY" ? <Component {...props} /> : <Redirect to="/" exact={true} />)} />;
};

export default SecretaryRoute;
