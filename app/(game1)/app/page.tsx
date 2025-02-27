"use client" 
import Image from "next/image";
import Footer from "../../../components/footer1";
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client'; // Import the io function
import confetti from 'canvas-confetti'; // Import the confetti function
import * as tf from '@tensorflow/tfjs'; // Import TensorFlow.js
import * as poseDetection from '@tensorflow-models/pose-detection'; // Import Pose Detection
import { Pose } from '@mediapipe/pose'; // Import the Pose class

const socket = io('https://your-signaling-server-url'); // Replace with your signaling server URL

export default function Home() {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    const peerConnection = new RTCPeerConnection();

    // Get local media stream
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        localVideoRef.current!.srcObject = stream;
        stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
      });

    // Handle incoming tracks
    peerConnection.ontrack = (event) => {
      remoteVideoRef.current!.srcObject = event.streams[0];
    };

    // Signaling channel message handling
    socket.on('message', async (message) => {
      if (message.offer) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.emit('message', { answer });
      } else if (message.answer) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(message.answer));
      } else if (message.iceCandidate) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(message.iceCandidate));
      }
    });

    // ICE candidate handling
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('message', { iceCandidate: event.candidate });
      }
    };

    peerConnectionRef.current = peerConnection;

    return () => {
      peerConnection.close();
    };
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto'}}>
        <div>
          <div>
          <video ref={localVideoRef} autoPlay muted />
      </div><div>
      <video ref={remoteVideoRef} autoPlay />  </div>
      <div>
      <input type="text" id="room-input" />
      </div>
      <div>
      </div>
    </div>
        </div>
     
      
      </main>
  <Footer />
    </div>
  );
}