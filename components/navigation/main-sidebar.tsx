"use client"

import { usePathname } from "next/navigation"
import Sidebar from "../sidebar"
import { Computer } from "lucide-react"

// List of routes where we don't want to show the sidebar
const fullScreenRoutes = ["/welcome-chat"]

export function MainSidebar() {
  const pathname = usePathname()

  // Don't render the sidebar on fullscreen routes
  if (fullScreenRoutes.includes(pathname)) {
    return null
  }

  return (
    <Sidebar
      onNewSession={() => {
        // Handle new session
      }}
      onOpenSettings={() => {
        // Handle open settings
      }}
      navigationItems={[
        {
          to: "/computer-control",
          label: "Computer Control",
          icon: <Computer className="h-5 w-5" />,
        },
      ]}
    />
  )
}
