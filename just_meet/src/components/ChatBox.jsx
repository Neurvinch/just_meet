import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { MessageCircle, Send, X } from 'lucide-react';

const socket = io("http://localhost:5000"); // Connect to backend

const ChatBox = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, { 
        text: msg, 
        sender: 'friend' 
      }]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() !== "") {
      const newMessage = { 
        text: message, 
        sender: 'user' 
      };
      
      socket.emit("send-message", message);
      setMessages((prev) => [...prev, newMessage]); 
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-45 right-120">
      {/* Chat Bot Symbol */}
      {!isChatOpen && (
        <button 
          onClick={() => setIsChatOpen(true)}
          className="bg-blue-500 text-white p-4 rounded-full shadow-2xl hover:bg-blue-600 transition-all duration-300 ease-in-out"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Container */}
      {isChatOpen && (
        <div className="w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col">
          {/* Chat Header */}
          <div className="bg-blue-500 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <h2 className="text-lg font-semibold">Chat with Friend</h2>
            <button 
              onClick={() => setIsChatOpen(false)}
              className="hover:bg-blue-600 rounded-full p-1"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-grow overflow-y-auto p-4 space-y-2 max-h-96">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`
                    px-4 py-2 rounded-2xl max-w-[75%]
                    ${msg.sender === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-black'}
                  `}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 flex items-center space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={sendMessage}
              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-all"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;