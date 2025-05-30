"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Clock } from "lucide-react"
import GoogleAdSense from "./google-adsense"

interface InterstitialAdProps {
  onClose: () => void
  gameTitle: string
}

export default function InterstitialAd({ onClose, gameTitle }: InterstitialAdProps) {
  const [countdown, setCountdown] = useState(5)
  const [canClose, setCanClose] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanClose(true)
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border-2 border-green-400 rounded-lg p-6 max-w-2xl w-full relative">
        {/* Close button - only shows after countdown */}
        {canClose && (
          <Button
            onClick={onClose}
            variant="outline"
            size="sm"
            className="absolute top-4 right-4 border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        {/* Countdown timer */}
        {!canClose && (
          <div className="absolute top-4 right-4 flex items-center space-x-2 text-green-400">
            <Clock className="h-4 w-4" />
            <span className="font-bold">{countdown}s</span>
          </div>
        )}

        {/* Ad content */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-green-400 mb-2">Loading {gameTitle}...</h2>
          <p className="text-green-300">Please wait while we prepare your gaming experience</p>
        </div>

        {/* Google Ad */}
        <div className="bg-gray-800 border border-green-400 rounded p-4 min-h-[250px] flex items-center justify-center">
          <GoogleAdSense
            adSlot="1234567890" // Replace with your actual ad slot
            adFormat="rectangle"
            style={{ width: "300px", height: "250px" }}
          />
        </div>

        {/* Loading indicator */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center space-x-2 text-green-400">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400"></div>
            <span>Initializing game engine...</span>
          </div>
        </div>
      </div>
    </div>
  )
}
