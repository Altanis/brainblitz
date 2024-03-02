import { createContext, useContext } from "react";

const CookieContext = createContext();

export const CookieContextProvider = ({ children }) => {
    const getCookie = (name) => {
        const cookie = document.cookie.split("; ").find(row => row.startsWith(name));
        if (cookie) return cookie.split("=")[1];
        return null;
    };

    const setCookie = (name, value, maxAge) => {
        document.cookie = `${name}=${value}; path=/; max-age=${maxAge}`;
    };

    const deleteCookie = (name) => {
        document.cookie = `${name}=; path=/; max-age=0`;
    };

    return (
        <CookieContext.Provider value={{ getCookie, setCookie, deleteCookie }}>
            {children}
        </CookieContext.Provider>
    );
};

export const UseCookie = () => useContext(CookieContext);