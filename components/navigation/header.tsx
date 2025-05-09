import Link from "next/link"
import { BorgLogo } from "@/components/borg-logo"
import { UserMenu } from "@/components/auth/user-menu"
import { Github, Twitter, Send, AtSign } from "lucide-react"

interface HeaderProps {
  title?: string
}

// Export as named export
export function Header({ title = "Dashboard" }: HeaderProps) {
  return (
    <header className="bg-[#1A1A1A] border-b border-gray-800 py-4 px-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="flex items-center">
            <BorgLogo className="h-8 w-8 text-sky-500" />
            <span className="ml-2 text-xl font-bold text-white">Borg</span>
          </Link>
          <span className="text-gray-400">|</span>
          <h1 className="text-xl font-semibold text-white">{title}</h1>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/yourusername/borg-framework"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-sky-300 transition-colors"
            >
              <Github size={20} />
            </a>
            <a
              href="https://twitter.com/borgframework"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-sky-300 transition-colors"
            >
              <Twitter size={20} />
            </a>
            <a
              href="https://t.me/borgframework"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-sky-300 transition-colors"
            >
              <Send size={20} />
            </a>
            <a
              href="https://bsky.app/profile/borgframework.bsky.social"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-sky-300 transition-colors"
            >
              <AtSign size={20} />
            </a>
          </div>
          <UserMenu />
        </div>
      </div>
    </header>
  )
}

// Also export as default for compatibility
export default Header
