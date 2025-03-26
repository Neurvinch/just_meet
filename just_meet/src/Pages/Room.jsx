import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import VideoPlayer from "../components/VideoPlayer";
import ChatBox from "../components/ChatBox";
import FileShare from "../components/FileShare";

const socket = io("http://localhost:5000");

const Room = () => {
  const { roomId } = useParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    socket.emit("join-room", roomId);
  }, [roomId]);

  return (
    <div 
      className="relative min-h-screen bg-gray-100 overflow-hidden"
      style={{ 
        backgroundImage: 'linear-gradient(#e5e5e5 1px, transparent 1px), linear-gradient(90deg, #e5e5e5 1px, transparent 1px)', 
        backgroundSize: '40px 40px' 
      }}
    >
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-5xl relative">
         

          {/* Room Container */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-black p-8 pt-24">
            {/* Room Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-orange-600 pixel-font tracking-wider">
                Room: {roomId}
              </h2>
              
              {/* Responsive Menu Toggle */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden bg-gray-200 p-2 rounded-lg"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 6h16M4 12h16M4 18h16" 
                  />
                </svg>
              </button>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Video Player */}
              <div className="md:col-span-2 bg-gray-100 rounded-lg p-4">
                <VideoPlayer />
              </div>

              {/* Sidebar for Chat and File Share */}
              <div className={`${isMenuOpen ? 'block' : 'hidden'} md:block space-y-6`}>
                <div className="bg-gray-100 rounded-lg p-4">
                  <ChatBox socket={socket} />
                </div>
                <div className="bg-gray-100 rounded-lg p-4">
                  <FileShare socket={socket} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;
