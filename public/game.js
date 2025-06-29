// Initialize PubNub
const pubnub = new PubNub({
    publishKey: 'pub-c-561a7378-fa06-4c50-a331-5c0056d0163c',
    subscribeKey: 'sub-c-17b7db8a-3915-11e4-9868-02ee2ddab7fe',
    uuid: 'player-' + Math.floor(Math.random() * 10000) // Unique ID per player
});

// Get room name from URL parameter, default to 'game-room-1' if not present
const urlParams = new URLSearchParams(window.location.search);
const room = urlParams.get('room') || 'game-room-1';

let players = new Set();

pubnub.subscribe({ channels: [room], withPresence: true });

pubnub.addListener({
    message: function(event) { 
        const messageArea = document.getElementById('messages');
        const msg = `${event.publisher}: ${event.message.text}`;
        const p = document.createElement('p');
        p.textContent = msg;
        messageArea.appendChild(p);
    },
    presence: function(event) {
        if (event.action === 'join') {
            players.add(event.uuid);
        } else if (event.action === 'leave' || event.action === 'timeout') {
            players.delete(event.uuid);
        }

        // Update status
        const statusDiv = document.getElementById('status');
        statusDiv.textContent = `Players in room: ${players.size}`;

        // Optional: Enforce 2-player limit
        if (players.size > 2) {
            alert('Room is full!');
            pubnub.unsubscribe({ channels: [room] });
        }
    }
});

// Send message
document.getElementById('sendBtn').addEventListener('click', () => {
    const messageInput = document.getElementById('messageInput');
    const text = messageInput.value.trim();
    if (text) {
        pubnub.publish({
            channel: room,
            message: { text }
        });
        messageInput.value = '';
    }
});
