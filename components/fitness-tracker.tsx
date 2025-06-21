"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card1"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Progress } from "../components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, Play, Square, RotateCcw, Activity } from "lucide-react"

interface FitnessTrackerProps {
  onScoreUpdate: (score: number, exercises: number) => void
}

interface ExerciseData {
  name: string
  count: number
  score: number
  accuracy: number
  lastDetection: number
}

interface ExerciseType {
  id: string
  name: string
  description: string
  icon: string
  baseScore: number
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
    lastDetection: 0,
  })
  const [poseDetector, setPoseDetector] = useState<any>(null)
  const [isModelLoaded, setIsModelLoaded] = useState(false)
  const [sessionScore, setSessionScore] = useState(0)
  const [exerciseState, setExerciseState] = useState<string>("neutral")

  const exerciseTypes: ExerciseType[] = [
    {
      id: "squats",
      name: "Squats",
      description: "Lower body strength exercise",
      icon: "🏋️",
      baseScore: 10,
    },
    {
      id: "starjumps",
      name: "Star Jumps",
      description: "Full body cardio exercise",
      icon: "⭐",
      baseScore: 15,
    },
    {
      id: "situps",
      name: "Sit-ups",
      description: "Core strengthening exercise",
      icon: "💪",
      baseScore: 8,
    },
    {
      id: "pushups",
      name: "Push-ups",
      description: "Upper body strength exercise",
      icon: "🤲",
      baseScore: 12,
    },
  ]

  // Initialize TensorFlow and MoveNet
  useEffect(() => {
    const initializeTensorFlow = async () => {
      try {
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

        // Draw skeleton connections
        drawSkeleton(pose, ctx)

        // Analyze exercise based on current type
        analyzeExercise(pose)
      }
    } catch (error) {
      console.error("Pose detection error:", error)
    }
  }, [poseDetector, currentExercise, exerciseState])

  const drawSkeleton = (pose: any, ctx: CanvasRenderingContext2D) => {
    const connections = [
      ["left_shoulder", "right_shoulder"],
      ["left_shoulder", "left_elbow"],
      ["left_elbow", "left_wrist"],
      ["right_shoulder", "right_elbow"],
      ["right_elbow", "right_wrist"],
      ["left_shoulder", "left_hip"],
      ["right_shoulder", "right_hip"],
      ["left_hip", "right_hip"],
      ["left_hip", "left_knee"],
      ["left_knee", "left_ankle"],
      ["right_hip", "right_knee"],
      ["right_knee", "right_ankle"],
    ]

    ctx.strokeStyle = "#00ff00"
    ctx.lineWidth = 2

    connections.forEach(([pointA, pointB]) => {
      const keypointA = pose.keypoints.find((kp: any) => kp.name === pointA)
      const keypointB = pose.keypoints.find((kp: any) => kp.name === pointB)

      if (keypointA && keypointB && keypointA.score > 0.3 && keypointB.score > 0.3) {
        ctx.beginPath()
        ctx.moveTo(keypointA.x, keypointA.y)
        ctx.lineTo(keypointB.x, keypointB.y)
        ctx.stroke()
      }
    })
  }

  const analyzeExercise = (pose: any) => {
    const now = Date.now()
    if (now - exerciseData.lastDetection < 1000) return // Prevent too frequent detections

    let detected = false
    let accuracy = 0

    switch (currentExercise) {
      case "squats":
        ;({ detected, accuracy } = analyzeSquats(pose))
        break
      case "starjumps":
        ;({ detected, accuracy } = analyzeStarJumps(pose))
        break
      case "situps":
        ;({ detected, accuracy } = analyzeSitUps(pose))
        break
      case "pushups":
        ;({ detected, accuracy } = analyzePushUps(pose))
        break
    }

    if (detected) {
      const exerciseType = exerciseTypes.find((e) => e.id === currentExercise)
      const scoreGain = Math.round((exerciseType?.baseScore || 10) * (accuracy / 100))

      setExerciseData((prev) => ({
        ...prev,
        count: prev.count + 1,
        score: prev.score + scoreGain,
        accuracy: Math.round(accuracy),
        lastDetection: now,
      }))

      setSessionScore((prev) => prev + scoreGain)
    }
  }

  const analyzeSquats = (pose: any) => {
    const keypoints = pose.keypoints
    const leftKnee = keypoints.find((kp: any) => kp.name === "left_knee")
    const rightKnee = keypoints.find((kp: any) => kp.name === "right_knee")
    const leftHip = keypoints.find((kp: any) => kp.name === "left_hip")
    const rightHip = keypoints.find((kp: any) => kp.name === "right_hip")

    if (leftKnee && rightKnee && leftHip && rightHip) {
      const avgKneeY = (leftKnee.y + rightKnee.y) / 2
      const avgHipY = (leftHip.y + rightHip.y) / 2
      const kneeHipRatio = avgKneeY / avgHipY

      if (kneeHipRatio > 1.1 && exerciseState === "neutral") {
        setExerciseState("down")
        return { detected: false, accuracy: 0 }
      } else if (kneeHipRatio < 1.05 && exerciseState === "down") {
        setExerciseState("neutral")
        const accuracy = Math.min(100, Math.max(60, 100 - Math.abs(kneeHipRatio - 1.0) * 50))
        return { detected: true, accuracy }
      }
    }

    return { detected: false, accuracy: 0 }
  }

  const analyzeStarJumps = (pose: any) => {
    const keypoints = pose.keypoints
    const leftWrist = keypoints.find((kp: any) => kp.name === "left_wrist")
    const rightWrist = keypoints.find((kp: any) => kp.name === "right_wrist")
    const leftAnkle = keypoints.find((kp: any) => kp.name === "left_ankle")
    const rightAnkle = keypoints.find((kp: any) => kp.name === "right_ankle")
    const nose = keypoints.find((kp: any) => kp.name === "nose")

    if (leftWrist && rightWrist && leftAnkle && rightAnkle && nose) {
      const armSpread = Math.abs(leftWrist.x - rightWrist.x)
      const legSpread = Math.abs(leftAnkle.x - rightAnkle.x)
      const armsUp = (leftWrist.y + rightWrist.y) / 2 < nose.y

      if (armSpread > 200 && legSpread > 100 && armsUp && exerciseState === "neutral") {
        setExerciseState("spread")
        return { detected: false, accuracy: 0 }
      } else if (armSpread < 150 && legSpread < 80 && !armsUp && exerciseState === "spread") {
        setExerciseState("neutral")
        const accuracy = Math.min(100, Math.max(70, 100 - Math.abs(armSpread - 100) / 10))
        return { detected: true, accuracy }
      }
    }

    return { detected: false, accuracy: 0 }
  }

  const analyzeSitUps = (pose: any) => {
    const keypoints = pose.keypoints
    const nose = keypoints.find((kp: any) => kp.name === "nose")
    const leftHip = keypoints.find((kp: any) => kp.name === "left_hip")
    const rightHip = keypoints.find((kp: any) => kp.name === "right_hip")
    const leftKnee = keypoints.find((kp: any) => kp.name === "left_knee")
    const rightKnee = keypoints.find((kp: any) => kp.name === "right_knee")

    if (nose && leftHip && rightHip && leftKnee && rightKnee) {
      const avgHipY = (leftHip.y + rightHip.y) / 2
      const avgKneeY = (leftKnee.y + rightKnee.y) / 2
      const torsoAngle = Math.abs(nose.y - avgHipY) / Math.abs(nose.x - (leftHip.x + rightHip.x) / 2)

      if (nose.y > avgHipY && exerciseState === "neutral") {
        setExerciseState("down")
        return { detected: false, accuracy: 0 }
      } else if (nose.y < avgKneeY && exerciseState === "down") {
        setExerciseState("neutral")
        const accuracy = Math.min(100, Math.max(60, 90 - Math.abs(torsoAngle - 1) * 20))
        return { detected: true, accuracy }
      }
    }

    return { detected: false, accuracy: 0 }
  }

  const analyzePushUps = (pose: any) => {
    const keypoints = pose.keypoints
    const leftShoulder = keypoints.find((kp: any) => kp.name === "left_shoulder")
    const rightShoulder = keypoints.find((kp: any) => kp.name === "right_shoulder")
    const leftWrist = keypoints.find((kp: any) => kp.name === "left_wrist")
    const rightWrist = keypoints.find((kp: any) => kp.name === "right_wrist")
    const leftHip = keypoints.find((kp: any) => kp.name === "left_hip")
    const rightHip = keypoints.find((kp: any) => kp.name === "right_hip")

    if (leftShoulder && rightShoulder && leftWrist && rightWrist && leftHip && rightHip) {
      const avgShoulderY = (leftShoulder.y + rightShoulder.y) / 2
      const avgWristY = (leftWrist.y + rightWrist.y) / 2
      const avgHipY = (leftHip.y + rightHip.y) / 2

      const armBend = avgWristY - avgShoulderY
      const bodyAlignment = Math.abs(avgShoulderY - avgHipY)

      if (armBend > 50 && exerciseState === "neutral") {
        setExerciseState("down")
        return { detected: false, accuracy: 0 }
      } else if (armBend < 20 && exerciseState === "down") {
        setExerciseState("neutral")
        const accuracy = Math.min(100, Math.max(60, 100 - bodyAlignment / 2))
        return { detected: true, accuracy }
      }
    }

    return { detected: false, accuracy: 0 }
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
    const selectedExercise = exerciseTypes.find((e) => e.id === currentExercise)
    setExerciseData({
      name: selectedExercise?.name || "Exercise",
      count: 0,
      score: 0,
      accuracy: 0,
      lastDetection: 0,
    })
    setSessionScore(0)
    setExerciseState("neutral")
  }

  const handleExerciseChange = (exerciseId: string) => {
    setCurrentExercise(exerciseId)
    const selectedExercise = exerciseTypes.find((e) => e.id === exerciseId)
    setExerciseData({
      name: selectedExercise?.name || "Exercise",
      count: 0,
      score: 0,
      accuracy: 0,
      lastDetection: 0,
    })
    setSessionScore(0)
    setExerciseState("neutral")
  }

  const currentExerciseType = exerciseTypes.find((e) => e.id === currentExercise)

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
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Exercise</label>
              <Select value={currentExercise} onValueChange={handleExerciseChange} disabled={isTracking}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {exerciseTypes.map((exercise) => (
                    <SelectItem key={exercise.id} value={exercise.id}>
                      <div className="flex items-center gap-2">
                        <span>{exercise.icon}</span>
                        <div>
                          <div className="font-medium">{exercise.name}</div>
                          <div className="text-xs text-gray-500">{exercise.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="relative">
              <video ref={videoRef} className="w-full h-64 bg-gray-900 rounded-lg" muted playsInline />
              <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-64 pointer-events-none" />

              {isTracking && (
                <div className="absolute top-2 right-2">
                  <Badge variant="destructive" className="animate-pulse">
                    🔴 Recording
                  </Badge>
                </div>
              )}
            </div>

            <div className="flex gap-2">
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Current Session
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Exercise</span>
            <Badge variant="secondary" className="flex items-center gap-1">
              <span>{currentExerciseType?.icon}</span>
              {exerciseData.name}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{exerciseData.count}</div>
              <div className="text-xs text-blue-600">Repetitions</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{sessionScore}</div>
              <div className="text-xs text-green-600">Session Score</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Form Accuracy</span>
              <span className="font-bold">{exerciseData.accuracy}%</span>
            </div>
            <Progress value={exerciseData.accuracy} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Base Score per Rep</span>
              <span className="font-bold">{currentExerciseType?.baseScore} pts</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Exercise State</span>
              <Badge variant="outline" className="text-xs">
                {exerciseState === "neutral" ? "Ready" : exerciseState}
              </Badge>
            </div>
          </div>

          {!isTracking && exerciseData.count > 0 && (
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-sm font-medium text-yellow-800">Session Complete!</div>
              <div className="text-xs text-yellow-600">
                Great job! You completed {exerciseData.count} {exerciseData.name.toLowerCase()} and earned{" "}
                {sessionScore} points.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
