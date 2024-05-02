import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { auth } from "@/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Authentication",
    description: "Sample for authentication module",
};



export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth()
    return (
        <SessionProvider session={session}>
            <html lang="en">
                <body className={inter.className}>{children}</body>
            </html>
        </SessionProvider>
    );
}
