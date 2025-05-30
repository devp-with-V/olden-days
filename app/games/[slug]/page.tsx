"use client"

import { useState } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import TetrisGame from "@/components/games/tetris"
import PacManGame from "@/components/games/pacman"
import SnakeGame from "@/components/games/snake"
import PongGame from "@/components/games/pong"
import SpaceInvadersGame from "@/components/games/space-invaders"
import BreakoutGame from "@/components/games/breakout"
import InterstitialAd from "@/components/ads/interstitial-ad"
import SidebarAd from "@/components/ads/sidebar-ad"
import BannerAd from "@/components/ads/banner-ad"

const games = {
  tetris: {
    title: "Tetris",
    component: TetrisGame,
  },
  pacman: {
    title: "Pac-Man",
    component: PacManGame,
  },
  snake: {
    title: "Snake",
    component: SnakeGame,
  },
  pong: {
    title: "Pong",
    component: PongGame,
  },
  "space-invaders": {
    title: "Space Invaders",
    component: SpaceInvadersGame,
  },
  breakout: {
    title: "Breakout",
    component: BreakoutGame,
  },
}

export default function GamePage({ params }: { params: { slug: string } }) {
  const [showAd, setShowAd] = useState(true)
  const [gameLoaded, setGameLoaded] = useState(false)

  const game = games[params.slug]

  if (!game) {
    notFound()
  }

  const GameComponent = game.component

  const handleAdClose = () => {
    setShowAd(false)
    setGameLoaded(true)
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      {/* Interstitial Ad */}
      {showAd && <InterstitialAd onClose={handleAdClose} gameTitle={game.title} />}

      {/* Scanlines effect */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #00ff00 2px, #00ff00 4px)",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b-2 border-green-400 bg-black/90 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="outline" className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Arcade
              </Button>
            </Link>
            <h1 className="text-2xl font-bold tracking-wider text-green-400 drop-shadow-[0_0_10px_#00ff00]">
              {game.title.toUpperCase()}
            </h1>
            <div className="text-sm text-green-300">OLDEN DAYS</div>
          </div>
        </div>
      </header>

      {/* Banner Ad */}
      <BannerAd size="leaderboard" />

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar Ad */}
        <SidebarAd className="hidden lg:block w-48 p-4" />

        {/* Game Container */}
        <main className="flex-1 relative z-10">{gameLoaded && <GameComponent />}</main>

        {/* Right Sidebar Ad */}
        <SidebarAd className="hidden lg:block w-48 p-4" />
      </div>

      {/* Bottom Banner Ad */}
      <BannerAd size="large-banner" className="mt-8" />
    </div>
  )
}
