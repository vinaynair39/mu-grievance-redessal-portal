import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import Context from "context/context";

export default ({ component: Component, ...rest }) => {
  const {
    state: { isAuthenticated, userType },
  } = useContext(Context);
  return (
    <Route
      {...rest}
      component={(props) =>
        isAuthenticated ? (
          <Redirect exact to={userType === "STUDENT" ? "/student" : userType === "SECRETARY" ? "/secretary" : "/committee"} />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};
