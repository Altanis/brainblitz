import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";

function constrain(min, value, max)
{
    if (value === "") return value;

    if (value < min) return min;
    if (value > max) return max;
    return value;
};

export default function GameCreate()
{
    const [error, setError] = useState("");

    const [topic, setTopic] = useState("");
    const [questions, setQuestions] = useState();
    const [clicked, setClicked] = useState(null);    
    const [education, setEducation] = useState(null);
    const [disabled, setDisabled] = useState(true);

    useEffect(() => {
        if (topic && questions && clicked) setDisabled(false);
        else setDisabled(true);
    }, [topic, questions, clicked]);

    function createGame()
    {
        if (disabled) return;

        const difficulty = clicked === "g" ? 0 : (clicked === "m" ? 1 : 2);
        const educationLevel = education === "m" ? 0 : (education === "h" ? 1 : (education === "a" ? 2 : 3));

        fetch("http://localhost:3001/game/create", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                topic,
                difficulty,
                educationLevel,
                totalQuestions: +questions,
            })
        }).then(res => res.json()).then(data => {
            if (!data.message?.includes("Success")) return setError(data?.message || data);
            window.location.href = `/game/${data.id}`;
        });
    };

    return (
        <div className="h-screen">
            <Navbar />
            <div className="flex flex-col items-center justify-center items-center min-h-[80%]">
                {error && (
                    <div className={`flex justify-center items-center w-screen`}>
                        <div className="bg-[#160B0B] border border-[#f8717160] text-red-700 px-4 py-3 rounded relative w-[30%] my-4" role="alert">
                            <span className="text-center block">{error}</span>
                        </div>
                    </div>
                )}
                
                <div className="border border-4 border-purple-accent bg-[#ba63ff20] rounded-lg p-8 w-[80%] h-[80%]">
                    <h1 className="text-3xl font-semibold text-center text-slate-300">Create Game</h1>
                        <div className="mt-8">
                            <div className="flex flex-col items-center justify-center my-8">
                                <h2 className="text-xl text-slate-300">What topic would you like to be quizzed on?</h2>
                                <input
                                    type="text"
                                    className="text-center border border-2 focus:border-purple-accent duration-300 rounded-lg p-2 w-[40%] h-10 mt-4 focus:outline-none focus:ring-none"
                                    placeholder="Topic"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, "").slice(0, 50))}
                                />
                            </div>

                            <div className="flex flex-col items-center justify-center my-8">
                                <h2 className="text-xl text-slate-300">How many questions do you want to be asked?</h2>
                                <input
                                    type="text"
                                    className="text-center border border-2 focus:border-purple-accent duration-300 rounded-lg p-2 w-10 h-10 mt-4 focus:outline-none focus:ring-none"
                                    value={questions}
                                    onChange={(e) => setQuestions(e.target.value = constrain(1, e.target.value = e.target.value.replace(/[^0-9]/g, ""), 10))}
                                />
                            </div>

                            <div className="flex flex-col items-center justify-center my-8">
                                <h2 className="text-xl text-slate-300">How difficult do you want this quiz to be?</h2>
                                <div className="flex flex-row items-center justify-center">
                                    <button 
                                        className={`${clicked === "g" ? "text-white bg-[#4ade8080]" : "text-green-400 bg-[#4ade8020]"} duration-300 border border-2 border-green-400 rounded-lg p-2 h-10 mt-4 focus:outline-none focus:ring-none mx-4`}
                                        onClick={() => setClicked("g")}
                                    >
                                        Easy
                                    </button>
                                    <button
                                        className={`${clicked === "m" ? "text-white bg-[#facc1580]" : "text-yellow-400 bg-[#facc1520]"} duration-300 border border-2 border-yellow-400 rounded-lg p-2 h-10 mt-4 focus:outline-none focus:ring-none mx-4`}
                                        onClick={() => setClicked("m")}
                                    >
                                        Medium
                                    </button>
                                    <button
                                        className={`${clicked === "r" ? "text-white bg-[#f8717180]" : "text-red-400 bg-[#f8717120]"} duration-300 border border-2 border-red-400 rounded-lg p-2 h-10 mt-4 focus:outline-none focus:ring-none mx-4`}
                                        onClick={() => setClicked("r")}
                                    >
                                        Hard
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col items-center justify-center my-8">
                                <h2 className="text-xl text-slate-300">At what level do you want to be quizzed at?</h2>
                                <div className="flex flex-row items-center justify-center">
                                    <button 
                                        className={`${education === "m" ? "text-white bg-[#4ade8080]" : "text-green-400 bg-[#4ade8020]"} duration-300 border border-2 border-green-400 rounded-lg p-2 h-10 mt-4 focus:outline-none focus:ring-none mx-4`}
                                        onClick={() => setEducation("m")}
                                    >
                                        Middle School
                                    </button>
                                    <button
                                        className={`${education === "h" ? "text-white bg-[#facc1580]" : "text-yellow-400 bg-[#facc1520]"} duration-300 border border-2 border-yellow-400 rounded-lg p-2 h-10 mt-4 focus:outline-none focus:ring-none mx-4`}
                                        onClick={() => setEducation("h")}
                                    >
                                        High School
                                    </button>
                                    <button
                                        className={`${education === "a" ? "text-white bg-[#ff965480]" : "text-orange-400 bg-[#ff965420]"} duration-300 border border-2 border-orange-400 rounded-lg p-2 h-10 mt-4 focus:outline-none focus:ring-none mx-4`}
                                        onClick={() => setEducation("a")}
                                    >
                                        AP
                                    </button>
                                    <button
                                        className={`${education === "c" ? "text-white bg-[#f8717180]" : "text-red-400 bg-[#f8717120]"} duration-300 border border-2 border-red-400 rounded-lg p-2 h-10 mt-4 focus:outline-none focus:ring-none mx-4`}
                                        onClick={() => setEducation("c")}
                                    >
                                        College
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col items-center justify-center my-8">
                                <div className="flex flex-col items-center justify-center mt-8 h-full">
                                    <button
                                        className="text-white border border-purple-accent bg-[#ba63ff20] hover:opacity-100 hover:bg-[#ba63ff80] border border-2 border-purple-accent hover:shadow-purple-glow filter disabled:grayscale duration-300 rounded-lg p-2 text-4xl w-32 h-24 mt-4 focus:outline-none focus:ring-none mx-4"
                                        onClick={createGame}
                                        disabled={disabled}
                                    >
                                        GO!
                                    </button>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
        </div>
    );
};