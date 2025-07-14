'use client';
import { createContext, useContext, useEffect, useState, Dispatch, SetStateAction } from "react";
import { useRouter } from 'next/navigation';
import axios from "axios";
import { enqueueSnackbar } from "notistack";

// Define a type for the context value
interface AppContextType {
    loggedIn: boolean;
    setLoggedIn: Dispatch<SetStateAction<boolean>>;
    logout: () => void;
    currentUser: any; // You can replace 'any' with a more specific type if needed
    setCurrentUser: Dispatch<SetStateAction<any>>;
    loadingData: boolean;
    setLoadingData: Dispatch<SetStateAction<boolean>>;
}

// Create the context with the appropriate type
const AppContext = createContext<AppContextType | null>(null);

export const Provider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<any | null>(null);
    const [loadingData, setLoadingData] = useState(true);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const router = useRouter();

    console.log(currentUser, "current user data after reload");

    useEffect(() => {
        handleCurrentUser();
    }, []);

    const handleCurrentUser = () => {
        setLoadingData(true);
        const user = sessionStorage.getItem('user');
        console.log(sessionStorage.getItem('user'), "current user");

        if (user) {
            const parsedUser = JSON.parse(user); // Correct parsing
            setCurrentUser(parsedUser);  // Set the parsed user object
            console.log(parsedUser, "current user in context");
            setLoggedIn(true);
        } else {
            setCurrentUser(null);
            setLoggedIn(false);
        }

        // Always set loadingData to false at the end of the function
        setLoadingData(false);
    };


    const logout = async () => {
        try {
            const res = await axios.post(process.env.apiUrl + `/signout`, {
                email: currentUser?.email,
                user_id: currentUser?._id
            });
            enqueueSnackbar(res?.data?.message, {
                anchorOrigin: {
                    horizontal: 'right',
                    vertical: 'bottom'
                },
                variant: 'success'
            })
            sessionStorage.removeItem('user');
            setLoggedIn(false);
            console.log('inside logout');
            setCurrentUser(null);
            router.push('/signin');
        } catch (error: any) {
            console.log(error);
        }
    };

    return (
        <AppContext.Provider value={{ loggedIn, setLoggedIn, logout, currentUser, setCurrentUser, loadingData, setLoadingData }}>
            {children}
        </AppContext.Provider>
    );
};

const UseAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("UseAppContext must be used within an AppProvider");
    }
    return context;
};

export default UseAppContext;
