import axios from "axios";
import toast from "react-hot-toast";

// 1. Create the Axios Instance
const api = axios.create({
  baseURL: "http://localhost:8080/api", // Your Backend URL
  withCredentials: true, // IMPORTANT: Sends the HttpOnly Cookie
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Response Interceptor (The Global Error Handler)
api.interceptors.response.use(
  (response) => {
    // If response is good, just return it
    return response;
  },
  (error) => {
    const { response } = error;

    // A. Handle Server Errors (4xx, 5xx)
    if (response) {
      // If token is invalid or expired (401), force logout
      if (response.status === 401) {
        // Optional: clear local storage if you store user info there
        localStorage.removeItem("user");
        
        // Redirect to login only if we aren't already there
        if (window.location.pathname !== "/login") {
           window.location.href = "/login";
        }
        
        toast.error("Session expired. Please login again.");
      } else {
        // Show the error message from the backend (e.g., "Invalid password")
        toast.error(response.data.message || "Something went wrong");
      }
    } else {
      // B. Handle Network Errors (Server down)
      toast.error("Network Error. Is the server running?");
    }

    return Promise.reject(error);
  }
);

export default api;