import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendTwoFactorTokenEmail = async (
    email: string,
    token: string
) => {
    await resend.emails.send({
        from: "onboading@resend.dev",
        to: email,
        subject: '2FA',
        html: `<p>Your 2FA code: ${token}</p>`
    })
}

export const sendVerificationEmail = async (
    email: string,
    token: string
) => {
    const confirmLink = `${process.env.BASE_URL}/auth/new-verification/?token=${token}`

    await resend.emails.send({
        from: "onboading@resend.dev",
        to: email,
        subject: 'Confirm your email',
        html: `<p>Click <a href="${confirmLink}">Here</a></p>`
    })
}

export const sendPasswordResetEmail = async (
    email: string,
    token: string
) => {
    const confirmLink = `${process.env.BASE_URL}/auth/new-password/?token=${token}`

    await resend.emails.send({
        from: "onboading@resend.dev",
        to: email,
        subject: 'Reset Password',
        html: `<p>Click <a href="${confirmLink}">Here</a> to reset your password</p>`
    })
}