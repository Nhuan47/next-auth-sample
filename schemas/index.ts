import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
    code: z.optional(z.string())
})

export const ResetSchema = z.object({
    email: z.string().email()
})
export const PasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Minumum 6 characters required."
    })
})

export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Email is required."
    }),
    name: z.string().min(1, {
        message: "Name is required."
    }),
    password: z.string().min(6, {
        message: "Minumum 6 characters required."
    })
})