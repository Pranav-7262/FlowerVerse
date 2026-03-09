import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  // If already logged in → block login/register
  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
