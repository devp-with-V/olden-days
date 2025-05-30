"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

const TETROMINOS = {
  I: { shape: [[1, 1, 1, 1]], color: "bg-cyan-500" },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    color: "bg-blue-500",
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
    ],
    color: "bg-orange-500",
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "bg-yellow-500",
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: "bg-green-500",
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    color: "bg-purple-500",
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: "bg-red-500",
  },
}

const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20
const INITIAL_DROP_TIME = 800
const SPEED_INCREASE_FACTOR = 0.95

const createEmptyBoard = () => Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0))

const randomTetromino = () => {
  const keys = Object.keys(TETROMINOS)
  const randKey = keys[Math.floor(Math.random() * keys.length)]
  return TETROMINOS[randKey]
}

export default function EnhancedTetrisGame() {
  const [board, setBoard] = useState(createEmptyBoard())
  const [currentPiece, setCurrentPiece] = useState(null)
  const [nextPiece, setNextPiece] = useState(randomTetromino())
  const [score, setScore] = useState(0)
  const [lines, setLines] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [dropTime, setDropTime] = useState(INITIAL_DROP_TIME)
  const [level, setLevel] = useState(1)
  const [completedRows, setCompletedRows] = useState([])
  const [isPaused, setIsPaused] = useState(false)
  const dropInterval = useRef(null)

  const checkCollision = (x, y, shape) => {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col] !== 0) {
          const newX = x + col
          const newY = y + row
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT || (newY >= 0 && board[newY][newX] !== 0)) {
            return true
          }
        }
      }
    }
    return false
  }

  const isValidMove = (x, y, shape) => !checkCollision(x, y, shape)

  const moveLeft = useCallback(() => {
    if (currentPiece && !isPaused && isValidMove(currentPiece.x - 1, currentPiece.y, currentPiece.tetromino.shape)) {
      setCurrentPiece((prev) => ({ ...prev, x: prev.x - 1 }))
    }
  }, [currentPiece, board, isPaused])

  const moveRight = useCallback(() => {
    if (currentPiece && !isPaused && isValidMove(currentPiece.x + 1, currentPiece.y, currentPiece.tetromino.shape)) {
      setCurrentPiece((prev) => ({ ...prev, x: prev.x + 1 }))
    }
  }, [currentPiece, board, isPaused])

  const moveDown = useCallback(() => {
    if (!currentPiece || isPaused) return
    if (isValidMove(currentPiece.x, currentPiece.y + 1, currentPiece.tetromino.shape)) {
      setCurrentPiece((prev) => ({ ...prev, y: prev.y + 1 }))
    } else {
      placePiece()
    }
  }, [currentPiece, board, isPaused])

  const hardDrop = useCallback(() => {
    if (!currentPiece || isPaused) return
    let dropDistance = 0
    while (isValidMove(currentPiece.x, currentPiece.y + dropDistance + 1, currentPiece.tetromino.shape)) {
      dropDistance++
    }
    setCurrentPiece((prev) => ({ ...prev, y: prev.y + dropDistance }))
    setScore((prev) => prev + dropDistance * 2) // Bonus points for hard drop
    setTimeout(placePiece, 50)
  }, [currentPiece, board, isPaused])

  const rotate = useCallback(() => {
    if (!currentPiece || isPaused) return
    const rotated = currentPiece.tetromino.shape[0].map((_, i) =>
      currentPiece.tetromino.shape.map((row) => row[i]).reverse(),
    )
    let newX = currentPiece.x
    let newY = currentPiece.y

    if (!isValidMove(newX, newY, rotated)) {
      if (isValidMove(newX - 1, newY, rotated)) {
        newX -= 1
      } else if (isValidMove(newX + 1, newY, rotated)) {
        newX += 1
      } else if (isValidMove(newX, newY - 1, rotated)) {
        newY -= 1
      } else {
        return
      }
    }

    setCurrentPiece((prev) => ({
      ...prev,
      x: newX,
      y: newY,
      tetromino: { ...prev.tetromino, shape: rotated },
    }))
  }, [currentPiece, board, isPaused])

  const placePiece = useCallback(() => {
    if (!currentPiece) return
    const newBoard = board.map((row) => [...row])
    currentPiece.tetromino.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          const boardY = y + currentPiece.y
          const boardX = x + currentPiece.x
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            newBoard[boardY][boardX] = currentPiece.tetromino.color
          }
        }
      })
    })
    setBoard(newBoard)
    clearLines(newBoard)
    spawnNewPiece()
  }, [currentPiece, board])

  const clearLines = useCallback(
    (newBoard) => {
      const linesCleared = []
      const updatedBoard = newBoard.filter((row, index) => {
        if (row.every((cell) => cell !== 0)) {
          linesCleared.push(index)
          return false
        }
        return true
      })

      if (linesCleared.length > 0) {
        setCompletedRows(linesCleared)
        setTimeout(() => {
          while (updatedBoard.length < BOARD_HEIGHT) {
            updatedBoard.unshift(Array(BOARD_WIDTH).fill(0))
          }
          setBoard(updatedBoard)
          setCompletedRows([])

          const linePoints = [0, 40, 100, 300, 1200] // Tetris scoring
          const newScore = score + linePoints[linesCleared.length] * (level + 1)
          setScore(newScore)
          setLines((prev) => prev + linesCleared.length)

          if (Math.floor((lines + linesCleared.length) / 10) > level - 1) {
            setLevel((prev) => prev + 1)
            setDropTime((prev) => prev * SPEED_INCREASE_FACTOR)
          }
        }, 500)
      }
    },
    [score, level, lines],
  )

  const spawnNewPiece = useCallback(() => {
    const newPiece = {
      x: Math.floor(BOARD_WIDTH / 2) - 1,
      y: 0,
      tetromino: nextPiece,
    }
    setNextPiece(randomTetromino())

    if (checkCollision(newPiece.x, newPiece.y, newPiece.tetromino.shape)) {
      setGameOver(true)
    } else {
      setCurrentPiece(newPiece)
    }
  }, [board, nextPiece])

  const togglePause = () => {
    setIsPaused((prev) => !prev)
  }

  useEffect(() => {
    if (!currentPiece && !gameOver) {
      spawnNewPiece()
    }
  }, [currentPiece, gameOver, spawnNewPiece])

  useEffect(() => {
    if (!gameOver && !isPaused) {
      dropInterval.current = setInterval(moveDown, dropTime)
    }
    return () => clearInterval(dropInterval.current)
  }, [moveDown, gameOver, dropTime, isPaused])

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver) return
      switch (e.key) {
        case "ArrowLeft":
          moveLeft()
          break
        case "ArrowRight":
          moveRight()
          break
        case "ArrowDown":
          moveDown()
          break
        case "ArrowUp":
          rotate()
          break
        case " ":
          e.preventDefault()
          hardDrop()
          break
        case "p":
        case "P":
          togglePause()
          break
        default:
          break
      }
    }
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [moveLeft, moveRight, moveDown, rotate, hardDrop, gameOver])

  const resetGame = () => {
    setBoard(createEmptyBoard())
    setCurrentPiece(null)
    setNextPiece(randomTetromino())
    setScore(0)
    setLines(0)
    setGameOver(false)
    setDropTime(INITIAL_DROP_TIME)
    setLevel(1)
    setCompletedRows([])
    setIsPaused(false)
    clearInterval(dropInterval.current)
  }

  const renderCell = (x, y) => {
    if (
      currentPiece &&
      currentPiece.tetromino.shape[y - currentPiece.y] &&
      currentPiece.tetromino.shape[y - currentPiece.y][x - currentPiece.x]
    ) {
      return currentPiece.tetromino.color
    }
    return board[y][x]
  }

  const renderNextPiece = () => {
    return (
      <div className="bg-gray-800 p-4 rounded border-2 border-green-400">
        <h3 className="text-green-400 font-bold mb-2">NEXT</h3>
        <div className="grid grid-cols-4 gap-1">
          {Array.from({ length: 16 }).map((_, index) => {
            const x = index % 4
            const y = Math.floor(index / 4)
            const isNextPiece = nextPiece.shape[y] && nextPiece.shape[y][x]
            return <div key={index} className={`w-4 h-4 ${isNextPiece ? nextPiece.color : "bg-gray-700"}`} />
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-black text-green-400 p-4 gap-8">
      {/* Game Board */}
      <div className="bg-gray-900 p-6 rounded-lg border-2 border-green-400 shadow-[0_0_20px_#00ff00]">
        <div
          className="grid bg-gray-800 border-2 border-green-400"
          style={{
            gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)`,
            width: `${BOARD_WIDTH * 25}px`,
            height: `${BOARD_HEIGHT * 25}px`,
          }}
        >
          {board.map((row, y) =>
            row.map((_, x) => (
              <AnimatePresence key={`${y}-${x}`}>
                <motion.div
                  initial={false}
                  animate={{
                    opacity: completedRows.includes(y) ? 0 : 1,
                    scale: completedRows.includes(y) ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`w-6 h-6 border border-gray-600 ${renderCell(x, y) || "bg-gray-800"}`}
                />
              </AnimatePresence>
            )),
          )}
        </div>
      </div>

      {/* Game Info Panel */}
      <div className="space-y-6">
        {/* Stats */}
        <div className="bg-gray-900 p-4 rounded border-2 border-green-400">
          <div className="space-y-2 text-green-400 font-bold">
            <div>SCORE: {score.toLocaleString()}</div>
            <div>LINES: {lines}</div>
            <div>LEVEL: {level}</div>
          </div>
        </div>

        {/* Next Piece */}
        {renderNextPiece()}

        {/* Controls */}
        <div className="bg-gray-900 p-4 rounded border-2 border-green-400">
          <h3 className="text-green-400 font-bold mb-2">CONTROLS</h3>
          <div className="text-xs text-green-300 space-y-1">
            <div>← → Move</div>
            <div>↑ Rotate</div>
            <div>↓ Soft Drop</div>
            <div>SPACE Hard Drop</div>
            <div>P Pause</div>
          </div>
        </div>

        {/* Game Status */}
        <div className="text-center space-y-2">
          {isPaused && <div className="text-2xl font-bold text-yellow-400 animate-pulse">PAUSED</div>}
          {gameOver && <div className="text-2xl font-bold text-red-500 animate-pulse">GAME OVER!</div>}
          <div className="space-x-2">
            <Button
              onClick={resetGame}
              className="bg-green-400 text-black hover:bg-green-300 font-bold tracking-wider border-2 border-green-400"
            >
              {gameOver ? "PLAY AGAIN" : "RESET GAME"}
            </Button>
            {!gameOver && (
              <Button
                onClick={togglePause}
                className="bg-yellow-400 text-black hover:bg-yellow-300 font-bold tracking-wider border-2 border-yellow-400"
              >
                {isPaused ? "RESUME" : "PAUSE"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
