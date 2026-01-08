// src/component/VerifiedRoute.js
import { Navigate } from "react-router-dom";

/**
 * VerifiedRoute - Protects routes that require BOTH login AND verified status.
 * 
 * Unverified/Pending users will be redirected to the pending verification page
 * where they can see a message explaining their account is under review.
 */
export default function VerifiedRoute({ children }) {
  const email = localStorage.getItem("loggedInEmail");
  
  // If not logged in, redirect to login page
  if (!email) {
    return <Navigate to="/login" replace />;
  }
  
  // Check user status from stored user data
  const userData = localStorage.getItem("userData");
  let status = null;
  
  try {
    const user = JSON.parse(userData || "{}");
    status = user.Status;
  } catch (e) {
    console.error("Error parsing user data:", e);
  }
  
  // If user is not verified (not Active), redirect to pending page
  if (status !== "Active") {
    return <Navigate to="/pending-verification" replace />;
  }
  
  // User is logged in AND verified, render the protected content
  return children;
}
