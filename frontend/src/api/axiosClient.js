import axios from "axios";

// Shared axios instance for the whole app.
const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically inject the Authorization token into requests (crucial for new tabs/windows)
axiosClient.interceptors.request.use(
  (config) => {
    // Check all standard keys where tokens or user sessions are commonly saved
    const possibleKeys = ["user", "auth", "currentUser", "token", "accessToken"];
    let token = null;

    for (const key of possibleKeys) {
      const item = localStorage.getItem(key);
      if (!item) continue;

      try {
        const parsed = JSON.parse(item);
        if (parsed && typeof parsed === "object") {
          token = parsed.token || parsed.accessToken;
        } else if (typeof parsed === "string") {
          token = parsed;
        }
      } catch (e) {
        // If it's stored as a raw plain string token
        token = item;
      }

      if (token) break;
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