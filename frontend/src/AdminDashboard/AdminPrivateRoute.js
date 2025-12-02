import React from "react";
import { Navigate } from "react-router-dom";

export default function AdminPrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!token || currentUser?.type !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
