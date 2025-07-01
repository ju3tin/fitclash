'use client';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';

export default function Home() {
  const [messageVisible, setMessageVisible] = useState(true);

  // Add keydown event listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        setMessageVisible(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <Head>
        <title>Chrome Easter Egg: T-Rex Runner</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="/index99.css" />
        <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" />
      </Head>

      <Script src="/index99.js" strategy="afterInteractive" />

      <div id="t" className="offline">
        {messageVisible && (
          <div id="messageBox" className="sendmessage">
            <h1 style={{ textAlign: 'center', fontFamily: "'Open Sans', sans-serif" }}>
              Press Space to start
            </h1>
            <div
              className="niokbutton"
              onClick={() => setMessageVisible(false)}
            ></div>
          </div>
        )}

        <div id="main-frame-error" className="interstitial-wrapper">
          <div id="main-content">
            <div className="icon icon-offline" />
          </div>

          <div id="offline-resources">
            <img
              id="offline-resources-1x"
              src="/assets/default_100_percent/100-offline-sprite.png"
              alt="sprite-1x"
            />
            <img
              id="offline-resources-2x"
              src="/assets/default_200_percent/200-offline-sprite.png"
              alt="sprite-2x"
            />

            {/* Audio elements */}
            <audio
              id="offline-sound-press"
              src="data:audio/mpeg;base64,..." // Replace with your full base64 string
            ></audio>
            <audio
              id="offline-sound-hit"
              src="data:audio/mpeg;base64,..." // Replace with your full base64 string
            ></audio>
            <audio
              id="offline-sound-reached"
              src="data:audio/mpeg;base64,..." // Replace with your full base64 string
            ></audio>
          </div>
        </div>
      </div>
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
