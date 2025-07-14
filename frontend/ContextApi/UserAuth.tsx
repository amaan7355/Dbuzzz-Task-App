'use client'

import Link from "next/link";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";

const UserAuth = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        const user = sessionStorage.getItem('user');
        if (user) {
            setCurrentUser(JSON.parse(user));
        } else {
            setCurrentUser(null); // Explicitly set to null if no user is found
        }
    }, []);

    console.log(currentUser);

    if (currentUser) {
        return <>{children}</>;
    } else {
        enqueueSnackbar("Please Login to continue.", {
            anchorOrigin: {
                horizontal: 'right',
                vertical: 'bottom'
            },
            variant: 'error'
        })
        // toast.error("Please Login to continue.");
        return <Link href='/' />;
    }
}

export default UserAuth;
