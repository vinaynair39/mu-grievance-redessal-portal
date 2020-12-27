import Axios from "axios";
import { setAuthorizationHeaderForGrievanceService } from "./grievance";

const axios = Axios.create({
  baseURL: `${process.env.REACT_APP_USER_SERVICE_URL_}${process.env.NODE_ENV.toUpperCase()}`,
});

export const setAuthorizationHeader = (token, userType) => {
  localStorage.setItem("token", token);
  if (!!userType) localStorage.setItem("userType", userType);
  axios.defaults.headers.Authorization = token;
};

export const registerUser = async ({ data, userType }) => await axios.post(`/user/register/${userType}`, data);

export const loginUser = async ({ data }) => {
  sessionStorage.setItem("email", data.email);
  const {
    data: { token },
  } = await axios.post(`/user/login`, data);
  const jwt = "Bearer " + token;
  setAuthorizationHeader(jwt);
  setAuthorizationHeaderForGrievanceService(jwt);
  return token;
};

export const verifyUser = async (payload) => {
  return await axios.patch(`/user/verify`, payload);
};

export const forgotPassword = async (email) => {
  sessionStorage.setItem("email", email);
  return await axios.patch(`/user/forgot/${email}`);
};

export const resetPassword = async (data) => {
  return await axios.patch(`/user/reset`, data);
};

export const getAllCommittee = async () => {
  const { data } = await axios.get(`/user/committee`);
  return data;
};
export const getAllCommitteePublic = async () => {
  const { data } = await axios.get(`/user/committee/public`);
  return data;
};

export const getCommittee = async (key, id) => {
  const { data } = await axios.get(`/user/committee/${id}`);
  return data;
};
export const editCommittee = async ({ id, data }) => await axios.patch(`/user/committee/${id}/update`, data);
