import axios from "axios";

const api = axios.create({
  baseURL: "https://primetrade-api-qkpr.onrender.com/api/v1",
  withCredentials: true, // REQUIRED for HTTP-Only cookies
});

export default api;
