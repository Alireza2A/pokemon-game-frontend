import React, { createContext, useContext, useState } from 'react';
// import { useNavigate } from "react-router";
// import { getUserFromApi, profile } from "../data/users";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // const navigate = useNavigate();
    // const [user, setUser] = useState(null);
    // const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     const getUser = async () => {
    //         try {
    //             const data = await profile();
    //             setUser(data);
    //         } catch (error) {
    //             console.error(error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     getUser();
    // }, []);

    // Mock user for development
    const [user] = useState({
        id: 1,
        name: 'Test User',
        email: 'test@example.com'
    });

    const value = {
        user,
        // loading,
        // setUser,
        // login: async (credentials) => {
        //     try {
        //         const data = await getUserFromApi(credentials);
        //         localStorage.setItem("token", data.token);
        //         setUser(data.user);
        //         navigate("/");
        //     } catch (error) {
        //         const errorMessage = error.response?.data?.message || "Something went wrong!";
        //         toast.error(errorMessage, { position: "top-right", autoClose: 3000 });
        //         console.error(error);
        //     }
        // },
        // logout: () => {
        //     localStorage.removeItem("token");
        //     setUser(null);
        //     navigate("/login");
        // }
        login: () => {},
        logout: () => {}
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
            {/* <ToastContainer /> */}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthProvider;

//This calls useContext(AuthContext), which returns whatever value is provided in AuthContext.Provider
//Therefore useAuth actually returns the entire AuthContext value,
// which is an object containing user, signIn, and signOut.
