"use client"

import GoogleAdSense from "./google-adsense"

interface BannerAdProps {
  size?: "leaderboard" | "banner" | "large-banner"
  className?: string
}

export default function BannerAd({ size = "leaderboard", className = "" }: BannerAdProps) {
  const getAdDimensions = () => {
    switch (size) {
      case "leaderboard":
        return { width: "728px", height: "90px", slot: "1234567891" }
      case "banner":
        return { width: "468px", height: "60px", slot: "1234567892" }
      case "large-banner":
        return { width: "320px", height: "100px", slot: "1234567893" }
      default:
        return { width: "728px", height: "90px", slot: "1234567891" }
    }
  }

  const { width, height, slot } = getAdDimensions()

  return (
    <div className={`flex justify-center my-6 ${className}`}>
      <div className="bg-gray-900 border border-green-400 rounded p-4">
        <div className="text-xs text-green-300 mb-2 text-center">Advertisement</div>
        <GoogleAdSense adSlot={slot} adFormat="auto" style={{ width, height, display: "block" }} />
      </div>
    </div>
  )
}
