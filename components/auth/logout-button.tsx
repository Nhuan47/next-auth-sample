
import { logout } from '@/actions/logout';
import React from 'react'

interface LogoutButtonProps {
    children: React.ReactNode;
}

const LogoutButton = ({
    children
}: LogoutButtonProps) => {

    const handleLogout = (): void => {
        logout()
    }
    return (
        <span onClick={handleLogout} className="cursor-pointer">
            {children}
        </span>
    )
}

export default LogoutButton