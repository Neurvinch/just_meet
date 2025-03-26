import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";

const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");

  const createRoom = () => {
    const newRoomId = uuidV4();
    navigate(`/room/${newRoomId}`);
  };

  const imagePositions = [
    { top: 'top-10', left: 'left-5' },
    { top: 'top-20', left: 'right-10' },
    { top: 'top-40', left: 'left-15' },
    { top: 'top-60', left: 'right-20' },
    { top: 'top-80', left: 'left-25' }
  ];

  const imageUrls = [
    '/p1.png',
    '/p2.webp',
    '/p3.jpg',
    '/p5.png',
    '/p6.png'
  ];

  return (
    <div 
      className="relative min-h-screen bg-gray-100 overflow-hidden pixel-font"
      style={{ 
        backgroundImage: 'linear-gradient(#e5e5e5 1px, transparent 1px), linear-gradient(90deg, #e5e5e5 1px, transparent 1px)', 
        backgroundSize: '40px 40px' 
      }}
    >
      {/* Positioned background images */}
      {imageUrls.map((url, index) => (
        <img 
          key={index} 
          src={url} 
          alt="Random background" 
          className={`absolute opacity-30 rounded-lg w-24 h-24 ${imagePositions[index].top} ${imagePositions[index].left}`}
        />
      ))}

      {/* Main container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md relative">
          {/* Top Image - Outside the white container */}
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 z-20">
            <img 
              src="/pp.webp" 
              alt="WebRTC Illustration" 
              className="w-40 h-40 "
            />
          </div>

          {/* WebRTC Container */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-black p-8 pt-24">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-blue-600 tracking-wider">
                WebRTC Stream
              </h1>
              <p className="text-gray-500 mt-2">Create or Join a Live Stream Room</p>
            </div>

            {/* Room Creation Section */}
            <div className="space-y-6">
              <button 
                onClick={createRoom}
                className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition-colors duration-300"
              >
                Create New Room
              </button>

              <div className="flex items-center justify-center space-x-2">
                <div className="h-px bg-gray-300 w-full"></div>
                <span className="text-gray-500 px-2">OR</span>
                <div className="h-px bg-gray-300 w-full"></div>
              </div>

              <div className="flex space-x-2 ">
                <input
                  type="text"
                  placeholder="Enter Room ID"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="flex-grow p-1 text-[0.8rem] border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  onClick={() => navigate(`/room/${roomId}`)}
                  className="bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                >
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;