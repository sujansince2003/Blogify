import { z } from "zod"
export const registerSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "password must be at least 6 character long"),
    email: z.string().email("email format didnot match"),
});

export const loginSchema = z
    .object({
        password: z.string().min(6, "Password must be at least 6 characters"),
    })
    .and(
        z.union([
            z.object({ email: z.string().email("Invalid email") }), // Login with email
            z.object({
                username: z.string().min(3, "Username must be at least 3 characters"),
            }), // Login with username
        ])
    );
export const blogBodySchema = z.object({
    title: z.string().min(1),
    content: z.string(),
    isPublished: z.boolean().optional(),
    createdAt: z.date()
});

export type signupType = z.infer<typeof registerSchema>
export type loginType = z.infer<typeof loginSchema>
export type blogType = z.infer<typeof blogBodySchema>