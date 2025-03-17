import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Nav from './Nav';

const PushUpDetails = () => {
    const navigate = useNavigate();

    const pushstart = () => {
        navigate('/PushUpExercise');
    };

    return (
        <>
            <Nav />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white p-8 rounded-3xl shadow-2xl w-full text-center space-y-6"
                >
                    {/* العنوان */}
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-4xl font-bold text-gray-800 mb-4"
                    >
                        Push-Up Exercise
                    </motion.h1>

                    {/* الفيديو */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="aspect-w-16 aspect-h-9 mb-6 overflow-hidden mx-auto max-w-2xl rounded-2xl shadow-lg"
                    >
                        <video
                            className="w-full h-full object-cover"
                            controls
                            autoPlay
                            muted
                            loop
                        >
                            <source src="/video/Push.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </motion.div>

                    {/* زر البدء */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                    >
                        <button
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                            onClick={pushstart}
                        >
                            Start Exercise
                        </button>
                    </motion.div>
                </motion.div>
            </div>
        </>
    );
};

export default PushUpDetails;