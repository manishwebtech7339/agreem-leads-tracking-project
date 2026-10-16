import { useAppSelector } from "@/store/store";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

const ProtectAuthRoute = ({ children }: { children: ReactNode }) => {
  const token = useAppSelector((state) => state.auth.token);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectAuthRoute;
