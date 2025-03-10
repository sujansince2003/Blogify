import { z } from "zod"
export const registerSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "password must be at least 6 character long"),
    email: z.string().email("email format didnot match"),
    userAvatarUrl: z.string().optional()
});

export const loginSchema = z
    .object({
        password: z.string().min(6, "Password must be at least 6 characters"),
        userAvatarUrl: z.string().optional()
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
    coverImgUrl: z.string().optional()
});


export const userSchema = z.object({
    username: z.string(),
    userAvatarUrl: z.string(),
});

export const BlogData = z.object({
    id: z.string(),
    title: z.string().min(1),
    content: z.string(),
    isPublished: z.boolean().optional(),
    createdAt: z.date().optional(),
    coverImgUrl: z.string().optional(),
    user: userSchema
})

export type signupType = z.infer<typeof registerSchema>
export type loginType = z.infer<typeof loginSchema>
export type blogType = z.infer<typeof BlogData>
