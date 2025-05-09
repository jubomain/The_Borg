"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MCPIntegration() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/mcp/http", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      const assistantMessage = data.messages[data.messages.length - 1]
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, there was an error processing your request." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Borg MCP Integration</CardTitle>
        <CardDescription>Interact with the Borg Framework using the Machine Communication Protocol</CardDescription>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="chat"
            onClick={() => setActiveTab("chat")}
            className={activeTab === "chat" ? "bg-blue-100 dark:bg-blue-900" : ""}
          >
            Chat
          </TabsTrigger>
          <TabsTrigger
            value="tools"
            onClick={() => setActiveTab("tools")}
            className={activeTab === "tools" ? "bg-blue-100 dark:bg-blue-900" : ""}
          >
            Available Tools
          </TabsTrigger>
        </TabsList>
      </CardHeader>

      <CardContent>
        {activeTab === "chat" ? (
          <div className="flex flex-col space-y-4">
            <div className="flex-1 overflow-y-auto max-h-[400px] p-4 rounded-md bg-gray-50 dark:bg-gray-900">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  Start a conversation with the Borg MCP
                </div>
              ) : (
                messages.map((message, index) => (
                  <div key={index} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
                    <div
                      className={`inline-block p-3 rounded-lg ${
                        message.role === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="text-left mb-4">
                  <div className="inline-block p-3 rounded-lg bg-gray-200 dark:bg-gray-700">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-md bg-gray-50 dark:bg-gray-900">
              <h3 className="font-medium mb-2">Available MCP Tools</h3>
              <ul className="space-y-3">
                <li className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                  <div className="font-semibold">search</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Search for information on the web</div>
                </li>
                <li className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                  <div className="font-semibold">create_workflow</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Create a new workflow in the Borg Framework
                  </div>
                </li>
                <li className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                  <div className="font-semibold">create_agent</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Create a new AI agent in the Borg Framework
                  </div>
                </li>
                <li className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                  <div className="font-semibold">execute_workflow</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Execute a workflow in the Borg Framework
                  </div>
                </li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>

      {activeTab === "chat" && (
        <CardFooter>
          <form onSubmit={handleSubmit} className="flex w-full space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              Send
            </Button>
          </form>
        </CardFooter>
      )}
    </Card>
  )
}
