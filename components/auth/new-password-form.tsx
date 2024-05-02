"use client"

import * as z from "zod";
import { useForm } from 'react-hook-form';
import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { PasswordSchema } from "@/schemas"
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
import { newPassword } from "@/actions/new-password";
import { useSearchParams } from "next/navigation";

const NewPasswordForm = () => {

    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    if (!token) return;

    const [isPending, startTransition] = useTransition();

    const [successMessage, setSuccessMessage] = useState<string | undefined>("");
    const [errorMessage, setErrorMessage] = useState<string | undefined>("");


    const form = useForm<z.infer<typeof PasswordSchema>>({
        resolver: zodResolver(PasswordSchema),
        defaultValues: {
            password: ""
        }
    })

    const onSubmit = async (values: z.infer<typeof PasswordSchema>) => {
        setErrorMessage("");
        setSuccessMessage("");

        startTransition(() => {
            newPassword(values, token).then((data) => {
                setErrorMessage(data?.error)
                setSuccessMessage(data?.success)
            })
        })
    }

    return (
        <CardWrapper
            headerLabel="Enter a new password"
            backButtonLabel="Back to login"
            backButtonHref="/auth/login"
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-4">

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
                    </div>

                    <FormSuccess message={successMessage} />
                    <FormError message={errorMessage} />

                    <Button
                        className="w-full"
                        type="submit"
                        disabled={isPending}
                    >
                        Reset password
                    </Button>

                </form>
            </Form >
        </CardWrapper >
    )
}

export default NewPasswordForm