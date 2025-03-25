import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const LandPage = () => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate('/environment');
  };

  return (
    <div className="min-h-screen bg-[#5c946e] flex flex-col items-center justify-center pixel-bg p-4">
      <div className="pixel-border bg-[#2c2f33] p-8 rounded-lg shadow-lg text-center max-w-md w-full">
        <h1 className="text-4xl font-bold mb-4 text-[#e2d68a] pixel-text">
          Pixel Land Adventures
        </h1>
        
        <div className="pixel-art-container mb-6">
          <div className="pixel-character mx-auto w-32 h-32 bg-[#7ed6df] relative">
            <div className="pixel-head absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-[#ff9ff3]"></div>
            <div className="pixel-body absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-16 bg-[#54a0ff]"></div>
          </div>
        </div>
        
        <p className="text-[#f6e58d] mb-6 text-lg">
          Embark on a nostalgic journey through a pixelated world of wonder and excitement!
        </p>
        
        <Button 
          onClick={handleExploreClick}
          className="pixel-button bg-[#ff6b6b] hover:bg-[#ff4757] text-white transition-all duration-300 transform hover:scale-105"
        >
          Explore Pixel Land
        </Button>
      </div>
    </div>
  );
};

export default LandPage;