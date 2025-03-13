import React, { useState, useRef, useEffect, useCallback } from 'react';
import Webcam from "react-webcam";
import { Pose } from '@mediapipe/pose';
import * as cam from '@mediapipe/camera_utils';
import { thresholdsBeginner, thresholdsPro } from './PushUpThresholds';
import { useNavigate } from 'react-router-dom';
import { startSession, updateSession, endSession } from '../api';
import { debounce } from 'lodash';

function PushUpExercise() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [isBeginnerMode, setIsBeginnerMode] = useState(true);
  const [currentThresholds, setCurrentThresholds] = useState(thresholdsBeginner);

  const stateTrackerRef = useRef({
    state_seq: [],
    start_inactive_time: Date.now(),
    start_inactive_time_front: Date.now(),
    INACTIVE_TIME: 0.0,
    INACTIVE_TIME_FRONT: 0.0,
    DISPLAY_TEXT: Array(4).fill(false),
    COUNT_FRAMES: Array(4).fill(0),
    INCORRECT_POSTURE: false,
    prev_state: null,
    curr_state: null,
    PUSH_UP_COUNT: 0,
    IMPROPER_PUSH_UP: 0
  });

  const dictFeatures = {
    left: { shoulder: 11, elbow: 13, wrist: 15, hip: 23, knee: 25, ankle: 27, foot: 31 },
    right: { shoulder: 12, elbow: 14, wrist: 16, hip: 24, knee: 26, ankle: 28, foot: 32 },
    nose: 0,
  };

  const colors = {
    blue: 'rgb(0,127,255)', red: 'rgb(255,50,50)', green: 'rgb(0,255,127)', light_green: 'rgb(100,233,127)',
    yellow: 'rgb(255,255,0)', magenta: 'rgb(255,0,255)', white: 'rgb(255,255,255)', cyan: 'rgb(0,255,255)', light_blue: 'rgb(102,204,255)'
  };

  const FEEDBACK_ID_MAP = {
    0: { text: 'BACK NOT STRAIGHT', position: 215, color: 'rgb(0,153,255)' },
    1: { text: 'ELBOWS TOO WIDE', position: 215, color: 'rgb(0,153,255)' },
    2: { text: 'HEAD TOO LOW', position: 170, color: 'rgb(255,80,80)' },
    3: { text: 'HIPS TOO HIGH', position: 125, color: 'rgb(255,80,80)' }
  };

  const getState = (elbowAngle) => {
    if (elbowAngle >= currentThresholds.ANGLE_SHOULDER_ELBOW_VERT.NORMAL[0] && elbowAngle <= currentThresholds.ANGLE_SHOULDER_ELBOW_VERT.NORMAL[1]) return 's1';
    if (elbowAngle >= currentThresholds.ANGLE_SHOULDER_ELBOW_VERT.TRANS[0] && elbowAngle <= currentThresholds.ANGLE_SHOULDER_ELBOW_VERT.TRANS[1]) return 's2';
    if (elbowAngle >= currentThresholds.ANGLE_SHOULDER_ELBOW_VERT.PASS[0] && elbowAngle <= currentThresholds.ANGLE_SHOULDER_ELBOW_VERT.PASS[1]) return 's3';
    return null;
  };

  const updateStateSequence = (newState) => {
    let updatedStateSeq = [...stateTrackerRef.current.state_seq];
    if (newState === 's2' && (!updatedStateSeq.includes('s3') || updatedStateSeq.filter(state => state === 's2').length === 1)) updatedStateSeq.push(newState);
    if (newState === 's3' && !updatedStateSeq.includes('s3') && updatedStateSeq.includes('s2')) updatedStateSeq.push(newState);
    stateTrackerRef.current.state_seq = updatedStateSeq;
  };

  const showFeedback = (ctx) => {
    const stateTracker = stateTrackerRef.current;
    if (stateTracker.INCORRECT_POSTURE) drawText(ctx, 'KEEP YOUR BACK STRAIGHT', 30, 80, { textColor: 'black', backgroundColor: 'yellow', fontSize: '16px' });
    stateTracker.DISPLAY_TEXT.forEach((displayText, index) => {
      if (displayText) {
        const feedback = FEEDBACK_ID_MAP[index];
        if (feedback) drawText(ctx, feedback.text, 30, feedback.position, { textColor: 'black', backgroundColor: 'yellow', fontSize: '16px' });
      }
    });
  };

  const getLandmarkPosition = (landmark, frameWidth, frameHeight) => ({ x: landmark.x * frameWidth, y: landmark.y * frameHeight });

  const getLandmarkFeatures = (poseLandmarks, feature, frameWidth, frameHeight) => {
    if (feature === 'nose') return getLandmarkPosition(poseLandmarks[dictFeatures.nose], frameWidth, frameHeight);
    const featureSet = dictFeatures[feature];
    return {
      shoulder: getLandmarkPosition(poseLandmarks[featureSet.shoulder], frameWidth, frameHeight),
      elbow: getLandmarkPosition(poseLandmarks[featureSet.elbow], frameWidth, frameHeight),
      wrist: getLandmarkPosition(poseLandmarks[featureSet.wrist], frameWidth, frameHeight),
      hip: getLandmarkPosition(poseLandmarks[featureSet.hip], frameWidth, frameHeight),
      knee: getLandmarkPosition(poseLandmarks[featureSet.knee], frameWidth, frameHeight),
      ankle: getLandmarkPosition(poseLandmarks[featureSet.ankle], frameWidth, frameHeight),
      foot: getLandmarkPosition(poseLandmarks[featureSet.foot], frameWidth, frameHeight)
    };
  };

  const findAngle = (p1, p2, refPt = { x: 0, y: 0 }) => {
    const p1Ref = { x: p1.x - refPt.x, y: p1.y - refPt.y };
    const p2Ref = { x: p2.x - refPt.x, y: p2.y - refPt.y };
    const cosTheta = (p1Ref.x * p2Ref.x + p1Ref.y * p2Ref.y) / (Math.sqrt(p1Ref.x ** 2 + p1Ref.y ** 2) * Math.sqrt(p2Ref.x ** 2 + p2Ref.y ** 2));
    return Math.round(Math.acos(Math.max(Math.min(cosTheta, 1.0), -1.0)) * (180 / Math.PI));
  };

  const drawText = (ctx, msg, x, y, options = {}) => {
    const { boxWidth = 8, textColor = 'rgb(0, 255, 0)', backgroundColor = 'rgb(0, 0, 0)', fontSize = '16px', fontFamily = 'Arial', paddingX = 20, paddingY = 10 } = options;
    ctx.font = `${fontSize} ${fontFamily}`;
    const textMetrics = ctx.measureText(msg);
    const textWidth = textMetrics.width;
    const textHeight = parseInt(fontSize, 10);
    const rectStartX = x - paddingX;
    const rectStartY = y - textHeight - paddingY;
    const rectWidth = textWidth + 2 * paddingX;
    const rectHeight = textHeight + 2 * paddingY;
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(rectStartX, rectStartY, rectWidth, rectHeight);
    ctx.fillStyle = textColor;
    ctx.fillText(msg, x, y + (paddingY / 2));
  };

  const drawCircle = (ctx, position, radius, color) => {
    ctx.beginPath();
    ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  };

  const drawConnector = (ctx, start, end, color, lineWidth) => {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  };

  const onResults = useCallback((results) => {
    if (!webcamRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = webcamRef.current.video.videoWidth;
    canvas.height = webcamRef.current.video.videoHeight;
    const frameWidth = canvas.width;
    const frameHeight = canvas.height;

    ctx.drawImage(webcamRef.current.video, 0, 0, canvas.width, canvas.height);

    if (results.poseLandmarks) {
      const noseCoord = getLandmarkFeatures(results.poseLandmarks, 'nose', frameWidth, frameHeight);
      const leftFeatures = getLandmarkFeatures(results.poseLandmarks, 'left', frameWidth, frameHeight);
      const rightFeatures = getLandmarkFeatures(results.poseLandmarks, 'right', frameWidth, frameHeight);

      const offsetAngle = findAngle(leftFeatures.shoulder, rightFeatures.shoulder, noseCoord);

      if (offsetAngle > currentThresholds.OFFSET_THRESH) {
        const endTime = Date.now();
        stateTrackerRef.current.INACTIVE_TIME_FRONT += endTime - stateTrackerRef.current.start_inactive_time_front;
        stateTrackerRef.current.start_inactive_time_front = endTime;

        if (stateTrackerRef.current.INACTIVE_TIME_FRONT >= currentThresholds.INACTIVE_THRESH) {
          stateTrackerRef.current.INACTIVE_TIME_FRONT = 0;
          stateTrackerRef.current.start_inactive_time_front = Date.now();
        }

        drawCircle(ctx, noseCoord, 7, colors.white);
        drawCircle(ctx, leftFeatures.shoulder, 7, colors.yellow);
        drawCircle(ctx, rightFeatures.shoulder, 7, colors.magenta);

        drawText(ctx, `CORRECT: ${stateTrackerRef.current.PUSH_UP_COUNT}`, frameWidth * 0.68, 30, { textColor: 'rgb(255, 255, 230)', backgroundColor: 'rgb(18, 185, 0)', fontSize: '14px' });
        drawText(ctx, `INCORRECT: ${stateTrackerRef.current.IMPROPER_PUSH_UP}`, frameWidth * 0.68, 80, { textColor: 'rgb(255, 255, 230)', backgroundColor: 'rgb(221, 0, 0)', fontSize: '14px' });
        drawText(ctx, 'CAMERA NOT ALIGNED PROPERLY!!!', 30, frameHeight - 60, { textColor: 'rgb(255, 255, 230)', backgroundColor: 'rgb(255, 153, 0)', fontSize: '14px' });
        drawText(ctx, `OFFSET ANGLE: ${offsetAngle.toFixed(2)}`, 30, frameHeight - 30, { textColor: 'rgb(255, 255, 230)', backgroundColor: 'rgb(255, 153, 0)', fontSize: '14px' });

        stateTrackerRef.current.start_inactive_time = Date.now();
        stateTrackerRef.current.INACTIVE_TIME = 0;
        stateTrackerRef.current.prev_state = null;
        stateTrackerRef.current.curr_state = null;
      } else {
        stateTrackerRef.current.INACTIVE_TIME_FRONT = 0;
        stateTrackerRef.current.start_inactive_time_front = Date.now();

        const selectedSideFeatures = Math.abs(leftFeatures.foot.y - leftFeatures.shoulder.y) > Math.abs(rightFeatures.foot.y - rightFeatures.shoulder.y) ? leftFeatures : rightFeatures;

        const shoulder_vertical_angle = findAngle(selectedSideFeatures.elbow, { x: selectedSideFeatures.shoulder.x, y: 0 }, selectedSideFeatures.shoulder);
        const elbow_vertical_angle = findAngle(selectedSideFeatures.shoulder, { x: selectedSideFeatures.elbow.x, y: 0 }, selectedSideFeatures.elbow);
        const wrist_vertical_angle = findAngle(selectedSideFeatures.elbow, { x: selectedSideFeatures.wrist.x, y: 0 }, selectedSideFeatures.wrist);

        drawConnector(ctx, selectedSideFeatures.shoulder, selectedSideFeatures.elbow, colors.light_blue, 4);
        drawConnector(ctx, selectedSideFeatures.wrist, selectedSideFeatures.elbow, colors.light_blue, 4);
        drawConnector(ctx, selectedSideFeatures.shoulder, selectedSideFeatures.hip, colors.light_blue, 4);
        drawConnector(ctx, selectedSideFeatures.knee, selectedSideFeatures.hip, colors.light_blue, 4);
        drawConnector(ctx, selectedSideFeatures.ankle, selectedSideFeatures.knee, colors.light_blue, 4);
        drawConnector(ctx, selectedSideFeatures.ankle, selectedSideFeatures.foot, colors.light_blue, 4);

        drawCircle(ctx, selectedSideFeatures.shoulder, 7, colors.yellow);
        drawCircle(ctx, selectedSideFeatures.elbow, 7, colors.yellow);
        drawCircle(ctx, selectedSideFeatures.wrist, 7, colors.yellow);
        drawCircle(ctx, selectedSideFeatures.hip, 7, colors.yellow);
        drawCircle(ctx, selectedSideFeatures.knee, 7, colors.yellow);
        drawCircle(ctx, selectedSideFeatures.ankle, 7, colors.yellow);
        drawCircle(ctx, selectedSideFeatures.foot, 7, colors.yellow);

        const curr_state = getState(elbow_vertical_angle);
        stateTrackerRef.current.curr_state = curr_state;
        updateStateSequence(curr_state);

        if (curr_state === 's1') {
          if (stateTrackerRef.current.state_seq.length === 3 && !stateTrackerRef.current.INCORRECT_POSTURE) stateTrackerRef.current.PUSH_UP_COUNT += 1;
          else if (stateTrackerRef.current.state_seq.includes('s2') && stateTrackerRef.current.state_seq.length === 1) stateTrackerRef.current.IMPROPER_PUSH_UP += 1;
          else if (stateTrackerRef.current.INCORRECT_POSTURE) stateTrackerRef.current.IMPROPER_PUSH_UP += 1;
          stateTrackerRef.current.state_seq = [];
          stateTrackerRef.current.INCORRECT_POSTURE = false;
        } else {
          const stateTracker = stateTrackerRef.current;
          if (shoulder_vertical_angle > currentThresholds.ANGLE_SHOULDER_ELBOW_VERT.NORMAL[1]) stateTracker.DISPLAY_TEXT[0] = true;
          else if (shoulder_vertical_angle < currentThresholds.ANGLE_SHOULDER_ELBOW_VERT.NORMAL[0] && stateTracker.state_seq.filter(e => e === 's2').length === 1) stateTracker.DISPLAY_TEXT[1] = true;
          if (currentThresholds.ANGLE_SHOULDER_ELBOW_VERT.TRANS[0] < elbow_vertical_angle && elbow_vertical_angle < currentThresholds.ANGLE_SHOULDER_ELBOW_VERT.TRANS[1] && stateTracker.state_seq.filter(e => e === 's2').length === 1) stateTracker.INCORRECT_POSTURE = true;
          else if (elbow_vertical_angle > currentThresholds.ANGLE_SHOULDER_ELBOW_VERT.PASS[1]) stateTracker.DISPLAY_TEXT[3] = true;
          if (wrist_vertical_angle > currentThresholds.ANGLE_SHOULDER_ELBOW_VERT.PASS[1]) stateTracker.DISPLAY_TEXT[2] = true;
        }

        showFeedback(ctx);
        drawText(ctx, `Shoulder Angle: ${shoulder_vertical_angle.toFixed(2)}`, selectedSideFeatures.shoulder.x + 10, selectedSideFeatures.shoulder.y, { textColor: colors.light_green, fontSize: '16px' });
        drawText(ctx, `Elbow Angle: ${elbow_vertical_angle.toFixed(2)}`, selectedSideFeatures.elbow.x + 15, selectedSideFeatures.elbow.y + 10, { textColor: colors.light_green, fontSize: '16px' });
        drawText(ctx, `Wrist Angle: ${wrist_vertical_angle.toFixed(2)}`, selectedSideFeatures.wrist.x + 10, selectedSideFeatures.wrist.y, { textColor: colors.light_green, fontSize: '16px' });
        drawText(ctx, `CORRECT: ${stateTrackerRef.current.PUSH_UP_COUNT}`, frameWidth * 0.68, 30, { textColor: 'rgb(255, 255, 230)', backgroundColor: 'rgb(18, 185, 0)', fontSize: '14px' });
        drawText(ctx, `INCORRECT: ${stateTrackerRef.current.IMPROPER_PUSH_UP}`, frameWidth * 0.68, 80, { textColor: 'rgb(255, 255, 230)', backgroundColor: 'rgb(221, 0, 0)', fontSize: '14px' });

        stateTrackerRef.current.DISPLAY_TEXT.forEach((_, index) => {
          if (stateTrackerRef.current.COUNT_FRAMES[index] > currentThresholds.CNT_FRAME_THRESH) {
            stateTrackerRef.current.DISPLAY_TEXT[index] = false;
            stateTrackerRef.current.COUNT_FRAMES[index] = 0;
          }
        });

        stateTrackerRef.current.prev_state = curr_state;
      }
    }
  }, [webcamRef, canvasRef]);

  const handleNavigate = () => navigate('/main');

  useEffect(() => {
    const initiateSession = debounce(async () => {
      try {
        const response = await startSession('push-up');
        console.log('Session started:', response);
        setSessionStarted(true);
      } catch (error) {
        console.error('Error starting session:', error);
      }
    }, 1000);

    initiateSession();
    return () => initiateSession.cancel();
  }, []);

  useEffect(() => {
    const pose = new Pose({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}` });
    pose.setOptions({ modelComplexity: 1, smoothLandmarks: true, enableSegmentation: false, smoothSegmentation: false, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });

    let camera;
    if (webcamRef.current && webcamRef.current.video) {
      camera = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => await pose.send({ image: webcamRef.current.video }),
        width: 640, height: 480
      });
      camera.start();
    }

    pose.onResults(onResults);
    return () => {
      if (camera) camera.stop();
      pose.close();
      endCurrentSession();
    };
  }, [onResults]);

  useEffect(() => {
    if (!sessionStarted || sessionEnded) return;
    const intervalId = setInterval(async () => {
      try {
        const correct = stateTrackerRef.current.PUSH_UP_COUNT;
        const incorrect = stateTrackerRef.current.IMPROPER_PUSH_UP;
        const feedback = stateTrackerRef.current.COUNT_FRAMES.reduce((obj, count, index) => ({ ...obj, [index]: count }), {});
        console.log('Updating session...', { correct, incorrect, feedback });
        await updateSession({ correct, incorrect, feedback });
        console.log('Session updated');
      } catch (error) {
        console.error('Error updating session:', error);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [sessionStarted, sessionEnded]);

  const endCurrentSession = async () => {
    if (!sessionStarted || sessionEnded) return;
    try {
      const correct = stateTrackerRef.current.PUSH_UP_COUNT;
      const incorrect = stateTrackerRef.current.IMPROPER_PUSH_UP;
      const feedback = stateTrackerRef.current.COUNT_FRAMES.reduce((obj, count, index) => ({ ...obj, [index]: count }), {});
      await endSession({ correct, incorrect, feedback });
      console.log('Session ended');
      setSessionEnded(true);
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  const handleEndSessionAndNavigate = async () => {
    await endCurrentSession();
    handleNavigate();
  };

  const handleModeChange = (event) => {
    const isBeginner = event.target.value === 'beginner';
    setIsBeginnerMode(isBeginner);
    setCurrentThresholds(isBeginner ? thresholdsBeginner : thresholdsPro);
    console.log('Current Thresholds:', isBeginner ? thresholdsBeginner : thresholdsPro);
  };

  return (
    <div className="bg-gray-100 w-full h-screen flex justify-center items-center overflow-hidden relative">
      <div className="absolute top-0 left-0 m-4 flex items-center">
        <button onClick={handleEndSessionAndNavigate} className="bg-blue-500 p-2 rounded-md shadow hover:bg-orange-600 transition duration-300 ease-in-out flex items-center justify-center z-10" aria-label="Go back">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="h-6 w-6 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="text-white bg-blue-500 ml-4 py-2 px-4 rounded-md shadow">Push-Up Exercise</div>
      </div>
      <div className="absolute top-0 right-0 m-4">
        <select onChange={handleModeChange} className="text-white bg-blue-500 p-2 rounded-md shadow" value={isBeginnerMode ? 'beginner' : 'pro'}>
          <option value="beginner">Beginner Mode</option>
          <option value="pro">Pro Mode</option>
        </select>
      </div>
      <div className="relative w-full max-w-screen-lg mx-auto">
        <Webcam ref={webcamRef} style={{ display: 'none' }} />
        <canvas ref={canvasRef} className="h-full w-full object-contain" style={{ maxWidth: '100vw', maxHeight: '100vh', position: 'relative', left: 0, top: 0 }} />
      </div>
    </div>
  );
}

export default PushUpExercise;