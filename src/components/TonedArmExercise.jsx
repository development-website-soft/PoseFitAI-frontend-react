
import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as mpPose from '@mediapipe/pose';

const calculateAngle = (a, b, c) => {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs((radians * 180.0) / Math.PI);
    if (angle > 180.0) angle = 360 - angle;
    return angle;
};

const TonedArmExercise = () => {
    const webcamRef = useRef(null);
    const [exercise, setExercise] = useState('arm workout');
    const [message, setMessage] = useState('');
    const [count, setCount] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [startTime, setStartTime] = useState(null);

    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                setDuration(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        } else if (!isActive && duration !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, startTime]);

    const handleStop = () => {
        setIsActive(false);
        setMessage('Exercise stopped');
        setCount(0);
        setDuration(0);
    };

    useEffect(() => {
        const pose = new mpPose.Pose({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
        });

        pose.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        });

        pose.onResults((results) => {
            if (results.poseLandmarks) {
                const landmarks = results.poseLandmarks;
                const angle = calculateAngle(
                    landmarks[11], // Shoulder
                    landmarks[13], // Elbow
                    landmarks[15]  // Wrist
                );

                if (angle > 160 && !isActive) {
                    setIsActive(true);
                    setStartTime(Date.now());
                    setMessage('Exercise started');
                }

                if (angle < 60 && isActive) {
                    setCount((prevCount) => prevCount + 1);
                }

                setMessage(`Arm angle: ${Math.round(angle)} degrees`);

                const canvas = webcamRef.current.getCanvas();
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                mpPose.drawLandmarks(
                    ctx,
                    results.poseLandmarks,
                    mpPose.POSE_CONNECTIONS,
                    { color: '#FF0000', lineWidth: 4 }
                );
            }
        });
    }, [isActive]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white">
            <h1 className="text-3xl font-bold mb-4">Arm Workout</h1>
            <Webcam ref={webcamRef} className="rounded-xl mb-4" />
            <p className="text-xl mb-2">{message}</p>
            <p className="text-lg">Reps: {count}</p>
            <p className="text-lg">Duration: {duration} seconds</p>
            <button onClick={handleStop} className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Stop
            </button>
        </div>
    );
};

export default TonedArmExercise;
