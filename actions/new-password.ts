"use server"

import * as z from "zod";
import bcrypt from "bcryptjs";

import { PasswordSchema } from "@/schemas"
import { getPasswordResetTokenByToken } from "@/data/password-reset";
import { getUserByEmail } from "@/data/user";
import prismadb from "@/lib/prismadb";


export const newPassword = async (
    values: z.infer<typeof PasswordSchema>,
    token: string
) => {

    if (!token) {
        return { error: "Missing token!" };
    }

    const validatedFields = PasswordSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const existingToken = await getPasswordResetTokenByToken(token);
    if (!existingToken) {
        return { error: "Invalid token!" }
    }

    const hasExpired = existingToken.expires < new Date();

    if (hasExpired) {
        return { error: "Expired token!" }
    }

    const existingUser = await getUserByEmail(existingToken.email)
    if (!existingUser) {
        return { error: "Email does not found!" }
    }

    const { password } = validatedFields.data;

    const passwordHashed = await bcrypt.hash(password, 10)

    await prismadb.user.update({
        where: { id: existingUser.id },
        data: { password: passwordHashed }
    })

    await prismadb.passwordResetToken.delete({ where: { id: existingToken.id } })

    return { success: "Password updated." }


}