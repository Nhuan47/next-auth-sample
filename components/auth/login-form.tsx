"use client"

import * as z from "zod";
import Link from "next/link";
import { useForm } from 'react-hook-form';
import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoginSchema } from "@/schemas"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button';
import CardWrapper from '@/components/auth/card-wrapper'
import FormError from '@/components/form-error';
import FormSuccess from '@/components/form-success';
import { login } from "@/actions/login"

const LoginForm = () => {

    const [isPending, startTransition] = useTransition();

    const [show2FA, setShow2FA] = useState<boolean | undefined>(false)
    const [successMessage, setSuccessMessage] = useState<string | undefined>("");
    const [errorMessage, setErrorMessage] = useState<string | undefined>("");

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
            code: ""
        }
    })

    const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
        setErrorMessage("");
        setSuccessMessage("");

        startTransition(() => {
            login(values).then((data) => {
                if (data?.error) {
                    setErrorMessage(data?.error)
                }

                if (data?.success) {
                    setSuccessMessage(data?.success);
                    form.reset();
                }

                if (data?.twoFactor) {
                    setShow2FA(data?.twoFactor)
                }
            }).catch(() => {
                setErrorMessage("Something went wrong!")
            })
        })
    }

    return (
        <CardWrapper
            headerLabel="Welcome back"
            backButtonLabel="Don't have a account?"
            backButtonHref="/auth/register"
            showSocial={!show2FA}
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-4">
                        {show2FA && (
                            <FormField
                                name="code"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Two Factor Code</FormLabel>
                                        <FormControl>
                                            <Input {...field}
                                                disabled={isPending}
                                                placeholder="123456"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {!show2FA && (
                            <>
                                <FormField
                                    name="email"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input {...field}
                                                    placeholder="example@mail.com"
                                                    type="email"
                                                    disabled={isPending}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    name="password"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input {...field}
                                                    placeholder="******"
                                                    type="password"
                                                    disabled={isPending}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}
                    </div>

                    <FormSuccess message={successMessage} />
                    <FormError message={errorMessage} />

                    <Button variant="link" size="sm" className="px-0" asChild>
                        <Link href="/auth/reset">
                            Forgot Password
                        </Link>
                    </Button>

                    <Button
                        className="w-full"
                        type="submit"
                        disabled={isPending}
                    >
                        {show2FA ? "Confirm" : "Login"}
                    </Button>

                </form>
            </Form >
        </CardWrapper >
    )
}

export default LoginForm