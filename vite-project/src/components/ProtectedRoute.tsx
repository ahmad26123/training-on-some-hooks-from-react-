import { useContext } from "react";
import { Navigate } from "react-router";
import { UserPostsContext } from "@/App";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { id } = useContext(UserPostsContext);

  if (!id) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;