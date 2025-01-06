// DOM elements.
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
roomInput.value = Math.floor(Math.random() * 90000) + 10000;

const roomdude34 = roomInput.value;



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
                connectButton.style.display = "block"

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
  socket.emit('start_call', roomId)
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

  rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event))
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
  } catch (error) {
    console.error('Could not get user media', error)
  }
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
});

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
  
  function countdown(counter, results, value1) {
    if (timeLeft == 0) {
      clearTimeout(timerId);
   //   document.getElementById("onctent1").innerHTML = "";
  //value1 = counter;
    
   //   document.getElementById('onctent1').id = 'two';
   //   openNav();
   alert('timer done');
   //   doSomething();
      
    } else {
      elem.innerHTML = timeLeft + ' seconds remaining';
      timeLeft--;
    }
  }
  
  }
  

// ... existing code ...