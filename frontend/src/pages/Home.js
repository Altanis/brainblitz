import Navbar from "../components/Navbar";
import StudyConquering from "../assets/images/nerd.svg";

import { UserAuth } from "../context/AuthContext";
import { useSearchParams } from "react-router-dom";
import { UseCookie } from "../context/CookieContext";

export default function Home() {
    let { user, signIn } = UserAuth();
    const { getCookie } = UseCookie();
    
    const [searchParams] = useSearchParams();

    let message = "";
    switch (searchParams.get("error"))
    {
        case "1": message = "An error occurred while signing in. Please try again."; break;
        case "2": message = "An error occurred while authorizing you. Please try again."; break;
        default: break;
    };

    return (
        <div className="relative">
            <Navbar />
            {message && (
                <div className={`flex justify-center items-center w-screen`}>
                    <div className="bg-[#160B0B] border border-[#f8717160] text-red-700 px-4 py-3 rounded relative w-[30%] my-4" role="alert">
                        <span className="text-center block">{message}</span>
                    </div>
                </div>
            )}
            <div className="flex flex-row px-[10%] p-12 pb-[0%]">
                <div className="w-2/5 h-1/5 text-white">
                    <h1 className="text-5xl font-bold text-main pb-5">Master your Exams With AI-Powered Learning</h1>
                    <p className="text-md pb-10">Accelerate your learning by experiencing the future of education.</p>
                    <button 
                        className="transition text-black ease-in-out delay-50 bg-button hover:scale-110 hover:bg-button-hover duration-300 p-3 rounded-lg font-semibold mt-4" 
                        onClick={async () => !["{}", "null"].includes(JSON.stringify(user)) ? (window.location.href = `/profile/${getCookie("id")}`) : (await signIn())}
                    >
                        {!["{}", "null"].includes(JSON.stringify(user)) ? "Go to Profile" : "Get Started"}
                    </button>
                    <div className="pt-[10%]">
                        <div className="flex flex-row basis-full pb-[5%]">
                            <div>
                                <i className={"fa-solid fa-key fa-2x text-orange-400 animate-bounce"}></i>
                            </div>
                            <div className="flex-column pl-5">
                                <h2 className="text-lg font-semibold">Unlock your potential.</h2>
                                <p className="text-sm">Input a topic you want to learn about at a specific difficulty, and we will generate questions to test your knowledge.</p>
                            </div>
                        </div>

                        <div className="flex flex-row basis-full pb-[5%]">
                            <div>
                                <i className={"fa-solid fa-repeat fa-2x text-green-400 animate-bounce"}></i>
                            </div>
                            <div className="flex-column pl-5">
                                <h2 className="text-lg font-semibold">Stand out from your peers.</h2>
                                <p className="text-sm">Our app uses AI to effectively curate itself to your needs.</p>
                            </div>
                        </div>

                        <div className="flex flex-row basis-full pb-[5%]">
                            <div>
                                <i className={"fa-solid fa-graduation-cap fa-2x text-blue-600 w-8 animate-bounce"}></i>
                            </div>
                            <div className="flex-column pl-5">
                                <h2 className="text-lg font-semibold">Learn smarter, not harder.</h2>
                                <p className="text-sm">Efficiently learn more in less time, so you can spend more time doing what you love.</p>
                            </div>
                        </div>

                        <div className="flex flex-row basis-full pb-[5%]">
                            <div>
                                <i className={"fa-solid fa-heart fa-2x text-red-600 animate-bounce"}></i>
                            </div>
                            <div className="flex-column pl-5">
                                <h2 className="text-lg font-semibold">Have a blast while learning!</h2>
                                <p className="text-sm">Our app is designed to be fun and engaging, so you can enjoy the learning process.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-3/5 flex justify-end">
                        <img className="" src={StudyConquering} alt="Home" width={600} height={600} />
                </div>
            </div>
        </div>
    )
};