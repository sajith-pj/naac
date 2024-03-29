import axios from "axios";
let domain =
  process.env.NODE_ENV === "production"
    ? window.location.host.split(".")[0]
    : "dev";
// axios instance for making requests
const axiosInstance = axios.create();
// request interceptor for adding token
axiosInstance.interceptors.request.use((config) => {
  // add token to request headers
  config.baseURL = `https://dev.naacpro.in/api/v1`;
  // config.baseURL = `http://192.168.29.191:8000/api/v1`;
  config.headers = Object.assign(
    {
      Authorization: `${localStorage.getItem("accessToken")}`,
    },
    config.headers
  );
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    if (err.response.status === 401) {
      localStorage.clear();
      if (window.location.pathname !== "/login") {
        window.location = "/login";
      }
    }

    return Promise.reject(err);
  }
);

export default axiosInstance;
