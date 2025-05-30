"use client"

import { useEffect, useState } from "react"
import GoogleAdSense from "./google-adsense"

export default function MobileAd() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  if (!isMobile) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gray-900 border-t-2 border-green-400 p-2">
      <div className="flex justify-center">
        <GoogleAdSense
          adSlot="1234567896" // Mobile ad slot
          adFormat="auto"
          style={{ width: "320px", height: "50px", display: "block" }}
        />
      </div>
    </div>
  )
}
