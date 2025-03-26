import { useState, useEffect } from "react";

const generateShuffledGrid = (size) => {
  let numbers = [...Array(size * size).keys()];
  do {
    numbers.sort(() => Math.random() - 0.5);
  } while (!isSolvable(numbers, size));
  return numbers;
};

const isSolvable = (arr, size) => {
  let inversions = 0;
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] && arr[j] && arr[i] > arr[j]) inversions++;
    }
  }
  return inversions % 2 === 0;
};

const SlidePuzzle = ({ size = 3 }) => {
  const [grid, setGrid] = useState(generateShuffledGrid(size));
  const emptyIndex = grid.indexOf(0);
  
  const swapTiles = (index) => {
    const validMoves = [
      emptyIndex - size,
      emptyIndex + size,
      emptyIndex - 1,
      emptyIndex + 1,
    ];

    // Check if the clicked tile is adjacent to the empty tile
    const rowDiff = Math.abs(Math.floor(index / size) - Math.floor(emptyIndex / size));
    const colDiff = Math.abs(index % size - emptyIndex % size);
    
    if (!(rowDiff === 1 && colDiff === 0) && !(rowDiff === 0 && colDiff === 1)) return;

    let newGrid = [...grid];
    [newGrid[emptyIndex], newGrid[index]] = [newGrid[index], newGrid[emptyIndex]];
    setGrid(newGrid);
  };
  
  const isSolved = () => {
    return grid.every((val, idx) => val === (idx === size * size - 1 ? 0 : idx + 1));
  };
  
  useEffect(() => {
    if (isSolved()) {
      alert("Congratulations! You solved the puzzle!");
    }
  }, [grid]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Slide Puzzle Game</h1>
      <div 
        className={`grid gap-2 bg-gray-200 p-4 rounded-lg shadow-md`}
        style={{ 
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`, 
          maxWidth: `${size * 100}px` 
        }}
      >
        {grid.map((num, idx) => (
          <div
            key={idx}
            className={`
              w-20 h-20 flex items-center justify-center 
              ${num === 0 ? 'bg-gray-400 cursor-default' : 'bg-orange-500 text-white cursor-pointer'}
              rounded-lg text-2xl font-semibold 
              transition-colors duration-200 ease-in-out
              hover:${num !== 0 ? 'bg-blue-600' : ''}
              active:${num !== 0 ? 'scale-95' : ''}
            `}
            onClick={() => num !== 0 && swapTiles(idx)}
          >
            {num !== 0 ? num : ""}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlidePuzzle;