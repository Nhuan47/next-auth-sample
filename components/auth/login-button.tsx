"use client"

import React from 'react'
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

interface LoginButtonProps {
    children: React.ReactNode;
    mode?: "modal" | "redirect";
    asChild?: boolean;
}

const LoginButton: React.FC<LoginButtonProps> = ({
    children,
    mode = "redirect",
    asChild
}) => {

    const router = useRouter()

    const onClick = () => {
        router.push("/auth/login")
    }

    if (mode === "modal") {
        return (
            <div>Modal</div>
        )
    }

    return (
        <Button
            variant="secondary"
            onClick={onClick}
        >
            {children}
        </Button>
    )
}

export default LoginButton