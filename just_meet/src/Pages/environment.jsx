import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EnvironmentPage = () => {
  const [position, setPosition] = useState({ x: 150, y: 500 }); // Character starting position
  const [direction, setDirection] = useState('down');
  const navigate = useNavigate();

  // Default portal positions (converted from original CSS classes)
  const defaultPortals = [
    { src: '/mud.webp', x: window.innerWidth - 126, y: window.innerHeight - 46, link: '/' }, // bottom-10 right-90
    { src: '/money.png', x: 140, y: 90, link: '/pay' }, // top-90 left-140
    { src: '/vote.png', x: 130, y: window.innerHeight - 66, link: '/poll' }, // bottom-30 left-130
    { src: '/board.png', x: window.innerWidth - 56, y: window.innerHeight - 70, link: '/Games' }, // bottom-40 right-30
    { src: '/c44.png', x: 255, y: 23, link: '/Home' }, // top-23 left-255
    { src: '/vc.png', x: 210, y: window.innerHeight - 120, link: '/Chat' }, // bottom-90 left-210
    { src: '/boa.png', x: 50, y: window.innerHeight - 156, link: '/board' }, // bottom-120 left-50
    { src: '/info.png', x: window.innerWidth - 156, y: 110, link: '/chatbot' }, // top-110 right-130
    { src: '/c3.png', x: 170, y: 180, link: '/ann' }, // top-180 left-170
    { src: '/c2.png', x: window.innerWidth - 206, y: 180, link: '/TaskList' }, // top-180 right-170
    { src: '/c2.png', x: 90, y: 110, link: '/Taskboard' }, // top-110 left-90
  ];

  // Load portals from localStorage or use defaults
  const [portals, setPortals] = useState(() => {
    const savedPortals = localStorage.getItem('portals');
    return savedPortals ? JSON.parse(savedPortals) : defaultPortals;
  });

  // State for dragging
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Save portals to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('portals', JSON.stringify(portals));
  }, [portals]);

  // Handle character movement and collision
  useEffect(() => {
    const handleKeyDown = (e) => {
      let newX = position.x;
      let newY = position.y;

      switch (e.key) {
        case 'ArrowUp':
          newY = Math.max(0, position.y - 10);
          setDirection('up');
          break;
        case 'ArrowDown':
          newY = Math.min(window.innerHeight - 100, position.y + 10);
          setDirection('down');
          break;
        case 'ArrowLeft':
          newX = Math.max(0, position.x - 10);
          setDirection('left');
          break;
        case 'ArrowRight':
          newX = Math.min(window.innerWidth - 100, position.x + 10);
          setDirection('right');
          break;
        default:
          return;
      }

      // Update character position
      setPosition({ x: newX, y: newY });

      // Check for collision with portals
      portals.forEach((portal) => {
        const characterWidth = 36;
        const characterHeight = 46;
        const portalWidth = 36;
        const portalHeight = 36;

        const isColliding =
          newX < portal.x + portalWidth &&
          newX + characterWidth > portal.x &&
          newY < portal.y + portalHeight &&
          newY + characterHeight > portal.y;

        if (isColliding) {
          navigate(portal.link);
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [position, portals, navigate]);

  // Handle dragging
  const handleMouseDown = (e, index) => {
    const rect = e.target.getBoundingClientRect();
    setDraggingIndex(index);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e) => {
    if (draggingIndex !== null) {
      const newX = Math.max(0, Math.min(window.innerWidth - 36, e.clientX - dragOffset.x));
      const newY = Math.max(0, Math.min(window.innerHeight - 36, e.clientY - dragOffset.y));

      setPortals((prev) =>
        prev.map((portal, idx) =>
          idx === draggingIndex ? { ...portal, x: newX, y: newY } : portal
        )
      );
    }
  };

  const handleMouseUp = () => {
    setDraggingIndex(null);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingIndex, dragOffset]);

  const characterImages = {
    up: '/b1.png',
    down: '/f.png',
    left: '/l1.png',
    right: '/r1.png',
  };

  return (
    <div className="relative w-full h-screen">
      {/* Portals */}
      {portals.map((portal, index) => (
        <div
          key={index}
          className="absolute z-50 drop-shadow-[0_0_15px_rgba(255,215,0,0.9)] hover:drop-shadow-[0_0_20px_rgba(255,215,0,1)] cursor-move"
          style={{ left: `${portal.x}px`, top: `${portal.y}px` }}
          onMouseDown={(e) => handleMouseDown(e, index)}
        >
          <img src={portal.src} alt={`Portal ${index}`} className="w-36 h-36" />
        </div>
      ))}

      {/* New Image (Bottom Layer) */}
      <div className="absolute bottom-80 left-0 w-full h-full z-0">
        <img
          src="/cld.avif"
          alt="Bottom Layer"
          className="w-full h-full filter brightness-70 contrast-125"
        />
      </div>

      {/* Background Image (Top Layer) */}
      <div className="absolute inset-0 w-full h-full z-10">
        <img
          src="/bg-removebg-preview.png"
          alt="Background"
          className="w-full h-full filter brightness-125 contrast-125 drop-shadow-xl"
        />
      </div>

      {/* Character */}
      <div
        className="absolute transition-all duration-100 ease-in-out z-20 animate-bounce"
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      >
        <img src={characterImages[direction]} alt="Character" className="w-36 h-46" />
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-md z-30">
        <p className="font-bold">Use Arrow Keys to Move | Click and Drag Portals</p>
      </div>
    </div>
  );
};

export default EnvironmentPage;