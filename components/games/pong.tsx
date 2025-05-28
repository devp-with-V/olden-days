"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"

const BOARD_WIDTH = 600
const BOARD_HEIGHT = 400
const PADDLE_HEIGHT = 80
const PADDLE_WIDTH = 10
const BALL_SIZE = 10
const PADDLE_SPEED = 5
const BALL_SPEED = 3

export default function PongGame() {
  const [leftPaddle, setLeftPaddle] = useState({ y: BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2 })
  const [rightPaddle, setRightPaddle] = useState({ y: BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2 })
  const [ball, setBall] = useState({
    x: BOARD_WIDTH / 2,
    y: BOARD_HEIGHT / 2,
    dx: BALL_SPEED,
    dy: BALL_SPEED,
  })
  const [score, setScore] = useState({ left: 0, right: 0 })
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [keys, setKeys] = useState({})
  const gameLoop = useRef()

  const resetBall = () => {
    setBall({
      x: BOARD_WIDTH / 2,
      y: BOARD_HEIGHT / 2,
      dx: Math.random() > 0.5 ? BALL_SPEED : -BALL_SPEED,
      dy: Math.random() > 0.5 ? BALL_SPEED : -BALL_SPEED,
    })
  }

  const updateGame = useCallback(() => {
    if (!gameStarted || gameOver) return

    // Move paddles
    setLeftPaddle((prev) => {
      let newY = prev.y
      if (keys["w"] && newY > 0) newY -= PADDLE_SPEED
      if (keys["s"] && newY < BOARD_HEIGHT - PADDLE_HEIGHT) newY += PADDLE_SPEED
      return { y: newY }
    })

    setRightPaddle((prev) => {
      let newY = prev.y
      if (keys["ArrowUp"] && newY > 0) newY -= PADDLE_SPEED
      if (keys["ArrowDown"] && newY < BOARD_HEIGHT - PADDLE_HEIGHT) newY += PADDLE_SPEED
      return { y: newY }
    })

    // Move ball
    setBall((prev) => {
      let newX = prev.x + prev.dx
      const newY = prev.y + prev.dy
      let newDx = prev.dx
      let newDy = prev.dy

      // Ball collision with top/bottom walls
      if (newY <= 0 || newY >= BOARD_HEIGHT - BALL_SIZE) {
        newDy = -newDy
      }

      // Ball collision with left paddle
      if (newX <= PADDLE_WIDTH && newY >= leftPaddle.y && newY <= leftPaddle.y + PADDLE_HEIGHT) {
        newDx = -newDx
        newX = PADDLE_WIDTH
      }

      // Ball collision with right paddle
      if (
        newX >= BOARD_WIDTH - PADDLE_WIDTH - BALL_SIZE &&
        newY >= rightPaddle.y &&
        newY <= rightPaddle.y + PADDLE_HEIGHT
      ) {
        newDx = -newDx
        newX = BOARD_WIDTH - PADDLE_WIDTH - BALL_SIZE
      }

      // Ball goes out of bounds
      if (newX < 0) {
        setScore((prev) => ({ ...prev, right: prev.right + 1 }))
        resetBall()
        return ball
      }
      if (newX > BOARD_WIDTH) {
        setScore((prev) => ({ ...prev, left: prev.left + 1 }))
        resetBall()
        return ball
      }

      return { x: newX, y: newY, dx: newDx, dy: newDy }
    })
  }, [gameStarted, gameOver, keys, leftPaddle.y, rightPaddle.y])

  useEffect(() => {
    if (score.left >= 5 || score.right >= 5) {
      setGameOver(true)
    }
  }, [score])

  useEffect(() => {
    if (gameStarted && !gameOver) {
      gameLoop.current = setInterval(updateGame, 16) // ~60 FPS
    }
    return () => clearInterval(gameLoop.current)
  }, [updateGame, gameStarted, gameOver])

  useEffect(() => {
    const handleKeyDown = (e) => {
      setKeys((prev) => ({ ...prev, [e.key]: true }))
    }

    const handleKeyUp = (e) => {
      setKeys((prev) => ({ ...prev, [e.key]: false }))
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  const resetGame = () => {
    setLeftPaddle({ y: BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2 })
    setRightPaddle({ y: BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2 })
    setScore({ left: 0, right: 0 })
    setGameStarted(false)
    setGameOver(false)
    resetBall()
    clearInterval(gameLoop.current)
  }

  const startGame = () => {
    setGameStarted(true)
    resetBall()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="bg-gray-900 p-6 rounded-lg border-2 border-white shadow-[0_0_20px_#ffffff]">
        <div className="relative bg-black border-2 border-white" style={{ width: BOARD_WIDTH, height: BOARD_HEIGHT }}>
          {/* Center line */}
          <div
            className="absolute bg-white opacity-50"
            style={{
              left: BOARD_WIDTH / 2 - 1,
              top: 0,
              width: 2,
              height: BOARD_HEIGHT,
              backgroundImage:
                "repeating-linear-gradient(0deg, white 0px, white 10px, transparent 10px, transparent 20px)",
            }}
          />

          {/* Left paddle */}
          <div
            className="absolute bg-white"
            style={{
              left: 0,
              top: leftPaddle.y,
              width: PADDLE_WIDTH,
              height: PADDLE_HEIGHT,
            }}
          />

          {/* Right paddle */}
          <div
            className="absolute bg-white"
            style={{
              right: 0,
              top: rightPaddle.y,
              width: PADDLE_WIDTH,
              height: PADDLE_HEIGHT,
            }}
          />

          {/* Ball */}
          <div
            className="absolute bg-white rounded-full"
            style={{
              left: ball.x,
              top: ball.y,
              width: BALL_SIZE,
              height: BALL_SIZE,
            }}
          />
        </div>
      </div>

      <div className="mt-6 text-center space-y-2">
        <div className="text-2xl font-bold text-white">
          PLAYER 1: {score.left} - PLAYER 2: {score.right}
        </div>
        <div className="text-sm text-gray-300">Player 1: W/S keys | Player 2: Arrow Up/Down</div>
        <div className="text-sm text-gray-300">First to 5 points wins!</div>
        {gameOver && (
          <div className="text-2xl font-bold text-green-400 animate-pulse">
            {score.left >= 5 ? "PLAYER 1 WINS!" : "PLAYER 2 WINS!"}
          </div>
        )}
        {!gameStarted && !gameOver && <div className="text-lg text-gray-300">Press START to begin</div>}
        <div className="space-x-4">
          {!gameStarted && !gameOver && (
            <Button
              onClick={startGame}
              className="bg-white text-black hover:bg-gray-200 font-bold tracking-wider border-2 border-white"
            >
              START GAME
            </Button>
          )}
          <Button
            onClick={resetGame}
            className="bg-white text-black hover:bg-gray-200 font-bold tracking-wider border-2 border-white"
          >
            {gameOver ? "PLAY AGAIN" : "RESET GAME"}
          </Button>
        </div>
      </div>
    </div>
  )
}
