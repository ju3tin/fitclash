
"use client"
import FAQ from '../../../components/faq';
import NetworkStatus from '../../../components/NetworkStatus';
import { useEffect, useRef, useState } from "react";

const useOrientation = () => {
    const [orientation, setOrientation] = useState<string | null>(null);
  
    useEffect(() => {
      if (typeof window !== "undefined" && screen.orientation) {
        setOrientation(screen.orientation.type);
  
        const handleOrientationChange = () => {
          setOrientation(screen.orientation.type);
        };
  
        screen.orientation.addEventListener("change", handleOrientationChange);
  
        return () => {
          screen.orientation.removeEventListener("change", handleOrientationChange);
        };
      }
    }, []);
  
    return orientation;
  };

export default function Home() {
    
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [videoSize, setVideoSize] = useState({ width: 640, height: 480 });
    const [orientation, setOrientation] = useState<string | null>(null);

    const orientation1 = useOrientation();

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
      <div style={{display:'none', width: '0px', height:'0px'}} className="container flex items-center justify-center min-h-screen">
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
    <p style={{zIndex:'3000', position:'fixed'}}>Current Orientation: {orientation1}</p>
  <canvas
  id="canvasstart"
  className="output_canvas"
  width={videoSize.width}
  height={videoSize.height}
  style={{
    width: videoSize.width < videoSize.height ? `${videoSize.width}px` : "100%",
    height: videoSize.width > videoSize.height ? "100%" :`${videoSize.height}px`,
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