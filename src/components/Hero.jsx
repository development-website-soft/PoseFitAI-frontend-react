import { Link } from "react-router-dom";
import { FaPersonRunning } from "react-icons/fa6";
import { IoFootsteps } from "react-icons/io5";
import { RiUserFollowFill } from "react-icons/ri";

export default function Hero() {
    const heroimage = "./images/home1.jpeg";

    return (
        <>
            <div style={{ backgroundColor: 'white' }} className="flex justify-center">
                <div className="container relative md:p-10 p-0">
                    <div className="flex flex-col sm:flex-row">

                        <div className="md:w-[70%] w-[100%] text-center">
                            <span className="font-extralight tracking-widest sm:text-[1rem] md:text-[3rem] lg:text-[5rem] text-[3rem] font-BebasNeue text-wrap">
                                Smart Workouts  <br /> WITH <span style={{ color: 'blue' }}> AI-Powered Coaching</span>
                            </span>
                            <p className="font-inter text-lg text-black">
                                Improve your fitness with real-time AI feedback and personalized guidance.
                            </p>
                        </div>

                        <div className="flex md:w-[40%] w-[100%] ml-5 relative ">
                            <img src={heroimage} alt="main"  className="z-10 w-full h-auto max-w-[600px] max-h-[600px] object-cover" />
                            
                            <div className="w-36 h-14 rounded-xl absolute flex flex-col justify-center items-center font-bold text-white text-lg bg-[#ef8964] right-0">
                                <FaPersonRunning className="self-start mx-10" />
                                <span className="font-inter">
                                    4,95<sub>KM</sub>
                                </span>
                            </div>
                            <div className="w-36 h-14 rounded-xl absolute flex flex-col justify-center items-center font-bold text-white text-sm bg-[#303030] top-1/3">
                                <IoFootsteps className="self-start mx-10" />
                                <span className="font-inter">
                                    Track your record
                                </span>
                            </div>
                            <div className="w-36 h-14 rounded-xl absolute flex flex-col justify-center items-center font-bold text-white text-lg bg-[#7a29dc] right-0 top-3/4">
                                <RiUserFollowFill className="self-start mx-10" />
                                <span className="font-inter">
                                    Follow steps 
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}