import Header from "@/components/auth/header";
import BackButton from "@/components/auth/back-button";

import { Card, CardFooter, CardHeader } from "@/components/ui/card";


const ErrorCard = () => {
    return (
        <Card className="w-[28rem] shadow-md">
            <CardHeader>
                <Header label="Oops! Something went wrong!" />
            </CardHeader>
            <CardFooter>
                <BackButton href="/auth/login" label="Back to Login" />
            </CardFooter>
        </Card>
    )
}

export default ErrorCard