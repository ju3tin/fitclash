"use client"
import React, { useState, useEffect } from "react";
import PubNub from "pubnub";
import { PubNubProvider, usePubNub } from "pubnub-react";

type Message = {
  text: string;
  sender: string;
};

const pubnub = new PubNub({
  publishKey: "pub-c-db637916-0311-418e-ae6d-d189a75c65f3",
  subscribeKey: "sub-c-afc25a91-8330-4942-ac5e-80aec627c0a5",
  secretKey: "sec-c-MjNlNmM5N2ItMjUyNi00YTZmLThlZWYtNmNmMzQ2OTEwZWM0",
  uuid: "user-" + Math.floor(Math.random() * 1000),
});

function Chat() {
  const pubnub = usePubNub();
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    pubnub.subscribe({ channels: ["chat-room"] });

    pubnub.addListener({
      message: (event) => {
        setMessages((msgs) => [...msgs, event.message as Message]);
      },
    });

    return () => {
      pubnub.unsubscribeAll();
    };
  }, [pubnub]);

  const sendMessage = () => {
    if (message.trim()) {
        pubnub.publish(
            {
              channel: "my_channel",
              message: {"text": "Hello World!"}
            },
            function(status, response) {
              console.log(status);
              console.log(response);
            }
          );
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto p-4">
      <div className="flex-1 overflow-y-auto bg-gray-100 rounded-xl p-3 mb-2">
        {messages.map((msg, i) => (
          <div key={i} className="p-2 my-1 bg-white rounded-lg shadow">
            <strong>{msg.sender}: </strong>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-1 border p-2 rounded-l-xl"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 rounded-r-xl"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <PubNubProvider client={pubnub}>
      <Chat />
    </PubNubProvider>
  );
}
