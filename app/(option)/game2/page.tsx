"use client";
import FAQ from "../../../components/faq";
import NetworkStatus from "../../../components/NetworkStatus";
import { useEffect, useRef, useState } from "react";

// Hook to get screen orientation
const useOrientation = () => {
  const [orientation, setOrientation] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && screen.orientation) {
      setOrientation(screen.orientation.type);

      const handleOrientationChange = () => {
        setOrientation(screen.orientation.type);
      };

      screen.orientation.addEventListener("change", handleOrientationChange);
      window.addEventListener("resize", handleOrientationChange);

      return () => {
        screen.orientation.removeEventListener("change", handleOrientationChange);
        window.removeEventListener("resize", handleOrientationChange);
      };
    }
  }, []);

  return orientation;
};

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [videoSize, setVideoSize] = useState({ width: 640, height: 480 });
  const orientation = useOrientation();

  // Update video size when metadata is loaded
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

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
      {/* Hidden Video Element */}
      <div className="hidden">
        <NetworkStatus />
        <video ref={videoRef} className="input_video" autoPlay playsInline style={{ display: "none" }}></video>
      </div>

      {/* Canvas Container */}
      <div className="flex items-center justify-center min-h-screen w-full">
        <p className="absolute top-5 z-50 text-white bg-black p-2 rounded">
          Current Orientation: {orientation}
        </p>
        <canvas
          ref={canvasRef}
          id="canvasstart"
          className="output_canvas"
          style={{
            width: videoSize.width > videoSize.height ? "100%" : `${videoSize.width}px`,
            height: videoSize.width > videoSize.height ? `${videoSize.height}px` : "100%",
            border: "1px solid red",
          }}
        ></canvas>
      </div>

      {/* Loading Spinner */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading">
          <div className="spinner"></div>
          <div className="message">Loading</div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="flex flex-col items-center justify-center mt-5">
        <a className="text-blue-500" href="https://github.com/baoanh1310/pose_demo" target="_blank">
          Click here for more info
        </a>
      </div>
    </>
  );
}