"use client"

import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { MainSidebar } from "@/components/navigation/main-sidebar"

const inter = Inter({ subsets: ["latin"] })

// List of routes where we don't want to show the sidebar
const fullScreenRoutes = ["/welcome-chat"]

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // We can't use usePathname() here since this is a Server Component
  // Instead, we'll handle this in the client components

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      {/* MainSidebar will handle its own visibility based on the route */}
      <MainSidebar />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}
