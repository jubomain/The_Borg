"use client"

import type React from "react"

import { useState } from "react"
import {
  LayoutDashboard,
  Play,
  Settings,
  Users,
  Github,
  ChevronRight,
  Bot,
  Workflow,
  Cpu,
  Database,
  BookOpen,
  MousePointer,
  Command,
  GitBranch,
  Server,
  Zap,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"
import BorgLogo from "./borg-logo"

interface SidebarProps {
  onNewSession: () => void
  onOpenSettings: () => void
}

export default function Sidebar({ onNewSession, onOpenSettings }: SidebarProps) {
  const [activeItem, setActiveItem] = useState("playground")

  return (
    <div className="w-[200px] bg-[#1E1E1E] border-r border-gray-800 flex flex-col h-full">
      <div className="p-4 border-b border-gray-800 flex items-center">
        <BorgLogo width={24} height={24} className="mr-2" />
        <span className="font-bold">THE BORG</span>
        <ChevronRight className="w-4 h-4 ml-auto" />
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className="p-2">
          <ul className="space-y-1">
            <SidebarItem
              icon={<LayoutDashboard className="w-4 h-4" />}
              label="DASHBOARD"
              isActive={activeItem === "dashboard"}
              onClick={() => setActiveItem("dashboard")}
              href="/dashboard"
            />
            <SidebarItem
              icon={<Play className="w-4 h-4" />}
              label="PLAYGROUND"
              isActive={activeItem === "playground"}
              onClick={() => setActiveItem("playground")}
              href="/playground"
            />
            <SidebarItem
              icon={<MessageSquare className="w-4 h-4" />}
              label="CHAT"
              isActive={activeItem === "chat"}
              onClick={() => setActiveItem("chat")}
              href="/chat"
            />
            <SidebarItem
              icon={<Command className="w-4 h-4" />}
              label="COMMAND CENTER"
              isActive={activeItem === "command-center"}
              onClick={() => setActiveItem("command-center")}
              href="/command-center"
            />
            <SidebarItem
              icon={<Bot className="w-4 h-4" />}
              label="AGENT STUDIO"
              isActive={activeItem === "agent-studio"}
              onClick={() => setActiveItem("agent-studio")}
              href="/agent-studio"
            />
            <SidebarItem
              icon={<Users className="w-4 h-4" />}
              label="BOT MANAGEMENT"
              isActive={activeItem === "bot-management"}
              onClick={() => setActiveItem("bot-management")}
              href="/bot-management"
            />
            <SidebarItem
              icon={<Workflow className="w-4 h-4" />}
              label="WORKFLOWS"
              isActive={activeItem === "workflows"}
              onClick={() => setActiveItem("workflows")}
              href="/workflows"
            />
            <SidebarItem
              icon={<GitBranch className="w-4 h-4" />}
              label="SELF-EVOLUTION"
              isActive={activeItem === "self-evolution"}
              onClick={() => setActiveItem("self-evolution")}
              href="/self-evolution"
            />
            <SidebarItem
              icon={<Zap className="w-4 h-4" />}
              label="IOU"
              isActive={activeItem === "iou"}
              onClick={() => setActiveItem("iou")}
              href="/iou"
            />
            <SidebarItem
              icon={<Server className="w-4 h-4" />}
              label="BOT SERVER"
              isActive={activeItem === "bot-server"}
              onClick={() => setActiveItem("bot-server")}
              href="/bot-server"
            />
            <SidebarItem
              icon={<Cpu className="w-4 h-4" />}
              label="AUTOPILOT"
              isActive={activeItem === "autopilot"}
              onClick={() => setActiveItem("autopilot")}
              href="/autopilot"
            />
            <SidebarItem
              icon={<MousePointer className="w-4 h-4" />}
              label="BROWSER CONTROL"
              isActive={activeItem === "browser-control"}
              onClick={() => setActiveItem("browser-control")}
              href="/browser-control"
            />
            <SidebarItem
              icon={<Database className="w-4 h-4" />}
              label="MEMORY & RAG"
              isActive={activeItem === "memory-rag"}
              onClick={() => setActiveItem("memory-rag")}
              href="/memory-rag"
            />
            <SidebarItem
              icon={<Settings className="w-4 h-4" />}
              label="SETTINGS"
              isActive={activeItem === "settings"}
              onClick={() => {
                setActiveItem("settings")
                onOpenSettings()
              }}
            />
          </ul>
        </nav>

        <div className="border-t border-gray-800 mt-4 pt-4">
          <nav className="p-2">
            <ul className="space-y-1">
              <SidebarItem
                icon={<BookOpen className="w-4 h-4" />}
                label="DOCUMENTATION"
                isActive={activeItem === "docs"}
                onClick={() => setActiveItem("docs")}
                href="/docs"
              />
              <SidebarItem
                icon={<Github className="w-4 h-4" />}
                label="GITHUB"
                isActive={activeItem === "github"}
                onClick={() => setActiveItem("github")}
                href="https://github.com/your-org/borg-framework"
                external
              />
            </ul>
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-gray-800">
        <div className="bg-black p-3 rounded-md text-center">
          <div className="flex items-center justify-center mb-2">
            <BorgLogo width={24} height={24} />
          </div>
          <p className="text-xs mb-1">The Borg Framework</p>
          <p className="text-xs mb-2 text-green-500">Self-Evolving Agent Framework</p>
          <button
            className="w-full bg-green-600 hover:bg-green-700 text-black font-medium text-xs py-1 px-2 rounded"
            onClick={onNewSession}
          >
            START NEW SESSION
          </button>
        </div>
      </div>
    </div>
  )
}

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  isActive: boolean
  onClick: () => void
  hasSubmenu?: boolean
  href?: string
  external?: boolean
}

function SidebarItem({ icon, label, isActive, onClick, hasSubmenu, href, external }: SidebarItemProps) {
  const content = (
    <>
      <span className="mr-2">{icon}</span>
      <span>{label}</span>
      {hasSubmenu && <ChevronRight className="w-3 h-3 ml-auto" />}
    </>
  )

  const className = `flex items-center w-full px-2 py-1.5 text-xs ${
    isActive ? "bg-green-800 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"
  } rounded-md transition-colors`

  if (href) {
    if (external) {
      return (
        <li>
          <a href={href} className={className} target="_blank" rel="noopener noreferrer" onClick={onClick}>
            {content}
          </a>
        </li>
      )
    }

    return (
      <li>
        <Link href={href} className={className} onClick={onClick}>
          {content}
        </Link>
      </li>
    )
  }

  return (
    <li>
      <button className={className} onClick={onClick}>
        {content}
      </button>
    </li>
  )
}
