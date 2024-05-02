import NextAuth, { type DefaultSession } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"

import authConfig from "@/auth.config"
import prismadb from "@/lib/prismadb"
import { getUserByEmail, getUserById } from "@/data/user"
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation"

declare module "next-auth" {
    interface Session {
        user: {
            role: string;
        } & DefaultSession["user"]
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    pages: {
        signIn: "/auth/login",
        error: "/auth/error"
    },
    events: {
        async linkAccount({ user }) {
            await prismadb.user.update({
                data: {
                    emailVerified: new Date()
                },
                where: {
                    id: user.id
                }
            })
        }
    },
    callbacks: {
        async signIn({  email, account }) {

            // Allow OAuth without email verification
            if (account?.type !== "credentials") {
                return true;
            }

            // Prevent signin with credentials 
            const existingUser = await getUserByEmail(email as string)

            if (!existingUser?.emailVerified) return false;

            // 2FA Check
            if (existingUser.isTwoFactorEnabled) {
                const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

                if (!twoFactorConfirmation) return false;

                // Delete 2FA confirmation for next sign in 
                await prismadb.twoFactorConfirmation.delete({
                    where: { id: twoFactorConfirmation.id }
                });

            }

            return true
        },
        async redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        },
        async session({ session, user, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.sub,
                    role: token.role,
                },
            }
        },
        async jwt({ token, user, account, profile }) {
            if (!token.sub) return token;

            const existingUser = await getUserById(token.sub);
            if (!existingUser) return token;

            token.role = existingUser.role

            return token
        }
    },

    adapter: PrismaAdapter(prismadb),
    session: { strategy: "jwt" },
    secret: process.env.AUTH_SECRET,
    ...authConfig,
})