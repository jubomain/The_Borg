"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Minimize2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { v4 as uuidv4 } from "uuid"

interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
}

interface VisualOrbChatProps {
  onLogin?: () => void
  isLoggedIn?: boolean
  initialExpanded?: boolean
}

export default function VisualOrbChat({ onLogin, isLoggedIn = false, initialExpanded = false }: VisualOrbChatProps) {
  const [expanded, setExpanded] = useState(initialExpanded)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uuidv4(),
      role: "assistant",
      content: "Hello! I'm your Borg AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [pulseAnimation, setPulseAnimation] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Start pulse animation every 10 seconds when collapsed
  useEffect(() => {
    if (!expanded) {
      const interval = setInterval(() => {
        setPulseAnimation(true)
        setTimeout(() => setPulseAnimation(false), 2000)
      }, 10000)
      return () => clearInterval(interval)
    }
  }, [expanded])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input when expanded
  useEffect(() => {
    if (expanded) {
      inputRef.current?.focus()
    }
  }, [expanded])

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
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
      // If user is not logged in, prompt to login
      if (!isLoggedIn) {
        setTimeout(() => {
          const systemMessage: Message = {
            id: uuidv4(),
            role: "system",
            content: "Please log in to continue this conversation and access all features.",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, systemMessage])
          setIsLoading(false)
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
        id: uuidv4(),
        role: "assistant",
        content: data.text,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
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

  const toggleExpanded = () => {
    setExpanded(!expanded)
  }

  const handleLoginClick = () => {
    if (onLogin) onLogin()
  }

  // Orb animation variants
  const orbVariants = {
    collapsed: {
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      boxShadow: "0 0 15px rgba(0, 120, 255, 0.5)",
    },
    expanded: {
      width: "380px",
      height: "500px",
      borderRadius: "20px",
      boxShadow: "0 0 30px rgba(0, 120, 255, 0.3)",
    },
  }

  // Pulse animation variants
  const pulseVariants = {
    pulse: {
      scale: [1, 1.1, 1],
      boxShadow: [
        "0 0 15px rgba(0, 120, 255, 0.5)",
        "0 0 30px rgba(0, 120, 255, 0.8)",
        "0 0 15px rgba(0, 120, 255, 0.5)",
      ],
      transition: {
        duration: 2,
        ease: "easeInOut",
      },
    },
  }

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50 bg-[#121212] text-white overflow-hidden flex flex-col"
      variants={orbVariants}
      animate={expanded ? "expanded" : pulseAnimation ? "pulse" : "collapsed"}
      initial="collapsed"
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      {...(pulseAnimation && { variants: pulseVariants, animate: "pulse" })}
    >
      {/* Header - only visible when expanded */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 border-b border-gray-800 flex items-center justify-between"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-2">
                <span className="text-white font-bold">B</span>
              </div>
              <span className="font-medium">Borg AI</span>
            </div>
            <button onClick={toggleExpanded} className="text-gray-400 hover:text-white">
              <Minimize2 size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat content - only visible when expanded */}
      <AnimatePresence>
        {expanded ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-y-auto p-3"
          >
            <div className="space-y-3">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-lg p-2 text-sm ${
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
                  <div className="bg-[#2A2A2A] rounded-lg p-2 text-sm flex items-center">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <p>Thinking...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full flex items-center justify-center"
            onClick={toggleExpanded}
          >
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold">B</span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Input area - only visible when expanded */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 border-t border-gray-800"
          >
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                ref={inputRef}
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="bg-[#2A2A2A] border-gray-700 text-white text-sm"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="sm"
                disabled={!input.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Send size={16} />
              </Button>
            </form>
            {!isLoggedIn && (
              <div className="mt-2 text-center">
                <button onClick={handleLoginClick} className="text-xs text-blue-400 hover:text-blue-300">
                  Log in for full features
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
