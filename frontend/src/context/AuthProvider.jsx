import { useState } from "react";

import { AuthContext }
from "./AuthContext";

export const AuthProvider = ({
    children
}) => {

    const [accessToken, setAccessToken] =
        useState(
            localStorage.getItem(
                "accessToken"
            )
        );

    const [user, setUser] =
        useState(null);

    const login = (token) => {

        localStorage.setItem(
            "accessToken",
            token
        );

        setAccessToken(token);
    };

    const logout = () => {

        localStorage.removeItem(
            "accessToken"
        );

        setAccessToken(null);

        setUser(null);

        window.location.href = "/login";
    };

    return (

        <AuthContext.Provider
            value={{
                accessToken,
                user,
                login,
                logout,
            }}
        >

            {children}

        </AuthContext.Provider>
    );
};