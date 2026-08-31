import axios from "axios";

// Shared axios instance for the whole app.
// TEAM NOTE: if an axiosClient (or similar) already exists in src/api,
// reuse that one instead of adding a second instance.
const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
