import prismadb from "@/lib/prismadb";

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
    try {
        const twoFactorToken = await prismadb.twoFactorConfirmation.findFirst({
            where: { userId }
        })

        return twoFactorToken;
    } catch (error) {
        return null;
    }
}
