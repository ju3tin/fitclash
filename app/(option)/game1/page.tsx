
"use client"
import FAQ from '../../../components/faq';
import NetworkStatus from '../../../components/NetworkStatus';
import { useEffect, useRef, useState } from "react";

export default function Home() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [videoSize, setVideoSize] = useState({ width: 640, height: 480 });
  

    useEffect(() => {
        const video = videoRef.current;

        if (!video) return;

        // Wait until video metadata is loaded
        const handleLoadedMetadata = () => {
            setVideoSize({
                width: video.videoWidth || 640,
                height: video.videoHeight || 480,
            });
        };

        video.addEventListener("loadedmetadata", handleLoadedMetadata);

        return () => {
            video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        };
    }, []);
    return (
        <>
      <div style={{display:'none'}} className="container flex items-center justify-center min-h-screen">
            <NetworkStatus />
         {/* Hidden video element */}
      <video
        ref={videoRef}
        style={{ display: "none" }}
        className="input_video"
        autoPlay
        playsInline
      ></video>

      {/* Canvas that matches the video size */}
    </div>
    <div style={{width:'100%', margin:'auto'}} className="container flex items-center justify-center min-h-screen">
  <canvas
    id="canvasstart"
    className="output_canvas"
    style={{
      width: `${videoSize.width}px`,
      height: "100%",
      border: "1px solid red",
    }}
  ></canvas>
</div>
    
    <div className="container flex items-center justify-center min-h-screen">
       <div className="loading">
            <div className="spinner"></div>
            <div className="message">
                Loading
            </div>
        </div>
        <a className="abs logo" href="https://github.com/baoanh1310/pose_demo" target="_blank">
            <div style={{ }}>
                <img className="logo" src="logo_white.png" alt="" style={{}} />
                <span className="title">Group 02 - AI Project</span>
            </div>
        </a>
        <div className="shoutout">
            <div>
                <a href="https://github.com/baoanh1310/pose_demo">
                    Click here for more info
                </a>
            </div>
        </div>
    </div>
    <div className="control-panel">
    </div>
    </>
    );
}