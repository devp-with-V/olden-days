"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"

const BOARD_SIZE = 20
const INITIAL_SNAKE = [{ x: 10, y: 10 }]
const INITIAL_FOOD = { x: 15, y: 15 }
const INITIAL_DIRECTION = { x: 0, y: -1 }
const GAME_SPEED = 150

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE)
  const [food, setFood] = useState(INITIAL_FOOD)
  const [direction, setDirection] = useState(INITIAL_DIRECTION)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const gameLoop = useRef()

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE),
    }
    return newFood
  }, [])

  const moveSnake = useCallback(() => {
    if (gameOver || !gameStarted) return

    setSnake((currentSnake) => {
      const newSnake = [...currentSnake]
      const head = { ...newSnake[0] }

      head.x += direction.x
      head.y += direction.y

      // Check wall collision
      if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
        setGameOver(true)
        return currentSnake
      }

      // Check self collision
      if (newSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true)
        return currentSnake
      }

      newSnake.unshift(head)

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore((prev) => prev + 10)
        setFood(generateFood())
      } else {
        newSnake.pop()
      }

      return newSnake
    })
  }, [direction, food, gameOver, gameStarted, generateFood])

  useEffect(() => {
    if (gameStarted && !gameOver) {
      gameLoop.current = setInterval(moveSnake, GAME_SPEED)
    }
    return () => clearInterval(gameLoop.current)
  }, [moveSnake, gameStarted, gameOver])

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameStarted || gameOver) return

      switch (e.key) {
        case "ArrowUp":
          if (direction.y === 0) setDirection({ x: 0, y: -1 })
          break
        case "ArrowDown":
          if (direction.y === 0) setDirection({ x: 0, y: 1 })
          break
        case "ArrowLeft":
          if (direction.x === 0) setDirection({ x: -1, y: 0 })
          break
        case "ArrowRight":
          if (direction.x === 0) setDirection({ x: 1, y: 0 })
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [direction, gameStarted, gameOver])

  const resetGame = () => {
    setSnake(INITIAL_SNAKE)
    setFood(INITIAL_FOOD)
    setDirection(INITIAL_DIRECTION)
    setGameOver(false)
    setScore(0)
    setGameStarted(false)
    clearInterval(gameLoop.current)
  }

  const startGame = () => {
    setGameStarted(true)
  }

  const isSnakeCell = (x, y) => {
    return snake.some((segment) => segment.x === x && segment.y === y)
  }

  const isFoodCell = (x, y) => {
    return food.x === x && food.y === y
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-green-400 p-4">
      <div className="bg-gray-900 p-6 rounded-lg border-2 border-green-400 shadow-[0_0_20px_#00ff00]">
        <div
          className="grid bg-gray-800 border-2 border-green-400"
          style={{
            gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
            width: `${BOARD_SIZE * 20}px`,
            height: `${BOARD_SIZE * 20}px`,
          }}
        >
          {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, index) => {
            const x = index % BOARD_SIZE
            const y = Math.floor(index / BOARD_SIZE)

            return (
              <div
                key={index}
                className={`w-5 h-5 border border-gray-600 ${
                  isSnakeCell(x, y) ? "bg-green-500" : isFoodCell(x, y) ? "bg-red-500" : "bg-gray-800"
                }`}
              />
            )
          })}
        </div>
      </div>

      <div className="mt-6 text-center space-y-2">
        <div className="text-2xl font-bold text-green-400">SCORE: {score}</div>
        <div className="text-sm text-green-300">Use arrow keys to control the snake</div>
        {gameOver && <div className="text-2xl font-bold text-red-500 animate-pulse">GAME OVER!</div>}
        {!gameStarted && !gameOver && <div className="text-lg text-green-300">Press START to begin</div>}
        <div className="space-x-4">
          {!gameStarted && !gameOver && (
            <Button
              onClick={startGame}
              className="bg-green-400 text-black hover:bg-green-300 font-bold tracking-wider border-2 border-green-400"
            >
              START GAME
            </Button>
          )}
          <Button
            onClick={resetGame}
            className="bg-green-400 text-black hover:bg-green-300 font-bold tracking-wider border-2 border-green-400"
          >
            {gameOver ? "PLAY AGAIN" : "RESET GAME"}
          </Button>
        </div>
      </div>
    </div>
  )
}
