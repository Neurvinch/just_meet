import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const socket = io('http://localhost:5000');

const DrawingBoard = () => {
  const canvasRef = useRef(null);
  const backgroundCanvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPosition = useRef({ x: null, y: null });
  const [context, setContext] = useState(null);
  const [backgroundContext, setBackgroundContext] = useState(null);
  const [drawColor, setDrawColor] = useState('black');
  const [brushSize, setBrushSize] = useState(2);
  const navigate = useNavigate();

  // Configurable background images
  const [backgroundImages, setBackgroundImages] = useState([
    { src: "/p1.png", top: "top-10", left: "left-5" },
    { src: "/p2.webp", top: "top-1/4", right: "right-10" },
    { src: "/p3.jpg", bottom: "bottom-20", left: "left-1/3" },
    { src: "/p5.png", top: "top-1/2", right: "right-1/4" },
    { src: "/p6.png", bottom: "bottom-10", right: "right-1/3" }
  
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const backgroundCanvas = backgroundCanvasRef.current;
    if (!canvas || !backgroundCanvas) return;

    // Set canvas dimensions
    const width = 600;
    const height = 400;
    canvas.width = backgroundCanvas.width = width;
    canvas.height = backgroundCanvas.height = height;

    // Drawing context setup
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = drawColor;
    setContext(ctx);

    // Background context setup
    const bgCtx = backgroundCanvas.getContext('2d');
    setBackgroundContext(bgCtx);

    // Draw grid
    drawGrid(bgCtx, width, height);

    // Draw background images
    backgroundImages.forEach(img => {
      const image = new Image();
      image.onload = () => {
        bgCtx.drawImage(image, 
          img.left ? parseInt(img.left) * width / 100 : 
          img.right ? width - parseInt(img.right) * width / 100 : 0, 
          img.top ? parseInt(img.top) * height / 100 : 
          img.bottom ? height - parseInt(img.bottom) * height / 100 : 0
        );
      };
      image.src = img.src;
    });

    // Socket event handlers
    socket.on('draw', ({ x0, y0, x1, y1, color, lineWidth }) => {
      if (!ctx) return;
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      drawLine(ctx, x0, y0, x1, y1);
    });

    socket.on('clearCanvas', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    return () => {
      socket.off('draw');
      socket.off('clearCanvas');
    };
  }, [drawColor, brushSize, backgroundImages]);

  // Draw grid function
  const drawGrid = (ctx, width, height, gridSize = 20) => {
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.2)';
    ctx.lineWidth = 1;

    // Vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }

    // Horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }

    ctx.stroke();
    ctx.closePath();
  };

  // Rest of the component remains the same as previous implementation...
  const drawLine = (ctx, x0, y0, x1, y1) => {
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.closePath();
  };

  const startDrawing = (e) => {
    if (!context) return;
    isDrawingRef.current = true;
    lastPosition.current = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
  };

  const draw = (e) => {
    if (!isDrawingRef.current || !context) return;

    const { offsetX, offsetY } = e.nativeEvent;
    const { x: prevX, y: prevY } = lastPosition.current;

    drawLine(context, prevX, prevY, offsetX, offsetY);
    socket.emit('draw', {
      x0: prevX,
      y0: prevY,
      x1: offsetX,
      y1: offsetY,
      color: drawColor,
      lineWidth: brushSize
    });

    lastPosition.current = { x: offsetX, y: offsetY };
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
    lastPosition.current = { x: null, y: null };
  };

  const clearCanvas = () => {
    if (!context) return;
    socket.emit('clearCanvas');
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const handleClearCanvas = () => {
    clearCanvas();
    navigate('/environment');
  };

  const colorOptions = ['black', 'red', 'blue', 'green', 'purple', 'orange'];

  return (
    <div className="min-h-screen bg-black-100 flex flex-col items-center justify-center p-4">
      {/* Grid Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="grid grid-cols-12 grid-rows-12 h-full w-full opacity-10">
          {[...Array(144)].map((_, index) => (
            <div 
              key={index} 
              className="border border-gray-300 dark:border-gray-700"
            ></div>
          ))}
        </div>
      </div>

      {/* Background Images */}
      {backgroundImages.map((image, index) => (
        <div 
          key={index} 
          className={`absolute ${image.top || ''} ${image.bottom || ''} ${image.left || ''} ${image.right || ''} opacity-20 z-0`}
        >
          <img 
            src={image.src} 
            alt={`Background image ${index + 1}`} 
            className="rounded-2xl shadow-lg transform rotate-6 hover:rotate-0 transition-all duration-300 w-30 h-30"
          />
        </div>
      ))}

      <div className="bg-black shadow-2xl rounded-2xl p-6 w-full max-w-3xl relative">
        <h2 className="text-3xl font-bold text-center mb-6 text-green-500 pixel-font">
          Collaborative Drawing Board
        </h2>

        <div className="flex justify-center mb-4 space-x-4">
          {/* Color Picker */}
          <div className="flex items-center space-x-2">
            {colorOptions.map((color) => (
              <button
                key={color}
                onClick={() => setDrawColor(color)}
                className={`w-8 h-8 rounded-full border-2 ${
                  drawColor === color ? 'border-black scale-125' : 'border-transparent hover:border-gray-300'
                } transition-all`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          {/* Brush Size */}
          <div className="flex items-center space-x-2">
            <label className="text-gray-700">Brush Size:</label>
            <input
              type="range"
              min="1"
              max="10"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        <div className="flex justify-center mb-4 relative">
          {/* Background Canvas with Grid and Images */}
          <canvas
            ref={backgroundCanvasRef}
            className="absolute top-0 left-0 z-0 pointer-events-none"
          />
          
          {/* Drawing Canvas */}
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            className="bg-transparent border-4 border-gray-300 rounded-lg shadow-md z-10"
          />
        </div>

        <div className="flex justify-center gap-3 mt-16">
          <button
            onClick={clearCanvas}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300 pixel-font"
          >
            Clear Canvas
          </button>
          <button
            onClick={handleClearCanvas}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 pixel-font"
          >
            Go to Environment
          </button>
        </div>
      </div>
    </div>
  );
};

export default DrawingBoard;