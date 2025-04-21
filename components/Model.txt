import React, { useEffect, useState, useRef } from "react";
import { useFrame } from "react-three-fiber";
import * as THREE from "three";
import { Html } from "drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Object3D } from "three/src/core/Object3D"; //Object3D types
import { AnimationClip } from "three/src/animation/AnimationClip"; //Animation types

interface group {
  current: {
    rotation: {
      x: number;
      y: number;
    };
  } | null;
}

interface actions {
  current: {
    idle: {
      play: () => void;
    };
  } | null;
}

const Model = () => {
  /* Refs */
  const group: group = useRef(null);
  const actions: actions = useRef(null);

  /* State */
  const [model, setModel] = useState<Object3D | null>(null);
  const [animation, setAnimation] = useState<AnimationClip[] | null>(null);

  /* Mixer */
  const [mixer, setMixer] = useState<THREE.AnimationMixer | null>(null);

  /* Load model */
  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load("scene.gltf", async (gltf) => {
      const nodes = await gltf.parser.getDependencies("node");
      const animations = await gltf.parser.getDependencies("animation");
      setModel(nodes[0]);
      setAnimation(animations);
      
      // Initialize the mixer with the loaded model
      const newMixer = new THREE.AnimationMixer(nodes[0]);
      setMixer(newMixer);
    });
  }, []);

  /* Set animation */
  useEffect(() => {
    if (animation && mixer) {
      actions.current = {
        idle: mixer.clipAction(animation[0], group.current as Object3D),
      };
      actions.current.idle.play();
      return () => animation.forEach((clip) => mixer.uncacheClip(clip));
    }
  }, [animation, mixer]);

  /* Animation update */
  useFrame((_, delta) => {
    if (mixer) {
      mixer.update(delta);
    }
  });
  /* Rotation */
  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.01;
    }
  });

  return (
    <>
      {model ? (
        <group ref={group} position={[0, -150, 0]} dispose={null}>
          <primitive ref={group} name="Object_0" object={model} />
        </group>
      ) : (
        <Html>Loading...</Html>
      )}
    </>
  );
};

export default Model;