import { createBrowserRouter, Outlet } from "react-router";
import SignIn from "@/pages/auth/SignIn";
import SignUp from "@/pages/auth/SignUp";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import VerifyOtp from "@/pages/auth/VerifyOtp";
import ResetPassword from "@/pages/auth/ResetPassword";
import Home from "@/pages/dashboard/home/Home";
import Leads from "@/pages/dashboard/leads/Leads";
import Notes from "@/pages/dashboard/leads/notes/Notes";
import Users from "@/pages/dashboard/users/Users";
import { Navigate } from "react-router";
import DashboardWrapper from "@/pages/dashboard/DashboardWrapper";
import ProtectRoute from "./ProtectRoute";
import ProtectAuthRoute from "./ProtectAuthRoute";

const router = createBrowserRouter([
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />, // Navigate to home, if page not found
  },
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />, // Navigate to home
  },
  {
    path: "/sign-in",
    element: (
      <ProtectAuthRoute>
        <SignIn />
      </ProtectAuthRoute>
    ),
  },
  {
    path: "/sign-up",
    element: (
      <ProtectAuthRoute>
        <SignUp />
      </ProtectAuthRoute>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <ProtectAuthRoute>
        <ForgotPassword />
      </ProtectAuthRoute>
    ),
  },
  {
    path: "/verify-otp",
    element: (
      <ProtectAuthRoute>
        <VerifyOtp />
      </ProtectAuthRoute>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <ProtectAuthRoute>
        <ResetPassword />
      </ProtectAuthRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <DashboardWrapper>
        <ProtectRoute>
          <Outlet /> {/* Passed all children */}
        </ProtectRoute>
      </DashboardWrapper>
    ),
    children: [
      {
        path: "",
        Component: Home,
      },
      {
        path: "/dashboard/leads",
        Component: Leads,
      },
      {
        path: "/dashboard/leads/notes",
        Component: Notes,
      },
      {
        path: "/dashboard/users",
        Component: Users,
      },
    ],
  },
]);

export default router;
