import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function Search()
{
    const { query } = useParams(); 
    const [results, setResults] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3001/account/search/${query}`, { credentials: "include" })
            .then(res => [200, 304].includes(res.status) && res.json())
            .then(data => setResults(data));
    }, [query]);

    return (
        <div className="h-screen">
            <Navbar />
            <div className="username w-screen h-[5%] flex justify-center items-center">
                <h1 className="text-slate-300 font-semibold text-center text-2xl lg:text-4xl">
                    Search Results For:{" "}
                    <span className="text-main">{query}</span>
                </h1>
            </div>
            
            <div className="grid grid-cols-2 gap-8 mt-4">
                <div className="h-full p-5 border border-4 border-green-accent border-opacity-30 rounded-lg ml-4">
                    <p className="text-center text-green-accent text-xl lg:text-2xl">Games</p>
                    <div className="w-[90%] h-1 bg-green-accent opacity-30 my-2 mx-auto"></div>

                    {results?.games?.length ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {results.games.map((game, idx) => (
                                <div
                                    key={idx}
                                    className="border border-green-accent bg-[#62FF6C20] opacity-80 hover:opacity-100 hover:bg-[#62FF6C80] duration-300 shadow-md rounded-md p-4 cursor-pointer hover:shadow-green-glow mt-4"
                                    onClick={() => window.location.href = `/game/${game.id}`}
                                >
                                    <h2 className="text-lg text-center text-white mb-2">{game.topic.length >= 36 ? game.topic.slice(0, 33) + "..." : game.topic}</h2>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="flex flex-col items-center">
                                            <p className="text-white text-center">
                                                <span className={game.difficulty === 0 ? "text-green-400" : (game.difficulty === 1 ? "text-amber-400" : "text-red-400")}>
                                                    {game.difficulty === 0 ? "Easy" : (game.difficulty === 1 ? "Medium" : "Hard")}
                                                </span>
                                            </p>
                                        </div>
                                        
                                        <div className="flex flex-col items-center">
                                            <p className="text-white text-center">
                                                Score:{" "}
                                                <span className={game.rating > (game.totalQuestions * 5) ? "text-green-400" : "text-red-400"}>
                                                    { `${((game.rating / (game.totalQuestions * 10)) * 100).toFixed(0)}%` }
                                                </span>
                                            </p>
                                        </div>
                                        
                                        <div className="flex flex-col items-center">
                                            <p className={`text-center ${game.finished ? "text-green-400" : "text-amber-400"}`}>
                                                {game.finished ? "Finished" : "Ongoing"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (<p className="text-center text-white mt-4">We could not match the query to any games.</p>)}
                </div>

                <div className="h-full p-5 border border-4 border-purple-accent border-opacity-30 rounded-lg mr-4 flex flex-col">
                    <p className="text-center text-purple-accent text-xl lg:text-2xl">Users</p>
                    <div className="w-[90%] h-1 bg-purple-accent opacity-30 my-2 mx-auto"></div>

                    {results?.users?.length ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {results.users.map((user, idx) => (
                                <div
                                    key={idx}
                                    className="border border-purple-accent bg-[#ba63ff20] opacity-80 hover:opacity-100 hover:bg-[#ba63ff80] duration-300 shadow-md rounded-md p-4 cursor-pointer hover:shadow-purple-glow mt-4"
                                    onClick={() => window.location.href = `/profile/${user.id}`}
                                >
                                    <h2 className="text-lg text-center text-white mb-2">{user.name}</h2>
                                    <h3 className="text-sm text-center text-white mb-1">
                                        {user.games.length ? `${user.games.length} game${user.games.length === 1 ? "" : "s"}` : "No activity has been recorded yet."}
                                    </h3>
                                </div>
                            ))}
                        </div>
                    ) : (<p className="text-center text-white mt-4">We could not match the query to any users.</p>)}
                </div>
            </div>
        </div>
    )
};