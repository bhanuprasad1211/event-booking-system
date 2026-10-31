import { createContext,useState } from "react";

export const AuthContext = createContext();

export const AuthProvider =
({ children }) => {

    const [accessToken,
        setAccessToken] =
            useState(

                localStorage.getItem(
                    "accessToken"
                ) || null
            );

    const [refreshToken,
        setRefreshToken] =
            useState(

                localStorage.getItem(
                    "refreshToken"
                ) || null
            );

    // LOGIN
    const login = (
        access,
        refresh
    ) => {

        localStorage.setItem(
            "accessToken",
            access
        );

        localStorage.setItem(
            "refreshToken",
            refresh
        );

        setAccessToken(access);

        setRefreshToken(refresh);
    };

    // LOGOUT
    const logout = () => {

        localStorage.removeItem(
            "accessToken"
        );

        localStorage.removeItem(
            "refreshToken"
        );

        setAccessToken(null);

        setRefreshToken(null);
    };

    return (

        <AuthContext.Provider
            value={{

                accessToken,
                refreshToken,

                login,
                logout
            }}
        >

            {children}

        </AuthContext.Provider>
    );
};