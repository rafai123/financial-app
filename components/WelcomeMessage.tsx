'use client'

import { useUser } from "@clerk/nextjs"

const WelcomeMessage = () => {

    const {user, isLoaded} = useUser()

    return (
        <>
            <h1 className="text-2xl lg:text-4xl text-white font-medium">
                Welcome back, {isLoaded ? user?.fullName : "loading..."}
            </h1>
            <h1 className="text-[#89BDFD] text-sm lg:text-base">This is your Financial Overview Report</h1>
        </>
    )
}

export default WelcomeMessage