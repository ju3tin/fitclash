// ChatInput.js

import React, { useState } from 'react';
import pubnub from './pubnub';

const ChatInput = () => {
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    if (message) {
      pubnub.publish({
        channel: 'chat-channel',
        message: {text: "sdfsdfsd"},
      });
      setMessage('');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatInput;