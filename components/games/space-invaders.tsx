"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"

const BOARD_WIDTH = 600
const BOARD_HEIGHT = 400
const PLAYER_WIDTH = 30
const PLAYER_HEIGHT = 20
const INVADER_WIDTH = 20
const INVADER_HEIGHT = 15
const BULLET_WIDTH = 3
const BULLET_HEIGHT = 10

export default function SpaceInvadersGame() {
  const [player, setPlayer] = useState({ x: BOARD_WIDTH / 2 - PLAYER_WIDTH / 2, y: BOARD_HEIGHT - 40 })
  const [invaders, setInvaders] = useState([])
  const [bullets, setBullets] = useState([])
  const [enemyBullets, setEnemyBullets] = useState([])
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [level, setLevel] = useState(1)
  const [invaderDirection, setInvaderDirection] = useState(1)
  const [keys, setKeys] = useState({})
  const gameLoop = useRef()
  const lastShotTime = useRef(0)

  const createInvaders = () => {
    const newInvaders = []
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 10; col++) {
        newInvaders.push({
          x: col * 50 + 50,
          y: row * 40 + 50,
          alive: true,
          type: row < 2 ? "small" : row < 4 ? "medium" : "large",
        })
      }
    }
    return newInvaders
  }

  const updateGame = useCallback(() => {
    if (!gameStarted || gameOver) return

    // Move player
    setPlayer((prev) => {
      let newX = prev.x
      if (keys["ArrowLeft"] && newX > 0) newX -= 6
      if (keys["ArrowRight"] && newX < BOARD_WIDTH - PLAYER_WIDTH) newX += 6
      return { ...prev, x: newX }
    })

    // Move bullets
    setBullets((prev) => prev.map((bullet) => ({ ...bullet, y: bullet.y - 10 })).filter((bullet) => bullet.y > 0))

    // Move enemy bullets
    setEnemyBullets((prev) =>
      prev.map((bullet) => ({ ...bullet, y: bullet.y + 5 })).filter((bullet) => bullet.y < BOARD_HEIGHT),
    )

    // Move invaders
    setInvaders((prev) => {
      const aliveInvaders = prev.filter((invader) => invader.alive)
      if (aliveInvaders.length === 0) {
        // Level complete - spawn new invaders
        setTimeout(() => {
          setLevel((prevLevel) => prevLevel + 1)
          setInvaders(createInvaders())
          setInvaderDirection(1)
        }, 1000)
        return prev
      }

      const rightmost = Math.max(...aliveInvaders.map((inv) => inv.x))
      const leftmost = Math.min(...aliveInvaders.map((inv) => inv.x))
      const shouldMoveDown =
        (rightmost >= BOARD_WIDTH - 50 && invaderDirection > 0) || (leftmost <= 0 && invaderDirection < 0)

      if (shouldMoveDown) {
        setInvaderDirection((prev) => -prev)
        return prev.map((invader) => {
          if (!invader.alive) return invader
          return { ...invader, y: invader.y + 25 }
        })
      } else {
        return prev.map((invader) => {
          if (!invader.alive) return invader
          return { ...invader, x: invader.x + invaderDirection * (2 + level) }
        })
      }
    })

    // Check bullet-invader collisions
    setBullets((prevBullets) => {
      const remainingBullets = []

      prevBullets.forEach((bullet) => {
        let hit = false
        setInvaders((prevInvaders) => {
          return prevInvaders.map((invader) => {
            if (
              invader.alive &&
              bullet.x < invader.x + INVADER_WIDTH &&
              bullet.x + BULLET_WIDTH > invader.x &&
              bullet.y < invader.y + INVADER_HEIGHT &&
              bullet.y + BULLET_HEIGHT > invader.y
            ) {
              hit = true
              const points = invader.type === "small" ? 30 : invader.type === "medium" ? 20 : 10
              setScore((prev) => prev + points)
              return { ...invader, alive: false }
            }
            return invader
          })
        })

        if (!hit) {
          remainingBullets.push(bullet)
        }
      })

      return remainingBullets
    })

    // Check enemy bullet-player collisions
    setEnemyBullets((prevBullets) => {
      return prevBullets.filter((bullet) => {
        if (
          bullet.x < player.x + PLAYER_WIDTH &&
          bullet.x + BULLET_WIDTH > player.x &&
          bullet.y < player.y + PLAYER_HEIGHT &&
          bullet.y + BULLET_HEIGHT > player.y
        ) {
          setLives((prev) => {
            const newLives = prev - 1
            if (newLives <= 0) {
              setGameOver(true)
            }
            return newLives
          })
          return false
        }
        return true
      })
    })

    // Random enemy shooting (more frequent at higher levels)
    if (Math.random() < 0.01 + level * 0.005) {
      setInvaders((prevInvaders) => {
        const aliveInvaders = prevInvaders.filter((inv) => inv.alive)
        if (aliveInvaders.length > 0) {
          const shooter = aliveInvaders[Math.floor(Math.random() * aliveInvaders.length)]
          setEnemyBullets((prev) => [...prev, { x: shooter.x + INVADER_WIDTH / 2, y: shooter.y + INVADER_HEIGHT }])
        }
        return prevInvaders
      })
    }

    // Check if invaders reached player
    setInvaders((prevInvaders) => {
      const reachedBottom = prevInvaders.some((inv) => inv.alive && inv.y + INVADER_HEIGHT >= player.y - 20)
      if (reachedBottom) {
        setGameOver(true)
      }
      return prevInvaders
    })
  }, [gameStarted, gameOver, keys, player, level, invaderDirection])

  useEffect(() => {
    if (gameStarted && !gameOver) {
      gameLoop.current = setInterval(updateGame, 50)
    }
    return () => clearInterval(gameLoop.current)
  }, [updateGame, gameStarted, gameOver])

  useEffect(() => {
    const handleKeyDown = (e) => {
      setKeys((prev) => ({ ...prev, [e.key]: true }))

      if (e.key === " " && gameStarted && !gameOver) {
        const now = Date.now()
        if (now - lastShotTime.current > 200) {
          // Limit shooting rate
          setBullets((prev) => [...prev, { x: player.x + PLAYER_WIDTH / 2, y: player.y }])
          lastShotTime.current = now
        }
      }
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
  }, [gameStarted, gameOver, player])

  const resetGame = () => {
    setPlayer({ x: BOARD_WIDTH / 2 - PLAYER_WIDTH / 2, y: BOARD_HEIGHT - 40 })
    setInvaders(createInvaders())
    setBullets([])
    setEnemyBullets([])
    setScore(0)
    setLives(3)
    setLevel(1)
    setInvaderDirection(1)
    setGameOver(false)
    setGameStarted(false)
    clearInterval(gameLoop.current)
  }

  const startGame = () => {
    setInvaders(createInvaders())
    setGameStarted(true)
  }

  const getInvaderEmoji = (type) => {
    switch (type) {
      case "small":
        return "👾"
      case "medium":
        return "🛸"
      case "large":
        return "🚀"
      default:
        return "👾"
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-green-400 p-4">
      <div className="bg-gray-900 p-6 rounded-lg border-2 border-green-400 shadow-[0_0_20px_#00ff00]">
        {/* Game Stats */}
        <div className="flex justify-between items-center mb-4 text-green-400 font-bold">
          <div>SCORE: {score}</div>
          <div>LEVEL: {level}</div>
          <div>LIVES: {"❤️".repeat(lives)}</div>
        </div>

        <div
          className="relative bg-black border-2 border-green-400 overflow-hidden"
          style={{ width: BOARD_WIDTH, height: BOARD_HEIGHT }}
        >
          {/* Stars background */}
          <div className="absolute inset-0">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: "1px",
                  height: "1px",
                  opacity: Math.random() * 0.8 + 0.2,
                }}
              />
            ))}
          </div>

          {/* Player */}
          <div
            className="absolute bg-green-400 transition-all duration-100"
            style={{
              left: player.x,
              top: player.y,
              width: PLAYER_WIDTH,
              height: PLAYER_HEIGHT,
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            }}
          />

          {/* Invaders */}
          {invaders.map(
            (invader, index) =>
              invader.alive && (
                <div
                  key={index}
                  className="absolute text-lg flex items-center justify-center transition-all duration-100"
                  style={{
                    left: invader.x,
                    top: invader.y,
                    width: INVADER_WIDTH,
                    height: INVADER_HEIGHT,
                    color: invader.type === "small" ? "#ef4444" : invader.type === "medium" ? "#f97316" : "#eab308",
                  }}
                >
                  {getInvaderEmoji(invader.type)}
                </div>
              ),
          )}

          {/* Player bullets */}
          {bullets.map((bullet, index) => (
            <div
              key={index}
              className="absolute bg-yellow-400 rounded-full"
              style={{
                left: bullet.x,
                top: bullet.y,
                width: BULLET_WIDTH,
                height: BULLET_HEIGHT,
              }}
            />
          ))}

          {/* Enemy bullets */}
          {enemyBullets.map((bullet, index) => (
            <div
              key={index}
              className="absolute bg-red-400 rounded-full"
              style={{
                left: bullet.x,
                top: bullet.y,
                width: BULLET_WIDTH,
                height: BULLET_HEIGHT,
              }}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 text-center space-y-2">
        <div className="text-sm text-green-300">Arrow keys to move, Spacebar to shoot</div>
        {gameOver && (
          <div className="text-2xl font-bold text-red-500 animate-pulse">{lives <= 0 ? "GAME OVER!" : "INVADED!"}</div>
        )}
        {!gameStarted && !gameOver && <div className="text-lg text-green-300">Press START to defend Earth!</div>}
        <div className="space-x-4">
          {!gameStarted && !gameOver && (
            <Button
              onClick={startGame}
              className="bg-green-400 text-black hover:bg-green-300 font-bold tracking-wider border-2 border-green-400"
            >
              START INVASION
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
