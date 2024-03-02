import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { UseCookie } from "../context/CookieContext";

export default function Game()
{
    const messageBox = useRef(null);

    const { id } = useParams();
    const { getCookie } = UseCookie();

    const [user, setUser] = useState(true);
    const [game, setGame] = useState(null);
    const [disabled, setDisabled] = useState(false);
    const [messages, setMessages] = useState([]);

    function pollConversation() {
        console.log("human")
        fetch(`http://localhost:3001/game/info/${id}`, { credentials: "include" })
            .then(res => [200, 304].includes(res.status) && res.json())
            .then(({game}) => {
                let { interaction: conversation, finished, rating, correctQuestions } = game;
                setGame(game => ({ ...game, finished, rating, correctQuestions }));

                console.log(conversation);
                conversation = conversation.map(message => ({ role: message.role, content: message.content, rating: message.parsed?.rating, response: message.parsed?.response, question: message.parsed?.question }));
                setMessages(conversation);

                if (!finished) setTimeout(() => pollConversation(), 1000);
            });
    };

    function answerQuestion(message) {
        setMessages(messages => [...messages, { role: "user", content: message }]);
        setMessages(messages => [...messages, "BUFFER"]);
        const index = messages.length + 1;

        fetch(`http://localhost:3001/game/answer/${id}`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ answer: message })
        })
            .then(res => res.json())
            .then(({rating, response, question, finished, totalRating, correctQuestions, message}) => {
                if (message.includes("error")) return messages[index] = { role: "assistant", content: message };

                setMessages(messages => {
                    messages[index] = { role: "assistant", content: message, rating, response, question };
                    return messages;
                });

                setGame(game => ({ ...game, finished, rating: totalRating, correctQuestions }));
            });
    };

    useEffect(() => {
        let shouldPoll = true;

        fetch(`http://localhost:3001/game/info/${id}`, { credentials: "include" })
            .then(res => [200, 304].includes(res.status) && res.json())
            .then(data => {
                setGame(data.game);

                setUser(data.game.user.id === getCookie("id"));
                if (data.game.finished || data.game.user.id === getCookie("id")) shouldPoll = false;

                for (const message of data.game.interaction)
                {
                    setMessages(messages => [...messages, { role: message.role, content: message.content, rating: message.parsed?.rating, response: message.parsed?.response, question: message.parsed?.question }]);
                };

                if (!shouldPoll) setDisabled(true);
                else pollConversation();
            });       
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!user) return setDisabled(true);

        setDisabled(messages[messages.length - 1]?.role !== "assistant");
        messageBox.current.scrollTop = messageBox.current.scrollHeight;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(messages)]);

    return (
        <div className="h-screen">
            <Navbar />

            <div className="flex flex-col items-left justify-left items-center h-[80%]">
                <div ref={messageBox} className="border border-4 border-purple-accent bg-[#ba63ff20] rounded-lg p-10 mt-1 w-[95%] h-full overflow-y-auto">
                    <div className="sticky top-0 flex flex-col justify-center items-center">
                        <div className="border border-4 border-purple-accent bg-[#ba63ff20] rounded-lg p-4 w-[25%]">
                            {game && (
                                <>
                                    <p className="text-md text-center text-white"><span className="text-lg text-slate-300 underline">{game.topic}</span></p>
                                    <p className="text-md text-center text-white">Correct Questions: <span className="text-green-400">{game.correctQuestions}</span></p>
                                    <p className="text-md text-center text-white">Total Questions: <span className="text-blurple">{game.totalQuestions}</span></p>
                                    <p className="text-md text-center text-white">Score: <span className={game.rating > (game.totalQuestions * 5) ? "text-green-400" : "text-red-400"}>{ `${((game.rating / (game.totalQuestions * 10)) * 100).toFixed(0)}%` }</span></p>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                        {messages.map((message, index) => (
                            <div key={index}>
                                <span className={`text-xs flex text-gray-500 ${message.role === "user" ? "justify-end" : "justify-start"} mx-2`}>{message.role === "user" ? (game?.user?.name?.toUpperCase() || "PLAYER") : "AI"}</span>
                                <div
                                    key={index}
                                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`text-sm border border-4 rounded-lg p-2 duration-300 hover:cursor-pointer text-slate-300 ${message.role === "user" ? "border-purple-accent bg-[#ba63ff20] opacity-80 hover:opacity-100 hover:bg-[#ba63ff80] hover:shadow-purple-glow text-right" : "border-green-accent bg-[#62FF6C20] opacity-80 hover:opacity-100 hover:bg-[#62FF6C80] hover:shadow-green-glow text-left"} ${message !== "BUFFER" && "w-[35%]"}`}>
                                            {message === "BUFFER" && (
                                                <div className="flex space-x-2 m-2">
                                                    <div className="w-3 h-3 bg-gray-500 rounded-full animate-bounce"></div>
                                                    <div className="w-3 h-3 bg-gray-500 rounded-full animate-bounce"></div>
                                                    <div className="w-3 h-3 bg-gray-500 rounded-full animate-bounce"></div>
                                                </div>
                                            )}
                                            
                                            {message.rating >= 0 && (<p className={`${message.rating > 5 ? "text-green-400": "text-red-400"} mb-2`}>{message.rating}/10</p>)}
                                            {message.response && (<p className="mb-2">{message.response}</p>)}
                                            {message.question && (<p className="text-yellow-400">{message.question}</p>)}
                                            {message.content && !message.response && !message.question && (
                                                message.content.split("\n").map((partition, index) => (
                                                    <p className="" key={index}>{partition}</p>
                                                ))
                                            )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <input 
                    type="text" 
                    className="filter disabled:grayscale text-slate-300 focus:outline-none focus:ring-none duration-300 border border-4 border-purple-accent bg-[#ba63ff20] rounded-lg p-4 mt-1 w-[95%] h-fit" 
                    placeholder="Reply to the AI"
                    onChange={(e) => e.target.value = e.target.value.slice(0, 200 * (game.difficulty + 1))}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && e.target.value.length > 0 && !disabled)
                        {
                            answerQuestion(e.target.value);
                            e.target.value = "";
                        };
                    }}
                    disabled={disabled}
                />
            </div>
        </div>
    );
};