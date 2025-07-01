'use client';
import { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as posedetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Suspense } from "react";
import Header from "../../../components/header";

export default function DinoGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [detector, setDetector] = useState<posedetection.PoseDetector | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const scoreRef = useRef(0);

  const { connected } = useWallet();

  // MoveNet Setup
  useEffect(() => {
    const setupCamera = async () => {
      const video = videoRef.current;
      if (!video) return;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false,
      });
      video.srcObject = stream;
      await video.play();
    };

    const loadDetector = async () => {
      await tf.setBackend('webgl');
      const loadedDetector = await posedetection.createDetector(posedetection.SupportedModels.MoveNet, {
        modelType: posedetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
      });
      setDetector(loadedDetector);
    };

    setupCamera();
    loadDetector();
  }, []);

  const detectJump = async (jumpCallback: () => void) => {
    if (!detector || !videoRef.current) return;

    const video = videoRef.current;
    const poses = await detector.estimatePoses(video);

    if (poses.length > 0) {
      const keypoints = poses[0].keypoints;

      const leftHip = keypoints.find((k) => k.name === 'left_hip');
      const rightHip = keypoints.find((k) => k.name === 'right_hip');

      if (
        leftHip && rightHip &&
        leftHip.score !== undefined && rightHip.score !== undefined &&
        leftHip.score > 0.5 && rightHip.score > 0.5
      ) {
        const avgY = (leftHip.y + rightHip.y) / 2;

        // Use a simple threshold for jump detection
        if (avgY < 250) { // Adjust this threshold based on testing
          jumpCallback();
        }
      }
    }
  };

  useEffect(() => {
    if (!isRunning) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dino = { x: 50, y: 250, width: 50, height: 50, velocity: 0, gravity: 0.6, jumping: false };
    const obstacles: { x: number; width: number; }[] = [];
    let obstacleTimer = 0;
    let animationFrameId: number;
    let frameCount = 0;

    const jump = () => {
      if (!dino.jumping) {
        dino.velocity = -12;
        dino.jumping = true;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') jump();
    };

    document.addEventListener('keydown', handleKeyDown);

    const gameLoop = async () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw ground
      ctx.fillStyle = '#444';
      ctx.fillRect(0, canvas.height - 10, canvas.width, 10);

      // Draw Dino
      ctx.fillStyle = '#000';
      ctx.fillRect(dino.x, dino.y, dino.width, dino.height);

      // Update Dino position
      dino.velocity += dino.gravity;
      dino.y += dino.velocity;
      if (dino.y >= 250) {
        dino.y = 250;
        dino.jumping = false;
      }

      // Handle obstacles
      obstacleTimer++;
      if (obstacleTimer > 100) {
        obstacles.push({ x: canvas.width, width: Math.random() * 20 + 20 });
        obstacleTimer = 0;
      }

      for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= 6;

        // Draw obstacle
        ctx.fillStyle = 'green';
        ctx.fillRect(obstacles[i].x, 270, obstacles[i].width, 30);

        // Check collision
        if (
          dino.x < obstacles[i].x + obstacles[i].width &&
          dino.x + dino.width > obstacles[i].x &&
          dino.y + dino.height > 270
        ) {
          setIsRunning(false);
          setGameOver(true);
          setHighScore(prev => (scoreRef.current > prev ? scoreRef.current : prev));
          document.removeEventListener('keydown', handleKeyDown);
          cancelAnimationFrame(animationFrameId);
          return;
        }
      }

      // Jump Detection
      await detectJump(jump);

      // Update score
      if (frameCount % 5 === 0) {
        scoreRef.current += 1;
        setScore(scoreRef.current);
      }
      frameCount++;

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isRunning, detector]);

  const resetGame = () => {
    scoreRef.current = 0;
    setScore(0);
    setGameOver(false);
    setIsRunning(true);
  };

  if (!connected) {
    return (
      <>
        <Header />
        <Suspense fallback={<div>Loading...</div>}>
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-3xl font-bold mb-4">Connect Your Solana Wallet to Play</h1>
            <WalletMultiButton />
          </div>
        </Suspense>
      </>
    );
  }

  return (
    <>
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
          <h1 className="text-3xl font-bold mb-4">Chrome Dino Game (Jump with Your Body!)</h1>
          <canvas ref={canvasRef} width={800} height={300} className="border border-black" />

          <video ref={videoRef} width={640} height={480} className="mt-4" autoPlay muted />

          <div className="mt-4 text-xl">Score: {score}</div>
          <div className="mt-2 text-xl">High Score: {highScore}</div>

          {!isRunning && !gameOver && (
            <button onClick={() => setIsRunning(true)} className="mt-4 px-4 py-2 bg-black text-white rounded">
              Start Game
            </button>
          )}

          {gameOver && (
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-red-600 mt-4">Game Over!</div>
              <button onClick={resetGame} className="mt-4 px-4 py-2 bg-black text-white rounded">
                Restart Game
              </button>
            </div>
          )}
        </div>
      </Suspense>
    </>
  );
}
