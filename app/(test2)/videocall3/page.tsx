"use client"
import VideoCall from "../../../components/video-call1a"
import RandomUrlGenerator from '../../../components/RandomUrlGenerator';
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function VideoCallContent() {
  const searchParams = useSearchParams();
  const [isTokenValid, setIsTokenValid] = useState(false);

  useEffect(() => {
    if (!searchParams) return;
    const token = searchParams.get('token');

    if (token) {
      console.log('Token from URL:', token);
      setIsTokenValid(true);
      // Do something with token
    } else {
      console.log('there is no token');
      setIsTokenValid(false);
    }
  }, [searchParams]);

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