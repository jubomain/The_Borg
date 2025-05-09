"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import BorgLogo from "./borg-logo"

interface PreloaderProps {
  onLoadComplete?: () => void
  minDisplayTime?: number
  redirectPath?: string
}

export default function Preloader({
  onLoadComplete,
  minDisplayTime = 2000,
  redirectPath = "/welcome-chat",
}: PreloaderProps) {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const startTime = Date.now()
    let animationFrameId: number | null = null
    let intervalId: NodeJS.Timeout | null = null

    // Simulate loading progress
    intervalId = setInterval(() => {
      setProgress((prev) => {
        // Accelerate progress as it gets closer to 100
        const increment = Math.max(1, 10 - Math.floor(prev / 10))
        const nextProgress = Math.min(99, prev + increment)
        return nextProgress
      })
    }, 100)

    // Check if we've met the minimum display time
    const checkCompletion = () => {
      const elapsed = Date.now() - startTime
      if (elapsed >= minDisplayTime) {
        setProgress(100)
        setIsComplete(true)

        if (onLoadComplete) {
          onLoadComplete()
        } else if (redirectPath) {
          // Use a timeout to ensure the fade-out animation completes
          setTimeout(() => {
            router.push(redirectPath)
          }, 500)
        }

        if (intervalId) clearInterval(intervalId)
      } else {
        animationFrameId = requestAnimationFrame(checkCompletion)
      }
    }

    animationFrameId = requestAnimationFrame(checkCompletion)

    return () => {
      if (intervalId) clearInterval(intervalId)
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [minDisplayTime, onLoadComplete, redirectPath, router])

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center bg-[#1E1E1E] z-50 transition-opacity duration-500 ${
        isComplete ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative mb-8">
        <BorgLogo width={100} height={100} className="borg-logo-pulse" />
        <div className="absolute -inset-4 border-4 border-green-500 rounded-2xl opacity-0 animate-ping-slow"></div>
      </div>
      <h1 className="text-3xl font-bold mb-2">The Borg Framework</h1>
      <p className="text-gray-400 mb-8">Self-Evolving Agent Framework</p>
      <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-600 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="mt-4 text-sm text-gray-500">Initializing command center...</p>
    </div>
  )
}
