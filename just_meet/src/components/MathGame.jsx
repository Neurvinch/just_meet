import React, { useState, useEffect } from "react";
import { Play, Repeat, Award, Clock, CheckCircle2, XCircle } from 'lucide-react';

const generateEquation = () => {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operator = ["+", "-", "*"][Math.floor(Math.random() * 3)];
  let correctAnswer;
  
  switch (operator) {
    case "+": correctAnswer = num1 + num2; break;
    case "-": correctAnswer = num1 - num2; break;
    case "*": correctAnswer = num1 * num2; break;
    default: correctAnswer = num1 + num2;
  }
  
  const isFake = Math.random() > 0.5;
  const displayedAnswer = isFake ? correctAnswer + (Math.random() > 0.5 ? 1 : -1) : correctAnswer;
  
  return { num1, num2, operator, displayedAnswer, correctAnswer, isFake };
};

const backgroundImageUrls = [
  '/api/placeholder/200/200?math',
  '/api/placeholder/220/220?numbers',
  '/api/placeholder/240/240?pattern',
  '/api/placeholder/260/260?geometric',
  '/api/placeholder/280/280?digital'
];

const backgroundImagePositions = [
  { top: 'top-10', left: 'left-5', size: 'w-24 h-24' },
  { top: 'top-20', right: 'right-10', size: 'w-32 h-32' },
  { top: 'top-40', left: 'left-15', size: 'w-28 h-28' },
  { top: 'top-60', right: 'right-20', size: 'w-36 h-36' },
  { top: 'top-80', left: 'left-25', size: 'w-20 h-20' }
];

const MathPuzzleGame = () => {
  const [equation, setEquation] = useState(generateEquation());
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'gameOver'
  const [lastResult, setLastResult] = useState(null);

  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleGameOver();
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameState('playing');
    setEquation(generateEquation());
    setLastResult(null);
  };

  const handleGameOver = () => {
    setGameState('gameOver');
    setHighScore(Math.max(highScore, score));
  };

  const checkAnswer = (isTrue) => {
    if (gameState !== 'playing') return;

    const isCorrect = (isTrue && !equation.isFake) || (!isTrue && equation.isFake);
    
    setLastResult(isCorrect);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    // Generate new equation and reset timer
    setEquation(generateEquation());
    setTimeLeft(30);

    // Clear last result after a short delay
    setTimeout(() => setLastResult(null), 500);
  };

  return (
    <div 
      className="relative min-h-screen flex items-center justify-center p-4 pixel-font"
      style={{ 
        backgroundImage: 'linear-gradient(#e5e5e5 1px, transparent 1px), linear-gradient(90deg, #e5e5e5 1px, transparent 1px)', 
        backgroundSize: '40px 40px' 
      }}
    >
      {/* Background Images */}
      {backgroundImageUrls.map((url, index) => (
        <img 
          key={index} 
          src={url} 
          alt="Background" 
          className={`
            absolute opacity-30 rounded-lg 
            ${backgroundImagePositions[index].top} 
            ${backgroundImagePositions[index].left || backgroundImagePositions[index].right} 
            ${backgroundImagePositions[index].size}
          `}
        />
      ))}

      {/* Game Container */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-2xl rounded-xl overflow-hidden relative z-10">
        {/* Game Header */}
        <div className="bg-gradient-to-r from-orange-300 to-orange-600 text-white p-4 text-center shadow-md">
          <h1 className="text-2xl font-bold tracking-wider flex items-center justify-center">
            <Award className="mr-2" /> Math Puzzle Game
          </h1>
        </div>

        {/* Game Content */}
        <div className="p-6 text-center">
          {gameState === 'start' && (
            <div>
              <h2 className="text-xl mb-4">Test Your Math Skills!</h2>
              <p className="mb-6 text-gray-600">Determine if the equation is true or false before time runs out.</p>
              <button 
                onClick={startGame}
                className="bg-orange-500 text-white px-6 py-3 rounded-full flex items-center justify-center mx-auto hover:bg-orange-600 transition"
              >
                <Play className="mr-2" /> Start Game
              </button>
            </div>
          )}

          {gameState === 'playing' && (
            <>
              {/* Game Stats */}
              <div className="flex justify-between mb-6">
                <div className="flex items-center">
                  <Clock className="mr-2 text-orange-600" />
                  <span className="font-bold">{timeLeft}s</span>
                </div>
                <div className="flex items-center">
                  <Award className="mr-2 text-orange-600" />
                  <span className="font-bold">{score}</span>
                </div>
              </div>

              {/* Equation */}
              <div className={`
                text-3xl mb-6 p-4 rounded-xl 
                ${lastResult === true ? 'bg-green-100 text-green-800' : 
                  lastResult === false ? 'bg-red-100 text-red-800' : 
                  'bg-orange-100 text-orange-800'}
              `}>
                <p>
                  {equation.num1} {equation.operator} {equation.num2} = {equation.displayedAnswer}
                </p>
              </div>

              {/* Answer Buttons */}
              <div className="flex space-x-4 justify-center">
                <button 
                  onClick={() => checkAnswer(true)}
                  className="bg-green-500 text-white px-6 py-3 rounded-full flex items-center hover:bg-green-600 transition"
                >
                  <CheckCircle2 className="mr-2" /> True
                </button>
                <button 
                  onClick={() => checkAnswer(false)}
                  className="bg-red-500 text-white px-6 py-3 rounded-full flex items-center hover:bg-red-600 transition"
                >
                  <XCircle className="mr-2" /> False
                </button>
              </div>
            </>
          )}

          {gameState === 'gameOver' && (
            <div>
              <h2 className="text-2xl mb-4">Game Over!</h2>
              <p className="text-xl mb-4">Your Score: {score}</p>
              <p className="text-lg mb-6">High Score: {highScore}</p>
              <button 
                onClick={startGame}
                className="bg-orange-500 text-white px-6 py-3 rounded-full flex items-center justify-center mx-auto hover:bg-orange-600 transition"
              >
                <Repeat className="mr-2" /> Play Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MathPuzzleGame;