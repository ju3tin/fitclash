"use client"
import VideoCall from "../../../components/video-call1a"
import RandomUrlGenerator from '../../../components/RandomUrlGenerator';
import { useSearchParams } from "next/navigation";
import { io } from "socket.io-client";
import { useEffect, useState, Suspense } from "react";
import axios from 'axios';
function VideoCallContent() {
  const searchParams = useSearchParams();
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [webrtc, setWebrtc] = useState(false);
  const [socket, setSocket] = useState(null);
  const [room, setRoom] = useState(null);
  const [peer, setPeer] = useState(null);
  const [stream, setStream] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isDisconnected, setIsDisconnected] = useState(false);
  const [player1, setPlayer1] = useState<string | null>(null);
  const [player2, setPlayer2] = useState<string | null>(null);
  const [isPlayer1, setIsPlayer1] = useState(false);
  const [isPlayer2, setIsPlayer2] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [isClient, setIsClient] = useState(false);
  

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const response = await axios.get('/api/apicall1');
        console.log(response.data);

        // Stop polling if status is 200
        if (response.status === 200) {
          clearInterval(intervalId);
          setWebrtc(true);
          console.log('Polling stopped: Status 200 received');
        }
      } catch (error) {
        console.error('API error:', error);
      }
    }, 1000);

    // Cleanup on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (webrtc) {
      console.log('Webrtc is true');
      const socket = io('https://webrtcsocket.onrender.com');
      socket.on('connect', () => {
        console.log('Connected to server');
      });
    }
  }, [webrtc]);

  useEffect(() => {
    if (!searchParams) return;
    const token = searchParams.get('token');

    if (token) {
      console.log('Token from URL:', token);
      setIsTokenValid(true);
      // Do something with token
      setIsPlayer2(true);
      setPlayer2('player2');
      console.log('i am', player2);
    } else {
      setIsPlayer1(true);
      setPlayer1('player1');
      console.log('i am', player1);
      console.log('there is no token');
      setIsTokenValid(false);
    }
  }, [searchParams, player1, player2]);

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
        <div className="mb-8 text-center flex flex-col items-center">
        <img src="/images/logo1.png" width="20%" className="w-1/5" />
        <h1 className="text-gray-600">Test Your Fitness Against Your Friends with Our Games</h1>
      
        
      </div>
          <p style={{display:'none'}} className="text-gray-600">Token Status: {isTokenValid ? "Valid" : "Invalid"}</p>
        </div>

        <VideoCall searchParams={searchParams} isTokenValid={isTokenValid} />
       
        <div style={{display:'none'}} className="mt-8 text-sm text-gray-500">
          <h2 className="font-medium text-lg mb-2">About This Demo</h2>
          <p className="mb-2">
            This application combines TensorFlow.js MoveNet for pose detection with WebRTC for peer-to-peer video
            communication. All processing happens in your browser - no data is sent to any server.
          </p>
          <p>
            MoveNet detects 17 keypoints of a body and works best when the subject is standing upright and facing the
            camera.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VideoCallContent />
    </Suspense>
  );
}