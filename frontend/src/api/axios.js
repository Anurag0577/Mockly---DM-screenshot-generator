import axios from "axios";
import useAuthStore from "@/stores/authStore";

const api = axios.create({ // creating an instance of axios
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

// 🔹 Add accessToken to every request
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return config;
    }
    config.headers["Authorization"] = `Bearer ${accessToken}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Handle expired token & retry request
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ✅ FIX: Use OR (||) instead of AND (&&) - status can be 401 OR 403
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Request new token
        const res = await axios.post(
          "http://localhost:3000/api/auth/newAccessToken",
          {},
          { withCredentials: true }
        );
        console.log('From axios', res.data.data.accessToken)

        // ✅ FIX: Access token from correct response path
        const newAccessToken = res.data.data.accessToken;
        
        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);

          // Update header for this request
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          console.log("Retried")
          // Retry original request
          return api(originalRequest);
        } else {
          throw new Error("No access token in response");
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        localStorage.removeItem("accessToken");
        console.log('Setting login dialog to true from axios interceptor')
        // Access Zustand store directly using getState() since we're outside React component
        useAuthStore.getState().setOpenLoginDialog(true);
        // console.log('From axios i am redirecting it to login')
        // Optionally redirect to login page here
        // window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;