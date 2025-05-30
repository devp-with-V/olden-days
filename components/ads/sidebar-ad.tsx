"use client"

import GoogleAdSense from "./google-adsense"

interface SidebarAdProps {
  className?: string
}

export default function SidebarAd({ className = "" }: SidebarAdProps) {
  return (
    <div className={`${className}`}>
      <div className="bg-gray-900 border border-green-400 rounded p-4 sticky top-4">
        <div className="text-xs text-green-300 mb-2 text-center">Sponsored</div>
        <GoogleAdSense
          adSlot="1234567894" // Replace with your actual ad slot
          adFormat="auto"
          style={{ width: "160px", height: "600px", display: "block" }}
        />
      </div>
    </div>
  )
}
