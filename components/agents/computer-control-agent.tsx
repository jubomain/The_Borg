"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Terminal, HardDrive, Cpu, Network, FileText } from "lucide-react"

export default function ComputerControlAgent() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const [systemInfo, setSystemInfo] = useState(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Fetch system info when component mounts
    if (activeTab === "system") {
      fetchSystemInfo()
    }
  }, [activeTab])

  const fetchSystemInfo = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/mcp/http", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            { role: "user", content: "Get system information using the system_info tool with info_type set to all" },
          ],
        }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      const assistantMessage = data.messages[data.messages.length - 1]

      // Extract system info from the response
      const toolCallMatch = assistantMessage.content.match(/```json\n([\s\S]*?)\n```/)
      if (toolCallMatch && toolCallMatch[1]) {
        try {
          const toolCallData = JSON.parse(toolCallMatch[1])
          setSystemInfo(toolCallData)
        } catch (e) {
          console.error("Failed to parse system info:", e)
        }
      }
    } catch (error) {
      console.error("Error fetching system info:", error)
    } finally {
      setIsLoading(false)
    }
  }

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

  const renderSystemInfo = () => {
    if (!systemInfo) {
      return (
        <div className="flex items-center justify-center h-64">
          <Button onClick={fetchSystemInfo} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Fetch System Information"
            )}
          </Button>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {systemInfo.os && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <HardDrive className="mr-2 h-5 w-5" />
                Operating System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="font-medium">Platform:</dt>
                  <dd>{systemInfo.os.platform}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Type:</dt>
                  <dd>{systemInfo.os.type}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Release:</dt>
                  <dd>{systemInfo.os.release}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Architecture:</dt>
                  <dd>{systemInfo.os.arch}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Hostname:</dt>
                  <dd>{systemInfo.os.hostname}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Uptime:</dt>
                  <dd>{Math.floor(systemInfo.os.uptime / 3600)} hours</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        )}

        {systemInfo.cpu && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Cpu className="mr-2 h-5 w-5" />
                CPU
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="font-medium">Model:</dt>
                  <dd className="text-right">{systemInfo.cpu.model}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Cores:</dt>
                  <dd>{systemInfo.cpu.cores}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Speed:</dt>
                  <dd>{systemInfo.cpu.speed} MHz</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Load Average:</dt>
                  <dd>{systemInfo.cpu.load.join(", ")}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        )}

        {systemInfo.memory && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Memory
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="font-medium">Total:</dt>
                  <dd>{Math.round(systemInfo.memory.total / 1024 / 1024)} MB</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Free:</dt>
                  <dd>{Math.round(systemInfo.memory.free / 1024 / 1024)} MB</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Used:</dt>
                  <dd>{Math.round(systemInfo.memory.used / 1024 / 1024)} MB</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Usage:</dt>
                  <dd>{Math.round((systemInfo.memory.used / systemInfo.memory.total) * 100)}%</dd>
                </div>
              </dl>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${Math.round((systemInfo.memory.used / systemInfo.memory.total) * 100)}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        )}

        {systemInfo.network && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Network className="mr-2 h-5 w-5" />
                Network
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-64 overflow-y-auto">
                {Object.entries(systemInfo.network.interfaces).map(([name, interfaces]) => (
                  <div key={name} className="mb-4">
                    <h4 className="font-medium">{name}</h4>
                    <ul className="pl-4 space-y-1">
                      {Array.isArray(interfaces) &&
                        interfaces.map((iface, i) => (
                          <li key={i} className="text-sm">
                            {iface.family}: {iface.address}
                            {iface.netmask && ` (netmask: ${iface.netmask})`}
                            {iface.internal ? " (internal)" : ""}
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle>Computer Control Agent</CardTitle>
        <CardDescription>Control and monitor your computer system using natural language</CardDescription>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger
            value="chat"
            onClick={() => setActiveTab("chat")}
            className={activeTab === "chat" ? "bg-blue-100 dark:bg-blue-900" : ""}
          >
            Chat
          </TabsTrigger>
          <TabsTrigger
            value="system"
            onClick={() => setActiveTab("system")}
            className={activeTab === "system" ? "bg-blue-100 dark:bg-blue-900" : ""}
          >
            System Info
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
        {activeTab === "chat" && (
          <div className="flex flex-col space-y-4">
            <div className="flex-1 overflow-y-auto max-h-[400px] p-4 rounded-md bg-gray-50 dark:bg-gray-900">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  <Terminal className="mx-auto h-12 w-12 mb-2 text-gray-400" />
                  <p>Start a conversation with the Computer Control Agent</p>
                  <p className="text-sm mt-2">Try asking:</p>
                  <ul className="text-sm mt-1 space-y-1">
                    <li>"Get system information"</li>
                    <li>"List running processes"</li>
                    <li>"Scan ports on localhost"</li>
                    <li>"Create a text file with some content"</li>
                  </ul>
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
        )}

        {activeTab === "system" && renderSystemInfo()}

        {activeTab === "tools" && (
          <div className="space-y-4">
            <div className="p-4 rounded-md bg-gray-50 dark:bg-gray-900">
              <h3 className="font-medium mb-2">Available Computer Control Tools</h3>
              <ul className="space-y-3">
                <li className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                  <div className="font-semibold">system_info</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Get system information such as OS, CPU, memory, etc.
                  </div>
                </li>
                <li className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                  <div className="font-semibold">list_directory</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    List files and directories in a specified path
                  </div>
                </li>
                <li className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                  <div className="font-semibold">read_file</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Read the contents of a file</div>
                </li>
                <li className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                  <div className="font-semibold">write_file</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Write content to a file</div>
                </li>
                <li className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                  <div className="font-semibold">run_command</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Run a shell command (with safety restrictions)
                  </div>
                </li>
                <li className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                  <div className="font-semibold">process_list</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Get a list of running processes</div>
                </li>
                <li className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                  <div className="font-semibold">network_scan</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Scan network for open ports on a specific host
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
              placeholder="Type your command or question..."
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
