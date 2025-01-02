import { useContext, createContext, useEffect, useState } from "react";

import Auth from "../firebase";
import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut as logOut,
    onAuthStateChanged,
    getAuth,
} from "firebase/auth";
import { UseCookie } from "./CookieContext";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const { setCookie } = UseCookie();

    useEffect(() => {
        onAuthStateChanged(getAuth(), async user => {
            if (!user) return;

            const token = await user.getIdToken(true);
            setCookie("token", token, 60 * 55);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const signIn = async () => {
        const provider = new GoogleAuthProvider();
        const data = await signInWithPopup(Auth, provider);
        const resolve = GoogleAuthProvider.credentialFromResult(data);
        if (!resolve) window.location.href = "/?error=1";

        const token = await getAuth().currentUser.getIdToken(true);
        setCookie("token", token, 60 * 55);

        const response = await fetch("http://localhost:3001/account/login", {
            method: "GET",
            credentials: "include"
        });

        if ([200, 304].includes(response.status))
        {
            const {id} = await response.json();
            setCookie("id", id, 60 * 60 * 24 * 7);
            window.location.href = `/profile/${id}`;
        }
        else
        {
            logOut();
            document.cookie = "";
            window.location.href = "/?error=2";
        }
        
        return resolve;
    };

    const signOut = async () => {
        await logOut(Auth);
        const cookies = document.cookie.split(";");

        for (const cookie of cookies)
        {
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;";
        }
        
        window.location.href = "/";
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(Auth, user => {
            setUser(user);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{signIn, signOut, user}}>
            {children}
        </AuthContext.Provider>
    );
};

export const UserAuth = () => useContext(AuthContext);