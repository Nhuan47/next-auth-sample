"use client"

import * as z from "zod";
import { useForm } from 'react-hook-form';
import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { ResetSchema } from "@/schemas"
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
import { reset } from "@/actions/reset"

const ResetForm = () => {

    const [isPending, startTransition] = useTransition();

    const [successMessage, setSuccessMessage] = useState<string | undefined>("");
    const [errorMessage, setErrorMessage] = useState<string | undefined>("");

    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver: zodResolver(ResetSchema),
        defaultValues: {
            email: "",
        }
    })

    const onSubmit = async (values: z.infer<typeof ResetSchema>) => {
        setErrorMessage("");
        setSuccessMessage("");

        startTransition(() => {
            reset(values).then((data) => {
                setErrorMessage(data?.error)
                setSuccessMessage(data?.success)
            })
        })
    }

    return (
        <CardWrapper
            headerLabel="Forgot your password?"
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
                    </div>

                    <FormSuccess message={successMessage} />
                    <FormError message={errorMessage} />

                    <Button
                        className="w-full"
                        type="submit"
                        disabled={isPending}
                    >
                        Send reset email
                    </Button>

                </form>
            </Form >
        </CardWrapper >
    )
}

export default ResetForm