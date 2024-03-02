import Background from "../assets/images/radial.svg";

export default function RadialBackground({ children }) {
    return (
        <>
            <div className="absolute top-0 inset-x-0 flex justify-center pointer-events-none overflow-hidden h-screen z-0">
                <div className="w-[108rem] flex-none flex justify-end blur-[8rem]">
                    <img src={Background} alt="Radial Background" />
                </div>
            </div>

            <div className="z-9 relative">
                {children}
            </div>
        </>
    );
};