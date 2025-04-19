"use client"
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three';

function Model() {
  const gltf = useGLTF('/assets/mesh/BoxingGym-draco.gltf');
  return <primitive object={gltf.scene} />;
}

export default function GLTFViewerPage() {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Canvas
        camera={{ position: [0, 1.5, 3], fov: 60 }}
        shadows
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Model />
        </Suspense>
        <OrbitControls enableDamping />
      </Canvas>
    </div>
  );
}
