"use client";

import { useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as posedetection from "@tensorflow-models/pose-detection";

const MoveNetComponent = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const loadModelAndDetect = async () => {
      const detector = await posedetection.createDetector(
        posedetection.SupportedModels.MoveNet,
        {
          modelType: posedetection.movenet.modelType.SINGLEPOSE_LIGHTNING, // Correct model type
        }
      );

      if (videoRef.current && canvasRef.current) {
        videoRef.current.width = 640;
        videoRef.current.height = 480;
        canvasRef.current.width = 640;
        canvasRef.current.height = 480;
        detectPose(detector);
      }
    };

    const detectPose = async (detector: posedetection.PoseDetector) => {
      if (!videoRef.current || !canvasRef.current) return;

      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return; // Ensure the context is valid

      const poseDetectionLoop = async () => {
        if (videoRef.current && ctx) {
          const poses = await detector.estimatePoses(videoRef.current);
          ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
          ctx.drawImage(videoRef.current, 0, 0, 640, 480);
          drawPose(poses, ctx);
        }
        requestAnimationFrame(poseDetectionLoop);
      };

      poseDetectionLoop();
    };

    const drawPose = (poses: posedetection.Pose[], ctx: CanvasRenderingContext2D) => {
      if (!poses.length) return;

      poses.forEach((pose) => {
        ctx.fillStyle = "red";
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;

        // Draw keypoints
        pose.keypoints.forEach(({ x, y, score }) => {
          if (score > 0.3) { // Confidence threshold
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fill();
          }
        });

        // Draw skeleton (connecting keypoints)
        const adjacentPairs = posedetection.util.getAdjacentPairs(posedetection.SupportedModels.MoveNet);
        adjacentPairs.forEach(([i, j]) => {
          const kp1 = pose.keypoints[i];
          const kp2 = pose.keypoints[j];

          if (kp1.score > 0.3 && kp2.score > 0.3) {
            ctx.beginPath();
            ctx.moveTo(kp1.x, kp1.y);
            ctx.lineTo(kp2.x, kp2.y);
            ctx.stroke();
          }
        });
      });
    };

    loadModelAndDetect();
  }, []);

  return (
    <div className="relative w-[640px] h-[480px]">
      <video ref={videoRef} autoPlay playsInline className="absolute w-full h-full hidden"></video>
      <canvas ref={canvasRef} className="absolute w-full h-full"></canvas>
    </div>
  );
};

export default MoveNetComponent;
