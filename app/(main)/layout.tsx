"use client"

import type React from "react"

import { MainSidebar } from "@/components/navigation/main-sidebar"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <MainSidebar />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}
