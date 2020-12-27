import { LOGIN, LOGOUT, SET_USER, SET_COLLAPSED, SET_TEXT_FILTER } from "./types";

const initalState = {
  isAuthenticated: false,
  userType: null,
  user: {},
  isCollapsed: false,
  filters: {
    text: "",
  },
};

const reducer = (state = initalState, action) => {
  switch (action.type) {
    case LOGIN:
      return { ...state, isAuthenticated: true, userType: action.payload.userType };
    case LOGOUT:
      localStorage.clear();
      return { ...state, isAuthenticated: false, userType: null };
    case SET_USER:
      return { ...state, user: action.payload.user };
    case SET_COLLAPSED:
      return { ...state, isCollapsed: action.payload.collapsed };
    case SET_TEXT_FILTER:
      return { ...state, filters: { ...state.filters, text: action.payload.text } };
    default:
      return state;
  }
};

export { initalState, reducer };
