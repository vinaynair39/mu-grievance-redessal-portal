import React, { useEffect, useReducer } from "react";
import { initalState, reducer } from "./context/reducer";
import { ReactQueryDevtools } from "react-query-devtools";
import AppRouter from "./routers/AppRouter";
import Context from "context/context";
import { login } from "context/actions";

function App({ userType, token }) {
  const [state, dispatch] = useReducer(reducer, initalState);
  useEffect(() => {
    if (!!token) dispatch(login(userType));
  }, []);

  return (
    <Context.Provider value={{ state, dispatch }}>
      <ReactQueryDevtools />
      <AppRouter />
    </Context.Provider>
  );
}

export default App;
