import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EnvironmentPage = () => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [direction, setDirection] = useState("down");
  const navigate = useNavigate();


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

  const characterImages = {
    up: "/c1.png",
    down: "/c1.png",
    left: "/c1.png",
    right: "/c1.png",
  };

  return (
    <div className="relative w-full h-screen">
      {/* Additional Images */}
      {/* <img src="/extra1.png" className="absolute bottom-80 left-50 w-16 h-16 z-50" alt="Extra 1" /> */}
      <img src="/money.png" className="absolute top-90 left-140 w-26 h-56 z-50" alt="Extra 2" />
      <img src="/c.png" className="absolute bottom-40 left-130 w-36 h-46 z-50" alt="Extra 3" />
      <img src="/board.png" className="absolute bottom-50 right-30 w-16 h-30 z-50" alt="Extra 4" />
      <img src="/c44.png" className="absolute top-23 left-255 w-40 h-40 z-50" alt="Extra 5" />
      <img
      src="/vc.png"
      className="absolute bottom-90 left-210 w-30 h-30 z-50 cursor-pointer"
      alt="Extra 6"
      onClick={() => navigate("/Landing")}
    />
      <img src="/boa.png" className="absolute bottom-120 left-50 w-36 h-36 z-50" alt="Extra 7" />
      <img src="info.png" className="absolute top-120 right-130 w-26 h-56 z-50" alt="Extra 8" />
      
      {/* New Image (Bottom Layer) */}
      <div className="absolute bottom-80 left-0 w-full h-full z-0">
        <img src="/cld.avif" alt="Bottom Layer" className="w-full h-full filter brightness-70 contrast-125" />
      </div>

      {/* Background Image (Top Layer) */}
      <div className="absolute inset-0 w-full h-full z-10">
        <img src="/bg-removebg-preview.png" alt="Background" className="w-full h-full filter brightness-125 contrast-125 drop-shadow-xl" />
      </div>

      {/* Character */}
      <div
        className="absolute transition-all duration-100 ease-in-out z-20"
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      >
        <img src={characterImages[direction]} alt="Character" className="w-16 h-36" />
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-md z-30">
        <p className="font-bold">Use Arrow Keys to Move</p>
      </div>
    </div>
  );
};

export default EnvironmentPage;