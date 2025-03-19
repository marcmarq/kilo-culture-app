import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const token = window.sessionStorage.getItem("authToken");  // <-- Add this
        console.log("🔍 Retrieved session token:", token); // Log token

        if (!token) {
          console.warn("⚠️ No session token found!");
          setIsAuthenticated(false);
          return;
        }

        console.log("🔍 Checking session with token...");
        const response = await window.authAPI.checkSession(token);
        console.log("✅ Session check response:", response);

        setIsAuthenticated(response);
      } catch (error) {
        console.error("❌ Session check error:", error);
        setIsAuthenticated(false);
      }
    };

    verifySession();
  }, []);

  if (isAuthenticated === null) {
    console.log("⏳ Waiting for session check...");
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    console.log("🚫 User not authenticated. Redirecting to /login");
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;

