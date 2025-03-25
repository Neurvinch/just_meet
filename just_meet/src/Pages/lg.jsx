import React, { useState } from 'react';

const PixelAuthPage = () => {
  const [isSignup, setIsSignup] = useState(true);
  const imagePositions = [
    { top: 'top-10', left: 'left-100' },
    { top: 'top-0', left: 'right-80' },
    { top: 'top-60', left: 'left-35' },
    { top: 'top-60', left: 'right-20' },
    { top: 'bottom-20', left: 'left-[500px]' },
    { top: 'bottom-20', left: 'right-[500px]' }
  ];
  const imageUrls = [
    '/p1.png',
  '/p6.png',
  '/p3.jpg',
  '/p1.png',
  '/p4.png',
  '/p5.png',
  ];

  return (
    <div 
      className="relative min-h-screen bg-gray-100 overflow-hidden"
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

      
<div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md relative">
          {/* Top Image - Outside the white container */}
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 z-20">
            <img 
              src="/pp.webp" 
              alt="Authentication Illustration" 
              className="w-40 h-40 "
            />
          </div>

          {/* Authentication Container */}
          <div className="bg-black rounded-2xl shadow-2xl overflow-hidden border-4 border-white p-8 pt-24 relative">
            {/* Pixel border effect */}
            <div className="absolute inset-0 border-4 border-white opacity-50 pointer-events-none"></div>
            
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white pixel-font tracking-wider">
                Just_meet
              </h1>
            </div>
            
            {/* Toggle Switch */}
            <div className="flex justify-center mb-8 pixel-font">
              <div className="bg-gray-800 rounded-full p-1 flex space-x-2">
                <button 
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${isSignup ? 'bg-yellow-300 text-black' : 'text-gray-400'}`}
                  onClick={() => setIsSignup(true)}
                >
                  Sign Up
                </button>
                <button 
                  className={`px-4 py-2 rounded-full transition-all duration-300 ${!isSignup ? 'bg-yellow-300 text-black' : 'text-gray-400'}`}
                  onClick={() => setIsSignup(false)}
                >
                  Sign In
                </button>
              </div>
            </div>

            {/* Form */}
            <form className="space-y-6 pixel-font text-sm">
              {isSignup && (
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  className="w-full p-3 bg-black border-2 border-white text-white rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white" 
                />
              )}
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full p-3 bg-black border-2 border-white text-white rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white" 
              />
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full p-3 bg-black border-2 border-white text-white rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white" 
              />
              {isSignup && (
                <input 
                  type="password" 
                  placeholder="Confirm Password" 
                  className="w-full p-3 bg-black border-2 border-white text-white rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white" 
                />
              )}
              <button 
                type="submit" 
                className="w-full bg-yellow-400 text-black text-sm font-bold py-3 rounded-lg hover:bg-gray-200 pixel-font transition-colors duration-300"
              >
                {isSignup ? 'Create Account' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PixelAuthPage;