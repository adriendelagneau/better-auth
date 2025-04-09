import { object, string, union } from "zod";

const base64Regex = /^data:image\/[a-zA-Z]+;base64,[a-zA-Z0-9+/=]+$/;

const getPasswordSchema = (type: "password" | "confirmPassword") =>
  string({ required_error: `${type} is required` })
    .min(8, `${type} must be at least 8 characters`)
    .max(32, `${type} cannot exceed 32 characters`);

const getEmailSchema = () =>
  string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email");

const getNameSchema = () =>
  string({ required_error: "Name is required" })
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters");

const getImageSchema = () =>
  string()
    .regex(base64Regex, "Invalid Base64 image format")
    .or(string().url("Invalid image URL")) // Allow either Base64 or URL
    .optional();

export const signUpSchema = object({
  name: getNameSchema(),
  email: getEmailSchema(),
  password: getPasswordSchema("password"),
  confirmPassword: getPasswordSchema("confirmPassword"),
  image: getImageSchema(), 
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const signInSchema = object({
  email: getEmailSchema(),
  password: getPasswordSchema("password"),
});

export const forgotPasswordSchema = object({
  email: getEmailSchema(),
});

export const resetPasswordSchema = object({
  password: getPasswordSchema("password"),
  confirmPassword: getPasswordSchema("confirmPassword"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});





import { z } from "zod";

export const videoUpdateSchema = object({
  title: string().min(1, "Title is required").max(255, "Title is too long"),
  description: string().optional(), // description is optional and can be nullable
  thumbnailUrl: string().url("Invalid URL").optional(),
  visibility: union([z.literal("private"), z.literal("public")]),
  categoryId: string().uuid("Invalid category ID").optional(),
});


export const commentSchema = z.object({
  videoId: z.string().uuid({ message: "Invalid video ID" }),
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment is too long"),
});

