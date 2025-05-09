"use client"

import { useState, useEffect } from "react"
import Header from "@/components/navigation/header"
import { Server, RefreshCw, Play, Pause, Plus, Trash2, Settings, HardDrive, Cpu, Activity } from "lucide-react"

interface ServerInstance {
  id: string
  name: string
  status: "running" | "stopped" | "starting" | "error"
  created_at: string
  specs: {
    cpu: number
    memory: number
    storage: number
  }
  bots: string[]
  metrics: {
    cpu_usage: number
    memory_usage: number
    network_usage: number
    uptime: number
  }
}

export default function BotServerPage() {
  const [servers, setServers] = useState<ServerInstance[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedServer, setSelectedServer] = useState<ServerInstance | null>(null)
  const [isCreatingServer, setIsCreatingServer] = useState(false)
  const [newServerName, setNewServerName] = useState("")

  useEffect(() => {
    fetchServers()
  }, [])

  const fetchServers = async () => {
    setIsLoading(true)
    try {
      // In a real implementation, this would fetch from Supabase
      // For this demo, we'll simulate the data
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const mockServers: ServerInstance[] = [
        {
          id: "server-1",
          name: "Production Server",
          status: "running",
          created_at: "2023-05-15T14:30:00Z",
          specs: {
            cpu: 8,
            memory: 16,
            storage: 100,
          },
          bots: ["bot-1", "bot-2", "bot-3", "bot-4", "bot-5"],
          metrics: {
            cpu_usage: 45,
            memory_usage: 60,
            network_usage: 30,
            uptime: 15 * 24 * 60 * 60, // 15 days in seconds
          },
        },
        {
          id: "server-2",
          name: "Development Server",
          status: "running",
          created_at: "2023-06-10T09:15:00Z",
          specs: {
            cpu: 4,
            memory: 8,
            storage: 50,
          },
          bots: ["bot-6", "bot-7", "bot-8"],
          metrics: {
            cpu_usage: 25,
            memory_usage: 40,
            network_usage: 15,
            uptime: 5 * 24 * 60 * 60, // 5 days in seconds
          },
        },
      ]

      setServers(mockServers)
      if (mockServers.length > 0 && !selectedServer) {
        setSelectedServer(mockServers[0])
      }
    } catch (error) {
      console.error("Error fetching servers:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateServer = async () => {
    if (!newServerName.trim()) return

    setIsCreatingServer(true)
    try {
      // In a real implementation, this would create a server in Supabase
      // For this demo, we'll simulate the creation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newServer: ServerInstance = {
        id: `server-${Date.now()}`,
        name: newServerName,
        status: "starting",
        created_at: new Date().toISOString(),
        specs: {
          cpu: 4,
          memory: 8,
          storage: 50,
        },
        bots: [],
        metrics: {
          cpu_usage: 0,
          memory_usage: 0,
          network_usage: 0,
          uptime: 0,
        },
      }

      setServers([...servers, newServer])
      setNewServerName("")

      // Simulate server starting
      setTimeout(() => {
        setServers((prevServers) =>
          prevServers.map((server) => (server.id === newServer.id ? { ...server, status: "running" } : server)),
        )
      }, 5000)
    } catch (error) {
      console.error("Error creating server:", error)
    } finally {
      setIsCreatingServer(false)
    }
  }

  const handleStartServer = async (serverId: string) => {
    try {
      // Update server status to starting
      setServers((prevServers) =>
        prevServers.map((server) => (server.id === serverId ? { ...server, status: "starting" } : server)),
      )

      // Simulate server starting
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Update server status to running
      setServers((prevServers) =>
        prevServers.map((server) => (server.id === serverId ? { ...server, status: "running" } : server)),
      )
    } catch (error) {
      console.error("Error starting server:", error)
    }
  }

  const handleStopServer = async (serverId: string) => {
    try {
      // Update server status to stopped
      setServers((prevServers) =>
        prevServers.map((server) => (server.id === serverId ? { ...server, status: "stopped" } : server)),
      )
    } catch (error) {
      console.error("Error stopping server:", error)
    }
  }

  const handleDeleteServer = async (serverId: string) => {
    try {
      // Remove server from state
      setServers((prevServers) => prevServers.filter((server) => server.id !== serverId))

      // If the deleted server was selected, select another one
      if (selectedServer?.id === serverId) {
        const remainingServers = servers.filter((server) => server.id !== serverId)
        setSelectedServer(remainingServers.length > 0 ? remainingServers[0] : null)
      }
    } catch (error) {
      console.error("Error deleting server:", error)
    }
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 60 * 60))
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60))
    const minutes = Math.floor((seconds % (60 * 60)) / 60)

    return `${days}d ${hours}h ${minutes}m`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-900 text-green-300"
      case "stopped":
        return "bg-gray-700 text-gray-300"
      case "starting":
        return "bg-blue-900 text-blue-300"
      case "error":
        return "bg-red-900 text-red-300"
      default:
        return "bg-gray-700 text-gray-300"
    }
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Bot Server Management" />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <Server className="w-6 h-6 mr-2" />
              Bot Servers
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={fetchServers}
                disabled={isLoading}
                className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md flex items-center text-sm"
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-gray-900 rounded-lg p-4 mb-6">
                <h3 className="font-medium mb-4">Create New Server</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Server Name</label>
                    <input
                      type="text"
                      value={newServerName}
                      onChange={(e) => setNewServerName(e.target.value)}
                      className="w-full bg-gray-800 rounded-md px-3 py-2 text-sm"
                      placeholder="E.g., Production Server"
                    />
                  </div>

                  <button
                    onClick={handleCreateServer}
                    disabled={isCreatingServer || !newServerName.trim()}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md flex items-center justify-center disabled:opacity-50"
                  >
                    {isCreatingServer ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Server
                      </>
                    )}
                  </button>
                </div>
              </div>

              <h3 className="font-medium mb-4">Available Servers</h3>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {servers.length === 0 ? (
                  <div className="bg-gray-900 rounded-lg p-6 text-center">
                    <Server className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Servers Available</h3>
                    <p className="text-gray-500 mb-4">Create a server to get started</p>
                  </div>
                ) : (
                  servers.map((server) => (
                    <div
                      key={server.id}
                      className={`bg-gray-900 rounded-md p-3 cursor-pointer hover:bg-gray-800 transition-colors ${
                        selectedServer?.id === server.id ? "border-2 border-green-500" : ""
                      }`}
                      onClick={() => setSelectedServer(server)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{server.name}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            {server.bots.length} bots • {server.specs.cpu} CPU • {server.specs.memory}GB RAM
                          </div>
                        </div>
                        <div className={`px-2 py-1 text-xs rounded-full ${getStatusColor(server.status)}`}>
                          {server.status}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="lg:col-span-2">
              {selectedServer ? (
                <div className="bg-gray-900 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-medium">{selectedServer.name}</h3>
                      <p className="text-sm text-gray-400 mt-1">
                        Created: {new Date(selectedServer.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      {selectedServer.status === "running" ? (
                        <button
                          onClick={() => handleStopServer(selectedServer.id)}
                          className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md flex items-center text-sm"
                        >
                          <Pause className="w-4 h-4 mr-1" />
                          Stop
                        </button>
                      ) : selectedServer.status === "stopped" ? (
                        <button
                          onClick={() => handleStartServer(selectedServer.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md flex items-center text-sm"
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Start
                        </button>
                      ) : null}
                      <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md flex items-center text-sm">
                        <Settings className="w-4 h-4 mr-1" />
                        Configure
                      </button>
                      <button
                        onClick={() => handleDeleteServer(selectedServer.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md flex items-center text-sm"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-medium mb-3 flex items-center">
                        <HardDrive className="w-4 h-4 mr-1" />
                        Server Specifications
                      </h4>
                      <div className="bg-gray-800 rounded-md p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-400 mb-1">CPU Cores</div>
                            <div className="text-xl font-bold">{selectedServer.specs.cpu}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-400 mb-1">Memory (GB)</div>
                            <div className="text-xl font-bold">{selectedServer.specs.memory}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-400 mb-1">Storage (GB)</div>
                            <div className="text-xl font-bold">{selectedServer.specs.storage}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-400 mb-1">Bots</div>
                            <div className="text-xl font-bold">{selectedServer.bots.length}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3 flex items-center">
                        <Activity className="w-4 h-4 mr-1" />
                        Server Metrics
                      </h4>
                      <div className="bg-gray-800 rounded-md p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-400 mb-1">CPU Usage</div>
                            <div className="flex items-center">
                              <div className="text-xl font-bold mr-2">{selectedServer.metrics.cpu_usage}%</div>
                              <div className="flex-1 bg-gray-700 rounded-full h-2">
                                <div
                                  className="bg-green-500 h-2 rounded-full"
                                  style={{ width: `${selectedServer.metrics.cpu_usage}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-400 mb-1">Memory Usage</div>
                            <div className="flex items-center">
                              <div className="text-xl font-bold mr-2">{selectedServer.metrics.memory_usage}%</div>
                              <div className="flex-1 bg-gray-700 rounded-full h-2">
                                <div
                                  className="bg-blue-500 h-2 rounded-full"
                                  style={{ width: `${selectedServer.metrics.memory_usage}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-400 mb-1">Network Usage</div>
                            <div className="flex items-center">
                              <div className="text-xl font-bold mr-2">{selectedServer.metrics.network_usage}%</div>
                              <div className="flex-1 bg-gray-700 rounded-full h-2">
                                <div
                                  className="bg-purple-500 h-2 rounded-full"
                                  style={{ width: `${selectedServer.metrics.network_usage}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-400 mb-1">Uptime</div>
                            <div className="text-xl font-bold">{formatUptime(selectedServer.metrics.uptime)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3 flex items-center">
                      <Cpu className="w-4 h-4 mr-1" />
                      Active Bots
                    </h4>
                    {selectedServer.bots.length === 0 ? (
                      <div className="bg-gray-800 rounded-md p-4 text-center">
                        <p className="text-gray-500">No bots deployed to this server</p>
                      </div>
                    ) : (
                      <div className="bg-gray-800 rounded-md p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                        {selectedServer.bots.map((botId) => (
                          <div key={botId} className="bg-gray-700 rounded-md p-3">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-2">
                                <Cpu className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="font-medium">Bot {botId.split("-")[1]}</div>
                                <div className="text-xs text-gray-400">Active</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-900 rounded-lg p-8 text-center h-full flex flex-col items-center justify-center">
                  <Server className="w-16 h-16 text-gray-600 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Server Selected</h3>
                  <p className="text-gray-500 mb-6">Select a server from the list or create a new one</p>
                  <button
                    onClick={() => setNewServerName("New Server")}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Server
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
