import LoginButton from "@/components/auth/login-button";


export default function Home() {
    return (
        <main className="flex h-full justify-center items-center">
            <div className="bg-green-200">
                <LoginButton>
                    Login
                </LoginButton>
            </div>
        </main>
    );
}
