"use server"

import * as z from "zod";
import bcrypt from "bcryptjs"

import { RegisterSchema } from "@/schemas";
import prismadb from "@/lib/prismadb";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid field" }
    }

    const { name, email, password } = validatedFields.data;
    const passwordHashed = await bcrypt.hash(password, 10)

    const existingUser = await getUserByEmail(email)
    if (existingUser) {
        return { error: "Email already exists", }
    }

    await prismadb.user.create({
        data: {
            name,
            email,
            password: passwordHashed
        }
    })

    const verificationTolen = await generateVerificationToken(email);
    await sendVerificationEmail(verificationTolen.email, verificationTolen.token)

    return { success: "Confirm mail sent!" }
};
