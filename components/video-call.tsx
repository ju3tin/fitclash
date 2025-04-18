"use client"

import { useRef, useState, useEffect } from "react"
import * as tf from "@tensorflow/tfjs"
import * as posedetection from "@tensorflow-models/pose-detection"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Label } from "./ui/label"
import RandomUrlGenerator from "./RandomUrlGenerator"
import { Textarea } from "./ui/textarea"
import { drawPose } from "../utils/drawing"
import { WebRTCService, type PeerEventCallbacks } from "../services/webrtc-service"
import { Loader2, Camera, CameraOff, Phone, PhoneOff, Copy, Check } from "lucide-react"

export default function VideoCall() {

  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const generateUrl = () => {
    const randomString = Math.random().toString(36).substring(2, 10);
    const newUrl = `https://example.com/${randomString}`;
    setUrl(newUrl);
    setCopied(false);
  };

  const copyToClipboard1 = async () => {
    if (url) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500); // Hide "Copied!" after 1.5s
    }
  };
  // Refs for video and canvas elements
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const localCanvasRef = useRef<HTMLCanvasElement>(null)
  const remoteCanvasRef = useRef<HTMLCanvasElement>(null)

  // State for WebRTC
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [webrtcService, setWebrtcService] = useState<WebRTCService | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected")
  const [offerSignal, setOfferSignal] = useState<string>("")
  const [answerSignal, setAnswerSignal] = useState<string>("")
  const [isCopied, setIsCopied] = useState<boolean>(false)

  // State for TensorFlow.js and MoveNet
  const [isModelLoading, setIsModelLoading] = useState<boolean>(true)
  const [detector, setDetector] = useState<posedetection.PoseDetector | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Initialize TensorFlow.js and load the MoveNet model
  useEffect(() => {
    async function setupTensorflow() {
      try {
        // First try to initialize TensorFlow.js with WebGL backend
        await tf.setBackend("webgl")
        await tf.ready()
        console.log("TensorFlow.js loaded successfully with WebGL backend")

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
        console.error("Failed to load with WebGL backend, trying CPU:", err)

        try {
          // Fall back to CPU backend
          await tf.setBackend("cpu")
          await tf.ready()
          console.log("TensorFlow.js loaded successfully with CPU backend")

          // Create the detector with CPU
          const detectorConfig = {
            modelType: posedetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
            enableSmoothing: true,
          }

          const detector = await posedetection.createDetector(posedetection.SupportedModels.MoveNet, detectorConfig)

          setDetector(detector)
          setIsModelLoading(false)
          console.log("MoveNet model loaded successfully with CPU backend")
        } catch (cpuErr) {
          console.error("Failed to load TensorFlow.js with CPU backend:", cpuErr)
          setError("Failed to load the pose detection model. Please try again or use a different browser.")
          setIsModelLoading(false)
        }
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

  // Start local webcam
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
        audio: true,
      })

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
        setLocalStream(stream)
      }
    } catch (err) {
      console.error("Error accessing webcam:", err)
      setError("Could not access your camera. Please allow camera access and try again.")
    }
  }

  // Stop local webcam
  const stopWebcam = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop())
      setLocalStream(null)

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null
      }
    }
  }

  // Initialize WebRTC as caller (create offer)
  const createOffer = () => {
    if (!localStream) {
      setError("Please start your webcam first")
      return
    }

    // Define callbacks for WebRTC events
    const callbacks: PeerEventCallbacks = {
      onSignal: (signal) => {
        const signalStr = JSON.stringify(signal)
        setOfferSignal(signalStr)
      },
      onStream: (stream) => {
        setRemoteStream(stream)
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream
        }
        setConnectionStatus("connected")
      },
      onConnect: () => {
        console.log("Peer connection established")
      },
      onClose: () => {
        setConnectionStatus("disconnected")
        setRemoteStream(null)
      },
      onError: (err) => {
        setError(`WebRTC error: ${err.message}`)
      },
    }

    // Create WebRTC service and initiate peer
    const service = new WebRTCService(callbacks)
    service.initiatePeer(localStream)
    setWebrtcService(service)
    setConnectionStatus("connecting")
  }

  // Initialize WebRTC as callee (create answer)
  const createAnswer = () => {
    if (!localStream) {
      setError("Please start your webcam first")
      return
    }

    if (!offerSignal) {
      setError("Please paste the offer signal first")
      return
    }

    try {
      // Define callbacks for WebRTC events
      const callbacks: PeerEventCallbacks = {
        onSignal: (signal) => {
          const signalStr = JSON.stringify(signal)
          setAnswerSignal(signalStr)
        },
        onStream: (stream) => {
          setRemoteStream(stream)
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = stream
          }
          setConnectionStatus("connected")
        },
        onConnect: () => {
          console.log("Peer connection established")
        },
        onClose: () => {
          setConnectionStatus("disconnected")
          setRemoteStream(null)
        },
        onError: (err) => {
          setError(`WebRTC error: ${err.message}`)
        },
      }

      // Create WebRTC service and receive peer
      const service = new WebRTCService(callbacks)
      service.receivePeer(localStream)
      service.signal(JSON.parse(offerSignal))
      setWebrtcService(service)
      setConnectionStatus("connecting")
    } catch (err) {
      setError("Invalid offer signal format")
    }
  }

  // Complete the connection by providing the answer
  const connectWithAnswer = () => {
    if (!webrtcService) {
      setError("WebRTC service not initialized")
      return
    }

    if (!answerSignal) {
      setError("Please paste the answer signal first")
      return
    }

    try {
      webrtcService.signal(JSON.parse(answerSignal))
    } catch (err) {
      setError("Invalid answer signal format")
    }
  }

  // End the call
  const endCall = () => {
    if (webrtcService) {
      webrtcService.destroy()
      setWebrtcService(null)
    }

    setConnectionStatus("disconnected")
    setRemoteStream(null)
    setOfferSignal("")
    setAnswerSignal("")
  }

  // Copy signal to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    })
  }

  // Run pose detection on video streams
  useEffect(() => {
    if (!detector || !localVideoRef.current || !localCanvasRef.current) return

    let localAnimationId: number
    let remoteAnimationId: number

    // Function to detect poses on local video
    const detectLocalPose = async () => {
      if (!detector || !localVideoRef.current || !localCanvasRef.current || !localStream) return

      try {
        // Check if video is ready for processing
        if (
          localVideoRef.current.readyState < 2 || // HAVE_CURRENT_DATA
          localVideoRef.current.videoWidth === 0 ||
          localVideoRef.current.videoHeight === 0 ||
          localVideoRef.current.paused
        ) {
          // Video not ready yet, try again in the next frame
          localAnimationId = requestAnimationFrame(detectLocalPose)
          return
        }

        // Create a canvas to draw the video frame first (this helps with WebGPU issues)
        const offscreenCanvas = document.createElement("canvas")
        offscreenCanvas.width = localVideoRef.current.videoWidth
        offscreenCanvas.height = localVideoRef.current.videoHeight
        const offscreenCtx = offscreenCanvas.getContext("2d")

        if (offscreenCtx) {
          // Draw the video frame to the offscreen canvas
          offscreenCtx.drawImage(
            localVideoRef.current,
            0,
            0,
            localVideoRef.current.videoWidth,
            localVideoRef.current.videoHeight,
          )

          // Get poses from the detector using the canvas instead of video directly
          const poses = await detector.estimatePoses(offscreenCanvas)

          // Draw the results on the visible canvas
          const ctx = localCanvasRef.current.getContext("2d")
          if (ctx) {
            // Set canvas dimensions to match video
            localCanvasRef.current.width = localVideoRef.current.videoWidth
            localCanvasRef.current.height = localVideoRef.current.videoHeight

            // Clear the canvas
            ctx.clearRect(0, 0, localCanvasRef.current.width, localCanvasRef.current.height)

            // Draw each detected pose
            poses.forEach((pose) => {
              drawPose(ctx, pose, 6, 3)
            })
          }
        }

        // Continue detection loop
        localAnimationId = requestAnimationFrame(detectLocalPose)
      } catch (err) {
        console.error("Error during local pose detection:", err)
        // Don't stop the loop on error, try again
        localAnimationId = requestAnimationFrame(detectLocalPose)
      }
    }

    // Function to detect poses on remote video
    const detectRemotePose = async () => {
      if (!detector || !remoteVideoRef.current || !remoteCanvasRef.current || !remoteStream) return

      try {
        // Check if video is ready for processing
        if (
          remoteVideoRef.current.readyState < 2 || // HAVE_CURRENT_DATA
          remoteVideoRef.current.videoWidth === 0 ||
          remoteVideoRef.current.videoHeight === 0 ||
          remoteVideoRef.current.paused
        ) {
          // Video not ready yet, try again in the next frame
          remoteAnimationId = requestAnimationFrame(detectRemotePose)
          return
        }

        // Create a canvas to draw the video frame first (this helps with WebGPU issues)
        const offscreenCanvas = document.createElement("canvas")
        offscreenCanvas.width = remoteVideoRef.current.videoWidth
        offscreenCanvas.height = remoteVideoRef.current.videoHeight
        const offscreenCtx = offscreenCanvas.getContext("2d")

        if (offscreenCtx) {
          // Draw the video frame to the offscreen canvas
          offscreenCtx.drawImage(
            remoteVideoRef.current,
            0,
            0,
            remoteVideoRef.current.videoWidth,
            remoteVideoRef.current.videoHeight,
          )

          // Get poses from the detector using the canvas instead of video directly
          const poses = await detector.estimatePoses(offscreenCanvas)

          // Draw the results on the visible canvas
          const ctx = remoteCanvasRef.current.getContext("2d")
          if (ctx) {
            // Set canvas dimensions to match video
            remoteCanvasRef.current.width = remoteVideoRef.current.videoWidth
            remoteCanvasRef.current.height = remoteVideoRef.current.videoHeight

            // Clear the canvas
            ctx.clearRect(0, 0, remoteCanvasRef.current.width, remoteCanvasRef.current.height)

            // Draw each detected pose
            poses.forEach((pose) => {
              drawPose(ctx, pose, 6, 3)
            })
          }
        }

        // Continue detection loop
        remoteAnimationId = requestAnimationFrame(detectRemotePose)
      } catch (err) {
        console.error("Error during remote pose detection:", err)
        // Don't stop the loop on error, try again
        remoteAnimationId = requestAnimationFrame(detectRemotePose)
      }
    }

    // Start pose detection if streams are available
    if (localStream) {
      detectLocalPose()
    }

    if (remoteStream) {
      detectRemotePose()
    }

    // Cleanup function
    return () => {
      if (localAnimationId) cancelAnimationFrame(localAnimationId)
      if (remoteAnimationId) cancelAnimationFrame(remoteAnimationId)
    }
  }, [detector, localStream, remoteStream])

  return (
    <div className="grid gap-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
            <svg
              className="fill-current h-6 w-6 text-red-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </span>
        </div>
      )}

      {isModelLoading && (
        <div className="flex items-center justify-center p-4 bg-blue-50 text-blue-700 rounded">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          <span>Loading MoveNet model...</span>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {/* Local Video */}
        <Card>
          <CardContent className="p-0 relative">
            <div className="relative aspect-video bg-black">
              <video
                ref={localVideoRef}
                className="absolute inset-0 w-full h-full object-contain"
                autoPlay
                playsInline
                muted
                onLoadedMetadata={() => {
                  if (localVideoRef.current) {
                    localVideoRef.current.play().catch((err) => {
                      console.error("Error playing local video:", err)
                    })
                  }
                }}
              />
              <canvas ref={localCanvasRef} className="absolute inset-0 w-full h-full object-contain z-10" />

              {!localStream && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white">
                  <p>Start your camera to begin</p>
                </div>
              )}
            </div>

            <div className="p-4 flex justify-center">
              <Button
                onClick={localStream ? stopWebcam : startWebcam}
                disabled={isModelLoading}
                className="flex items-center gap-2"
              >
                {localStream ? (
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

        {/* Remote Video */}
        <Card>
          <CardContent className="p-0 relative">
            <div className="relative aspect-video bg-black">
              <video
                ref={remoteVideoRef}
                className="absolute inset-0 w-full h-full object-contain"
                autoPlay
                playsInline
                onLoadedMetadata={() => {
                  if (remoteVideoRef.current) {
                    remoteVideoRef.current.play().catch((err) => {
                      console.error("Error playing remote video:", err)
                    })
                  }
                }}
              />
              <canvas ref={remoteCanvasRef} className="absolute inset-0 w-full h-full object-contain z-10" />

              {!remoteStream && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white">
                  <p>Remote video will appear here</p>
                </div>
              )}
            </div>

            <div className="p-4 flex justify-center">
              {connectionStatus === "connected" ? (
                <Button onClick={endCall} variant="destructive" className="flex items-center gap-2">
                  <PhoneOff className="h-4 w-4" />
                  End Call
                </Button>
              ) : (
                <Button
                  onClick={createOffer}
                  disabled={!localStream || connectionStatus === "connecting"}
                  className="flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Start Call
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* WebRTC Connection Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="newgame">Click Here For New Game</Label>

 <div className="p-4 border rounded-lg shadow-md max-w-md mx-auto mt-10 text-center">
      <button
        onClick={generateUrl}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Generate URL
      </button>

      {url && (
        <div className="mt-4">
          <p className="break-words text-blue-700 font-mono">{url}</p>
          <button
            onClick={copyToClipboard1}
            className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            Copy
          </button>
          {copied && <p className="text-sm text-green-500 mt-1">Copied!</p>}
        </div>
      )}
    </div>
              
            
              <Label htmlFor="offer">Offer Signal</Label>
              <div className="flex gap-2">
                <Textarea
                  id="offer"
                  value={offerSignal}
                  onChange={(e) => setOfferSignal(e.target.value)}
                  placeholder="Paste offer signal here..."
                  className="font-mono text-xs"
                />
                {offerSignal && (
                  <Button variant="outline" size="icon" onClick={() => copyToClipboard(offerSignal)} className="h-full">
                    {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                )}
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={createAnswer}
                  disabled={!localStream || !offerSignal || connectionStatus !== "disconnected"}
                  size="sm"
                >
                  Create Answer
                </Button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="answer">Answer Signal</Label>
              <div className="flex gap-2">
                <Textarea
                  id="answer"
                  value={answerSignal}
                  onChange={(e) => setAnswerSignal(e.target.value)}
                  placeholder="Paste answer signal here..."
                  className="font-mono text-xs"
                />
                {answerSignal && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(answerSignal)}
                    className="h-full"
                  >
                    {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                )}
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={connectWithAnswer}
                  disabled={!webrtcService || !answerSignal || connectionStatus !== "connecting"}
                  size="sm"
                >
                  Connect
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-2">How to use:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Both users: Start your camera</li>
            <li>User 1: Click "Start Call" to generate an offer signal</li>
            <li>User 1: Copy and send the offer signal to User 2</li>
            <li>User 2: Paste the offer signal and click "Create Answer"</li>
            <li>User 2: Copy and send the answer signal back to User 1</li>
            <li>User 1: Paste the answer signal and click "Connect"</li>
            <li>Once connected, pose detection will run on both video streams</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}

