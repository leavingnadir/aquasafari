import axios from "axios";

// Shared axios instance for the whole app.
const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add the token from the same session storage managed by AuthContext.
axiosClient.interceptors.request.use(
  (config) => {
    let token;
    try {
      token = JSON.parse(localStorage.getItem("aquasafari_auth") || "null")?.token;
    } catch (error) {
      return Promise.reject(error);
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;