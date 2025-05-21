"use client"

import { useRef, useState, useEffect } from "react"
import GameIcon from '../assets/gameicon.svg'; // Path to your SVG file
//import MessageSender from './pubnunb';
//import { useSearchParams } from 'next/navigation'
//import clientPromise from '../lib/mongodb';
//import client from "../lib/mongodb";
//import { GetServerSideProps } from 'next';
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";

//import MessageSender from "./pubnunb"

//import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import * as tf from "@tensorflow/tfjs"
import * as posedetection from "@tensorflow-models/pose-detection"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Label } from "./ui/label"
//import RandomUrlGenerator from "./RandomUrlGenerator"
import { Textarea } from "./ui/textarea"
import { drawPose } from "../utils/drawing"
import { WebRTCService, type PeerEventCallbacks } from "../services/webrtc-service"
import { Loader2, Camera, CameraOff, Phone, PhoneOff, Copy, Check, Wallet2 } from "lucide-react"
import PubNub from 'pubnub';
import { useSearchParams } from 'next/navigation';

interface VideoCallProps {
  onSelect: (room: any, game: any, betAmount: number, duration: { hours: number; minutes: number; seconds: number }) => void;
  selectedGameData: {
    game: any;
    betAmount: number;
    duration: { hours: number; minutes: number; seconds: number };
  } | null;
  gameFromUrl: string | null;
  setSelectedGameData: (data: any) => void;
  hideOverlay: () => void;
}

const generateRandomUUID = () => {
  return 'user-' + Math.random().toString(36).substring(2, 10);
};

interface GameSessionData {
  room: string;
  game: any; // Replace 'any' with the actual type of your game object if known
  betAmount: number;
  duration: { hours: number; minutes: number; seconds: number };
  offer: string;
  timestamp: string;
  offerread: string; 
}
interface gameFromUrl {
  gameFromUrl: string | null;
}
export default function VideoCall({ onSelect, selectedGameData, gameFromUrl, setSelectedGameData, hideOverlay }: VideoCallProps) {
  console.log("Game from URL:", gameFromUrl);



  

  //pubnub
  const [message, setMessage] = useState('');
  const [randomString, setRandomString] = useState(Math.random().toString(36).substring(2, 10));
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
  const [channel, setChannel] = useState('dodgy');
  const [pubnub, setPubnub] = useState<PubNub | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  // videostart

  const searchParams = useSearchParams()
  if (searchParams){
  const search = searchParams.get('game')
  }
  const startLocalStream = async (): Promise<MediaStream> => {
    console.log("Starting local stream...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
        audio: true,
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        setLocalStream(stream);
      }
      
      return stream; // Return the stream
    } catch (err) {
      console.error("Error accessing webcam:", err);
      setError("Could not access your camera. Please allow camera access and try again.");
      throw err; // Optionally rethrow the error
    }
  };



  
  const sendGameSessionToAPI = async ( data: GameSessionData) => {
    try {
      // If there's no game URL (assuming this is what you meant by your opening line)
      if (!gameFromUrl) {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
    
        console.log('this is my offer' + data.offerread); // Consider clarifying this log
    
        const raw = JSON.stringify({
          room: data.room,
          offerUpdated: "true",
          offer: data.offer,
        });
    
        const requestOptions: RequestInit = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };
    
        const response = await fetch("/api/room", requestOptions);
        const result = await response.text();
        console.log(result);
    
        if (data) {
          const newUrl4 = `https://fitclash.vercel.app/videocall?game=${data.room}`;
          setUrl(newUrl4);
          setCopied(false);
        } else {
          console.error("Data is not available.");
        }
      }else{
        console.log(
          `I have a game url dude cant you see`
        )
     

        const requestOptions: RequestInit = {
          method: "GET",
          redirect: "follow",
        };
        



        fetch(`/api/room?room=${gameFromUrl}`, requestOptions)
          .then((response11) => response11.text())
          .then((result11) => console.log(result11))
          .catch((error) => console.error(error));

        //  const response11 = await fetch(`https://fitclash.vercel.app/api/room?room=${gameFromUrl}`, requestOptions);
       //   const result11 = await response11.text();
       //   console.log(result11);

      }
    } catch (err: any) {
      console.error("Error sending session:", err.message);
      setError("Error sending session data.");
    }
    
  };
  

  useEffect(() => {
    if (!selectedGameData) return;
  
    const startProcess = async () => {
      console.log("Game selected, starting stream...");
  
      try {
        const stream = await startLocalStream(); // Await the actual stream
        setLocalStream(stream); // Make sure you store it in state
  
        setTimeout(() => {
          if (!stream) {
            setError("Please start your webcam first");
            return;
          }
  
          console.log("Creating offer after 2s delay...");
  
          const callbacks: PeerEventCallbacks = {
            onSignal: async (signal) => {
              try {
                let signalStr: any;
            
                if (!gameFromUrl) {
                  signalStr = JSON.stringify(signal);
                } else {
                  const requestOptions = {
                    method: "GET",
                    redirect: "follow" as RequestRedirect,
                  };
                  const url = `/api/room?room=${gameFromUrl}&game=dsfsfd`;

                  fetch(url, requestOptions)
                    .then((response) => response.text())
                    .then((result) => {
                      console.log("the rest the just in "+result);
                    })

                    
            
                  const response11 = await fetch(`/api/room?room=${gameFromUrl}`, requestOptions);
                  const result11 = await response11.json()
                  console.log("this is your answer please get it right "+result11.data);
                  signalStr = result11.data.offer;
                }
            
                setOfferSignal(signalStr);
            
                if (selectedGameData) {
                  sendGameSessionToAPI({
                    room: randomString,
                    game: selectedGameData.game,
                    betAmount: selectedGameData.betAmount,
                    duration: selectedGameData.duration,
                    offerread: signalStr,
                    offer: signal,
                    timestamp: new Date().toISOString(),
                  });
                }
              } catch (error) {
                console.error("Error in onSignal handler:", error);
              }
              try {
                let signalStr: any;
              
                if (!gameFromUrl) {
                  signalStr = JSON.stringify(signal);
                } else {
                  const response11 = await fetch(`/api/room?room=${gameFromUrl}`);
                  const result11 = await response11.json(); // <- parse as JSON, not text
                  console.log("Full response:", result11.data);
              
                  // Extract just the offer
                  if (result11.success && result11.data && result11.data.offer) {
                    signalStr = JSON.stringify(result11.data.offer);
                  console.log('this is for the user')
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
                    if (localStream) {
                    service.receivePeer(localStream)
                  }
                    service.signal(JSON.parse(offerSignal))
                    setWebrtcService(service)
                    setConnectionStatus("connecting")
                  } catch (err) {
                    setError("Invalid offer signal format")
                  }
                   // setAnswerSignal(signalStr);
                  } else {
                    throw new Error("Offer not found in response");
                  }
                }
              
                setOfferSignal(signalStr);
                
                if (gameFromUrl){
                  const offerSignal = signalStr
                  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                  .then((stream) => {
                    setLocalStream(stream); // ✅ this must happen
                    if (localVideoRef.current) {
                      localVideoRef.current.srcObject = stream;
                    }
                  })
                  .catch((err) => {
                    console.error("Failed to get media stream:", err);
                    setError("Could not access webcam");
                  });
                
                  if (!localStream) {
                //     setError("Please start your webcam first")
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
              } catch (err) {
                console.error("Error in onSignal:", err);
              }
              


            },
            
            onStream: (stream) => {
              setRemoteStream(stream);
              if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = stream;
              }
              setConnectionStatus("connected");
            },
            onConnect: () => {
              console.log("Peer connection established");
            },
            onClose: () => {
              setConnectionStatus("disconnected");
              setRemoteStream(null);
            },
            onError: (err) => {
              setError(`WebRTC error: ${err.message}`);
            },
          };
  
          const service = new WebRTCService(callbacks);
          service.initiatePeer(stream); // Use the guaranteed stream
          setWebrtcService(service);
          setConnectionStatus("connecting");
  
        }, 2000); // 2-second delay
  
      } catch (err) {
        setError("Failed to start webcam: " + err.message);
      }
    };
  
    startProcess();
 //   generateUrl1(selectedGameData);
  }, [selectedGameData, gameFromUrl]);
  useEffect(() =>{

    //if (gameFromUrl) return
   
const dude34 = async () => {
      
      if (searchParams){
        const search1 = searchParams.get('game')
        const response11 = await fetch(`/api/room?room=${search1}`);
        const result11 = await response11.json();
        console.log("we are doing the dam thing", result11.data.offer);

        try {
          // Define callbacks for WebRTC events
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user", width: 640, height: 480 },
            audio: true,
          })
    
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream
            setLocalStream(stream)
          }
      
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
          service.receivePeer(stream)
          service.signal(JSON.parse(offerSignal))
          setWebrtcService(service)
          setConnectionStatus("connecting")
        } catch (err) {
          setError("Invalid offer signal format")
        }
        
        console.log('dude please work123')
      }else{
        console.log('this is not working')
      }
    

}
dude34()
  },[gameFromUrl])
  
  useEffect(() => {

  }, [])
  //end

  useEffect(() => {
    const uuid = generateRandomUUID();

    const pn = new PubNub({
      publishKey: 'pub-c-69da0173-9e37-484b-9136-1c6fd880cfcd',
      subscribeKey: 'sub-c-2a6e471a-96d9-11e9-ab0f-d62d90a110cf',
      uuid,
    });

    pn.addListener({
      message: (event) => {
        const message = event.message as { text: string; sender: string };
        setMessages((prev) => [...prev, message]);
      },
    });

    pn.subscribe({ channels: [channel] });
    setPubnub(pn);

    return () => {
      pn.unsubscribeAll();
    };
  }, [channel]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!message || !pubnub || !channel) {
      console.error("Message, PubNub instance, or channel is missing");
      return;
    }

    const senderUUID = Wallet2+''; // Call the method to get the UUID as a string

    pubnub.publish(
      {
        channel,
        message: { text: message, sender: senderUUID }, // Use the retrieved UUID
      },
      (status) => {
        if (status.error) {
          console.error('PubNub Publish Error:', status);
        } else {
          setMessage('');
        }
      }
    );
  };



  //end of pubnub

  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [done2, done2d] = useState(false)

  const generateUrl = () => {
   
    const newUrl = `https://fitclash.vercel.app/videocall?game=${randomString}`;
    setUrl(newUrl);
    setCopied(false);
    done2d(true);
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
      generateUrl()
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
      onSignal: async (signal) => {
        try {
          let signalStr: any;
        
          if (!gameFromUrl) {
            signalStr = JSON.stringify(signal);
          } else {
            const response11 = await fetch(`/api/room?room=${gameFromUrl}`);
            const result11 = await response11.json(); // <- parse as JSON, not text
            console.log("Full response:", result11);
            // Extract just the offer
            if (result11.success && result11.data && result11.data.offer) {
              signalStr = JSON.stringify(result11.data.offer);
              setOfferSignal(signalStr);
            } else {
              throw new Error("Offer not found in response");
            }
          }
        
          setOfferSignal(signalStr);
        } catch (err) {
          console.error("Error in onSignal:", err);
        }
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
  const createAnswer1 = () => {
    if (!localStream) {
    //  setError("Please start your webcam first")
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

  const generateUrl1 = (data: GameSessionData) => {
    if (data) {
      const newUrl4 = `https://fitclash.vercel.app/videocall?game=${data.room}`;
      setUrl(newUrl4);
      setCopied(false);
    } else {
      console.error("Data is not available.");
    }
  };

  useEffect(() => {
    if (selectedGameData) {
     setChannel(randomString);
    }
  }, [selectedGameData]);

  const handleSelect = (game, betAmount, duration, room) => {
    const data5 = {
      game,
      betAmount,
      duration,
      room,
    };

    console.log("Selected game:", game);
    console.log("Bet Amount:", betAmount);
    console.log("Duration:", duration);
    setSelectedGameData(data5);
    hideOverlay();
  };

  // Effect to set randomString based on gameFromUrl
  useEffect(() => {
    if (gameFromUrl) {
      setRandomString(gameFromUrl); 
      setChannel(gameFromUrl); // Set channel to gameFromUrl if it's not null

    } else {
      setChannel('randomString'); // Ensure channel is set to randomString
    }
  }, [gameFromUrl]);

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
                   <img src="/images/gameicon.svg" alt="My Icon" className="w-6 h-6" />
                    Start Game
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
      <div className="p-4 border rounded space-y-4 max-w-md w-full">
      <div className="h-64 overflow-y-auto border rounded p-2 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-2">
            <span className="font-semibold">{msg.sender}: </span>
            <span>{msg.text}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="w-full border rounded p-2"
      />
      <button
        onClick={sendMessage}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Send Message
      </button>
    </div> 
    <div className="p-4 border rounded space-y-4 max-w-md w-full">

{/* 
lets win
<MessageSender />
*/}


    </div>
      {/* WebRTC Connection Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-4">
          <div className="grid gap-2">
  <Label htmlFor="newgame">Click Here For New Game</Label>


    {url && (
    <>
        <p className="text-blue-700 font-mono text-sm break-words">{url}</p>
        <button
          onClick={copyToClipboard1}
          className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 w-fit"
        >
          Copy
        </button>
        {copied && <p className="text-xs text-green-500">Copied!</p>}
        </>
    )}
  

  <Label htmlFor="offer">Offer Signal</Label>
  <div className="flex gap-2">
    <Textarea
      id="offer"
      value={offerSignal}
      onChange={(e) => setOfferSignal(e.target.value)}
      placeholder="Paste offer signal here..."
      className="font-mono text-xs flex-1"
    />
    {offerSignal && (
      <Button
        variant="outline"
        size="icon"
        onClick={() => copyToClipboard(offerSignal)}
        className="h-full"
      >
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
      
    </div>
  )
}

