import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (user) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

export default GuestRoute;
