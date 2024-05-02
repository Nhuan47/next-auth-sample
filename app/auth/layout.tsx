interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
    children
}) => {
    return (
        <div className="h-full flex justify-center items-center ">
            {children}
        </div>
    )
}

export default AuthLayout;