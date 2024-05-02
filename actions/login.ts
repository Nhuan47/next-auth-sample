"use server"

import * as z from "zod";

import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

import { generateTwoFactorToken, generateVerificationToken } from "@/lib/token";
import { getUserByEmail } from "@/data/user";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import prismadb from "@/lib/prismadb";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields" }
    }

    const { email, password, code } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: "Invalid credentials!" }
    }

    if (!existingUser.emailVerified) {
        const verificationTolen = await generateVerificationToken(email);
        await sendVerificationEmail(verificationTolen.email, verificationTolen.token)
    }

    if (existingUser.isTwoFactorEnabled && existingUser.email) {
        if (code) {
            // Verify code
            let twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)
            if (!twoFactorToken) {
                return { error: 'Invalid code' }
            }

            if (twoFactorToken.token !== code) {
                return { error: 'Invalid code' }
            }

            let hasExpired = new Date(twoFactorToken.expires) < new Date();
            if (hasExpired) {
                return { error: 'Token has expired' }
            }

            await prismadb.twoFactorToken.delete({
                where: { id: twoFactorToken.id }
            })

            const existingComfirmation2FA = await getTwoFactorConfirmationByUserId(existingUser.id)

            if (existingComfirmation2FA) {
                await prismadb.twoFactorConfirmation.delete({
                    where: { id: existingComfirmation2FA.id }
                })
            }

            await prismadb.twoFactorConfirmation.create({
                data: {
                    userId: existingUser.id,
                    expires: new Date()
                }
            })


        } else {
            let twoFactorToken = await generateTwoFactorToken(existingUser.email);
            await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token)
            return { twoFactor: true }
        }
    }

    try {
        await signIn("credentials", { email, password, redirectTo: DEFAULT_LOGIN_REDIRECT })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials!" }
                default:
                    return { error: "Something went wrong!" }
            }
        }

        throw error;
    }

    return { success: "Mail sent" }


};
