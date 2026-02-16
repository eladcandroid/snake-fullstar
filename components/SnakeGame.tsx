"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = "UP";
const SPEED = 150;

type Point = { x: number; y: number };
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food is on snake
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setIsGameOver(false);
    setScore(0);
    setFood(generateFood(INITIAL_SNAKE));
    setIsPaused(false);
  }, [generateFood]);

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case "UP":
          newHead.y -= 1;
          break;
        case "DOWN":
          newHead.y += 1;
          break;
        case "LEFT":
          newHead.x -= 1;
          break;
        case "RIGHT":
          newHead.x += 1;
          break;
      }

      // Wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      // Self collision
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((prevScore) => {
          const newScore = prevScore + 10;
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem("snakeHighScore", newScore.toString());
          }
          return newScore;
        });
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood, highScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          if (direction !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
          if (direction !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
          if (direction !== "LEFT") setDirection("RIGHT");
          break;
        case " ":
          if (isGameOver) resetGame();
          else setIsPaused((p) => !p);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction, isGameOver, resetGame]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = setInterval(moveSnake, SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, isPaused, isGameOver]);

  useEffect(() => {
    const saved = localStorage.getItem("snakeHighScore");
    if (saved) {
      setHighScore(parseInt(saved, 10)); // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, []);

  // Remove the other useEffect that was syncing score and highScore

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-4xl font-bold text-emerald-600">Snake Game</h1>
        <div className="flex gap-8 text-xl font-medium">
          <p>Score: <span className="text-emerald-500">{score}</span></p>
          <p>High Score: <span className="text-amber-500">{highScore}</span></p>
        </div>
      </div>

      <div 
        className="relative border-4 border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {/* Render Snake */}
        {snake.map((segment, i) => (
          <div
            key={`${i}-${segment.x}-${segment.y}`}
            className={`absolute w-[20px] h-[20px] transition-all duration-150 ${
              i === 0 ? "bg-emerald-400 z-10" : "bg-emerald-600"
            } rounded-sm`}
            style={{
              left: segment.x * 20,
              top: segment.y * 20,
            }}
          />
        ))}

        {/* Render Food */}
        <div
          className="absolute w-[20px] h-[20px] bg-rose-500 rounded-full animate-pulse"
          style={{
            left: food.x * 20,
            top: food.y * 20,
          }}
        />

        {/* Game Over / Pause Overlays */}
        {(isGameOver || isPaused) && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm text-white">
            {isGameOver ? (
              <>
                <h2 className="text-4xl font-bold mb-4 text-rose-500">GAME OVER</h2>
                <button
                  onClick={resetGame}
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-full font-bold transition-colors"
                >
                  Try Again
                </button>
              </>
            ) : (
              <>
                <h2 className="text-4xl font-bold mb-4">PAUSED</h2>
                <button
                  onClick={() => setIsPaused(false)}
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-full font-bold transition-colors"
                >
                  Resume
                </button>
              </>
            )}
            <p className="mt-4 text-sm text-zinc-400">Press Space to {isGameOver ? 'restart' : 'toggle'}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-2 text-zinc-500 text-sm">
        <p>Use Arrow Keys to move</p>
        <p>Press Space to pause/resume</p>
      </div>
    </div>
  );
}
