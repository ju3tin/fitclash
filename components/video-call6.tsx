"use client"


import { useRef, useState, useEffect } from "react"
import axios from 'axios';
import GameIcon from '../assets/gameicon.svg'; // Path to your SVG file
//import MessageSender from './pubnunb';
//import { useSearchParams } from 'next/navigation'
//import clientPromise from '../lib/mongodb';
//import client from "../lib/mongodb";
//import { GetServerSideProps } from 'next';
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";

//import MessageSender from "./pubnunb"

//import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import * as tf from "@tensorflow/tfjs"
import * as posedetection from "@tensorflow-models/pose-detection"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Label } from "./ui/label"
//import RandomUrlGenerator from "./RandomUrlGenerator"
import { Textarea } from "./ui/textarea"
import { drawPose } from "../utils/drawing"
import { WebRTCService, type PeerEventCallbacks } from "../services/webrtc-service"
import { Loader2, Camera, CameraOff, Phone, PhoneOff, Copy, Check, Wallet2 } from "lucide-react"
import PubNub from 'pubnub';
import { useSearchParams } from 'next/navigation';

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface GLBLoaderProps {
  modelPath: string;
  width?: number;
  height?: number;
  backgroundColor?: string;
  autoRotate?: boolean;
}


interface VideoCallProps {
  onSelect: (room: any, game: any, betAmount: number, duration: { hours: number; minutes: number; seconds: number }) => void;
  selectedGameData: {
    game: any;
    betAmount: number;
    duration: { hours: number; minutes: number; seconds: number };
  } | null;
  gameFromUrl: string | null;
  setSelectedGameData: (data: any) => void;
  hideOverlay: () => void;
}

const generateRandomUUID = () => {
  return 'user-' + Math.random().toString(36).substring(2, 10);
};

interface GameSessionData {
  room: string;
  game: any; // Replace 'any' with the actual type of your game object if known
  betAmount: number;
  duration: { hours: number; minutes: number; seconds: number };
  offer: string;
  timestamp: string;
  offerread: string; 
}
interface gameFromUrl {
  gameFromUrl: string | null;
}

const ThreeScene: React.FC<GLBLoaderProps> = ({ 
  modelPath, 
  width = 400, 
  height = 400, 
  backgroundColor = '#f0f0f0',
  autoRotate = true 
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(backgroundColor);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 2);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 2.0;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Load GLB model
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;
        
        // Center the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        
        // Scale model to fit in view
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxDim;
        model.scale.setScalar(scale);
        
        // Enable shadows for all meshes
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        
        scene.add(model);
        setLoading(false);
      },
      (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
      },
      (error) => {
        console.error('Error loading GLB file:', error);
        setError('Failed to load model');
        setLoading(false);
      }
    );

    // Add to DOM
    mountRef.current.appendChild(renderer.domElement);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

     

    // Cleanup
    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [modelPath, width, height, backgroundColor, autoRotate]);

  return (
    <div 
      ref={mountRef} 
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
        border: '1px solid #ccc',
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative'
      }} 
    >
      {loading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#666',
          fontSize: '14px'
        }}>
          Loading...
        </div>
      )}
      {error && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#ff4444',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}
    </div>
  );
};

// Multiple GLB Loaders Component
export default function MultipleGLBLoaders({ onSelect, selectedGameData, gameFromUrl, setSelectedGameData, hideOverlay }: VideoCallProps) {
  const [models, setModels] = useState([
    { id: 1, path: '/models/glb1/model1.glb', name: 'Model 1' },
    { id: 2, path: '/models/glb2/model2.glb', name: 'Model 2' }
  ]);

  const addModel = () => {
    const newId = models.length + 1;
    setModels([...models, { 
      id: newId, 
      path: `/models/glb${newId}/model${newId}.glb`, 
      name: `Model ${newId}` 
    }]);
  };

  const removeModel = (id: number) => {
    setModels(models.filter(model => model.id !== id));
  };

  return (
    <div style={{ textAlign: 'center' }}
   >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => (
          <div key={model.id} className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">{model.name}</h3>
             
            </div>
            <ThreeScene
              modelPath={model.path}
              width={300}
              height={250}
              backgroundColor="#f8f9fa"
              autoRotate={false}
            />
            <p className="text-sm text-gray-600 mt-2">{model.path}</p>
          </div>
        ))}
      </div>
    </div>
  );
};