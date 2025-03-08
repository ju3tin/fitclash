"use client"

import { useRef, useState, useEffect } from "react"
import * as tf from "@tensorflow/tfjs"
import * as posedetection from "@tensorflow-models/pose-detection"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card" 
import { drawPose } from "../utils/drawing"
import { Loader2, Camera, CameraOff } from "lucide-react"

export default function PoseDetector() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isModelLoading, setIsModelLoading] = useState(true)
  const [isDetecting, setIsDetecting] = useState(false)
  const [detector, setDetector] = useState<posedetection.PoseDetector | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Initialize TensorFlow.js and load the MoveNet model
  useEffect(() => {
    async function setupTensorflow() {
      try {
        // Load TensorFlow.js
        await tf.ready()
        console.log("TensorFlow.js loaded successfully")

        // Create the detector
        const detectorConfig = {
          modelType: posedetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
          enableSmoothing: true,
        }

        const detector = await posedetection.createDetector(posedetection.SupportedModels.MoveNet, detectorConfig)

        setDetector(detector)
        setIsModelLoading(false)
        console.log("MoveNet model loaded successfully")
      } catch (err) {
        console.error("Failed to load TensorFlow.js or MoveNet model:", err)
        setError("Failed to load the pose detection model. Please try again later.")
        setIsModelLoading(false)
      }
    }

    setupTensorflow()

    // Cleanup function
    return () => {
      if (detector) {
        detector.dispose()
      }
    }
  }, [])

  // Start/stop webcam and pose detection
  const toggleDetection = async () => {
    if (isDetecting) {
      // Stop detection
      setIsDetecting(false)
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
        videoRef.current.srcObject = null
      }
    } else {
      // Start detection
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              videoRef.current.play()
              setIsDetecting(true)
              detectPose()
            }
          }
        }
      } catch (err) {
        console.error("Error accessing webcam:", err)
        setError("Could not access your camera. Please allow camera access and try again.")
      }
    }
  }

  // Detect poses in a loop
  const detectPose = async () => {
    if (!detector || !videoRef.current || !canvasRef.current || !isDetecting) return

    try {
      // Get poses from the detector
      const poses = await detector.estimatePoses(videoRef.current)

      // Draw the results on the canvas
      const ctx = canvasRef.current.getContext("2d")
      if (ctx) {
        // Set canvas dimensions to match video
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight

        // Clear the canvas
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

        // Draw each detected pose
        poses.forEach((pose) => {
          drawPose(ctx, pose, 6, 3)
        })
      }

      // Continue detection loop if still detecting
      if (isDetecting) {
        requestAnimationFrame(detectPose)
      }
    } catch (err) {
      console.error("Error during pose detection:", err)
      setError("An error occurred during pose detection.")
      setIsDetecting(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto overflow-hidden">
      <CardContent className="p-0 relative">
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white p-4 z-20">
            <p className="text-center">{error}</p>
          </div>
        )}

        {isModelLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white p-4 z-10">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            <p>Loading MoveNet model...</p>
          </div>
        )}

        <div className="relative aspect-video bg-black">
          <video ref={videoRef} className="absolute inset-0 w-full h-full object-contain" playsInline />
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-contain z-10" />

          {!isDetecting && !isModelLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white">
              <p>Click "Start Camera" to begin pose detection</p>
            </div>
          )}
        </div>

        <div className="p-4 flex justify-center">
          <Button onClick={toggleDetection} disabled={isModelLoading} className="flex items-center gap-2">
            {isDetecting ? (
              <>
                <CameraOff className="h-4 w-4" />
                Stop Camera
              </>
            ) : (
              <>
                <Camera className="h-4 w-4" />
                Start Camera
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
