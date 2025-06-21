"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card1"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Progress } from "../components/ui/progress"
import { Camera, Play, Square, RotateCcw } from "lucide-react"

interface FitnessTrackerProps {
  onScoreUpdate: (score: number, exercises: number) => void
}

interface ExerciseData {
  name: string
  count: number
  score: number
  accuracy: number
}

export function FitnessTracker({ onScoreUpdate }: FitnessTrackerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isTracking, setIsTracking] = useState(false)
  const [currentExercise, setCurrentExercise] = useState<string>("squats")
  const [exerciseData, setExerciseData] = useState<ExerciseData>({
    name: "Squats",
    count: 0,
    score: 0,
    accuracy: 0,
  })
  const [poseDetector, setPoseDetector] = useState<any>(null)
  const [isModelLoaded, setIsModelLoaded] = useState(false)
  const [sessionScore, setSessionScore] = useState(0)

  // Initialize TensorFlow and MoveNet
  useEffect(() => {
    const initializeTensorFlow = async () => {
      try {
        // Dynamically import TensorFlow modules
        const tf = await import("@tensorflow/tfjs")
        const poseDetection = await import("@tensorflow-models/pose-detection")

        await tf.ready()

        const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
          enableSmoothing: true,
        })

        setPoseDetector(detector)
        setIsModelLoaded(true)
      } catch (error) {
        console.error("Failed to initialize TensorFlow:", error)
      }
    }

    initializeTensorFlow()
  }, [])

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }, [])

  const detectPose = useCallback(async () => {
    if (!poseDetector || !videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx || video.videoWidth === 0) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    try {
      const poses = await poseDetector.estimatePoses(video)

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (poses.length > 0) {
        const pose = poses[0]

        // Draw pose keypoints
        pose.keypoints.forEach((keypoint: any) => {
          if (keypoint.score > 0.3) {
            ctx.beginPath()
            ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI)
            ctx.fillStyle = "#00ff00"
            ctx.fill()
          }
        })

        // Analyze exercise form and count reps
        analyzeExercise(pose)
      }
    } catch (error) {
      console.error("Pose detection error:", error)
    }
  }, [poseDetector, currentExercise])

  const analyzeExercise = (pose: any) => {
    // Simplified exercise analysis - in a real app, this would be more sophisticated
    const keypoints = pose.keypoints
    const leftKnee = keypoints.find((kp: any) => kp.name === "left_knee")
    const rightKnee = keypoints.find((kp: any) => kp.name === "right_knee")
    const leftHip = keypoints.find((kp: any) => kp.name === "left_hip")
    const rightHip = keypoints.find((kp: any) => kp.name === "right_hip")

    if (leftKnee && rightKnee && leftHip && rightHip) {
      // Calculate knee angle for squat detection
      const avgKneeY = (leftKnee.y + rightKnee.y) / 2
      const avgHipY = (leftHip.y + rightHip.y) / 2
      const kneeHipRatio = avgKneeY / avgHipY

      // Simple squat detection logic
      if (kneeHipRatio > 1.1) {
        // In squat position
        const accuracy = Math.min(100, Math.max(60, 100 - Math.abs(kneeHipRatio - 1.15) * 100))

        setExerciseData((prev) => {
          const newCount = prev.count + 1
          const newScore = prev.score + Math.round(accuracy)
          return {
            ...prev,
            count: newCount,
            score: newScore,
            accuracy: Math.round(accuracy),
          }
        })

        setSessionScore((prev) => prev + Math.round(accuracy))
      }
    }
  }

  useEffect(() => {
    let animationFrame: number

    const runDetection = () => {
      if (isTracking) {
        detectPose()
        animationFrame = requestAnimationFrame(runDetection)
      }
    }

    if (isTracking) {
      runDetection()
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [isTracking, detectPose])

  const startTracking = async () => {
    if (!isModelLoaded) {
      alert("AI model is still loading. Please wait...")
      return
    }

    await startCamera()
    setIsTracking(true)
  }

  const stopTracking = () => {
    setIsTracking(false)

    // Update parent component with session results
    onScoreUpdate(sessionScore, exerciseData.count)

    // Stop camera
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
    }
  }

  const resetSession = () => {
    setExerciseData({
      name: "Squats",
      count: 0,
      score: 0,
      accuracy: 0,
    })
    setSessionScore(0)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            AI Pose Detection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <video ref={videoRef} className="w-full h-64 bg-gray-900 rounded-lg" muted playsInline />
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-64 pointer-events-none" />
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={startTracking} disabled={isTracking || !isModelLoaded} className="flex-1">
              <Play className="h-4 w-4 mr-2" />
              {isModelLoaded ? "Start Workout" : "Loading AI..."}
            </Button>
            <Button onClick={stopTracking} disabled={!isTracking} variant="outline" className="flex-1">
              <Square className="h-4 w-4 mr-2" />
              Stop
            </Button>
            <Button onClick={resetSession} variant="outline" size="icon">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Session</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Exercise</span>
            <Badge variant="secondary">{exerciseData.name}</Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Repetitions</span>
              <span className="font-bold">{exerciseData.count}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Session Score</span>
              <span className="font-bold">{sessionScore}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Form Accuracy</span>
              <span className="font-bold">{exerciseData.accuracy}%</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Accuracy</span>
              <span>{exerciseData.accuracy}%</span>
            </div>
            <Progress value={exerciseData.accuracy} className="h-2" />
          </div>

          {isTracking && (
            <div className="text-center">
              <Badge variant="outline" className="animate-pulse">
                🔴 Recording
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
