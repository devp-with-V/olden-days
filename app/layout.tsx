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
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7998341892862391"
      crossorigin="anonymous"/>
      </head>
      <body>{children}</body>
    </html>
  )
}
