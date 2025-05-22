"use client"
import VideoCall from "../../../components/video-call1"
import RandomUrlGenerator from '../../../components/RandomUrlGenerator';


export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
      <div className="mb-8 text-center flex flex-col items-center">
        <img src="/images/logo1.png" width="20%" className="w-1/5" />
        <h1 className="text-gray-600">Test Your Fitness Against Your Friends with Our Games</h1>
        <h2 className="text-gray-600">Click The Button Below To Start.</h2>
       
          <p>
            <button
            
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 flex items-center"
            >
              <img src="/images/gameicon.svg" alt="My Icon" className="w-5 h-5 mr-2" />
              Start game
            </button>
          </p>
        
      </div>

        <VideoCall />
<RandomUrlGenerator />
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