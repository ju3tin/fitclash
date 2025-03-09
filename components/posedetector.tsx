import * as cam from "@mediapipe/camera_utils";
import React, { useEffect, useRef } from "react";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { POSE_CONNECTIONS } from "@mediapipe/pose";
import * as posedetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import Webcam from "react-webcam";

const UserPose = () => {
  // Explicitly define ref types
  const webcamRef = useRef<Webcam | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  let camera: cam.Camera | null = null; // Ensure camera is properly typed

  // Function to draw landmarks once the pose has been determined
  const onResults = (poses: posedetection.Pose[]) => {
    if (!canvasRef.current || !webcamRef.current || !webcamRef.current.video) return;

    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");

    if (!canvasCtx) return; // Ensure context is not null

    // Ensure the canvas matches the video feed size
    canvasElement.width = webcamRef.current.video.videoWidth;
    canvasElement.height = webcamRef.current.video.videoHeight;

    // Clear and draw the video frame
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
      webcamRef.current.video,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );

    // Draw pose landmarks
    if (poses.length > 0) {
      const keypoints = poses[0].keypoints;

      drawConnectors(canvasCtx, keypoints, POSE_CONNECTIONS, {
        color: "#3240CF",
        lineWidth: 2,
      });

      drawLandmarks(canvasCtx, keypoints, {
        color: "red",
        lineWidth: 2,
        radius: 3,
      });
    }
  };

  useEffect(() => {
    const setupPoseDetection = async () => {
      // Load TensorFlow Pose Detection Model
      const detector = await posedetection.createDetector(
        posedetection.SupportedModels.MoveNet,
        {
          modelType: posedetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        }
      );

      // Initialize camera and run detection on each frame
      if (webcamRef.current && webcamRef.current.video) {
        camera = new cam.Camera(webcamRef.current.video, {
          onFrame: async () => {
            const poses = await detector.estimatePoses(webcamRef.current!.video!);
            onResults(poses);
          },
          width: 1280,
          height: 720,
        });

        camera.start();
      }
    };

    setupPoseDetection();

    return () => {
      if (camera) {
        camera.stop();
      }
    };
  }, []);

  return (
    <div>
      <div className="App">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 1280,
            height: 720,
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 1280,
            height: 720,
          }}
        ></canvas>
      </div>
    </div>
  );
};

export default UserPose;