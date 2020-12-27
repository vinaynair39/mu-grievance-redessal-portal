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
        isAuthenticated && userType === "COMMITTEE" ? (
          <div>
            <Component {...props} />
          </div>
        ) : (
          <Redirect to="/" exact={true} />
        )
      }
    />
  );
};
