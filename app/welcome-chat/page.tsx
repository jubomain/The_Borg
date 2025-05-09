"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Send, Paperclip, Loader2, Clock, Save, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import BorgLogo from "@/components/borg-logo"
import VisualOrbChat from "@/components/visual-orb-chat"

interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
}

export default function WelcomeChat() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-msg",
      role: "assistant",
      content: "Welcome to The Borg Framework. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [showOrbChat, setShowOrbChat] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    // Check login status via API instead of direct Supabase client usage
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

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // If user is not logged in, redirect after a short delay to show their message
      if (!isLoggedIn) {
        setTimeout(() => {
          setIsRedirecting(true)
          const systemMessage: Message = {
            id: `system-${Date.now()}`,
            role: "system",
            content: "Please log in or register to continue this conversation.",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, systemMessage])

          // Redirect to login after showing the message
          setTimeout(() => {
            router.push("/auth/login")
          }, 2000)
        }, 1000)
        return
      }

      // For logged in users, call Groq API
      const response = await fetch("/api/grok", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: input,
          systemPrompt:
            "You are a helpful AI assistant for The Borg Framework, a powerful platform for building, managing, and orchestrating AI agents and workflows.",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.text,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "system",
        content: "Sorry, there was an error processing your request.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

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

      {/* Main chat area */}
      <div className="flex flex-1 flex-col max-w-5xl mx-auto w-full pt-6 px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">What do you want to build?</h2>
          <p className="text-gray-400 text-lg">
            Prompt, run, edit, and deploy AI agents and workflows with The Borg Framework
          </p>
        </div>

        {/* Messages container */}
        <div className="flex-1 overflow-y-auto rounded-lg bg-[#1A1A1A] mb-4 p-4">
          <div className="space-y-4">
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
            {isRedirecting && (
              <div className="flex justify-center">
                <div className="bg-blue-900/30 border border-blue-700 text-blue-200 p-3 rounded-md flex items-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  <p>Redirecting to login...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <form onSubmit={handleSendMessage} className="mb-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="What would you like help with today?"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="bg-[#2A2A2A] border-gray-700 text-white pl-4 pr-10 py-6 rounded-lg"
                disabled={isLoading || isRedirecting}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                disabled={isLoading || isRedirecting}
              >
                <Paperclip className="w-5 h-5" />
              </button>
            </div>
            <Button
              type="submit"
              disabled={!input.trim() || isLoading || isRedirecting}
              className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-6 rounded-lg ${
                (!input.trim() || isLoading || isRedirecting) && "opacity-50 cursor-not-allowed"
              }`}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </Button>
          </div>
        </form>

        {/* Footer with features */}
        {!isLoggedIn && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#1A1A1A] p-4 rounded-lg flex items-center">
              <div className="w-10 h-10 bg-blue-900/30 rounded-full flex items-center justify-center mr-3">
                <Save className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">Save Your Chats</h3>
                <p className="text-sm text-gray-400">Create an account to save conversations</p>
              </div>
            </div>
            <div className="bg-[#1A1A1A] p-4 rounded-lg flex items-center">
              <div className="w-10 h-10 bg-blue-900/30 rounded-full flex items-center justify-center mr-3">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">Chat History</h3>
                <p className="text-sm text-gray-400">Access your previous conversations</p>
              </div>
            </div>
            <div className="bg-[#1A1A1A] p-4 rounded-lg flex items-center">
              <div className="w-10 h-10 bg-blue-900/30 rounded-full flex items-center justify-center mr-3">
                <ArrowRight className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">Deploy Agents</h3>
                <p className="text-sm text-gray-400">Create and deploy custom AI agents</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Visual Orb Chat */}
      {showOrbChat && <VisualOrbChat onLogin={redirectToLogin} isLoggedIn={isLoggedIn} />}
    </div>
  )
}
