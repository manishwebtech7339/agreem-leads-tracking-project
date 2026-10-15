import { z } from "zod";

export const GENDER_OPTIONS = ["male", "female"] as const;
export const LEAD_STATUS_OPTIONS = [
  "new",
  "contacted",
  "qualified",
  "lost",
] as const;

// Sign In Schema
export const signInFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be at most 20 characters"),
});
export type SignInFormSchemaType = z.infer<typeof signInFormSchema>;

// Sign Up Schema
export const signUpFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters"),
  email: z.string().email("Invalid email address"),
  gender: z.enum(GENDER_OPTIONS, {
    message: "Please select a valid gender",
  }),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be at most 20 characters"),
});
export type SignUpFormSchemaType = z.infer<typeof signUpFormSchema>;

// Forgot Password Schema
export const forgotPasswordFormSchema = z.object({
  email: z.string().email("Invalid email address"),
});
export type ForgotPasswordFormSchemaType = z.infer<
  typeof forgotPasswordFormSchema
>;

// Verify OTP Schema
export const verifyOtpFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z
    .string()
    .min(1, "OTP is required")
    .max(6, "OTP must be at most 6 digits"),
});
export type VerifyOtpFormSchemaType = z.infer<typeof verifyOtpFormSchema>;

// Reset Password Schema (API payload)
export const resetPasswordFormSchema = z
  .object({
    resetToken: z.string().min(1, "Reset token is required"),
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(20, "Password must be at most 20 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(20, "Password must be at most 20 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type ResetPasswordFormSchemaType = z.infer<
  typeof resetPasswordFormSchema
>;

// Lead Schema
export const leadFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().or(z.literal("")),
  status: z.enum(LEAD_STATUS_OPTIONS).default("new"),
});
export type LeadFormSchemaType = z.infer<typeof leadFormSchema>;

// Note Schema
export const noteFormSchema = z.object({
  leadId: z.string().min(1, "Lead ID is required"),
  content: z
    .string()
    .min(1, "Content is required")
    .max(500, "Content must be less than 500 characters"),
});
export type NoteFormSchemaType = z.infer<typeof noteFormSchema>;
