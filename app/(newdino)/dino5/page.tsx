'use client';
import { useRef, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Suspense } from "react";
import Script from 'next/script';
import Header from "../../../components/header";
import { SolanaProvider } from "../../../components/solanaprovider";


export default function DinoGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const scoreRef = useRef(0);

  const { connected } = useWallet();

  useEffect(() => {
    if (!isRunning) return;
  
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    const dinoImage = new Image();
    dinoImage.src = '/images/trashguy.png'; // Path to your dino image
  
    const obstacleImage = new Image();
    obstacleImage.src = '/images/gor.png'; // Path to your obstacle image
  
    const dino = { x: 50, y: 200, width: 100, height: 100, velocity: 0, gravity: 0.6, jumping: false };
    const obstacles: { x: number; width: number; }[] = [];
    let obstacleTimer = 0;
    let animationFrameId: number;
    let frameCount = 0;
  
    const jump = () => {
      if (!dino.jumping) {
        dino.velocity = -12;
        dino.jumping = true;
      }
    };
  
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') jump();
    };
  
    document.addEventListener('keydown', handleKeyDown);
  
    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      // Draw ground
      ctx.fillStyle = '#444';
      ctx.fillRect(0, canvas.height - 10, canvas.width, 10);
  
      // Draw Dino as image
      ctx.drawImage(dinoImage, dino.x, dino.y, dino.width, dino.height);
  
      // Update Dino position
      dino.velocity += dino.gravity;
      dino.y += dino.velocity;
      if (dino.y >= 200) {
        dino.y = 200;
        dino.jumping = false;
      }
  
      // Handle obstacles
      obstacleTimer++;
      if (obstacleTimer > 100) {
        obstacles.push({ x: canvas.width, width: Math.random() * 20 + 20 });
        obstacleTimer = 0;
      }
  
      for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= 6;
  
        // Draw obstacle as image
        ctx.drawImage(obstacleImage, obstacles[i].x, 250, obstacles[i].width, 70);
  
        // Check collision
        if (
          dino.x < obstacles[i].x + obstacles[i].width &&
          dino.x + dino.width > obstacles[i].x &&
          dino.y + dino.height > 250
        ) {
          setIsRunning(false);
          setGameOver(true);
          setHighScore(prev => (scoreRef.current > prev ? scoreRef.current : prev));
          document.removeEventListener('keydown', handleKeyDown);
          cancelAnimationFrame(animationFrameId);
          return;
        }
      }
  
      // Update score
      if (frameCount % 5 === 0) {
        scoreRef.current += 1;
        setScore(scoreRef.current);
      }
      frameCount++;
  
      animationFrameId = requestAnimationFrame(gameLoop);
    };
  
    animationFrameId = requestAnimationFrame(gameLoop);
  
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isRunning]);

  const resetGame = () => {
    scoreRef.current = 0;
    setScore(0);
    setGameOver(false);
    setIsRunning(true);
  };

  if (!connected) {
    return (
      <>
      <Script src="/assets/js/index1.js" strategy="beforeInteractive" />
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
      <Script src="/assets/js/index1.js" strategy="beforeInteractive" />

<div id="t" className="offline">
  <div style={{display:'none'}} className="topright">Top Right</div>

  <video id="video" playsInline autoPlay muted></video>
  <canvas id="canvas"></canvas>

 

  <div id="main-frame-error" className="interstitial-wrapper">
    <div id="main-content">
      <div className="icon icon-offline" />
    </div>

 
  </div>
 {/*  <div dangerouslySetInnerHTML={{ __html: htmlContent }} /> */}
  <div id="info1">Info Text</div>
  <Script src="/assets/js/2nd.js" strategy="afterInteractive" />
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs" />
<script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection" />
  <Script src="/assets/js/1st.js" strategy="afterInteractive" />
</div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <h1 className="text-3xl font-bold mb-4">Connect Your Solana Wallet to Play</h1>
        <WalletMultiButton />
      </div>
      </Suspense>
      </>
    );
  }

  return (
    <>
    <Header />
    <link rel="stylesheet" href="/assets/css/index1.css" />
    <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" />
     
    <Suspense fallback={<div>Loading...</div>}>
    
<div id="t" className="offline">
  <div style={{display:'none'}} className="topright">Top Right</div>

  <video id="video" playsInline autoPlay muted></video>
  <canvas id="canvas"></canvas>

 

 {/*  <div dangerouslySetInnerHTML={{ __html: htmlContent }} /> */}
  <div style={{display:'none'}} id="info1">Info Text</div>
  <Script src="/assets/js/2nd.js" strategy="afterInteractive" />
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs" />
<script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection" />
  <Script src="/assets/js/1st.js" strategy="afterInteractive" />
</div>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Chrome Dino Game</h1>
      <canvas ref={canvasRef} width={800} height={300} className="border border-black" />

      <div className="mt-4 text-xl">Score: {score}</div>
      <div className="mt-2 text-xl">High Score: {highScore}</div>

      {!isRunning && !gameOver && (
        <button onClick={() => setIsRunning(true)} className="mt-4 px-4 py-2 bg-black text-white rounded">
          Start Game
        </button>
      )}

      {gameOver && (
        <div className="flex flex-col items-center">
          <div className="text-2xl font-bold text-red-600 mt-4">Game Over!</div>
          <button onClick={resetGame} className="mt-4 px-4 py-2 bg-black text-white rounded">
            Restart Game
          </button>
        </div>
      )}
    </div>   
<Script src="/assets/js/2nd.js" strategy="afterInteractive" />
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs" />
<script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection" />
<Script src="/assets/js/1st.js" strategy="afterInteractive" />
    </Suspense>
    <style jsx global>{`
         #video {
            position: absolute;
            top: 0;
            left: 0;
            width: 440px;
            height: 280px;
        }
        #canvas {
            position: absolute;
            top: 0;
            left: 0;
            width: 440px;
            height: 280px;
        }
        .topright {
        position: absolute;
        top: 0px;
        right: 16px;
        font-size: 18px;
        }
        #info1 {
        position: absolute;
        bottom: 20px; /* Position 20px from the bottom */
        left: 50%; /* Center horizontally */
        transform: translateX(-50%); /* Adjust for centering */
        color: rgb(0, 0, 0); /* Text color */
        font-size: 24px; /* Font size */
        text-align: center; /* Center text */
    }
    
    /* Copyright 2013 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file. */

html, body {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}

.icon {
  -webkit-user-select: none;
  user-select: none;
  display: inline-block;
}

.icon-offline {
  content: -webkit-image-set( url(assets/default_100_percent/100-error-offline.png) 1x, url(assets/default_200_percent/200-error-offline.png) 2x);
  position: relative;
}

.hidden {
  display: none;
}


/* Offline page */

.offline .interstitial-wrapper {
  color: #2b2b2b;
  font-size: 1em;
  line-height: 1.55;
  margin: 0 auto;
  max-width: 600px;
  padding-top: 100px;
  width: 100%;
}

.offline .runner-container {
  height: 150px;
  max-width: 600px;
  overflow: hidden;
  position: absolute;
  top: 35px;
  width: 44px;
}

.offline .runner-canvas {
  height: 150px;
  max-width: 600px;
  opacity: 1;
  overflow: hidden;
  position: absolute;
  top: 0;
  z-index: 2;
}

.offline .controller {
  background: rgba(247, 247, 247, .1);
  height: 100vh;
  left: 0;
  position: absolute;
  top: 0;
  width: 100vw;
  z-index: 1;
}

#offline-resources {
  display: none;
}

@media (max-width: 420px) {
  .suggested-left > #control-buttons, .suggested-right > #control-buttons {
    float: none;
  }
  .snackbar {
    left: 0;
    bottom: 0;
    width: 100%;
    border-radius: 0;
  }
}

@media (max-height: 350px) {
  h1 {
    margin: 0 0 15px;
  }
  .icon-offline {
    margin: 0 0 10px;
  }
  .interstitial-wrapper {
    margin-top: 5%;
  }
  .nav-wrapper {
    margin-top: 30px;
  }
}

@media (min-width: 600px) and (max-width: 736px) and (orientation: landscape) {
  .offline .interstitial-wrapper {
    margin-left: 0;
    margin-right: 0;
  }
}

@media (min-width: 420px) and (max-width: 736px) and (min-height: 240px) and (max-height: 420px) and (orientation:landscape) {
  .interstitial-wrapper {
    margin-bottom: 100px;
  }
}

@media (min-height: 240px) and (orientation: landscape) {
  .offline .interstitial-wrapper {
    margin-bottom: 90px;
  }
  .icon-offline {
    margin-bottom: 20px;
  }
}

@media (max-height: 320px) and (orientation: landscape) {
  .icon-offline {
    margin-bottom: 0;
  }
  .offline .runner-container {
    top: 10px;
  }
}

@media (max-width: 240px) {
  .interstitial-wrapper {
    overflow: inherit;
    padding: 0 8px;
  }
}

.arcade-mode,
.arcade-mode .runner-container,
.arcade-mode .runner-canvas {
  image-rendering: pixelated;
  max-width: 100%;
  overflow: hidden;
}

.arcade-mode #buttons,
.arcade-mode #main-content {
  opacity: 0;
  overflow: hidden;
}

.arcade-mode .interstitial-wrapper {
  height: 100vh;
  max-width: 100%;
  overflow: hidden;
}

.arcade-mode .runner-container {
  left: 0;
  margin: auto;
  right: 0;
  transform-origin: top center;
  transition: transform 250ms cubic-bezier(0.4, 0, 1, 1) 400ms;
  z-index: 2;
}

    
    `}</style>
    </>
  );
}
