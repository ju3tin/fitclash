import React, { useRef, useEffect } from 'react';
import { RendererWebGPU } from '../utils/rendererWebGPU';

const WebGPUVideoRenderer: React.FC<{ model: any }> = ({ model }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const startVideo = async () => {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        video: { width: 640, height: 480 },
                    });
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        videoRef.current.onloadedmetadata = () => {
                            videoRef.current?.play();
                        };
                    }
                } catch (err) {
                    console.error('Error accessing user media', err);
                }
            }
        };

        if (model && canvasRef.current) {
            const renderer = new RendererWebGPU(canvasRef.current, true);
            startVideo();

            const detectPose = async () => {
                if (videoRef.current && canvasRef.current) {
                    const poses = await model.estimatePoses(videoRef.current);
                    renderer.draw([videoRef.current, poses, new Float32Array([0, 0, 640, 480, canvasRef.current.width, canvasRef.current.height]), 0.5]);
                }
                requestAnimationFrame(detectPose);
            };

            detectPose();
        }
    }, [model]);

    return (
        <div>
            <video ref={videoRef} style={{ display: 'none' }} />
            <canvas ref={canvasRef} width="640" height="480" />
        </div>
    );
};

export default WebGPUVideoRenderer;
