"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"

const BOARD_SIZE = 19
const GAME_SPEED = 200

// Simple maze layout (1 = wall, 0 = dot, 2 = empty, 3 = power pellet)
const INITIAL_MAZE = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 3, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 3, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 0, 1, 1, 1, 2, 1, 2, 1, 1, 1, 0, 1, 1, 1, 1],
  [2, 2, 2, 1, 0, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0, 1, 2, 2, 2],
  [1, 1, 1, 1, 0, 1, 2, 1, 1, 2, 1, 1, 2, 1, 0, 1, 1, 1, 1],
  [2, 2, 2, 2, 0, 2, 2, 1, 2, 2, 2, 1, 2, 2, 0, 2, 2, 2, 2],
  [1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1],
  [2, 2, 2, 1, 0, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0, 1, 2, 2, 2],
  [1, 1, 1, 1, 0, 1, 1, 1, 2, 1, 2, 1, 1, 1, 0, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
  [1, 3, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 3, 1],
  [1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]

const GHOST_POSITIONS = [
  { x: 9, y: 9 },
  { x: 8, y: 9 },
  { x: 10, y: 9 },
  { x: 9, y: 8 },
]

export default function PacManGame() {
  const [pacman, setPacman] = useState({ x: 9, y: 15 })
  const [ghosts, setGhosts] = useState(GHOST_POSITIONS)
  const [maze, setMaze] = useState(INITIAL_MAZE)
  const [direction, setDirection] = useState({ x: 0, y: 0 })
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [powerMode, setPowerMode] = useState(false)
  const gameLoop = useRef()
  const powerModeTimer = useRef()

  const isValidMove = (x, y) => {
    return x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE && maze[y][x] !== 1
  }

  const movePacman = useCallback(() => {
    if (!gameStarted || gameOver) return

    setPacman((current) => {
      const newX = current.x + direction.x
      const newY = current.y + direction.y

      if (!isValidMove(newX, newY)) return current

      // Check if pacman eats a dot or power pellet
      if (maze[newY][newX] === 0) {
        setScore((prev) => prev + 10)
        setMaze((prev) => {
          const newMaze = prev.map((row) => [...row])
          newMaze[newY][newX] = 2
          return newMaze
        })
      } else if (maze[newY][newX] === 3) {
        setScore((prev) => prev + 50)
        setPowerMode(true)
        clearTimeout(powerModeTimer.current)
        powerModeTimer.current = setTimeout(() => setPowerMode(false), 5000)
        setMaze((prev) => {
          const newMaze = prev.map((row) => [...row])
          newMaze[newY][newX] = 2
          return newMaze
        })
      }

      return { x: newX, y: newY }
    })
  }, [direction, gameStarted, gameOver, maze])

  const moveGhosts = useCallback(() => {
    if (!gameStarted || gameOver) return

    setGhosts((currentGhosts) => {
      return currentGhosts.map((ghost) => {
        const directions = [
          { x: 0, y: -1 },
          { x: 0, y: 1 },
          { x: -1, y: 0 },
          { x: 1, y: 0 },
        ]
        const validMoves = directions.filter((dir) => isValidMove(ghost.x + dir.x, ghost.y + dir.y))

        if (validMoves.length === 0) return ghost

        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)]
        return {
          x: ghost.x + randomMove.x,
          y: ghost.y + randomMove.y,
        }
      })
    })
  }, [gameStarted, gameOver])

  useEffect(() => {
    // Check collision with ghosts
    const collision = ghosts.some((ghost) => ghost.x === pacman.x && ghost.y === pacman.y)
    if (collision && !powerMode) {
      setGameOver(true)
    }
  }, [pacman, ghosts, powerMode])

  useEffect(() => {
    if (gameStarted && !gameOver) {
      gameLoop.current = setInterval(() => {
        movePacman()
        moveGhosts()
      }, GAME_SPEED)
    }
    return () => clearInterval(gameLoop.current)
  }, [movePacman, moveGhosts, gameStarted, gameOver])

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameStarted || gameOver) return

      switch (e.key) {
        case "ArrowUp":
          setDirection({ x: 0, y: -1 })
          break
        case "ArrowDown":
          setDirection({ x: 0, y: 1 })
          break
        case "ArrowLeft":
          setDirection({ x: -1, y: 0 })
          break
        case "ArrowRight":
          setDirection({ x: 1, y: 0 })
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [gameStarted, gameOver])

  const resetGame = () => {
    setPacman({ x: 9, y: 15 })
    setGhosts(GHOST_POSITIONS)
    setMaze(INITIAL_MAZE)
    setDirection({ x: 0, y: 0 })
    setScore(0)
    setGameOver(false)
    setGameStarted(false)
    setPowerMode(false)
    clearInterval(gameLoop.current)
    clearTimeout(powerModeTimer.current)
  }

  const startGame = () => {
    setGameStarted(true)
  }

  const renderCell = (x, y) => {
    if (pacman.x === x && pacman.y === y) {
      return "🟡" // Pacman
    }

    const ghost = ghosts.find((g) => g.x === x && g.y === y)
    if (ghost) {
      return powerMode ? "💙" : "👻" // Ghost (blue when in power mode)
    }

    switch (maze[y][x]) {
      case 1:
        return "" // Wall
      case 0:
        return "•" // Dot
      case 3:
        return "⚪" // Power pellet
      default:
        return "" // Empty
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-yellow-400 p-4">
      <div className="bg-gray-900 p-6 rounded-lg border-2 border-yellow-400 shadow-[0_0_20px_#fbbf24]">
        <div
          className="grid bg-black border-2 border-yellow-400"
          style={{
            gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
            width: `${BOARD_SIZE * 20}px`,
            height: `${BOARD_SIZE * 20}px`,
          }}
        >
          {maze.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${y}-${x}`}
                className={`w-5 h-5 flex items-center justify-center text-xs ${
                  cell === 1 ? "bg-blue-600" : "bg-black"
                }`}
              >
                {renderCell(x, y)}
              </div>
            )),
          )}
        </div>
      </div>

      <div className="mt-6 text-center space-y-2">
        <div className="text-2xl font-bold text-yellow-400">SCORE: {score}</div>
        {powerMode && <div className="text-lg text-blue-400 animate-pulse">POWER MODE!</div>}
        <div className="text-sm text-yellow-300">Use arrow keys to move Pac-Man</div>
        {gameOver && <div className="text-2xl font-bold text-red-500 animate-pulse">GAME OVER!</div>}
        {!gameStarted && !gameOver && <div className="text-lg text-yellow-300">Press START to begin</div>}
        <div className="space-x-4">
          {!gameStarted && !gameOver && (
            <Button
              onClick={startGame}
              className="bg-yellow-400 text-black hover:bg-yellow-300 font-bold tracking-wider border-2 border-yellow-400"
            >
              START GAME
            </Button>
          )}
          <Button
            onClick={resetGame}
            className="bg-yellow-400 text-black hover:bg-yellow-300 font-bold tracking-wider border-2 border-yellow-400"
          >
            {gameOver ? "PLAY AGAIN" : "RESET GAME"}
          </Button>
        </div>
      </div>
    </div>
  )
}
