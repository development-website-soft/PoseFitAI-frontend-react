
import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { Pose } from '@mediapipe/pose';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import './ArmWorkout.css';

const TonedArmExercise = () => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [isExerciseStopped, setIsExerciseStopped] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const exerciseDuration = 60; // مدة التمرين بالثواني

    useEffect(() => {
        const initializePose = async () => {
            try {
                // تهيئة Pose مع تحديد مسار الملفات من CDN
                const pose = new Pose({
                    locateFile: (file) => {
                        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
                    },
                });

                // تعيين خيارات Pose
                pose.setOptions({
                    modelComplexity: 1,
                    smoothLandmarks: true,
                    minDetectionConfidence: 0.5,
                    minTrackingConfidence: 0.5,
                });

                // تعريف دالة onResults لمعالجة النتائج
                const onResults = (results) => {
                    const canvasElement = canvasRef.current;
                    const canvasCtx = canvasElement.getContext('2d');
                    const videoWidth = webcamRef.current.video.videoWidth;
                    const videoHeight = webcamRef.current.video.videoHeight;

                    canvasElement.width = videoWidth;
                    canvasElement.height = videoHeight;

                    canvasCtx.save();
                    canvasCtx.clearRect(0, 0, videoWidth, videoHeight);
                    canvasCtx.drawImage(results.image, 0, 0, videoWidth, videoHeight);

                    if (results.poseLandmarks) {
                        const landmarks = results.poseLandmarks;

                        // رسم النقاط والاتصالات
                        drawConnectors(canvasCtx, landmarks, Pose.POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 2 });
                        drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 1 });

                        // استخراج النقاط الأساسية للذراعين
                        const leftShoulder = [landmarks[11].x, landmarks[11].y];
                        const leftElbow = [landmarks[13].x, landmarks[13].y];
                        const leftWrist = [landmarks[15].x, landmarks[15].y];

                        const rightShoulder = [landmarks[12].x, landmarks[12].y];
                        const rightElbow = [landmarks[14].x, landmarks[14].y];
                        const rightWrist = [landmarks[16].x, landmarks[16].y];

                        // حساب الزوايا
                        const calculateAngle = (a, b, c) => {
                            const radians = Math.atan2(c[1] - b[1], c[0] - b[0]) - Math.atan2(a[1] - b[1], a[0] - b[0]);
                            let angle = Math.abs(radians * 180.0 / Math.PI);
                            if (angle > 180.0) {
                                angle = 360 - angle;
                            }
                            return angle;
                        };

                        const leftArmAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
                        const rightArmAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);

                        let correct = true; 

                        // تعيين حجم الخط
                        canvasCtx.font = '30px Arial';

                        if (leftArmAngle < 90) {
                            correct = false;
                            canvasCtx.fillStyle = '#FF0000';
                            canvasCtx.fillText("Lower your left arm!", 50, 50);
                        }

                        if (rightArmAngle < 90) {
                            correct = false;
                            canvasCtx.fillStyle = '#FF0000';
                            canvasCtx.fillText("Lower your right arm!", 50, 100);
                        }

                        const color = correct ? '#00FF00' : '#FF0000';
                        drawConnectors(canvasCtx, landmarks, Pose.POSE_CONNECTIONS, { color, lineWidth: 2 });
                        drawLandmarks(canvasCtx, landmarks, { color, lineWidth: 1 });

                        // حساب الوقت المتبقي
                        if (startTime !== null) {
                            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
                            const remainingTime = Math.max(0, exerciseDuration - elapsedTime);

                            canvasCtx.fillStyle = '#FFA500';
                            canvasCtx.fillText(`Time Left: ${remainingTime}s`, 50, 150);

                            if (remainingTime === 0) {
                                canvasCtx.fillStyle = '#00FF00';
                                canvasCtx.fillText("Exercise Complete!", 50, 200);
                                setStartTime(null);
                            }
                        }
                    }

                    canvasCtx.restore();
                };

                pose.onResults(onResults);

                const processFrame = async () => {
                    if (!webcamRef.current || !webcamRef.current.video) return;

                    const video = webcamRef.current.video;
                    await pose.send({ image: video });
                    if (!isExerciseStopped) {
                        requestAnimationFrame(processFrame);
                    }
                };

                processFrame();
            } catch (error) {
                console.error('Error initializing Pose:', error);
            }
        };

        initializePose();
    }, [isExerciseStopped, startTime]);

    const startExercise = () => {
        setStartTime(Date.now());
    };

    const stopExercise = () => {
        setIsExerciseStopped(true);
        setStartTime(null);
    };

    return (
        <div className="arm-workout-container">
            <h1>Toned Arm Exercise</h1>
            <Webcam ref={webcamRef} className="webcam" />
            <canvas ref={canvasRef} className="canvas" />
            <button onClick={startExercise} className="start-button">
                Start Exercise
            </button>
            <button onClick={stopExercise} className="stop-button">
                Stop Exercise
            </button>
        </div>
    );
};

export default TonedArmExercise;