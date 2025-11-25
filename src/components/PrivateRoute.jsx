import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  // se não tiver token, volta pro login
  if (!token) return <Navigate to="/" replace />;

  return children;
}