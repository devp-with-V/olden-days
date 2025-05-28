import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Gamepad2, Star, Users, Clock } from "lucide-react"

const games = [
  {
    id: "tetris",
    title: "Tetris",
    description: "Classic block-stacking puzzle game",
    difficulty: "Medium",
    players: "1 Player",
    category: "Puzzle",
    color: "from-cyan-500 to-blue-600",
    icon: "🧩",
  },
  {
    id: "pacman",
    title: "Pac-Man",
    description: "Navigate mazes and eat dots while avoiding ghosts",
    difficulty: "Easy",
    players: "1 Player",
    category: "Arcade",
    color: "from-yellow-400 to-orange-500",
    icon: "👻",
  },
  {
    id: "snake",
    title: "Snake",
    description: "Control a growing snake to eat food",
    difficulty: "Easy",
    players: "1 Player",
    category: "Arcade",
    color: "from-green-400 to-emerald-600",
    icon: "🐍",
  },
  {
    id: "pong",
    title: "Pong",
    description: "Classic paddle tennis game",
    difficulty: "Easy",
    players: "2 Players",
    category: "Sports",
    color: "from-white to-gray-300",
    icon: "🏓",
  },
  {
    id: "space-invaders",
    title: "Space Invaders",
    description: "Defend Earth from alien invasion",
    difficulty: "Hard",
    players: "1 Player",
    category: "Shooter",
    color: "from-purple-500 to-pink-600",
    icon: "👾",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
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
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Gamepad2 className="h-8 w-8 text-green-400" />
              <h1 className="text-4xl font-bold tracking-wider text-green-400 drop-shadow-[0_0_10px_#00ff00]">
                OLDEN DAYS
              </h1>
            </div>
            <div className="text-sm text-green-300">
              {">"} RETRO GAMING ARCADE {"<"}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-8">
            <h2 className="text-6xl font-bold mb-4 text-green-400 drop-shadow-[0_0_20px_#00ff00] animate-pulse">
              WELCOME TO THE ARCADE
            </h2>
            <p className="text-xl text-green-300 max-w-2xl mx-auto leading-relaxed">
              {">"} Step back in time and experience the golden age of gaming
              <br />
              {">"} Classic games, pixel-perfect graphics, endless fun
            </p>
          </div>

          <div className="flex justify-center space-x-8 text-green-300 mb-8">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5" />
              <span>5 Classic Games</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Single & Multiplayer</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Instant Play</span>
            </div>
          </div>
        </div>
      </section>

      {/* Games Grid */}
      <section className="relative z-10 py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-green-400">
            {">"} SELECT YOUR GAME {"<"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {games.map((game) => (
              <Card
                key={game.id}
                className="bg-black border-2 border-green-400 hover:border-green-300 transition-all duration-300 hover:shadow-[0_0_20px_#00ff00] group"
              >
                <CardHeader className="text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {game.icon}
                  </div>
                  <CardTitle className="text-green-400 text-xl font-bold tracking-wider">
                    {game.title.toUpperCase()}
                  </CardTitle>
                  <CardDescription className="text-green-300">{game.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge variant="outline" className="border-green-400 text-green-400">
                      {game.category}
                    </Badge>
                    <Badge variant="outline" className="border-green-400 text-green-400">
                      {game.difficulty}
                    </Badge>
                    <Badge variant="outline" className="border-green-400 text-green-400">
                      {game.players}
                    </Badge>
                  </div>

                  <Link href={`/games/${game.id}`} className="block">
                    <Button className="w-full bg-green-400 text-black hover:bg-green-300 font-bold tracking-wider border-2 border-green-400 hover:shadow-[0_0_10px_#00ff00] transition-all duration-300">
                      {">"} PLAY NOW {"<"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t-2 border-green-400 bg-black/90 backdrop-blur mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-green-300">
            {">"} OLDEN DAYS ARCADE - WHERE NOSTALGIA MEETS FUN {"<"}
          </p>
          <p className="text-green-400 mt-2 text-sm">Built with ❤️ for retro gaming enthusiasts</p>
        </div>
      </footer>
    </div>
  )
}
