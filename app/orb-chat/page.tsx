"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import VisualOrbChat from "@/components/visual-orb-chat"
import BorgLogo from "@/components/borg-logo"
import { Button } from "@/components/ui/button"

export default function OrbChatPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check login status via API
    const checkLoginStatus = async () => {
      try {
        const response = await fetch("/api/auth/session", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          const data = await response.json()
          setIsLoggedIn(!!data.session)
        }
      } catch (error) {
        console.error("Error checking session:", error)
        setIsLoggedIn(false)
      }
    }

    checkLoginStatus()
  }, [])

  const redirectToLogin = () => {
    router.push("/auth/login")
  }

  return (
    <div className="flex flex-col h-screen bg-[#121212]">
      {/* Header */}
      <header className="border-b border-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <BorgLogo width={30} height={30} className="mr-3" />
          <h1 className="text-xl font-bold text-white">THE BORG FRAMEWORK</h1>
        </div>
        {isLoggedIn ? (
          <Button onClick={() => router.push("/dashboard")} className="bg-blue-600 hover:bg-blue-700 text-white">
            Go to Dashboard
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={redirectToLogin}
              variant="outline"
              className="border-gray-700 text-gray-300 hover:text-white"
            >
              Sign In
            </Button>
            <Button onClick={() => router.push("/auth/register")} className="bg-blue-600 hover:bg-blue-700 text-white">
              Register
            </Button>
          </div>
        )}
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center mb-8 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Visual Orb Chat Interface</h2>
          <p className="text-gray-400 text-lg mb-8">
            Interact with our AI assistant through the floating orb interface. Click the orb in the bottom right corner
            to expand the chat.
          </p>

          <div className="bg-[#1A1A1A] p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3 text-white">Features:</h3>
            <ul className="text-left text-gray-300 space-y-2">
              <li>• Floating interface that stays with you across pages</li>
              <li>• Minimizes to a compact orb when not in use</li>
              <li>• Expands to a full chat interface when needed</li>
              <li>• Pulse animation to remind you it's available</li>
              <li>• Seamless integration with your Borg Framework account</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Visual Orb Chat */}
      <VisualOrbChat onLogin={redirectToLogin} isLoggedIn={isLoggedIn} initialExpanded={true} />
    </div>
  )
}
