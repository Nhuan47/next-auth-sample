"use client"

import { signIn } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import { SiMicrosoftazure } from "react-icons/si";

import { Button } from '@/components/ui/button'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'

const Social = () => {


    const handleClick = (provider: "google" | "github" | "azure-ad") => {
        signIn(provider, {
            callbackUrl: DEFAULT_LOGIN_REDIRECT
        })
    }

    return (
        <div className="flex items-center w-full gap-x-2">
            <Button
                size="lg"
                className="w-full"
                variant="outline"
                onClick={() => handleClick("google")}
            >
                <FcGoogle className="w-5 h-5" />
            </Button>
            <Button
                size="lg"
                className="w-full"
                variant="outline"
                onClick={() => handleClick("github")}
            >
                <FaGithub className="w-5 h-5" />
            </Button>
            <Button
                size="lg"
                className="w-full"
                variant="outline"
                onClick={() => handleClick("azure-ad")}
            >
                <SiMicrosoftazure className="w-5 h-5" />
            </Button>
        </div>
    )
}

export default Social