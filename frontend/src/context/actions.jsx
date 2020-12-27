import * as Types from "./types";

export const login = (userType) => {
  return {
    type: Types.LOGIN,
    payload: {
      userType,
    },
  };
};

export const logout = () => {
  return {
    type: Types.LOGOUT,
  };
};

export const setCollapsed = (state) => {
  return {
    type: Types.SET_COLLAPSED,
    payload: {
      collapsed: state,
    },
  };
};

export const setUser = (user) => {
  return {
    type: Types.SET_USER,
    payload: {
      user,
    },
  };
};

export const setTextFilter = (text) => {
  return {
    type: Types.SET_TEXT_FILTER,
    payload: {
      text,
    },
  };
};
