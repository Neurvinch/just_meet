import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const DrawingBoard = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';
    setContext(ctx);

    // Handle incoming draw events
    socket.on('draw', ({ x0, y0, x1, y1 }) => {
      drawLine(ctx, x0, y0, x1, y1);
    });

    // Handle canvas clear
    socket.on('clearCanvas', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    return () => {
      socket.off('draw');
      socket.off('clearCanvas');
    };
  }, []);

  const drawLine = (ctx, x0, y0, x1, y1) => {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.closePath();
  };

  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const prevX = context.currentX || offsetX;
    const prevY = context.currentY || offsetY;

    drawLine(context, prevX, prevY, offsetX, offsetY);
    socket.emit('draw', { x0: prevX, y0: prevY, x1: offsetX, y1: offsetY });

    context.currentX = offsetX;
    context.currentY = offsetY;
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    context.currentX = null;
    context.currentY = null;
  };

  const clearCanvas = () => {
    socket.emit('clearCanvas');
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto' }}>
      <h2>Drawing Board</h2>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        style={{ border: '1px solid #ccc' }}
      />
      <button
        onClick={clearCanvas}
        style={{ marginTop: '10px', padding: '5px 10px' }}
      >
        Clear Canvas
      </button>
    </div>
  );
};

export default DrawingBoard;