import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const storedUser = localStorage.getItem("userData");

  if (storedUser) {
    return <Navigate to="/profile" replace />;
  }

  return children;
}
