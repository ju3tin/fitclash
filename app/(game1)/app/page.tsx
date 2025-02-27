"use client" 
import Image from "next/image";
import Footer from "../../../components/footer1";
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client'; // Import the io function
import confetti from 'canvas-confetti'; // Import the confetti function
import * as tf from '@tensorflow/tfjs'; // Import TensorFlow.js
import * as poseDetection from '@tensorflow-models/pose-detection'; // Import Pose Detection
import { Pose } from '@mediapipe/pose'; // Import the Pose class

export default function Home() {



  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto'}}>
        <div>
          <div>
      <video id="local-video" autoPlay muted></video>
      </div>
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