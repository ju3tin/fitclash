'use client';

import { useEffect, useRef, useState } from 'react';
import '@mediapipe/pose';
import '@mediapipe/camera_utils';
import '@mediapipe/drawing_utils';
import { Camera } from '@mediapipe/camera_utils';
import { ControlPanel, FPS } from '@mediapipe/control_utils';
import { Pose, POSE_CONNECTIONS, POSE_LANDMARKS_LEFT, POSE_LANDMARKS_RIGHT, POSE_LANDMARKS_NEUTRAL } from '@mediapipe/pose';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import styles from '../boxingtest/styles.module.css';


export default function PushupCounter() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [counter, setCounter] = useState(0);
  const [stage, setStage] = useState('UP');
  const fps = new FPS();

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext('2d');

    const pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.3.1621277220/${file}`,
    });
    pose.setOptions({
      selfieMode: true,
      modelComplexity: 0,
      smoothLandmarks: true,
      minDetectionConfidence: 0.2,
      minTrackingConfidence: 0.2,
    });
    pose.onResults((results) => {
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

      drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, { visibilityMin: 0.65, color: 'white' });
      drawLandmarks(canvasCtx, Object.values(POSE_LANDMARKS_LEFT).map(index => results.poseLandmarks[index]), { visibilityMin: 0.65, color: 'rgb(255,138,0)' });
      drawLandmarks(canvasCtx, Object.values(POSE_LANDMARKS_RIGHT).map(index => results.poseLandmarks[index]), { visibilityMin: 0.65, color: 'rgb(0,217,231)' });
      drawLandmarks(canvasCtx, Object.values(POSE_LANDMARKS_NEUTRAL).map(index => results.poseLandmarks[index]), { visibilityMin: 0.65, color: 'white' });

      const nose = results.poseLandmarks[POSE_LANDMARKS_NEUTRAL.NOSE];
      if (!nose) return;
      if (nose.y <= 0.5) {
        setStage('UP');
      } else if (nose.y > 0.7 && stage === 'UP') {
        setStage('DOWN');
        setCounter((prev) => prev + 1);
      }
      
      canvasCtx.font = '30px Arial';
      canvasCtx.fillStyle = 'red';
      canvasCtx.fillText(`${stage}: ${counter}`, 1100, 50);
    });

    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await pose.send({ image: videoElement });
      },
      width: 1280,
      height: 720,
    });
    camera.start();
  }, [counter, stage]);

  return (
    <div className={styles.container}>
      <video ref={videoRef} className={styles.inputVideo} autoPlay playsInline></video>
      <canvas ref={canvasRef} className={styles.outputCanvas} width={1280} height={720}></canvas>
      <div className={styles.loading}><div className={styles.spinner}></div><div>Loading</div></div>
      <a href="https://github.com/baoanh1310/pose_demo" target="_blank" className={styles.logo}>
        <img src="/logo_white.png" alt="logo" style={{ height: 50 }} />
        <span>Group 02 - AI Project</span>
      </a>
    </div>
  );
}
