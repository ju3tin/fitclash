"use client";

import { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as poseDetection from "@tensorflow-models/pose-detection";
import UserPose from "../../../components/posedetector";

const PunchDetector = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [punchType, setPunchType] = useState<string>("");

  useEffect(() => {
    const runModel = async () => {
      await tf.ready();
      const detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet
      );

      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      const detectPunch = async () => {
        if (!videoRef.current) return;
        const poses = await detector.estimatePoses(videoRef.current);
        if (poses.length > 0) {
          const keypoints = poses[0].keypoints;

          if (keypoints) {
            const leftWrist = keypoints[9];
            const rightWrist = keypoints[10];
            const leftElbow = keypoints[7];
            const rightElbow = keypoints[8];

            if (leftWrist && rightWrist && leftElbow && rightElbow) {
              const punch = classifyPunch(
                leftWrist,
                rightWrist,
                leftElbow,
                rightElbow
              );
              setPunchType(punch);
            }
          }
        }

        requestAnimationFrame(detectPunch);
      };

      detectPunch();
    };

    runModel();
  }, []);

  const classifyPunch = (
    leftWrist: any,
    rightWrist: any,
    leftElbow: any,
    rightElbow: any
  ): string => {
    const threshold = 50; // Adjust based on real-world testing

    // Detecting a Jab (Fast forward movement)
    if (
      rightWrist.x - rightElbow.x > threshold ||
      leftWrist.x - leftElbow.x > threshold
    ) {
      return "Jab";
    }

    // Detecting a Hook (Horizontal swing)
    if (
      Math.abs(rightWrist.y - rightElbow.y) < threshold ||
      Math.abs(leftWrist.y - leftElbow.y) < threshold
    ) {
      return "Hook";
    }

    // Detecting an Uppercut (Upward motion)
    if (
      rightWrist.y < rightElbow.y - threshold ||
      leftWrist.y < leftElbow.y - threshold
    ) {
      return "Uppercut";
    }

    return "";
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-bold">Punch Detector</h2>
      <UserPose />
      <video ref={videoRef} className="w-full max-w-md rounded-lg" />
      {punchType && <p className="mt-4 text-xl font-semibold">{punchType}</p>}
    </div>
  );
};

export default PunchDetector;