"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase-client"
import { Users, Plus, Save, RefreshCw, Check, X, Settings } from "lucide-react"

interface BotStrategy {
  id: string
  name: string
  description: string
  capabilities: string[]
  integrations: string[]
  specialization: string
  learning_rate: number
  memory_capacity: number
}

interface Bot {
  id: string
  name: string
  strategy_id: string
  status: "active" | "inactive" | "learning" | "error"
  created_at: string
  last_active: string
  performance_score: number
}

interface Team {
  id: string
  name: string
  description: string
  bots: string[] // Bot IDs
  created_at: string
  status: "active" | "inactive" | "forming"
}

export default function TeamCreator() {
  const [strategies, setStrategies] = useState<BotStrategy[]>([])
  const [bots, setBots] = useState<Bot[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreatingTeam, setIsCreatingTeam] = useState(false)
  const [isCreatingBot, setIsCreatingBot] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [newTeam, setNewTeam] = useState<Partial<Team>>({
    name: "",
    description: "",
    bots: [],
  })
  const [newBot, setNewBot] = useState<Partial<Bot>>({
    name: "",
    strategy_id: "",
  })
  const [selectedBots, setSelectedBots] = useState<string[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      // Fetch strategies
      const { data: strategiesData, error: strategiesError } = await supabase.from("bot_strategies").select("*")

      if (strategiesError) throw strategiesError

      // Fetch bots
      const { data: botsData, error: botsError } = await supabase.from("bots").select("*")

      if (botsError) throw botsError

      // Fetch teams
      const { data: teamsData, error: teamsError } = await supabase.from("bot_teams").select("*")

      if (teamsError) throw teamsError

      setStrategies(strategiesData || [])
      setBots(botsData || [])
      setTeams(teamsData || [])
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateBot = async () => {
    if (!newBot.name || !newBot.strategy_id) return

    setIsCreatingBot(true)
    try {
      const strategy = strategies.find((s) => s.id === newBot.strategy_id)
      if (!strategy) throw new Error("Strategy not found")

      const bot: Bot = {
        id: `bot-${Date.now()}`,
        name: newBot.name,
        strategy_id: newBot.strategy_id,
        status: "learning",
        created_at: new Date().toISOString(),
        last_active: new Date().toISOString(),
        performance_score: Math.floor(Math.random() * 30) + 70, // 70-100
      }

      // Save bot to Supabase
      const { error } = await supabase.from("bots").insert([bot])

      if (error) throw error

      setBots([...bots, bot])
      setNewBot({
        name: "",
        strategy_id: "",
      })
    } catch (error) {
      console.error("Error creating bot:", error)
    } finally {
      setIsCreatingBot(false)
    }
  }

  const handleCreateTeam = async () => {
    if (!newTeam.name || !newTeam.description || selectedBots.length === 0) return

    setIsCreatingTeam(true)
    try {
      const team: Team = {
        id: `team-${Date.now()}`,
        name: newTeam.name,
        description: newTeam.description,
        bots: selectedBots,
        created_at: new Date().toISOString(),
        status: "forming",
      }

      // Save team to Supabase
      const { error } = await supabase.from("bot_teams").insert([team])

      if (error) throw error

      setTeams([...teams, team])
      setNewTeam({
        name: "",
        description: "",
        bots: [],
      })
      setSelectedBots([])
    } catch (error) {
      console.error("Error creating team:", error)
    } finally {
      setIsCreatingTeam(false)
    }
  }

  const handleSelectTeam = (team: Team) => {
    setSelectedTeam(team)
    setSelectedBots(team.bots)
  }

  const handleToggleBot = (botId: string) => {
    if (selectedBots.includes(botId)) {
      setSelectedBots(selectedBots.filter((id) => id !== botId))
    } else {
      setSelectedBots([...selectedBots, botId])
    }
  }

  const handleActivateTeam = async (teamId: string) => {
    try {
      // Update team status to active
      await supabase.from("bot_teams").update({ status: "active" }).eq("id", teamId)

      // Update teams state
      setTeams(teams.map((team) => (team.id === teamId ? { ...team, status: "active" } : team)))
    } catch (error) {
      console.error("Error activating team:", error)
    }
  }

  const handleDeactivateTeam = async (teamId: string) => {
    try {
      // Update team status to inactive
      await supabase.from("bot_teams").update({ status: "inactive" }).eq("id", teamId)

      // Update teams state
      setTeams(teams.map((team) => (team.id === teamId ? { ...team, status: "inactive" } : team)))
    } catch (error) {
      console.error("Error deactivating team:", error)
    }
  }

  const getTeamBots = (team: Team) => {
    return bots.filter((bot) => team.bots.includes(bot.id))
  }

  const getStrategyName = (strategyId: string) => {
    const strategy = strategies.find((s) => s.id === strategyId)
    return strategy ? strategy.name : "Unknown Strategy"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-900 text-green-300"
      case "inactive":
        return "bg-gray-700 text-gray-300"
      case "learning":
        return "bg-blue-900 text-blue-300"
      case "forming":
        return "bg-yellow-900 text-yellow-300"
      case "error":
        return "bg-red-900 text-red-300"
      default:
        return "bg-gray-700 text-gray-300"
    }
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Bot Team Creator
        </h2>
        <button
          onClick={fetchData}
          disabled={isLoading}
          className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md flex items-center text-sm"
        >
          <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <h3 className="font-medium mb-4">Create New Bot</h3>
          <div className="bg-gray-800 rounded-md p-4 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Bot Name</label>
                <input
                  type="text"
                  value={newBot.name || ""}
                  onChange={(e) => setNewBot({ ...newBot, name: e.target.value })}
                  className="w-full bg-gray-700 rounded-md px-3 py-2 text-sm"
                  placeholder="E.g., DataBot-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Strategy</label>
                <select
                  value={newBot.strategy_id || ""}
                  onChange={(e) => setNewBot({ ...newBot, strategy_id: e.target.value })}
                  className="w-full bg-gray-700 rounded-md px-3 py-2 text-sm"
                >
                  <option value="">Select a strategy</option>
                  {strategies.map((strategy) => (
                    <option key={strategy.id} value={strategy.id}>
                      {strategy.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleCreateBot}
                disabled={isCreatingBot || !newBot.name || !newBot.strategy_id}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md flex items-center justify-center disabled:opacity-50"
              >
                {isCreatingBot ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Bot
                  </>
                )}
              </button>
            </div>
          </div>

          <h3 className="font-medium mb-4">Available Bots</h3>
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {bots.length === 0 ? (
              <div className="bg-gray-800 rounded-md p-4 text-center">
                <p className="text-gray-500">No bots available. Create a bot first.</p>
              </div>
            ) : (
              bots.map((bot) => (
                <div
                  key={bot.id}
                  className={`bg-gray-800 rounded-md p-3 cursor-pointer hover:bg-gray-700 transition-colors ${
                    selectedBots.includes(bot.id) ? "border-2 border-green-500" : ""
                  }`}
                  onClick={() => handleToggleBot(bot.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{bot.name}</div>
                      <div className="text-xs text-gray-400 mt-1">Strategy: {getStrategyName(bot.strategy_id)}</div>
                    </div>
                    <div className={`px-2 py-1 text-xs rounded-full ${getStatusColor(bot.status)}`}>{bot.status}</div>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <div className="text-xs text-gray-400">Performance: {bot.performance_score}%</div>
                    {selectedBots.includes(bot.id) ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Plus className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <h3 className="font-medium mb-4">Create New Team</h3>
          <div className="bg-gray-800 rounded-md p-4 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Team Name</label>
                <input
                  type="text"
                  value={newTeam.name || ""}
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                  className="w-full bg-gray-700 rounded-md px-3 py-2 text-sm"
                  placeholder="E.g., Data Analysis Team"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <textarea
                  value={newTeam.description || ""}
                  onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                  className="w-full bg-gray-700 rounded-md px-3 py-2 text-sm"
                  rows={3}
                  placeholder="Describe the purpose and functionality of this team"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Selected Bots ({selectedBots.length})
                </label>
                <div className="bg-gray-700 rounded-md p-3 min-h-[100px] max-h-[150px] overflow-y-auto">
                  {selectedBots.length === 0 ? (
                    <p className="text-gray-500 text-sm">No bots selected. Click on bots to add them to the team.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedBots.map((botId) => {
                        const bot = bots.find((b) => b.id === botId)
                        return bot ? (
                          <div key={bot.id} className="bg-gray-600 rounded-md px-2 py-1 text-xs flex items-center">
                            <span>{bot.name}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleToggleBot(bot.id)
                              }}
                              className="ml-2 text-gray-400 hover:text-white"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : null
                      })}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleCreateTeam}
                disabled={isCreatingTeam || !newTeam.name || !newTeam.description || selectedBots.length === 0}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md flex items-center justify-center disabled:opacity-50"
              >
                {isCreatingTeam ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Team
                  </>
                )}
              </button>
            </div>
          </div>

          <h3 className="font-medium mb-4">Active Teams</h3>
          <div className="space-y-4">
            {teams.length === 0 ? (
              <div className="bg-gray-800 rounded-md p-6 text-center">
                <p className="text-gray-500">No teams available. Create a team first.</p>
              </div>
            ) : (
              teams.map((team) => (
                <div
                  key={team.id}
                  className={`bg-gray-800 rounded-md p-4 ${
                    selectedTeam?.id === team.id ? "border-2 border-green-500" : ""
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{team.name}</h4>
                      <p className="text-sm text-gray-400 mt-1">{team.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`px-2 py-1 text-xs rounded-full ${getStatusColor(team.status)}`}>
                        {team.status}
                      </div>
                      <button
                        onClick={() => handleSelectTeam(team)}
                        className="p-1 bg-gray-700 rounded-md hover:bg-gray-600"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h5 className="text-sm font-medium mb-2">Team Bots ({team.bots.length})</h5>
                    <div className="flex flex-wrap gap-2">
                      {getTeamBots(team).map((bot) => (
                        <div key={bot.id} className="bg-gray-700 rounded-md px-2 py-1 text-xs flex items-center">
                          <span>{bot.name}</span>
                          <div
                            className={`ml-2 w-2 h-2 rounded-full ${
                              bot.status === "active"
                                ? "bg-green-500"
                                : bot.status === "learning"
                                  ? "bg-blue-500"
                                  : bot.status === "error"
                                    ? "bg-red-500"
                                    : "bg-gray-500"
                            }`}
                          ></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    {team.status === "active" ? (
                      <button
                        onClick={() => handleDeactivateTeam(team.id)}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        onClick={() => handleActivateTeam(team.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Activate
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
