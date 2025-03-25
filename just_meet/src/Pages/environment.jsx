import React, { useState, useEffect } from "react";

const CharacterMovement = () => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [direction, setDirection] = useState("down");

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowUp":
          setPosition((prev) => ({
            ...prev,
            y: Math.max(0, prev.y - 10),
          }));
          setDirection("up");
          break;
        case "ArrowDown":
          setPosition((prev) => ({
            ...prev,
            y: Math.min(window.innerHeight - 100, prev.y + 10),
          }));
          setDirection("down");
          break;
        case "ArrowLeft":
          setPosition((prev) => ({
            ...prev,
            x: Math.max(0, prev.x - 10),
          }));
          setDirection("left");
          break;
        case "ArrowRight":
          setPosition((prev) => ({
            ...prev,
            x: Math.min(window.innerWidth - 100, prev.x + 10),
          }));
          setDirection("right");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Character images based on direction
  const characterImages = {
    up: "/P1.png",
    down: "/P4.png",
    left: "/p2.webp",
    right: "/p6.png",
  };

  return (
    <div className="relative w-full h-screen ">
      {/* New Image (Bottom Layer) */}
      <div className="absolute bottom-80 left-0 w-full h-full">
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
        className="absolute transition-all duration-100 ease-in-out z-20"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <img src={characterImages[direction]} alt="Character" className="w-16 h-16" />
      </div>
  
      {/* Instructions */}
      <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-md z-30">
        <p className="font-bold">Use Arrow Keys to Move</p>
      </div>
    </div>
  );
};  
export default CharacterMovement;
