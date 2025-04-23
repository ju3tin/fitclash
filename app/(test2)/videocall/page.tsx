"use client"
import VideoCall from "../../../components/video-call"
import { useState } from "react";
import "../globals.css"
import Form from "../../../components/form";
import MessageSender from "../../../components/pubnunb"

export default function Home() {
  const [isOverlayVisible, setOverlayVisible] = useState(false);

  const showOverlay = () => {
    setOverlayVisible(true);
  };

  const hideOverlay = () => {
    setOverlayVisible(false);
  };

  // Define the onSelect function
  const handleSelect = (game, betAmount, duration) => {
    console.log("Selected game:", game);
    console.log("Bet Amount:", betAmount);
    console.log("Duration:", duration);
    // You can add additional logic here if needed
    hideOverlay(); // Optionally hide the overlay after selection
  };

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50">
      {isOverlayVisible && (
        
        <Form setOverlayVisible={setOverlayVisible} onSelect={handleSelect} />
        
      )}
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">TensorFlow.js MoveNet with WebRTC</h1>
          <p className="text-gray-600">Real-time human pose estimation with peer-to-peer video calls</p>
        </div>
        <button onClick={showOverlay} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Show Overlay
        </button>
        <VideoCall />
        <div className="mt-8 text-sm text-gray-500">
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
  )
}
