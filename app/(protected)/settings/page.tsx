"use client"


import { logout } from "@/actions/logout"
import { useCurrentUser } from "@/hooks/use-current-user"




const SettingPage = () => {
    const user = useCurrentUser()

    const hanleSignOut = () => {
        logout()
    }
    return (
        <div>

            <button type="submit" onClick={hanleSignOut}>
                sign-out
            </button>

        </div>
    )
}

export default SettingPage