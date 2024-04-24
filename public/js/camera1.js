/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
 import * as posenet from '@tensorflow-models/posenet';
 import dat from 'dat.gui';
 import Stats from 'stats.js';
 import { drawKeypoints, drawAndGetAngles, drawSkeleton, drawBoundingBox } from './demo_util';
 
 const videoWidth = 640;//853;//600;
 const videoHeight = 360;//480;//500;
 
 const camVidWidth = 640;//640;
 const camVidHeight = 360;//360;
 const stats = new Stats();
 
 function isAndroid() {
   return /Android/i.test(navigator.userAgent);
 }
 
 function isiOS() {
   return /iPhone|iPad|iPod/i.test(navigator.userAgent);
 }
 
 function isMobile() {
   return isAndroid() || isiOS();
 }
 
 /**
  * Loads a the camera to be used in the demo
  *
  */
 async function setupVideo(vidFName = "dance3_frag_silent.mp4", vidCodec = "avc1.4D401F") {
   if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
     throw new Error(
       'Browser API navigator.mediaDevices.getUserMedia not available');
   }
 
   const video = document.getElementById('video');
   video.width = videoWidth;
   video.height = videoHeight;
 
   // const mobile = isMobile();
   // const stream = await navigator.mediaDevices.getUserMedia({
   //   'audio': false,
   //   'video': {
   //     facingMode: 'user',
   //     width: mobile ? undefined : videoWidth,
   //     height: mobile ? undefined : videoHeight,
   //   },
   // });
 
   const myMediaSource = new MediaSource();
   console.log(myMediaSource.readyState); // closed
   const url = URL.createObjectURL(myMediaSource);
   console.log("url initiated.")
 
   // video.srcObject = stream;
   video.src = url;
   myMediaSource.addEventListener('sourceopen', function (_) {
     console.log("Source opened, can procede with adding video source")
 
     const videoSourceBuffer = myMediaSource
       .addSourceBuffer('video/mp4; codecs=' + vidCodec);
     fetch(vidFName).then(function (response) {
       // The data has to be a JavaScript ArrayBuffer
       console.log("video fetched")
       videoSourceBuffer.addEventListener('updateend', function (_) {
         myMediaSource.endOfStream();
         //video.play();
         //console.log(mediaSource.readyState); // ended
       });
       return response.arrayBuffer();
     }).then(function (videoData) {
       videoSourceBuffer.appendBuffer(videoData);
     });
   })
 
 
   return new Promise((resolve) => {
     video.onloadedmetadata = () => {
       console.log("we resolved our request i.e. video is now loaded this async op is complete.")
       resolve(video);
     };
   });
 }
 
 async function setupCamera() {
   if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
     throw new Error(
       'Browser API navigator.mediaDevices.getUserMedia not available');
   }
 
   const video = document.getElementById('video-camera');
   video.width = camVidWidth; //480;
   video.height = camVidHeight; //360;
 
   const mobile = isMobile();
   const stream = await navigator.mediaDevices.getUserMedia({
     'audio': false,
     'video': {
       facingMode: 'user',
       width: mobile ? undefined : videoWidth,
       height: mobile ? undefined : videoHeight,
     },
   });
 
   video.srcObject = stream
 
   return new Promise((resolve) => {
     video.onloadedmetadata = () => {
       console.log("we resolved our request i.e. video is now loaded this async op is complete.")
       resolve(video);
     };
   });
 }
 
 async function loadVideo(vidFName = "dance3_frag_silent.mp4", vidCodec = "avc1.4D401F", playAudio = true) {
   console.log("Got Vid Data: ", vidFName, "\t", vidCodec)
   const video = await setupVideo(vidFName, vidCodec);
   video.muted = !playAudio; //TODO: make this a setting!
   video.play();
 
   return video;
 }
 
 async function loadVideoCam() {
   const videoCam = await setupCamera();
   videoCam.play();
 
   return videoCam;
 }
 
 // if (!localStorage.getItem('guiState')) {
 //   localStorage.setItem('guiState')
 // } else {
 //   guiState = localStorage.getItem('guiState');
 // }
 
 const guiState = {
   algorithm: 'single-pose',
   input: {
     mobileNetArchitecture: isMobile() ? '0.50' : '0.75',
     outputStride: 16,
     imageScaleFactor: 0.6,//0.4//localStorage.getItem('imageSF') ? parseFloat(parseFloat(localStorage.getItem('imageSF')).toFixed(2)) : 0.40,//0.35 //0.5
   },
   singlePoseDetection: {
     minPoseConfidence: 0.7, //0.5 //0.1
     minPartConfidence: 0.8,//localStorage.getItem('minPC') ? parseFloat(parseFloat(localStorage.getItem('minPC')).toFixed(2)) : 0.8, //0.75 //0.9, //0.8 //0.5
   },
   multiPoseDetection: {
     maxPoseDetections: 5,
     minPoseConfidence: 0.15,
     minPartConfidence: 0.1,
     nmsRadius: 30.0,
   },
   output: {
     showVideo: true,
     showSkeleton: true,
     showPoints: true,
     showAngles: true,
     showBoundingBox: false,
   },
   net: null,
 };
 
 /**
  * Sets up dat.gui controller on the top-right of the window
  */
 function setupGui(cameras, net) {
   guiState.net = net;
 
   if (cameras.length > 0) {
     guiState.camera = cameras[0].deviceId;
   }
 
   const gui = new dat.GUI({ width: 300, closed: true });
 
   // The single-pose algorithm is faster and simpler but requires only one
   // person to be in the frame or results will be innaccurate. Multi-pose works
   // for more than 1 person
   const algorithmController =
     gui.add(guiState, 'algorithm', ['single-pose']);
 
   // The input parameters have the most effect on accuracy and speed of the
   // network
   let input = gui.addFolder('Input');
   // Architecture: there are a few PoseNet models varying in size and
   // accuracy. 1.01 is the largest, but will be the slowest. 0.50 is the
   // fastest, but least accurate.
   const architectureController = input.add(
     guiState.input, 'mobileNetArchitecture',
     ['1.01', '1.00', '0.75', '0.50']);
   // Output stride:  Internally, this parameter affects the height and width of
   // the layers in the neural network. The lower the value of the output stride
   // the higher the accuracy but slower the speed, the higher the value the
   // faster the speed but lower the accuracy.
   input.add(guiState.input, 'outputStride', [8, 16, 32]);
   // Image scale factor: What to scale the image by before feeding it through
   // the network.
   const sfController = input.add(guiState.input, 'imageScaleFactor', 0.2, 1.0);
   // sfController.onChange(function (sf) {
   //   localStorage.setItem('imageSF', sf);
   // });
 
   //input.open();
 
   // Pose confidence: the overall confidence in the estimation of a person's
   // pose (i.e. a person detected in a frame)
   // Min part confidence: the confidence that a particular estimated keypoint
   // position is accurate (i.e. the elbow's position)
   let single = gui.addFolder('Single Pose Detection');
   single.add(guiState.singlePoseDetection, 'minPoseConfidence', 0.0, 1.0);
   var minPCController = single.add(guiState.singlePoseDetection, 'minPartConfidence', 0.0, 1.0);
   // minPCController.onChange(function (value) {
   //   localStorage.setItem('minPC', value);
   // });
 
   // let multi = gui.addFolder('Multi Pose Detection');
   // multi.add(guiState.multiPoseDetection, 'maxPoseDetections')
   //   .min(1)
   //   .max(20)
   //   .step(1);
   // multi.add(guiState.multiPoseDetection, 'minPoseConfidence', 0.0, 1.0);
   // multi.add(guiState.multiPoseDetection, 'minPartConfidence', 0.0, 1.0);
   // // nms Radius: controls the minimum distance between poses that are returned
   // // defaults to 20, which is probably fine for most use cases
   // multi.add(guiState.multiPoseDetection, 'nmsRadius').min(0.0).max(40.0);
   // multi.open();
 
   let output = gui.addFolder('Output');
   output.add(guiState.output, 'showVideo');
   output.add(guiState.output, 'showSkeleton');
   output.add(guiState.output, 'showPoints');
   output.add(guiState.output, 'showAngles');
   output.add(guiState.output, 'showBoundingBox');
 
   //output.open();
 
 
   architectureController.onChange(function (architecture) {
     guiState.changeToArchitecture = architecture;
   });
 
   algorithmController.onChange(function (value) {
     switch (guiState.algorithm) {
       case 'single-pose':
         //multi.close();
         single.open();
         break;
       case 'multi-pose':
         single.close();
         //multi.open();
         break;
     }
   });
 
   gui.close();
 
 
 }
 
 /**
  * Sets up a frames per second panel on the top-left of the window
  */
 function setupFPS() {
   stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
   document.body.appendChild(stats.dom);
 }
 
 
 
 
 /*alpha => approx angle at which score = 0.1*/
 /* score_min => 0 when angle is large, score_max => 1 when angle=>0,
    score_cutoff => 0. when angle=>alpha, exp_decay based on alpha*/
 function calcDegAngleScore(x, alpha = 60) {
   return Math.exp(- ((135 / alpha) * Math.sqrt(2 * (1 - Math.cos((x * Math.PI) / 180)))))
 }
 
 /**
  * Feeds an image to posenet to estimate poses - this is where the magic
  * happens. This function loops with a requestAnimationFrame method.
  */
 function detectPoseInRealTime(data) {
   //console.log(data[0]);
 
   //console.log("cVas", canvasID);
 
 
   data = data.map(elemSet => {
     elemSet['canvas'] = document.getElementById(elemSet.cId);
     elemSet.canvas.width = elemSet.vW;
     elemSet.canvas.height = elemSet.vH;
     elemSet['ctx'] = elemSet.canvas.getContext('2d');
     return elemSet;
   });
 
   //console.log("NEW DATASET");
   //console.log(data);
   // since images are being fed from a webcam
   //const flipHorizontal = flipHorizontal;
   //console.log("FLIP-HORZ", flipHorizontal)
 
   const scoreValElem = document.getElementById("master-score-val");
   const angleDiffElem = document.getElementById("angle-diff-val");
   const playerAvgAngleElem = document.getElementById("player-avg-angle-val");
   const deltaScoreValElem = document.getElementById("delta-score-val");
   const secRemainElem = document.getElementById("master-sec-elap");
 
   var before = Date.now();
   var playerOldAvgAngle = 180;
 
 
   // loop for every frame.
   async function poseDetectionFrame() {
     if (guiState.changeToArchitecture) {
       // Important to purge variables and free up GPU memory
       guiState.net.dispose();
 
       // Load the PoseNet model weights for either the 0.50, 0.75, 1.00, or 1.01
       // version
       guiState.net = await posenet.load(+guiState.changeToArchitecture);
 
       guiState.changeToArchitecture = null;
     }
 
     // Begin monitoring code for frames per second
     stats.begin();
 
     // Scale an image down to a certain factor. Too large of an image will slow
     // down the GPU
     const imageScaleFactor = guiState.input.imageScaleFactor;
     const outputStride = +guiState.input.outputStride;
 
 
     let minPoseConfidence;
     let minPartConfidence;
 
 
     const poseDat = [[
       data[0], await guiState.net.estimateSinglePose(
         data[0].vid, imageScaleFactor, data[0].fH, outputStride)
     ],
     [data[1], await guiState.net.estimateSinglePose(
       data[1].vid, imageScaleFactor, data[1].fH, outputStride)]
     ];
 
 
     for (const [elemSet, pose] of poseDat) {
       //let poses = [];
       //const pose = await guiState.net.estimateSinglePose(
       //  elemSet.vid, imageScaleFactor, elemSet.fH, outputStride);
       //poses.push(pose);
 
       minPoseConfidence = +guiState.singlePoseDetection.minPoseConfidence;
       minPartConfidence = +guiState.singlePoseDetection.minPartConfidence;
 
       elemSet.ctx.clearRect(0, 0, elemSet.vW, elemSet.vH);
 
       if (guiState.output.showVideo) {
         elemSet.ctx.save();
         elemSet.ctx.scale((elemSet.fH ? -1 : 1), 1);
         elemSet.ctx.translate((elemSet.fH ? -elemSet.vW : 0), 0);
         elemSet.ctx.drawImage(elemSet.vid, 0, 0, elemSet.vW, elemSet.vH);
         elemSet.ctx.restore();
       }
 
       // For each pose (i.e. person) detected in an image, loop through the poses
       // and draw the resulting skeleton and keypoints if over certain confidence
       // scores
       // poses.forEach(({ score, keypoints }) => {
       //   // do nothing
       // });
       var { score, keypoints } = pose;
       if (score >= minPoseConfidence) {
         if (guiState.output.showPoints) {
           drawKeypoints(keypoints, minPartConfidence, elemSet.ctx);
         }
         if (guiState.output.showSkeleton) {
           drawSkeleton(keypoints, minPartConfidence, elemSet.ctx);
         }
         if (guiState.output.showAngles) {
           // if show skeleton also show angles
           // after drawing angles also return them out
           elemSet['angleObjArr'] = drawAndGetAngles(keypoints, minPartConfidence, elemSet.ctx);
         }
         if (guiState.output.showBoundingBox) {
           drawBoundingBox(keypoints, elemSet.ctx);
         }
       }
     }
 
     //console.log(stats.dom.)
     // rate of change of score by frame == dScoreByDFrame
     var total = 0;
     var totAngleDiff = 0;
     var playerTotAngle = 0.0;
 
     //data[0] -> src
     //data[1] -> actor
 
 
     if (data[1].angleObjArr !== undefined && data[0].angleObjArr !== undefined) {
       //make this a reduce function to get final score
       data[1].angleObjArr.forEach(angleObj => {
         var idx = data[0].angleObjArr.findIndex(x => x.name === angleObj.name);
         if (idx > -1) {
           // essentially for now we can give a 0 or 0.5 or 1 as score, maybe make it scaled.
           // max score should be 8 for 2 sets of 4 angles: alpha, beta, gamma, sigma
           // this is normalised so x/8 so u get score btw 0 -> 1
           // score is added to total
 
           //
           // when you normalise you don't know how many u are summing up, so u always
           // divide by 8 but shuld really divide by how many were found or seen
           /*
            *
            *e^(-(alpha)^1 * 4.5 * 0.5 * sqrt(2 * (1-cos((x * pi)/180)))
            * => e^(-(alpha)^1 * 2.25 * sqrt(2 * (1-cos((x * pi)/180)))
           */
 
           //use alhpa as angle so =60 by default
           //f1(x, alpha = 60) { return Math.exp( - ( ((2.25 * 60) / alpha) * Math.sqrt(2 * (1-Math.cos((x * Math.PI)/180))) ) ) }
           //==>f1(x, alpha = 60) { return Math.exp( - ( (135 / alpha) * Math.sqrt(2 * (1-Math.cos((x * Math.PI)/180))) ) ) }
 
           //const targetAngle = data[0].angleObjArr[idx].angle;
           //const absAngleDiff <-- we need absAngleDiff for 0 <= diff <= 180
           // for some joints this angle is similar if we normalise each connectPart diff vectors
           // of TWO DIFFERENT POSES i.e. source and player
           // such as [wrist,elbow] => vector{(writst_keypoint - elbow_kp) / ||wrist_kp- elbow_kp||}
           // [elbow, shoulder] , ..., etc then...
           // try to find the angle between this product using dot prod
           // since its normalised i.e. mag => 1 so cosTheta = A . B
           // other option is do || A - B || which is equivalent to
           // sqrt(2(1 - cosTheta)) which can then simplify score func
           // here A => [wrist,elbow]_vect for source
           // B => [wrist,elbow]_vect for actor
 
           playerTotAngle += parseFloat(angleObj.angle);
 
           var angleDiff = Math.abs(data[0].angleObjArr[idx].angle - angleObj.angle);
           //deltaScore += calcDegAngleScore(angleDiff, 30);
           //score += Math.exp(-0.8 * absDiff);
           totAngleDiff += angleDiff;
           total += 1;
         }
       });
     }
 
     //normalised , ideally we need to scale w.r.t to confidence? somehow if needed....
     // we assume if player doesnt show half body for e.g. your score shuld exceed by that much
 
     // we also nned to normalise by fps... ideally 30fps should do score += 1 EVERY SECOND
     // so essentially 1/FPS * deltaScore
     // we also include 8 cause its 8 angles max for now...
     var FPS = 1000 / (Date.now() - before); //crude FPS estimate
     before = Date.now()
 
     //var a = 0.5 * Math.exp(-1.9 * Math.log((totAngleDiff / total) - 9));
     //var alpha = 0.001;
     //var avgAngle = (alpha) * (totAngleDiff / total) + (1 - alpha) * oldAngleAvg;
     //oldAngleAvg = avgAngle;
     //playerAvgAngle /= total; //must divide by total to get avganlge
 
     //totAngleDiff --> for P1 and P2
     //playerOldNewAngleDiff --> for P2 (Player/User) only
     //must have >=3 joints on screen for scoring
     //3 * Math.exp(-0.22 * avgAngle) - 0.05;
     var scoreVal = 10 * (Math.exp(-1 * ((totAngleDiff / total) / 10) ** 2) - 0.01);
     var playerOldNewAngleDiff = Math.abs((playerTotAngle / total) - playerOldAvgAngle);
     playerOldAvgAngle = (playerTotAngle / total);
 
     //2.0 is thr avgYourAngle diff from prev frame if less than that then penalise
     // if u dont play then u get negatve scoring!!
     // this has some issues due to random noise but its usually alright
     // now i get -2.3 no play --> 1.3 with play
     var deltaScore = total >= 3 ?
       (playerOldNewAngleDiff > 2.0 ?
         (scoreVal > 0.1 ? scoreVal / FPS
           : 0) : -0.1 / FPS) : 0;
 
     deltaScore = Number.isNaN(deltaScore) ? 0 : deltaScore;
     //deltaScore /= 4; //* (FPS / 30) # noew deltaScore is 0 -> 1
     //scoreval is unnormalised by fps
     deltaScoreValElem.innerHTML = (scoreVal).toFixed(4);
     angleDiffElem.innerHTML = (totAngleDiff / total).toFixed(2);
     playerAvgAngleElem.innerHTML = (playerOldNewAngleDiff).toFixed(2);//(playerTotAngle / total).toFixed(2); //new
     scoreValElem.innerHTML = (parseFloat(scoreValElem.innerHTML) + deltaScore).toFixed(2);
 
     // End monitoring code for frames per second
     stats.end();
 
     //recursive loop
     if (parseInt(secRemainElem.innerHTML) > 0) {
       //only continue detection if time is not over.
       requestAnimationFrame(poseDetectionFrame);
     }
     else {
       console.log("Game over as remTime = 0s");
     }
   }
 
   poseDetectionFrame();
 }
 
 
 function startCountDown() {
   console.log("countdown starting...")
   const secRemainElem = document.getElementById("master-sec-elap");
   const progBar = document.querySelector("#master-progress");
   progBar.MaterialProgress.setProgress(100);
   //const maxSeconds = Math.floor(timeLim);
 
   //console.log(progBar.MaterialProgress);
 
 
 
   setTimeout(function () {
     const vid1 = document.getElementById('video');
     const vid2 = document.getElementById('video-camera');
 
     const maxSeconds = Math.floor(vid1.duration);
     secRemainElem.innerHTML = maxSeconds;
 
     var mainTimer = setInterval(function () {
       secRemainElem.innerHTML = parseInt(secRemainElem.innerHTML) - 1;
       progBar.MaterialProgress.setProgress(parseInt((maxSeconds - parseInt(secRemainElem.innerHTML)) * (100 / maxSeconds)));
     }, 1000);
 
     console.log("HELLOW", vid1.duration);
     setTimeout(function () {
       clearInterval(mainTimer);
       vid1.pause();
       vid1.src = '';
       vid2.pause();
       vid2.src = '';
       document.getElementById('output-pane').style.display = "none";
       document.getElementById('final-score-pane').style.display = "";
 
       const finalScore = parseFloat(document.getElementById('master-score-val').innerHTML);
 
       if (!localStorage.getItem('highScoreText')) {
         localStorage.setItem('highScoreText', "".concat(finalScore));
       }
 
       const highScore = parseFloat(localStorage.getItem('highScoreText'));
 
       document.getElementById('final-text').innerHTML =
         "Game Over! You scored: " +
         "".concat(finalScore) +
         (finalScore >= highScore ? "<br> You just bet the high score!!" :
           "<br> The high score is " + "".concat(highScore) + "... Can you beat it?")
       "!<br>Your Page will refresh in 5 seconds.";
 
       if (finalScore > highScore) {
         localStorage.setItem('highScoreText', "".concat(finalScore));
       }
 
       setTimeout(function () {
         //set timeout to refesh page
         location.reload();
       }, 5000);
     }, (maxSeconds + 0.1) * 1000);
   }, 1000);
 }
 
 /**
  * Kicks off the demo by loading the posenet model, finding and loading
  * available camera devices, and setting off the detectPoseInRealTime function.
  */
 export async function bindPage() {
   // Load the PoseNet model weights with architecture 0.75
   //var userInput = await waitForStart();
   document.getElementById('loading').style.display = '';
 
   var playAudio = document.getElementById("switch-audio").checked;
   var e = document.getElementById("difficulty-select");
 
   const vidFile = e.options[e.selectedIndex].value;//"this_is_me.mp4";//"napoleon_dynamite.mp4";//"fortnight_360p_new2.mp4";//"dance3_frag_silent.mp4";
   const vidCodec = "avc1.64001E, mp4a.40.2";//"avc1.4D401F"
 
   //console.log(userInput);
   const net = await posenet.load(0.75);
 
 
   document.getElementById('output-pane').style.display = '';
 
   let video, videoCam;
 
   try {
     video = await loadVideo(vidFile, vidCodec, playAudio);
     videoCam = await loadVideoCam();
   } catch (e) {
     let info = document.getElementById('info');
     info.textContent = 'this browser does not support video capture,' +
       'or this device does not have a camera';
     info.style.display = 'block';
     throw e;
   }
 
 
 
   setupGui([], net);
   setupFPS();
   let data = [
     { vid: video, net: net, cId: 'output', vW: videoWidth, vH: videoHeight, fH: false },
     { vid: videoCam, net: net, cId: 'output2', vW: camVidWidth, vH: camVidHeight, fH: true },//true
   ]
 
   document.getElementById('loading').style.display = 'none';
   document.getElementById('pre-start-grid').style.display = 'none';
 
   console.log("Both video streams are loaded.");
   console.log(video.duration, " --- ", video.readyState);
   startCountDown();
   detectPoseInRealTime(data);
 
 
 
   //detectPoseInRealTime(videoCam, net, 'output2', camVidWidth, camVidHeight, true);
 }
 
 navigator.getUserMedia = navigator.getUserMedia ||
   navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
 
 document.getElementById("start-btn").addEventListener("click", function (params) {
   // kick off the demo
   bindPage();
 });
 
 
 
 