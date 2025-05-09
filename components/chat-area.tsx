"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Loader2 } from "lucide-react"
import type { Message, Agent } from "@/types/agent"

interface ChatAreaProps {
  messages: Message[]
  isLoading: boolean
  onSendMessage: (content: string) => void
  endpointConnected: boolean
  selectedAgent: Agent | null
  onSelectDemoAgent: () => void
}

export default function ChatArea({
  messages,
  isLoading,
  onSendMessage,
  endpointConnected,
  selectedAgent,
  onSelectDemoAgent,
}: ChatAreaProps) {
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    onSendMessage(input)
    setInput("")
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex">
                {message.role === "user" ? (
                  <div className="flex-1">
                    <div className="bg-gray-800 rounded-lg p-3 inline-block max-w-[80%]">
                      <p>{message.content}</p>
                    </div>
                  </div>
                ) : message.role === "assistant" ? (
                  <div className="flex-1 flex justify-end">
                    <div className="bg-blue-600 rounded-lg p-3 inline-block max-w-[80%]">
                      <p>{message.content}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1">
                    <div className="bg-gray-700 text-gray-300 rounded-lg p-3 inline-block max-w-[80%]">
                      <p>{message.content}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : !endpointConnected ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="mb-4 flex items-center">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center mr-2">
                <span className="text-xl">💬</span>
              </div>
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xl">🤖</span>
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">Please select an endpoint to connect to</h2>
            <p className="text-gray-400 mb-4">Visit our docs for more information or try our demo agent</p>
            <div className="flex space-x-4">
              <button className="px-4 py-2 bg-gray-800 rounded-md text-sm font-medium flex items-center">DOCS</button>
              <button
                className="px-4 py-2 bg-gray-800 rounded-md text-sm font-medium flex items-center"
                onClick={onSelectDemoAgent}
              >
                DEMO AGENT
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <p className="text-gray-400">No messages yet. Start a conversation!</p>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-gray-800">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={endpointConnected ? "Type a message..." : "Select an endpoint to start chatting..."}
            className="flex-1 bg-gray-800 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!endpointConnected || isLoading}
          />
          <button
            type="submit"
            className="bg-blue-600 rounded-md p-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!endpointConnected || isLoading || !input.trim()}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  )
}
