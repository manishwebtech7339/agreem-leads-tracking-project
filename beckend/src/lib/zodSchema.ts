import { z } from "zod";

// Sign in
export const signInZodSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// Sign up
export const signUpZodSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password must be less then 20 characters"),
  gender: z.enum(["male", "female"], {
    message: "Invalid gender",
  }),
});

// Lead
export const leadZodSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.email("Invalid email address"),
  phone: z.string().optional().or(z.literal("")),
  status: z.enum(["new", "contacted", "qualified", "lost"]),
});
export type leadZodSchemaType = z.infer<typeof leadZodSchema>;

// Lead Note
export const leadNoteZodSchema = z.object({
  leadId: z.string().min(1, "Lead id is required"),
  content: z
    .string()
    .min(1, "Content is required")
    .max(500, "Content must be less then 500 characters"),
});
export type leadNoteZodSchemaType = z.infer<typeof leadNoteZodSchema>;
