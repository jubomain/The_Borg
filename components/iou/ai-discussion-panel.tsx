"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Cpu, Search, Send, User } from "lucide-react"

type Message = {
  id: string
  role: "user" | "groq" | "serper"
  content: string
  timestamp: Date
}

export default function AIDiscussionPanel() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [topic, setTopic] = useState("")
  const [isDiscussing, setIsDiscussing] = useState(false)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const startDiscussion = async () => {
    if (!topic) return

    setIsDiscussing(true)
    setMessages([])

    const initialMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `Let's discuss: ${topic}`,
      timestamp: new Date(),
    }

    setMessages([initialMessage])

    try {
      setIsLoading(true)

      // Call the API to start the AI discussion
      const response = await fetch("/api/ai-discussion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      })

      if (!response.ok) {
        throw new Error("Failed to start discussion")
      }

      const data = await response.json()

      // Add the AI responses
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "-groq",
          role: "groq",
          content: data.groqResponse,
          timestamp: new Date(),
        },
        {
          id: Date.now().toString() + "-serper",
          role: "serper",
          content: data.serperResponse,
          timestamp: new Date(),
        },
      ])
    } catch (error) {
      console.error("Error starting discussion:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || !isDiscussing) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    try {
      setIsLoading(true)

      // Call the API to get AI responses
      const response = await fetch("/api/ai-discussion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get AI responses")
      }

      const data = await response.json()

      // Add the AI responses
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "-groq",
          role: "groq",
          content: data.groqResponse,
          timestamp: new Date(),
        },
        {
          id: Date.now().toString() + "-serper",
          role: "serper",
          content: data.serperResponse,
          timestamp: new Date(),
        },
      ])
    } catch (error) {
      console.error("Error getting AI responses:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-green-500" />
              <h2 className="text-xl font-semibold">AI Discussion Panel</h2>
            </div>

            <p className="text-gray-400 text-sm">
              Start a three-way discussion between you, Groq AI, and a search-powered AI using Serper. They will analyze
              and discuss potential implementations and optimizations.
            </p>

            {!isDiscussing ? (
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter a topic to discuss (e.g., 'Implementing RAG in BORG')"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={startDiscussion}
                  disabled={isLoading || !topic}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Start Discussion
                </Button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Input
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {isDiscussing && (
        <Card className="h-[600px] flex flex-col">
          <CardContent className="pt-6 flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`
                    relative max-w-[80%] p-3 rounded-lg
                    ${
                      message.role === "user"
                        ? "bg-gray-700 text-white"
                        : message.role === "groq"
                          ? "bg-green-900 text-white"
                          : "bg-blue-900 text-white"
                    }
                  `}
                  >
                    <div className="flex items-center mb-1">
                      {message.role === "user" ? (
                        <User className="w-4 h-4 mr-1" />
                      ) : message.role === "groq" ? (
                        <div className="relative">
                          <div className="w-4 h-4 bg-green-500 rounded-full mr-1"></div>
                          <div className="absolute top-0 left-0 w-4 h-4 bg-green-500 rounded-full animate-ping opacity-75"></div>
                        </div>
                      ) : (
                        <div className="relative">
                          <div className="w-4 h-4 bg-blue-500 rounded-full mr-1"></div>
                          <div className="absolute top-0 left-0 w-4 h-4 bg-blue-500 rounded-full animate-ping opacity-75"></div>
                        </div>
                      )}
                      <span className="text-xs font-bold">
                        {message.role === "user" ? "You" : message.role === "groq" ? "Groq AI" : "Search AI"}
                      </span>
                      <span className="text-xs ml-2 opacity-50">{message.timestamp.toLocaleTimeString()}</span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />

              {isLoading && (
                <div className="flex justify-center items-center space-x-2 py-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
