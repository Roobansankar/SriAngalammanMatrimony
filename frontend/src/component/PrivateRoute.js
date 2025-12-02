// src/component/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const email = localStorage.getItem("loggedInEmail");
  // If not logged in, redirect to login page
  if (!email) {
    return <Navigate to="/login" replace />;
  }
  // else render children (the protected component)
  return children;
}
