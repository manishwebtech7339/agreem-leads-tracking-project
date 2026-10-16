import express, { Router } from "express";
import {
  forgotPassword,
  resetPassword,
  signIn,
  signUp,
  verifyOTP,
} from "../controllers/auth.js";
import { zodValidate } from "../lib/zodValidator.js";
import { signInZodSchema, signUpZodSchema } from "../lib/zodSchema.js";

const authRouter = Router();

// Sign UP
authRouter.post("/signup", zodValidate(signUpZodSchema), signUp);
// Sign IN
authRouter.post("/signin", zodValidate(signInZodSchema), signIn);
// Forgot Password
authRouter.post("/forgot-password", forgotPassword);
// Verify OTP
authRouter.post("/verify-otp", verifyOTP);
// Reset Password
authRouter.post("/reset-password", resetPassword);

export default authRouter;
