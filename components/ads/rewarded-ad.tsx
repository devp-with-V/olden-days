"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Gift } from "lucide-react"
import GoogleAdSense from "./google-adsense"

interface RewardedAdProps {
  onReward: () => void
  rewardText: string
}

export default function RewardedAd({ onReward, rewardText }: RewardedAdProps) {
  const [showAd, setShowAd] = useState(false)
  const [adWatched, setAdWatched] = useState(false)

  const handleWatchAd = () => {
    setShowAd(true)
    // Simulate ad completion after 30 seconds
    setTimeout(() => {
      setAdWatched(true)
      onReward()
    }, 30000)
  }

  if (showAd && !adWatched) {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 border-2 border-green-400 rounded-lg p-6 max-w-lg w-full">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-green-400 mb-2">Watch Ad for Reward</h3>
            <p className="text-green-300">{rewardText}</p>
          </div>

          <div className="bg-gray-800 border border-green-400 rounded p-4 min-h-[250px] flex items-center justify-center">
            <GoogleAdSense
              adSlot="1234567895" // Rewarded ad slot
              adFormat="rectangle"
              style={{ width: "300px", height: "250px" }}
            />
          </div>

          <div className="mt-4 text-center">
            <div className="text-sm text-green-300">Please wait for the ad to complete...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Button
      onClick={handleWatchAd}
      className="bg-yellow-500 text-black hover:bg-yellow-400 font-bold border-2 border-yellow-500"
      disabled={adWatched}
    >
      <Gift className="h-4 w-4 mr-2" />
      {adWatched ? "Reward Claimed!" : `Watch Ad - ${rewardText}`}
    </Button>
  )
}
