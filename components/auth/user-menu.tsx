"use client"

import { useState } from "react"
import Link from "next/link"
import { User, Settings, LogOut, ChevronDown } from "lucide-react"

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="flex items-center space-x-2 text-white hover:text-gray-300 focus:outline-none"
      >
        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
          <User className="h-5 w-5 text-gray-300" />
        </div>
        <span className="hidden md:inline">User</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[#1E1E1E] border border-gray-800 rounded-md shadow-lg z-10">
          <div className="py-1">
            <Link
              href="/settings"
              className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 flex items-center"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Link>
            <Link
              href="/auth/login"
              className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 flex items-center"
              onClick={() => setIsOpen(false)}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

// Also export as default for compatibility
export default UserMenu
