// "use client"

// import { useState, useEffect, useCallback, useRef } from "react"
// import { Button } from "@/components/ui/button"

// const BOARD_WIDTH = 600
// const BOARD_HEIGHT = 400
// const PLAYER_WIDTH = 30
// const PLAYER_HEIGHT = 20
// const INVADER_WIDTH = 20
// const INVADER_HEIGHT = 15
// const BULLET_WIDTH = 3
// const BULLET_HEIGHT = 10

// export default function SpaceInvadersGame() {
//   const [player, setPlayer] = useState({ x: BOARD_WIDTH / 2 - PLAYER_WIDTH / 2, y: BOARD_HEIGHT - 40 })
//   const [invaders, setInvaders] = useState([])
//   const [bullets, setBullets] = useState([])
//   const [enemyBullets, setEnemyBullets] = useState([])
//   const [score, setScore] = useState(0)
//   const [gameOver, setGameOver] = useState(false)
//   const [gameStarted, setGameStarted] = useState(false)
//   const [keys, setKeys] = useState({})
//   const gameLoop = useRef()

//   const createInvaders = () => {
//     const newInvaders = []
//     for (let row = 0; row < 5; row++) {
//       for (let col = 0; col < 10; col++) {
//         newInvaders.push({
//           x: col * 50 + 50,
//           y: row * 40 + 50,
//           alive: true
//         })
//       }
//     }
//     return newInvaders
//   }

//   const updateGame = useCallback(() => {
//     if (!gameStarted || gameOver) return

//     // Move player
//     setPlayer(prev => {
//       let newX = prev.x
//       if (keys['ArrowLeft'] && newX > 0) newX -= 5
//       if (keys['ArrowRight'] && newX < BOARD_WIDTH - PLAYER_WIDTH) newX += 5
//       return { ...prev, x: newX }
//     })

//     // Move bullets
//     setBullets(prev => prev.map(bullet => ({ ...bullet, y: bullet.y - 8 })).filter(bullet => bullet.y > 0))

//     // Move enemy bullets
//     setEnemyBullets(prev => prev.map(bullet => ({ ...bullet, y: bullet.y + 4 })).filter(bullet => bullet.y < BOARD_HEIGHT))

//     // Move invaders
//     setInvaders(prev => {
//       const aliveInvaders = prev.filter(invader => invader.alive)
//       if (aliveInvaders.length === 0) return prev

//       const rightmost = Math.max(...aliveInvaders.map(inv => inv.x))
//       const leftmost = Math.min(...aliveInvaders.map(inv => inv.x))
//       const shouldMoveDown = rightmost >= BOARD_WIDTH - 50 || leftmost <= 0

//       return prev.map(invader => {
//         if (!invader.alive) return invader
        
//         if (shouldMoveDown) {
//           return { ...invader, y: invader.y + 20 }
//         } else {
//           return { ...invader, x: invader.x + (rightmost >= BOARD_WIDTH - 50 ? -10 : 10) }
//         }
//       })
//     })

//     // Check bullet-invader collisions
//     setBullets(prevBullets => {
//       const remainingBullets = []
      
//       prevBullets.forEach(bullet => {
//         let hit = false
//         setInvaders(prevInvaders => {
//           return prevInvaders.map(invader => {
//             if (invader.alive && 
//                 bullet.x < invader.x + INVADER_WIDTH &&
//                 bullet.x + BULLET_WIDTH > invader.x &&
//                 bullet.y < invader.y + INVADER_HEIGHT &&
//                 bullet.y + BULLET_HEIGHT > invader.y) {
//               hit = true
//               setScore(prev => prev + 10)
//               return { ...invader, alive: false }
//             }
//             return invader
//           })
//         })
        
//         if (!hit) {
//           remainingBullets.push(bullet)
//         }
//       })
      
//       return remainingBullets
//     })

//     // Check enemy bullet-player collisions
//     setEnemyBullets(prevBullets => {
//       return prevBullets.filter(bullet => {
//         if (bullet.x < player.x + PLAYER_WIDTH &&
//             bullet.x + BULLET_WIDTH > player.x &&
//             bullet.y < player.y + PLAYER_HEIGHT &&
//             bullet.y + BULLET_HEIGHT > player.y) {
//           setGameOver(true)
//           return false
//         }
//         return true
//       })
//     })

//     // Random enemy shooting
//     if (Math.random() < 0.02) {
//       setInvaders(prevInvaders => {
//         const aliveInvaders = prevInvaders.filter(inv => inv.alive)
//         if (aliveInvaders.length > 0) {
//           const shooter = aliveInvaders[Math.floor(Math.random() * aliveInvaders.length)]
//           setEnemyBullets(prev => [...prev, { x: shooter.x + INVADER_WIDTH / 2, y: shooter.y + INVADER_HEIGHT }])
//         }
//         return prevInvaders
//       })
//     }

//     // Check if invaders reached player
//     setInvaders(prevInvaders => {
//       const reachedBottom = prevInvaders.some(inv => inv.alive && inv.y + INVADER_HEIGHT >= player.y)
//       if (reachedBottom) {
//         setGameOver(true)
//       }
//       return prevInvaders
//     })

//   }, [gameStarted, gameOver, keys, player])

//   useEffect(() => {
//     if (gameStarted && !gameOver) {
//       gameLoop.current = setInterval(updateGame, 50)
//     }
//     return () => clearInterval(gameLoop.current)
//   }, [updateGame, gameStarted, gameOver])

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       setKeys(prev => ({ ...prev, [e.key]: true }))
      
//       if (e.key === ' ' && gameStarted && !gameOver) {
//         setBullets(prev => [...prev, { x: player.x + PLAYER_WIDTH / 2, y: player.y }])
//       }
//     }

//     const handleKeyUp = (e) => {
//       setKeys(prev => ({ ...prev, [e.key]: false }))
//     }

//     window.addEventListener('keydown', handleKeyDown)
//     window.addEventListener('keyup', handleKeyUp)
    
//     return () => {
//       window.removeEventListener('keydown', handleKeyDown)
//       window.removeEventListener('keyup', handleKeyUp)
//     }
//   }, [gameStarted, gameOver, player])

//   const resetGame = () => {
//     setPlayer({ x: BOARD_WIDTH / 2 - PLAYER_WIDTH / 2, y: BOARD_HEIGHT - 40 })
//     setInvaders(createInvaders())
//     setBullets([])
//     setEnemyBullets([])
//     setScore(0)
//     setGameOver(false)
//     setGameStarted(false)
//     clearInterval(gameLoop.current)
//   }

//   const startGame = () => {
//     setInvaders(createInvaders())
//     setGameStarted(true)
//   }

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-black text-green-400 p-4">
//       <div className="bg-gray-900 p-6 rounded-lg border-2 border-green-400 shadow-[0_0_20px_#00ff00]">
//         <div 
//           className="relative bg-black border-2 border-green-400 overflow-hidden"
//           style={{ width: BOARD_WIDTH, height: BOARD_HEIGHT }}
//         >
//           {/* Player */}
//           <div 
//             className="absolute bg-green-400"
//             style={{
//               left: player.x,
//               top: player.y,
//               width: PLAYER_WIDTH,
//               height: PLAYER_HEIGHT,
//               clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
//             }}
//           />
          
//           {/* Invaders */}
//           {invaders.map((invader, index) => (
//             invader.alive && (
//               <div 
//                 key={index}
//                 className="absolute bg-red-500"
//                 style={{
//                   left: invader.x,
//                   top: invader.y,
//                   width: INVADER_WIDTH,
//                   height: INVADER_HEIGHT
//                 }}
//               >
//                 👾
//               </div>
//             )
//           ))}
          
//           {/* Player bullets */}
//           {bullets.map((bullet, index) => (
//             <div 
//               key={index}
//               className="absolute bg-yellow-400"
//               style={{
//                 left: bullet.x,
//                 top: bullet.y,
//                 width: BULLET_WIDTH,
//                 height: BULLET_HEIGHT
//               }}
//             />
//           ))}
          
//           {/* Enemy bullets */}
//           {enemyBullets.map((bullet, index) => (
//             <div 
//               key={index}
//               className="absolute bg-red-400"
//               style={{
//                 left: bullet.x,
//                 top: bullet.y,
//                 width: BULLET_WIDTH,
//                 height: BULLET_HEIGHT
//               }}
//             />
//           ))}
//         </div>
//       </div>
      
//       <div className="mt-6 text-center space-y-2">
//         <div className="text-2xl font-bold text-green-400">SCORE: {score}</div>
//         <div className="text-sm text-green-300">
//           Arrow keys to move, Spacebar to shoot
//         </div>
//         {gameOver && (
//           <div className="text-2xl font-bold text-red-500 animate-pulse">GAME OVER!</div>
//         )}
//         {!gameStarted && !gameOver && (
//           <div className="text-lg text-green-300">Press START to begin invasion</div>
//         )}
//         <div className="space-x-4">
//           {!gameStarted && !gameOver && (
//             <Button 
//               onClick={startGame}
//               className="bg-green-400 text-black hover:bg-green-300 font-bold tracking-wider border-2 border-green-400"
//             >
//               START GAME
//             </Button>
//           )}
//           <Button 
//             onClick={resetGame}
//             className="bg-green-400 text\
