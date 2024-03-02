import { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";

export default function Navbar() {
    let { user, signIn, signOut } = UserAuth();
    const { query } = useParams(); 

    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        setSearchQuery(query);
    }, [query]);

    return (
        <>
            <nav className="inline-block mb-8 md:mb-0 md:flex flex-row items-center py-8 px-[10%] h-[10%] justify-between">
                <a href="/" className="text-3xl transition ease-in-out delay-50 hover:scale-110 duration-300 text-white">Brain<b>Blitz</b></a>
                <ul className="flex">
                    <li className="relative pt-2">
                        <input 
                            type="text" 
                            className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:w-72 w-48 focus:outline-none focus:border-green-400 transition-all duration-300 block p-3 h-10 h-5px mx-2"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.keyCode === 13 && (window.location.href = `/search/${searchQuery}`)}
                        />
                    </li>
                    <li className="relative">
                        <button 
                            className="cursor-pointer block font-semibold transition ease-in-out delay-50 bg-button text-black hover:scale-110 hover:bg-button-hover duration-300 rounded-lg m-2 h-10 w-30 px-3" 
                            onClick={async () => !["{}", "null"].includes(JSON.stringify(user)) ? (await signOut()) : (await signIn())}
                        >
                            Sign {!["{}", "null"].includes(JSON.stringify(user)) ? "Out" : "In"}
                        </button>
                    </li>
                    <li className="relative">
                        {user && (<button 
                            className="cursor-pointer block font-semibold transition ease-in-out delay-50 bg-green-300 text-black hover:scale-110 hover:bg-green-500 duration-300 rounded-lg m-2 h-10 w-30 px-3" 
                            onClick={() => window.location.href = "/game/create"}
                        >
                            Create Game
                        </button>)}
                    </li>
                </ul>
            </nav>
        </>
    );
};