import Axios from "axios";
import { userBaseURL } from "./user";

let baseURL = "";
switch (process.env.NODE_ENV) {
  case "development":
    baseURL = process.env.REACT_APP_GRIEVANCE_SERVICE_URL_DEV;
    break;
  case "production":
    baseURL = process.env.REACT_APP_GRIEVANCE_SERVICE_URL_PROD;
    break;
  case "test":
    baseURL = process.env.REACT_APP_GRIEVANCE_SERVICE_URL_TEST;
    break;
  default:
    baseURL = process.env.REACT_APP_GRIEVANCE_SERVICE_URL_DEV;
    break;
}

const axios = Axios.create({
  baseURL,
});

export const setAuthorizationHeaderForGrievanceService = (token) => {
  axios.defaults.headers.Authorization = token;
};

export const getGrievances = async (_, status) => {
  const { data } = await axios.get(`/grievance?status=${status}`);
  return data;
};
export const getGrievancesByEmail = async () => {
  const { data } = await axios.get(`/grievance/student`);
  return data;
};

export const getGrievance = async (_, id) => {
  if (!!id) {
    const { data } = await axios.get(`/grievance/${id}`);
    return data;
  }
  return {};
};

export const updateGrievance = async ({ id, studentInfo, grievanceInfo }) => {
  const { data } = await axios.put(`/grievance/update/${id}`, { studentInfo, grievanceInfo });
  return data;
};

export const createGrievance = async (payload) => await axios.post(`/grievance/create`, payload);

export const getGrievanceStats = async () => {
  const { data } = await axios.get(`/grievance/stats`);
  return data;
};

export const allocateDate = async ({ id, payload }) => await axios.patch(`/grievance/date/${id}`, payload);

export const addComment = async ({ id, payload }) => await axios.patch(`/grievance/comment/${id}`, payload);

export const selectGrievance = async (id) => await axios.patch(`/grievance/select/${id}`);

export const rejectGrievance = async ({ id, message, email }) => await axios.patch(`/grievance/reject/${id}`, { message, email });

export const sendResolution = async ({ id, payload }) => await axios.patch(`grievance/resolution/${id}`, payload);

export const sendATR = async ({ id, payload }) => await axios.patch(`grievance/atr/${id}`, payload);

export const sendInvite = async ({ payload }) => await axios.put("grievance/invite", payload);

export const fetchEmailIdOfPrincipal = async (key, collegeName) => {
  if (!!collegeName) {
    const { data } = await axios.get(`/grievance/email/${collegeName}`);
    return data;
  }
  return null;
};

export const sendPrincipalActions = async ({ id, payload }) => await axios.patch("grievance/principal/" + id, payload);

export const fetchStudentDetails = async (_, id, type) => {
  if (type === "EDIT") {
    if (!!id) {
      const { data } = await axios.get(`/grievance/${id}`);
      return data;
    }
    return {};
  } else {
    const { data } = await axios.get(`${userBaseURL}/user/${id}`);
    return data;
  }
};
