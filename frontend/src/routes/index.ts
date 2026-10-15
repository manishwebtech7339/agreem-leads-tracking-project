import { createBrowserRouter } from "react-router";
import SignIn from "@/pages/auth/SignIn";
import SignUp from "@/pages/auth/SignUp";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import VerifyOtp from "@/pages/auth/VerifyOtp";
import ResetPassword from "@/pages/auth/ResetPassword";

const router = createBrowserRouter([
  {
    path: "/sign-in",
    Component: SignIn,
  },
  {
    path: "/sign-up",
    Component: SignUp,
  },
  {
    path: "/forgot-password",
    Component: ForgotPassword,
  },
  {
    path: "/verify-otp",
    Component: VerifyOtp,
  },
  {
    path: "/reset-password",
    Component: ResetPassword,
  },
]);

export default router;
