"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { EnhancedDocs } from "./documentation/enhanced-docs"

interface DocSidebarItemProps {
  title: string
  isActive: boolean
  onClick: () => void
  hasChildren?: boolean
  level?: number
}

function DocSidebarItem({ title, isActive, onClick, hasChildren = false, level = 0 }: DocSidebarItemProps) {
  return (
    <button
      className={`flex items-center w-full px-2 py-1.5 text-sm ${
        isActive ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"
      } rounded-md transition-colors text-left ${level > 0 ? `pl-${level * 4 + 2}` : ""}`}
      onClick={onClick}
    >
      <span>{title}</span>
      {hasChildren && <ChevronRight className="w-3 h-3 ml-auto" />}
    </button>
  )
}

export default function Documentation() {
  const [activePage, setActivePage] = useState<string>("quickstart")
  const [searchQuery, setSearchQuery] = useState<string>("")

  const renderContent = () => {
    switch (activePage) {
      case "quickstart":
        return <QuickstartGuide />
      case "installation":
        return <InstallationGuide />
      case "api-reference":
        return <ApiReference />
      case "agent-creation":
        return <AgentCreationGuide />
      case "team-management":
        return <TeamManagementGuide />
      case "autopilot":
        return <AutopilotGuide />
      case "rag-memory":
        return <RagMemoryGuide />
      case "browser-control":
        return <BrowserControlGuide />
      default:
        return <QuickstartGuide />
    }
  }

  return <EnhancedDocs />
}

function QuickstartGuide() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Quickstart Guide</h1>

      <div className="prose prose-invert max-w-none">
        <h2>Welcome to The Borg Framework</h2>
        <p>
          The Borg is a self-evolving agent framework that allows you to create, manage, and deploy intelligent AI
          agents that can learn and improve over time.
        </p>

        <h3>Getting Started in 5 Minutes</h3>
        <ol>
          <li>
            <strong>Configure your API keys</strong>
            <p>Go to Settings and add your Grok API key and Supabase credentials to enable all features.</p>
          </li>
          <li>
            <strong>Create your first agent</strong>
            <p>
              Navigate to the Agent Studio and create a new agent using the intuitive interface or plain language
              description.
            </p>
          </li>
          <li>
            <strong>Test your agent</strong>
            <p>Use the Playground to interact with your agent and test its capabilities.</p>
          </li>
          <li>
            <strong>Build a team</strong>
            <p>Combine multiple agents into a team to solve complex problems through collaboration.</p>
          </li>
          <li>
            <strong>Enable self-evolution</strong>
            <p>
              Turn on the self-evolution feature to allow your agents to learn and improve based on interactions and
              feedback.
            </p>
          </li>
        </ol>

        <h3>Key Concepts</h3>
        <ul>
          <li>
            <strong>Agents</strong>: Individual AI entities with specific capabilities and knowledge.
          </li>
          <li>
            <strong>Teams</strong>: Groups of agents working together to accomplish tasks.
          </li>
          <li>
            <strong>Workflows</strong>: Sequences of actions that agents can perform automatically.
          </li>
          <li>
            <strong>Self-Evolution</strong>: The ability of agents to improve their capabilities over time.
          </li>
          <li>
            <strong>RAG (Retrieval-Augmented Generation)</strong>: Enhances agent responses with external knowledge.
          </li>
          <li>
            <strong>Autopilot</strong>: Allows agents to operate autonomously while you observe.
          </li>
        </ul>

        <h3>Next Steps</h3>
        <p>
          Explore the rest of the documentation to learn more about advanced features and capabilities of The Borg
          Framework.
        </p>
      </div>
    </div>
  )
}

function InstallationGuide() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Installation Guide</h1>

      <div className="prose prose-invert max-w-none">
        <p>Detailed installation instructions would go here...</p>
      </div>
    </div>
  )
}

function ApiReference() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">API Reference</h1>

      <div className="prose prose-invert max-w-none">
        <p>API documentation would go here...</p>
      </div>
    </div>
  )
}

function AgentCreationGuide() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Agent Creation Guide</h1>

      <div className="prose prose-invert max-w-none">
        <p>Guide for creating agents would go here...</p>
      </div>
    </div>
  )
}

function TeamManagementGuide() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Team Management Guide</h1>

      <div className="prose prose-invert max-w-none">
        <p>Guide for managing agent teams would go here...</p>
      </div>
    </div>
  )
}

function AutopilotGuide() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Autopilot Mode Guide</h1>

      <div className="prose prose-invert max-w-none">
        <p>Guide for using autopilot mode would go here...</p>
      </div>
    </div>
  )
}

function RagMemoryGuide() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">RAG & Memory Guide</h1>

      <div className="prose prose-invert max-w-none">
        <p>Guide for RAG and memory features would go here...</p>
      </div>
    </div>
  )
}

function BrowserControlGuide() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Browser Control Guide</h1>

      <div className="prose prose-invert max-w-none">
        <p>Guide for browser control features would go here...</p>
      </div>
    </div>
  )
}
