import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import Script from "next/script"
import { AD_CONFIG } from "@/lib/ad-config"

export const metadata: Metadata = {
  title: "OLdenDays",
  description: "Created By OldenDays Team",
  keywords: "OLdenDays, OldenDays Team, OldenDays Project, OldenDays Website"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CONFIG.publisherId}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
