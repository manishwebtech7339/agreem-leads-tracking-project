import { z } from "zod";

// Sign in
export const signInZodSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// Sign up
export const signUpZodSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  gender: z.enum(["male", "female"], {
    message: "Invalid gender",
  }),
});
