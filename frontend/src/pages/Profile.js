import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

import 'chartjs-adapter-moment';

import { Line, Pie } from 'react-chartjs-2';
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const DUMMY_DATA = true;

export default function Profile()
{
    const { id } = useParams();
    const [results, setResults] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3001/account/profile/${id}`, { credentials: "include" })
            .then(res => [200, 304].includes(res.status) && res.json())
            .then(data => {
                if (DUMMY_DATA)
                {
                    data.games = [];
                    for (let i = 0; i < 10; ++i)
                    {
                        const totalQuestions = Math.floor(Math.random() * 10) + 1;
                        const answeredQuestions = Math.random() > 0.5 ? totalQuestions : Math.floor(Math.random() * totalQuestions);
                        const difficulty = Math.floor(Math.random() * 3);
                        const correctQuestions = Math.floor(Math.random() * totalQuestions);
                        let rating = 0;
                        for (let i = 0; i < correctQuestions; i++)
                        {
                            rating += Math.floor(Math.random() * (10 - 5 + 1)) + 5;
                        }
    
                        data.games.push({
                            totalQuestions,
                            answeredQuestions,
                            correctQuestions,
                            difficulty,
                            finished: answeredQuestions === totalQuestions,
                            rating,
                            timestamp: Date.now() - (Math.random() * 6.048E8),
                            id: "wow!",
                            user: {},
                            topic: `DUMMY TOPIC ${i}`
                        });
                    };
                }

                setResults(data);
            });
    }, [id]);

    function CreateActivityGraph() {
        if (!results?.games.length) return null;
        
        const dates = {}; 
        const startDate = new Date(results.games[0].timestamp);
        const endDate = new Date();
        
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            dates[currentDate.toLocaleDateString()] = 0;
            currentDate.setDate(currentDate.getDate() + 1);
        };

        results.games.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        for (const game of results.games) {
            const date = new Date(game.timestamp).toLocaleDateString();
            if (dates[date]) dates[date]++;
            else dates[date] = 1;
        }

        const forSortedData = Object.entries(dates)
            .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
            .map(([date, activity]) => activity);
        
        const data = {
            labels: Object.keys(dates).sort((dateA, dateB) => new Date(dateA) - new Date(dateB)),
            datasets: [
                {
                    label: 'Activity',
                    data: forSortedData,
                    backgroundColor: '#ba63ff',
                    borderColor: '#ba63ff',
                    tension: 0.1,
                    pointRadius: forSortedData.map((activity) => (activity === 0 ? 0 : 5)),
                    pointHoverRadius: 8,
                },
            ],
        };
        
        const options = {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'white',
                        font: {
                            family: "Poppins"
                        }
                    },
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            let label = context.label || '';
                            if (label) label += ': ';
                            
                            const value = context.parsed.y;
                            if (value) {
                                label += `${value} game${value === 1 ? '' : 's'}`;
                            }
                            
                            return label;
                        },
                    },
                },
            },
        };
        
        return (
            <div className="w-full h-full border border-purple-accent bg-[#ba63ff20] opacity-80 hover:opacity-100 duration-300 rounded-md p-4 cursor-pointer hover:shadow-purple-glow mt-4">
                <h2 className="text-xl text-white mb-4">Activity</h2>
                <Line data={data} options={options} />
            </div>
        );
    };
    
    return (
        <div className="h-screen">
            <Navbar />
            <div className="username w-screen h-[5%] flex justify-center items-center">
                <h1 className="text-slate-300 font-semibold text-center text-2xl lg:text-4xl">{results?.name || "Loading..."}</h1>
            </div>
            
            <div className="grid grid-cols-2 gap-8 mt-4">
                <div className="h-full p-5 border border-4 border-green-accent border-opacity-30 rounded-lg ml-4">
                    <p className="text-center text-green-accent text-xl lg:text-2xl">Games</p>
                    <div className="w-[90%] h-1 bg-green-accent opacity-30 my-2 mx-auto"></div>

                    {results?.games?.length ? 
                    (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {results.games.slice(0).reverse().map((game, idx) => (
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
                    ) : (<p className="text-center text-white mt-4">The user has yet to play a game.</p>)}
                </div>
                <div className="h-full p-5 border border-4 border-purple-accent border-opacity-30 rounded-lg mr-4 flex flex-col">
                    <p className="text-center text-purple-accent text-xl lg:text-2xl">Statistics</p>
                    <div className="w-[90%] h-1 bg-purple-accent opacity-30 my-2 mx-auto"></div>

                    <div className="flex flex-col justify-center items-center">
                        {results?.games?.length ? (
                            <>
                                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                                    <div className="border border-purple-accent bg-[#ba63ff20] opacity-80 hover:opacity-100 duration-300 rounded-md p-4 cursor-pointer hover:shadow-purple-glow">
                                        <h2 className="text-xl text-white mb-4">Correct vs. Incorrect</h2>
                                        <Pie
                                            data={{
                                                labels: ['Correct', 'Incorrect', 'Not Answered'],
                                                datasets: [
                                                    {
                                                        data: [
                                                            results.games.reduce((acc, game) => acc + game.correctQuestions, 0),
                                                            results.games.reduce((acc, game) => acc + (game.answeredQuestions - game.correctQuestions), 0),
                                                            results.games.reduce((acc, game) => acc + (game.totalQuestions - game.answeredQuestions), 0),
                                                        ],
                                                        backgroundColor: ['#4CAF50', '#F44336', '#808080'],
                                                        borderWidth: 0,
                                                    },
                                                ],
                                            }}
                                            options={{
                                                plugins: {
                                                    legend: {
                                                        labels: {
                                                            color: 'white',
                                                            font: {
                                                                family: "Poppins"
                                                            }
                                                        }
                                                    },
                                                    tooltip: {
                                                        callbacks: {
                                                            label: function(context) {
                                                                let label = context.label || '';
                                                                if (label) label += ': ';
                                                                const value = context.parsed;
                                                                if (value) {
                                                                    const percent = Math.round((value / context.dataset.data.reduce((acc, val) => acc + val, 0)) * 100);
                                                                    label += `${percent}% (${value})`;
                                                                };
                                                                return label;
                                                            }
                                                        }
                                                    }
                                                }
                                            }}
                                        />
                                    </div>

                                    <div className="border border-purple-accent bg-[#ba63ff20] opacity-80 hover:opacity-100 duration-300 rounded-md p-4 cursor-pointer hover:shadow-purple-glow">
                                        <h2 className="text-xl text-white mb-4">Difficulty Distribution</h2>
                                        <Pie
                                            data={{
                                                labels: ['Easy', 'Medium', 'Hard'],
                                                datasets: [
                                                    {
                                                        data: [
                                                            results.games.filter((game) => game.difficulty === 0).length,
                                                            results.games.filter((game) => game.difficulty === 1).length,
                                                            results.games.filter((game) => game.difficulty === 2).length,
                                                        ],
                                                        backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
                                                        borderWidth: 0,
                                                    }
                                                ]
                                            }}
                                            options={{
                                                plugins: {
                                                    legend: {
                                                        labels: {
                                                            color: 'white',
                                                            font: {
                                                                family: "Poppins"
                                                            }
                                                        }
                                                    },
                                                    tooltip: {
                                                        callbacks: {
                                                            label: function(context) {
                                                                let label = context.label || '';
                                                                if (label) label += ': ';
                                                                const value = context.parsed;
                                                                if (value) {
                                                                    const percent = Math.round((value / context.dataset.data.reduce((acc, val) => acc + val, 0)) * 100);
                                                                    label += `${percent}% (${value})`;
                                                                };
                                                                return label;
                                                            }
                                                        }
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                                <CreateActivityGraph />
                            </>
                        ) : (<p className="text-center text-white mt-2">The user has yet to play a game.</p>)}
                      </div>
                </div>
            </div>
        </div>
    );
};