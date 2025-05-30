"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"

const BOARD_WIDTH = 500
const BOARD_HEIGHT = 400
const PADDLE_WIDTH = 80
const PADDLE_HEIGHT = 10
const BALL_SIZE = 10
const BRICK_WIDTH = 50
const BRICK_HEIGHT = 20
const BRICK_ROWS = 8
const BRICK_COLS = 12
const BALL_SPEED = 4
const PADDLE_SPEED = 8

export default function BreakoutGame() {
  const [paddle, setPaddle] = useState({ x: BOARD_WIDTH / 2 - PADDLE_WIDTH / 2, y: BOARD_HEIGHT - 30 })
  const [ball, setBall] = useState({
    x: BOARD_WIDTH / 2,
    y: BOARD_HEIGHT / 2,
    dx: BALL_SPEED,
    dy: -BALL_SPEED,
  })
  const [bricks, setBricks] = useState([])
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [level, setLevel] = useState(1)
  const [keys, setKeys] = useState({})
  const gameLoop = useRef()

  const createBricks = () => {
    const newBricks = []
    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        newBricks.push({
          x: col * BRICK_WIDTH,
          y: row * BRICK_HEIGHT + 50,
          alive: true,
          color: `hsl(${(row * 45) % 360}, 70%, 60%)`,
          points: (BRICK_ROWS - row) * 10,
        })
      }
    }
    return newBricks
  }

  const resetBall = () => {
    setBall({
      x: BOARD_WIDTH / 2,
      y: BOARD_HEIGHT / 2,
      dx: Math.random() > 0.5 ? BALL_SPEED : -BALL_SPEED,
      dy: -BALL_SPEED,
    })
  }

  const updateGame = useCallback(() => {
    if (!gameStarted || gameOver) return

    // Move paddle
    setPaddle((prev) => {
      let newX = prev.x
      if (keys["ArrowLeft"] && newX > 0) newX -= PADDLE_SPEED
      if (keys["ArrowRight"] && newX < BOARD_WIDTH - PADDLE_WIDTH) newX += PADDLE_SPEED
      return { ...prev, x: newX }
    })

    // Move ball
    setBall((prev) => {
      let newX = prev.x + prev.dx
      let newY = prev.y + prev.dy
      let newDx = prev.dx
      let newDy = prev.dy

      // Ball collision with walls
      if (newX <= 0 || newX >= BOARD_WIDTH - BALL_SIZE) {
        newDx = -newDx
        newX = newX <= 0 ? 0 : BOARD_WIDTH - BALL_SIZE
      }
      if (newY <= 0) {
        newDy = -newDy
        newY = 0
      }

      // Ball collision with paddle
      if (
        newY + BALL_SIZE >= paddle.y &&
        newY <= paddle.y + PADDLE_HEIGHT &&
        newX + BALL_SIZE >= paddle.x &&
        newX <= paddle.x + PADDLE_WIDTH
      ) {
        newDy = -Math.abs(newDy) // Always bounce up
        newY = paddle.y - BALL_SIZE

        // Add spin based on where ball hits paddle
        const hitPos = (newX + BALL_SIZE / 2 - paddle.x) / PADDLE_WIDTH
        newDx = (hitPos - 0.5) * BALL_SPEED * 2
      }

      // Ball goes out of bounds (bottom)
      if (newY > BOARD_HEIGHT) {
        setLives((prevLives) => {
          const newLives = prevLives - 1
          if (newLives <= 0) {
            setGameOver(true)
          } else {
            setTimeout(resetBall, 1000)
          }
          return newLives
        })
        return prev
      }

      // Ball collision with bricks
      setBricks((prevBricks) => {
        let hitBrick = false
        const newBricks = prevBricks.map((brick) => {
          if (!brick.alive) return brick

          if (
            newX + BALL_SIZE >= brick.x &&
            newX <= brick.x + BRICK_WIDTH &&
            newY + BALL_SIZE >= brick.y &&
            newY <= brick.y + BRICK_HEIGHT
          ) {
            if (!hitBrick) {
              hitBrick = true
              newDy = -newDy
              setScore((prevScore) => prevScore + brick.points)
            }
            return { ...brick, alive: false }
          }
          return brick
        })

        // Check if all bricks are destroyed
        const remainingBricks = newBricks.filter((brick) => brick.alive)
        if (remainingBricks.length === 0) {
          setTimeout(() => {
            setLevel((prevLevel) => prevLevel + 1)
            setBricks(createBricks())
            resetBall()
          }, 1000)
        }

        return newBricks
      })

      return { x: newX, y: newY, dx: newDx, dy: newDy }
    })
  }, [gameStarted, gameOver, keys, paddle])

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
    setPaddle({ x: BOARD_WIDTH / 2 - PADDLE_WIDTH / 2, y: BOARD_HEIGHT - 30 })
    setBricks(createBricks())
    setScore(0)
    setLives(3)
    setLevel(1)
    setGameStarted(false)
    setGameOver(false)
    resetBall()
    clearInterval(gameLoop.current)
  }

  const startGame = () => {
    setBricks(createBricks())
    setGameStarted(true)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-orange-400 p-4">
      <div className="bg-gray-900 p-6 rounded-lg border-2 border-orange-400 shadow-[0_0_20px_#fb923c]">
        {/* Game Stats */}
        <div className="flex justify-between items-center mb-4 text-orange-400 font-bold">
          <div>SCORE: {score}</div>
          <div>LEVEL: {level}</div>
          <div>LIVES: {"🔴".repeat(lives)}</div>
        </div>

        <div
          className="relative bg-black border-2 border-orange-400 overflow-hidden"
          style={{ width: BOARD_WIDTH, height: BOARD_HEIGHT }}
        >
          {/* Bricks */}
          {bricks.map(
            (brick, index) =>
              brick.alive && (
                <div
                  key={index}
                  className="absolute border border-gray-600 transition-all duration-200"
                  style={{
                    left: brick.x,
                    top: brick.y,
                    width: BRICK_WIDTH,
                    height: BRICK_HEIGHT,
                    backgroundColor: brick.color,
                    boxShadow: `0 0 5px ${brick.color}`,
                  }}
                />
              ),
          )}

          {/* Paddle */}
          <div
            className="absolute bg-orange-400 rounded transition-all duration-100"
            style={{
              left: paddle.x,
              top: paddle.y,
              width: PADDLE_WIDTH,
              height: PADDLE_HEIGHT,
              boxShadow: "0 0 10px #fb923c",
            }}
          />

          {/* Ball */}
          <div
            className="absolute bg-white rounded-full transition-all duration-75"
            style={{
              left: ball.x,
              top: ball.y,
              width: BALL_SIZE,
              height: BALL_SIZE,
              boxShadow: "0 0 8px #ffffff",
            }}
          />
        </div>
      </div>

      <div className="mt-6 text-center space-y-2">
        <div className="text-sm text-orange-300">Arrow keys to move paddle</div>
        {gameOver && (
          <div className="text-2xl font-bold text-red-500 animate-pulse">
            {lives <= 0 ? "GAME OVER!" : "LEVEL COMPLETE!"}
          </div>
        )}
        {!gameStarted && !gameOver && <div className="text-lg text-orange-300">Press START to break out!</div>}
        <div className="space-x-4">
          {!gameStarted && !gameOver && (
            <Button
              onClick={startGame}
              className="bg-orange-400 text-black hover:bg-orange-300 font-bold tracking-wider border-2 border-orange-400"
            >
              START GAME
            </Button>
          )}
          <Button
            onClick={resetGame}
            className="bg-orange-400 text-black hover:bg-orange-300 font-bold tracking-wider border-2 border-orange-400"
          >
            {gameOver ? "PLAY AGAIN" : "RESET GAME"}
          </Button>
        </div>
      </div>
    </div>
  )
}
