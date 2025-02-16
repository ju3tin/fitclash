// DOM elements.
<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.4.0/dist/confetti.browser.min.js"></script>
const roomSelectionContainer = document.getElementById('room-selection-container')
const roomInput = document.getElementById('room-input')
const connectButton = document.getElementById('connect-button')
const copyaddress1 = document.getElementById('copyaddress1')
const addressmyInput = document.getElementById('addressmyInput')

const videoChatContainer = document.getElementById('video-chat-container')
const localVideoComponent = document.getElementById('local-video')
const remoteVideoComponent = document.getElementById('remote-video')

let Gameoption = null;
//var roomidpalyer1

let player1Ready = false;
let player2Ready = false;


roomInput.value = Math.floor(Math.random() * 90000) + 10000;

const roomdude34 = roomInput.value;

const canvas = document.createElement('canvas');
canvas.width = localVideoComponent.clientWidth; // Set canvas width
canvas.height = localVideoComponent.clientHeight; // Set canvas height
//videoChatContainer.appendChild(canvas);
canvas.style.position = 'absolute';
canvas.style.bottom = '0px';
canvas.style.width = '100%';
canvas.style.height = '50%';
canvas.style.marginBottom = '0px';
canvas.style.left = '0';
canvas.style.objectFit = 'contain';


document.getElementById('send-message-button').onclick = function() {
  const message = document.getElementById('message-input').value;
  if (message) {
      socket.emit('send_message', { roomId, message }); // Send message to the server
      displayMessage(`You: ${message}`); // Display your own message
      document.getElementById('message-input').value = ''; // Clear the input field
  }
};


// Fetch the JSON file
fetch('/js/gameoptions.json')
    .then(response => response.json())
    .then(data => {
        const dropdownList = document.getElementById('dropdown-list');
        const dropdownButton = document.getElementById('dropdownMenuButton');

        // Generate the dropdown items
        data.forEach(gameoption => {
            const listItem = document.createElement('li');
            listItem.className = 'dropdown-item';
            listItem.innerHTML = `<img src="${gameoption.flag}" width="20" height="15"> ${gameoption.name}`;
            
            // Add click event to update button and global variable
            listItem.addEventListener('click', () => {
                Gameoption = gameoption.name; // Update global variable
                dropdownButton.innerHTML = `<img src="${gameoption.flag}" width="20" height="15"> ${gameoption.name}`;
                console.log("Selected Game:", Gameoption); // Debug
                connectButton.style.display = "block";

                // Update addressmyInput value after Gameoption is set
                addressmyInput.value = `${window.location.href}?roomId=${roomdude34}&gameoption=${Gameoption}`;
            });

            dropdownList.appendChild(listItem);
        });
    }).catch(error => console.error('Error loading the JSON file:', error));
 
 
console.log("this is the player 1 roomid "+roomInput.value);


function copytext() {
  // Get the text field
  var copyText = document.getElementById("addressmyInput");

  // Select the text field
  copyText.select();
  copyText.setSelectionRange(0, 99999); // For mobile devices

   // Copy the text inside the text field
  navigator.clipboard.writeText(copyText.value);

  // Alert the copied text
  alert("Copied the text: " + copyText.value);
}

// Variables.
const socket = io('https://webrtcsocket.onrender.com/'); // Replace with your Render URL
const mediaConstraints = {
  audio: true,
  video: { width: 1280, height: 720 },
}
let localStream
let remoteStream
let isRoomCreator
let rtcPeerConnection // Connection between the local device and the remote peer.
let roomId

// Free public STUN servers provided by Google.
const iceServers = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
  ],
}
const urlParams = new URLSearchParams(window.location.search);
const roomIdFromUrl = urlParams.get('roomId'); // Extract roomId from URL
var player
if (roomIdFromUrl) { // If roomId exists in the URL
    joinRoom(roomIdFromUrl); // Call joinRoom with the extracted roomId
var player = 'player2';
    console.log("your player name is "+player);
}else{
var player = 'player1';
  console.log("your player name is "+player);
}
// BUTTON LISTENER ============================================================
connectButton.addEventListener('click', () => {
  joinRoom(roomInput.value)
})

// SOCKET EVENT CALLBACKS =====================================================
socket.on('room_created', async () => {
  console.log('Socket event callback: room_created')

  await setLocalStream(mediaConstraints)
  isRoomCreator = true
  if (player === 'player1') {
    console.log('Player 1 has joined the room');
    copyaddress1.style.display = "flex";
    copyaddress1.style.justifyContent = "center";
    copyaddress1.style.alignItems = "center";
    copyaddress1.style.textAlign = "center";
    copyaddress1.style.minHeight = "100vh";
    copyaddress1.style.position = "absolute";
    copyaddress1.style.zIndex = "3000";
    } else {
    console.log(`this is the dude ${player}`);
  }
})

socket.on('room_joined', async () => {
  console.log('Socket event callback: room_joined')
  copyaddress1.style.display = "none";

  await setLocalStream(mediaConstraints)
  socket.emit('start_call', roomId);



// ... existing code ...

// Create a canvas element and a button
const readyButton = document.createElement('button');
readyButton.innerText = 'Ready';
readyButton.style.position = 'absolute';
readyButton.style.bottom = '60px'; // Position above the canvas
readyButton.style.left = '50%';
readyButton.style.transform = 'translateX(-50%)'; // Center the button
readyButton.style.zIndex = '3000'; // Ensure it appears above other elements

// Append the button to the video chat container
videoChatContainer.appendChild(readyButton);

// Create a new canvas element for the "Ready" state
const readyCanvas = document.createElement('canvas');
readyCanvas.id = 'readyCanvas';
readyCanvas.width = localVideoComponent.clientWidth; // Set canvas width
readyCanvas.height = localVideoComponent.clientHeight; // Set canvas height
readyCanvas.style.position = 'absolute';
readyCanvas.style.bottom = '0px';
readyCanvas.style.width = '100%';
readyCanvas.style.height = '50%';
readyCanvas.style.marginBottom = '0px';
readyCanvas.style.left = '0';
readyCanvas.style.objectFit = 'contain';

// Append the canvas to the video chat container
videoChatContainer.appendChild(readyCanvas);

// ... existing code ...

readyButton.addEventListener('click', (data) => {
 
// Draw the text "Read" on the readyCanvas
const ctx = readyCanvas.getContext('2d');
ctx.font = '48px Arial'; // Set font size and family
ctx.fillStyle = 'black'; // Set text color
ctx.textAlign = 'center'; // Center the text
ctx.textBaseline = 'middle'; // Align text vertically
ctx.fillText('Ready', readyCanvas.width / 2, readyCanvas.height / 2); // Draw the text in the center
readyButton.remove(); // Remove the button from the DOM
let message = `ready to start ${player}`;
socket.emit('send_message', { roomId, message }); // Send message to the server
displayMessage(`You: ${message}`); 
if (message == 'ready to start player1') {
  player1Ready = true; // Set player1 as ready
  checkBothPlayersReady(); // Check if both players are ready
}
if (message == 'ready to start player2') {
  player2Ready = true; // Set player2 as ready
  checkBothPlayersReady(); // Check if both players are ready
}
})
  


})

socket.on('full_room', () => {
  console.log('Socket event callback: full_room')

  alert('The room is full, please try another one')
})

socket.on('start_call', async () => {
  console.log('Socket event callback: start_call')
  copyaddress1.style.display = "none";


  if (isRoomCreator) {
    copyaddress1.style.display = "none";
    rtcPeerConnection = new RTCPeerConnection(iceServers)
    addLocalTracks(rtcPeerConnection)
    rtcPeerConnection.ontrack = setRemoteStream
    rtcPeerConnection.onicecandidate = sendIceCandidate
    await createOffer(rtcPeerConnection)
  }
})

socket.on('webrtc_offer', async (event) => {
  console.log('Socket event callback: webrtc_offer')

  if (!isRoomCreator) {
    rtcPeerConnection = new RTCPeerConnection(iceServers)
    addLocalTracks(rtcPeerConnection)
    rtcPeerConnection.ontrack = setRemoteStream
    rtcPeerConnection.onicecandidate = sendIceCandidate
    rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event))
    await createAnswer(rtcPeerConnection)
  }
})

socket.on('webrtc_answer', (event) => {
  console.log('Socket event callback: webrtc_answer')

  rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event));


// ... existing code ...

// Create a canvas element and a button
const readyButton = document.createElement('button');
readyButton.innerText = 'Ready';
readyButton.style.position = 'absolute';
readyButton.style.bottom = '60px'; // Position above the canvas
readyButton.style.left = '50%';
readyButton.style.transform = 'translateX(-50%)'; // Center the button
readyButton.style.zIndex = '3000'; // Ensure it appears above other elements

// Append the button to the video chat container
videoChatContainer.appendChild(readyButton);

// Create a new canvas element for the "Ready" state
const readyCanvas = document.createElement('canvas');
readyCanvas.id = 'readyCanvas';
readyCanvas.width = localVideoComponent.clientWidth; // Set canvas width
readyCanvas.height = localVideoComponent.clientHeight; // Set canvas height
readyCanvas.style.position = 'absolute';
readyCanvas.style.bottom = '0px';
readyCanvas.style.width = '100%';
readyCanvas.style.height = '50%';
readyCanvas.style.marginBottom = '0px';
readyCanvas.style.left = '0';
readyCanvas.style.objectFit = 'contain';

// Append the canvas to the video chat container
videoChatContainer.appendChild(readyCanvas);

// ... existing code ...

readyButton.addEventListener('click', () => {
 
// Draw the text "Read" on the readyCanvas
const ctx = readyCanvas.getContext('2d');
ctx.font = '48px Arial'; // Set font size and family
ctx.fillStyle = 'black'; // Set text color
ctx.textAlign = 'center'; // Center the text
ctx.textBaseline = 'middle'; // Align text vertically
ctx.fillText('Ready', readyCanvas.width / 2, readyCanvas.height / 2); // Draw the text in the center
readyButton.remove(); // Remove the button from the DOM
let message = `ready to start ${player}`;
socket.emit('send_message', { roomId, message }); // Send message to the server
displayMessage(`You: ${message}`); 
if (message == 'ready to start player1') {
  player1Ready = true; // Set player1 as ready
  checkBothPlayersReady(); // Check if both players are ready
}
if (message == 'ready to start player2') {
  player2Ready = true; // Set player2 as ready
  checkBothPlayersReady(); // Check if both players are ready
}
})
  



})

socket.on('webrtc_ice_candidate', (event) => {
  console.log('Socket event callback: webrtc_ice_candidate')

  // ICE candidate configuration.
  const candidate = new RTCIceCandidate({
    sdpMLineIndex: event.label,
    candidate: event.candidate,
  })
  rtcPeerConnection.addIceCandidate(candidate)
})

// FUNCTIONS ==================================================================
function joinRoom(room) {
  if (room === '') {
    alert('Please type a room ID')
  } else {
    roomId = room
    socket.emit('join', room)
    showVideoConference()
  }
}

function showVideoConference() {
  roomSelectionContainer.style.display = 'none'
  videoChatContainer.style.display = 'block'
}

async function setLocalStream(mediaConstraints) {
  try {
    localStream = await navigator.mediaDevices.getUserMedia(mediaConstraints)
    localVideoComponent.srcObject = localStream



    // Create a new canvas element for MoveNet
   // const canvas = document.createElement('canvas');
    videoChatContainer.appendChild(canvas);
    canvas.style.position = 'absolute';
    canvas.style.bottom = '0px';
    canvas.style.width = '100%';
    canvas.style.height = '50%';
    canvas.style.marginBottom = '0px';
    canvas.style.left = '0';
    canvas.style.objectFit = 'contain';
    localVideoComponent.onloadedmetadata = () => {
      localVideoComponent.play();
      startMoveNet(canvas, localVideoComponent);
    };
    canvas.style.width = localVideoComponent.clientWidth; // Set canvas width
    canvas.style.height = localVideoComponent.clientHeight; // Set canvas height
    
  } catch (error) {
    console.error('Could not get user media', error)
  }
}




setLocalStream(mediaConstraints);


async function name(canvas, video) {
  
}

function addLocalTracks(rtcPeerConnection) {
  localStream.getTracks().forEach((track) => {
    rtcPeerConnection.addTrack(track, localStream)
  })
}

async function createOffer(rtcPeerConnection) {
  try {
    const sessionDescription = await rtcPeerConnection.createOffer()
    rtcPeerConnection.setLocalDescription(sessionDescription)
    
    socket.emit('webrtc_offer', {
      type: 'webrtc_offer',
      sdp: sessionDescription,
      roomId,
    })
  } catch (error) {
    console.error(error)
  }
}

async function createAnswer(rtcPeerConnection) {
  try {
    const sessionDescription = await rtcPeerConnection.createAnswer()
    rtcPeerConnection.setLocalDescription(sessionDescription)
    
    socket.emit('webrtc_answer', {
      type: 'webrtc_answer',
      sdp: sessionDescription,
      roomId,
    })
  } catch (error) {
    console.error(error)
  }
}

function setRemoteStream(event) {
  remoteVideoComponent.srcObject = event.streams[0]
  remoteStream = event.stream
}

function sendIceCandidate(event) {
  if (event.candidate) {
    socket.emit('webrtc_ice_candidate', {
      roomId,
      label: event.candidate.sdpMLineIndex,
      candidate: event.candidate.candidate,
    })
  }
}
// ... existing code ...

// DOM elements for messaging
const messageInput = document.getElementById('message-input');
const sendMessageButton = document.getElementById('send-message-button');
const messageContainer = document.getElementById('message-container');

// BUTTON LISTENER FOR SENDING MESSAGES =====================================
sendMessageButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message) {
        socket.emit('send_message', { roomId, message }); // Send message to the server
        displayMessage(`You: ${message}`); // Display your own message
        messageInput.value = ''; // Clear the input field
    }
});

// SOCKET EVENT FOR RECEIVING MESSAGES =====================================
socket.on('receive_message', (data) => {
    displayMessage(`${data.sender}: ${data.message}`); // Display received message
    if (data.message == 'ready to start player1'){
      player1Ready = true; // Set player1 as ready
      checkBothPlayersReady(); // Check if both players are ready

// Create a new canvas element for the "Ready" state
const readyCanvas1 = document.createElement('canvas');
readyCanvas1.id = 'readyCanvas';
readyCanvas1.width = localVideoComponent.clientWidth; // Set canvas width
readyCanvas1.height = localVideoComponent.clientHeight; // Set canvas height
readyCanvas1.style.position = 'absolute';
readyCanvas1.style.top = '0px';
readyCanvas1.style.width = '100%';
readyCanvas1.style.height = '50%';
readyCanvas1.style.marginBottom = '0px';
readyCanvas1.style.left = '0';
readyCanvas1.style.objectFit = 'contain';

// Append the canvas to the video chat container
videoChatContainer.appendChild(readyCanvas1);

const ctx = readyCanvas1.getContext('2d');
ctx.font = '48px Arial'; // Set font size and family
ctx.fillStyle = 'black'; // Set text color
ctx.textAlign = 'center'; // Center the text
ctx.textBaseline = 'middle'; // Align text vertically
ctx.fillText('Ready', readyCanvas1.width / 2, readyCanvas1.height / 2); // Draw the text in the center


// ... existing code ...

      console.log('what the fuck 1');
    };
    if (data.message == 'ready to start player2'){
      player2Ready = true; // Set player2 as ready
      checkBothPlayersReady(); // Check if both players are ready
    
// Create a new canvas element for the "Ready" state
const readyCanvas1 = document.createElement('canvas');
readyCanvas1.id = 'readyCanvas';
readyCanvas1.width = localVideoComponent.clientWidth; // Set canvas width
readyCanvas1.height = localVideoComponent.clientHeight; // Set canvas height
readyCanvas1.style.position = 'absolute';
readyCanvas1.style.top = '0px';
readyCanvas1.style.width = '100%';
readyCanvas1.style.height = '50%';
readyCanvas1.style.marginBottom = '0px';
readyCanvas1.style.left = '0';
readyCanvas1.style.objectFit = 'contain';

// Append the canvas to the video chat container
videoChatContainer.appendChild(readyCanvas1);

// ... existing code ...


const ctx = readyCanvas1.getContext('2d');
ctx.font = '48px Arial'; // Set font size and family
ctx.fillStyle = 'black'; // Set text color
ctx.textAlign = 'center'; // Center the text
ctx.textBaseline = 'middle'; // Align text vertically
ctx.fillText('Ready', readyCanvas1.width / 2, readyCanvas1.height / 2); // Draw the text in the center


      console.log('what the fuck 2')
    };
    if (player !== 'player1' && data.message.startsWith('player1')) {
        const scoreUpdate = parseInt(data.message.slice(8), 10); // Remove first 8 characters and parse the score
        player1Score = scoreUpdate; // Update player1Score
        console.log(`Updated player1Score: ${player1Score}`); // Log the updated score
    }
    if (player !== 'player2' && data.message.startsWith('player2')) {
      const scoreUpdate = parseInt(data.message.slice(8), 10); // Remove first 8 characters and parse the score
      player2Score = scoreUpdate; // Update player1Score
      console.log(`Updated player2Score: ${player2Score}`); // Log the updated score
   }
});


// Function to check if both players are ready
function checkBothPlayersReady() {
  if (player1Ready && player2Ready) {
      startCountdown(5); // Start a 5-second countdown
  }
}

// Countdown function
function startCountdown(seconds) {
  let timeLeft = seconds;
  const countdownElement = document.createElement('div');
  countdownElement.style.position = 'absolute';
  countdownElement.style.top = '10px';
  countdownElement.style.left = '50%';
  countdownElement.style.transform = 'translateX(-50%)';
  countdownElement.style.fontSize = '48px';
  countdownElement.style.color = 'red';
  videoChatContainer.appendChild(countdownElement);

  const timerId = setInterval(() => {
      countdownElement.innerText = timeLeft;
      if (timeLeft <= 0) {
          clearInterval(timerId);
          countdownElement.innerText = 'Go!'; // Indicate the start
          setTimeout(() => {
              countdownElement.remove(); // Remove countdown element after a moment
              timer3()
          }, 1000);
      }
      timeLeft--;
  }, 1000);
}

// FUNCTION TO DISPLAY MESSAGES ============================================
function displayMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageContainer.appendChild(messageElement);
}


function timer3(){

  var timeLeft = 30;
  var elem = document.getElementById('Timer');
  
  
  //document.getElementById('onctent2').id = 'onctent1';
  
  var timerId = setInterval(countdown, 1000);
  countStarJumps(keypoints)
  
  function countdown(counter, results, value1, jumpCount) {
    if (timeLeft == 0) {
      clearTimeout(timerId);
   //   document.getElementById("onctent1").innerHTML = "";
  //value1 = counter;
    
   //   document.getElementById('onctent1').id = 'two';
   //   openNav();
   if(player == 'player1'){
    alert(`Player 1 Score: ${player1Score} + Player 2 Score: ${player2Score} - ${player1Score > player2Score ? 'You Win Well Done!' : player1Score < player2Score ? 'You Lost, Better Luck Next Time!' : 'It\'s a tie!'}`);
    if (player1Score > player2Score) {
      confetti(); // Trigger confetti for Player 1
  }
   }
   if(player == 'player2'){
    alert(`Player 1 Score: ${player1Score} + Player 2 Score: ${player2Score} - ${player1Score > player2Score ? 'You Lost, Better Luck Next Time!' : player1Score < player2Score ? 'You Win Well Done!' : 'It\'s a tie!'}`);
    if (player2Score > player1Score) {
      confetti(); // Trigger confetti for Player 2
  }
   }

   //   doSomething();
      
    } else {
      elem.innerHTML = timeLeft + ' seconds remaining';
      timeLeft--;
    }
  }
  
  }



  async function startMoveNet(canvas, video) {
    // Load MoveNet model
    const detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
      }
    );
  
    const ctx = canvas.getContext('2d');
  
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
  
    // Function to detect poses
    async function detectPose() {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      // Detect poses
      const poses = await detector.estimatePoses(video, {
        maxPoses: 1,
        flipHorizontal: false,
      });
  
      // Log the detected poses for debugging
      console.log("Detected poses:", poses);
  
      // Draw the video frame onto the canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
      // Draw keypoints and skeleton
      poses.forEach((pose) => {
        const keypoints = pose.keypoints;
  
        // Log the keypoints for debugging
        console.log("Keypoints:", keypoints);
  
        // Check if keypoints are valid
        if (!keypoints || keypoints.length < 17) {
            console.error("Keypoints array is not defined or does not have enough elements.");
            return; // Exit if keypoints are not valid
        }
  
        drawKeypoints(keypoints, ctx);
        drawSkeleton(keypoints, ctx);
        
        // Call countStarJumps with the keypoints of the detected pose
        countStarJumps(keypoints);
      });
  
      // Request the next frame
      requestAnimationFrame(detectPose);
    }
  
    // Function to draw keypoints
    function drawKeypoints(keypoints, ctx) {
      keypoints.forEach((keypoint) => {
        if (keypoint.score > 0.5) {
          const { x, y } = keypoint;
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = 'red';
          ctx.fill();
        }
      });
    }
  
    // Function to draw skeleton
    function drawSkeleton(keypoints, ctx) {
      const adjacentPairs = poseDetection.util.getAdjacentPairs(poseDetection.SupportedModels.MoveNet);
      adjacentPairs.forEach(([i, j]) => {
        const kp1 = keypoints[i];
        const kp2 = keypoints[j];
  
        if (kp1.score > 0.5 && kp2.score > 0.5) {
          ctx.beginPath();
          ctx.moveTo(kp1.x, kp1.y);
          ctx.lineTo(kp2.x, kp2.y);
          ctx.strokeStyle = 'yellow';
          ctx.lineWidth = 5;
          ctx.stroke();
        }
      });
    }
  
    // Start detecting poses
    detectPose();
  }

  setLocalStream(mediaConstraints);



  let jumpCount = 0; // Counter for star jumps
//  let jumpCount = 0; // Player's jump counter
let player1Score = 0;
let player2Score = 0;

  let lastState = "closed"; // Track the last state of the jump

  function countStarJumps(keypoints) {
    // Check if keypoints is defined and has enough elements
    if (!keypoints || keypoints.length < 17) {
        console.error("Keypoints array is not defined or does not have enough elements.");
        return; // Exit the function if the check fails
    }

    // Extract relevant keypoints
    const leftWrist = keypoints[9].y; // Left wrist
    const rightWrist = keypoints[10].y; // Right wrist
    const leftAnkle = keypoints[15].y; // Left ankle
    const rightAnkle = keypoints[16].y; // Right ankle
    const shoulderY = keypoints[5].y; // Shoulder Y position

    // Conditions for a "star" position
    const armsRaised = leftWrist < shoulderY && rightWrist < shoulderY; // Arms are raised above shoulders
    const legsApart = Math.abs(leftAnkle - rightAnkle) > 100; // Legs are apart

    // Check if the current state is a star jump
    if (armsRaised && legsApart) {
        if (lastState === "closed") {
            jumpCount++; // Increment jump count
            console.log("Star jump detected! Total jumps: " + jumpCount);
            if (player === 'player1') {
                player1Score = jumpCount; // Update player1Score
            } else if (player === 'player2') {
                player2Score = jumpCount; // Update player2Score
            }
            message = `${player} ${jumpCount}`;
            socket.emit('send_message', { roomId, message }); 
        }
        lastState = "open"; // Update state to open
    } else {
        lastState = "closed"; // Update state to closed
    }
  }
  

// ... existing code ...