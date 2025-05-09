"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Send, Paperclip, Loader2, Save, FileText, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { v4 as uuidv4 } from "uuid"

interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
}

interface Chat {
  id: string
  title: string
  created_at: string
  updated_at: string
}

interface Agent {
  id: string
  name: string
  icon: string
  description: string
}

export default function ChatPage() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uuidv4(),
      role: "assistant",
      content: "Welcome to your Borg Framework chat. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [savedChats, setSavedChats] = useState<Chat[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [activeAgent, setActiveAgent] = useState<Agent | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/session")
        const data = await response.json()

        setIsLoggedIn(!!data.session)

        if (!data.session) {
          router.push("/auth/login")
        } else {
          // Load saved chats for logged in user
          loadSavedChats()
          // Load available agents
          loadAgents()
        }
      } catch (error) {
        console.error("Error checking session:", error)
        router.push("/auth/login")
      }
    }

    checkSession()
  }, [router])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const loadSavedChats = async () => {
    try {
      const response = await fetch("/api/chats")

      if (!response.ok) {
        throw new Error("Failed to load chats")
      }

      const data = await response.json()
      setSavedChats(data.chats || [])
    } catch (error) {
      console.error("Error loading saved chats:", error)
      // Use mock data for demo mode
      setSavedChats([
        {
          id: "1",
          title: "Agent Creation Discussion",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "2",
          title: "Workflow Optimization",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "3",
          title: "System Integration Ideas",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
    }
  }

  const loadAgents = async () => {
    try {
      const response = await fetch("/api/agents")

      if (!response.ok) {
        throw new Error("Failed to load agents")
      }

      const data = await response.json()
      setAgents(data.agents || [])
    } catch (error) {
      console.error("Error loading agents:", error)
      // Use mock data for demo mode
      setAgents([
        {
          id: "1",
          name: "Research Assistant",
          icon: "📚",
          description: "Helps with research and information gathering",
        },
        { id: "2", name: "Code Assistant", icon: "💻", description: "Assists with coding tasks and debugging" },
        { id: "3", name: "Data Analyst", icon: "📊", description: "Analyzes data and provides insights" },
        { id: "4", name: "Creative Writer", icon: "✍️", description: "Helps with content creation and writing" },
      ])
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Call Groq API
      const response = await fetch("/api/grok", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: input,
          systemPrompt: activeAgent
            ? `You are ${activeAgent.name}, ${activeAgent.description}.`
            : "You are a helpful AI assistant for The Borg Framework, a powerful platform for building, managing, and orchestrating AI agents and workflows.",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: data.text,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Auto-save chat if we have an active chat
      if (activeChatId) {
        saveChat(false)
      }
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: uuidv4(),
        role: "system",
        content: "Sorry, there was an error processing your request.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const saveChat = async (isNew = true) => {
    try {
      if (!isLoggedIn) return

      const chatTitle = messages.length > 1 ? messages[1].content.substring(0, 30) + "..." : "New Chat"

      const endpoint = isNew || !activeChatId ? "/api/chats" : `/api/chats/${activeChatId}`

      const method = isNew || !activeChatId ? "POST" : "PUT"

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: chatTitle,
          messages: messages,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save chat")
      }

      const data = await response.json()

      if (isNew || !activeChatId) {
        setActiveChatId(data.id)
      }

      await loadSavedChats()
    } catch (error) {
      console.error("Error saving chat:", error)
    }
  }

  const loadChat = async (chatId: string) => {
    try {
      const response = await fetch(`/api/chats/${chatId}`)

      if (!response.ok) {
        throw new Error("Failed to load chat")
      }

      const data = await response.json()

      if (data) {
        setActiveChatId(chatId)
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error("Error loading chat:", error)
    }
  }

  const startNewChat = () => {
    setActiveChatId(null)
    setActiveAgent(null)
    setMessages([
      {
        id: uuidv4(),
        role: "assistant",
        content: "Welcome to your Borg Framework chat. How can I assist you today?",
        timestamp: new Date(),
      },
    ])
  }

  const selectAgent = (agent: Agent) => {
    setActiveAgent(agent)
    setActiveChatId(null)
    setMessages([
      {
        id: uuidv4(),
        role: "assistant",
        content: `I'm ${agent.name}. ${agent.description}. How can I help you today?`,
        timestamp: new Date(),
      },
    ])
  }

  return (
    <div className="flex h-screen bg-[#121212] text-white">
      {/* Sidebar */}
      <div className="w-64 bg-[#1A1A1A] border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <Button
            onClick={startNewChat}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {savedChats.length > 0 && (
            <div className="p-4">
              <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2">Saved Chats</h3>
              <div className="space-y-1">
                {savedChats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => loadChat(chat.id)}
                    className={`w-full text-left px-3 py-2 rounded text-sm flex items-center hover:bg-gray-800 ${
                      activeChatId === chat.id ? "bg-gray-800" : ""
                    }`}
                  >
                    <FileText className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="truncate">{chat.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {agents.length > 0 && (
            <div className="p-4">
              <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2">Available Agents</h3>
              <div className="space-y-1">
                {agents.map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => selectAgent(agent)}
                    className={`w-full text-left px-3 py-2 rounded text-sm flex items-center hover:bg-gray-800 ${
                      activeAgent?.id === agent.id ? "bg-gray-800" : ""
                    }`}
                  >
                    <span className="mr-2">{agent.icon}</span>
                    <span className="truncate">{agent.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="border-b border-gray-800 p-4 flex items-center justify-between">
          <div className="flex items-center">
            {activeAgent ? (
              <>
                <span className="text-xl mr-2">{activeAgent.icon}</span>
                <span className="font-medium">{activeAgent.name}</span>
              </>
            ) : (
              <span className="font-medium">Borg AI Chat</span>
            )}
          </div>
          <div>
            <Button
              onClick={() => saveChat()}
              variant="outline"
              size="sm"
              className="border-gray-700 text-gray-300 hover:text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Chat
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : message.role === "system"
                        ? "bg-gray-700 text-gray-300"
                        : "bg-[#2A2A2A] text-white"
                  }`}
                >
                  <p>{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#2A2A2A] rounded-lg p-3 flex items-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  <p>Thinking...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <div className="border-t border-gray-800 p-4">
          <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="bg-[#2A2A2A] border-gray-700 text-white pl-4 pr-10 py-6 rounded-lg"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  disabled={isLoading}
                >
                  <Paperclip className="w-5 h-5" />
                </button>
              </div>
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-6 rounded-lg ${
                  (!input.trim() || isLoading) && "opacity-50 cursor-not-allowed"
                }`}
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
