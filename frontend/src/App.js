import React from "react";
import { Route, Routes } from 'react-router-dom';
import "./index.css";

import RadialBackground from "./components/RadialBackground";
import { AuthContextProvider } from "./context/AuthContext";

import Home from "./pages/Home";

import Search from "./pages/Search";

import NotFound from "./pages/NotFound";

import { CookieContextProvider } from "./context/CookieContext";
import Profile from "./pages/Profile";
import GameCreate from "./pages/GameCreate";
import Game from "./pages/Game";

export default function App() {
    return (
        <CookieContextProvider>
            <AuthContextProvider>
                <RadialBackground>
                    <Routes>
                        <Route path="/" element={<Home />} />

                        <Route path="/search/:query" element={<Search />} />
                        <Route path="/profile/:id" element={<Profile />} />

                        <Route path="/game/create" element={<GameCreate />} />
                        <Route path="/game/:id" element={<Game />} />
                        
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </RadialBackground>
            </AuthContextProvider>
        </CookieContextProvider>
    )
};