import crypto from 'crypto';
import { v4 as uuidv4 } from "uuid";

import { getVerificationTokenByEmail } from "@/data/verification-token";
import prismadb from "./prismadb";
import { getPasswordResetTokenByEmail } from "@/data/password-reset";
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';


export const generateTwoFactorToken = async (email: string) => {
    const token = crypto.randomInt(100001, 999999).toString();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getTwoFactorTokenByEmail(email);

    if (existingToken) {
        await prismadb.twoFactorToken.delete({ where: { id: existingToken.id } });
    }

    const twoFactorToken = await prismadb.twoFactorToken.create({
        data: {
            email,
            token,
            expires
        }
    })

    return twoFactorToken;
}

export const generateVerificationToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000)

    const existingToken = await getVerificationTokenByEmail(email);

    if (existingToken) {
        await prismadb.verificationToken.delete({
            where: { id: existingToken.id }
        })
    }

    const verificationToken = await prismadb.verificationToken.create({
        data: {
            token,
            email,
            expires
        }
    })

    return verificationToken;
}

export const generatePasswordResetToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getPasswordResetTokenByEmail(email);
    if (existingToken) {
        await prismadb.passwordResetToken.delete({
            where: { id: existingToken.id }
        })
    }

    const passwordResetToken = await prismadb.passwordResetToken.create({
        data: {
            token,
            email,
            expires
        }
    })
    return passwordResetToken;

}
