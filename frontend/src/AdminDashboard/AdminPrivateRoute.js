import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function AdminPrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [token]);

  if (!token || currentUser?.type !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
