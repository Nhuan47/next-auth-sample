"use client"

import React, { useCallback, useEffect, useState } from 'react'
import { BeatLoader } from "react-spinners";
import { useSearchParams } from 'next/navigation';

import CardWrapper from './card-wrapper'
import { newVerification } from '@/actions/new-verification';
import FormError from '@/components/form-error';
import FormSuccess from '@/components/form-success';

const NewVerificationForm = () => {

    const params = useSearchParams();
    const token = params.get('token');

    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    if (!token) {
        setError("Missing token!")
        return;
    }

    const onSubmit = useCallback(() => {
        newVerification(token).then(data => {
            setSuccess(data.success)
            setError(data.error)
        }).catch(() => {
            setError("Failed to verify")
        })
    }, [token])

    useEffect(() => {
        onSubmit();
    }, [onSubmit])

    return (
        <CardWrapper

            headerLabel='Comfirming your varification'
            backButtonHref='/auth/login'
            backButtonLabel='Back to login'
        >
            <div className="flex item-centers w-full justify-center">

                {error || success
                    ? (
                        <>
                            <FormError message={error} />
                            <FormSuccess message={success} />
                        </>)
                    : <BeatLoader />}

            </div>
        </CardWrapper>
    )
}

export default NewVerificationForm