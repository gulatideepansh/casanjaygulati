import { z } from "zod";

export const usernamePattern = /^[a-z0-9](?:[a-z0-9._-]{2,29})$/;

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long.")
  .max(128, "Password must be under 128 characters.")
  .regex(/[a-z]/, "Password must include at least one lowercase letter.")
  .regex(/[A-Z]/, "Password must include at least one uppercase letter.")
  .regex(/[0-9]/, "Password must include at least one number.")
  .regex(/[^A-Za-z0-9]/, "Password must include at least one special character.");

export const signInSchema = z.object({
  identifier: z.string().trim().min(1, "Enter your username or email address."),
  password: z.string().min(1, "Enter your password.")
});

export const staffAccountSchema = z
  .object({
    username: z
      .string()
      .trim()
      .toLowerCase()
      .regex(
        usernamePattern,
        "Username can use lowercase letters, numbers, dots, underscores, and hyphens."
      ),
    firstName: z.string().trim().min(2, "First name is required."),
    lastName: z.string().trim().min(2, "Last name is required."),
    email: z.email("Enter a valid email address.").transform((value) => value.trim().toLowerCase()),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm your password.")
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"]
  });

export const forgotPasswordSchema = z.object({
  email: z.email("Enter a valid email address.").transform((value) => value.trim().toLowerCase())
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm your password.")
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"]
  });

export const PROFILE_IMAGE_SIZE_LIMIT = 2 * 1024 * 1024;
export const PROFILE_IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function normalizeIdentifier(value: string) {
  return value.trim().toLowerCase();
}
