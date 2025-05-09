"use client"

import { useState } from "react"
import { Users, Plus, Trash2, Edit, Save, X, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Agent {
  id: string
  name: string
  type: string
  description: string
  icon: string
}

interface Team {
  id: string
  name: string
  description: string
  agents: Agent[]
}

export default function TeamManagement() {
  const [teams, setTeams] = useState<Team[]>([
    {
      id: "team-1",
      name: "Research Team",
      description: "A team of agents specialized in research and data analysis",
      agents: [
        {
          id: "agent-1",
          name: "Web Researcher",
          type: "web-search",
          description: "Searches the web for information",
          icon: "🔍",
        },
        {
          id: "agent-2",
          name: "Data Analyst",
          type: "data-analysis",
          description: "Analyzes data and generates insights",
          icon: "📊",
        },
      ],
    },
  ])

  const [availableAgents, setAvailableAgents] = useState<Agent[]>([
    {
      id: "agent-3",
      name: "Content Writer",
      type: "content-creation",
      description: "Creates written content based on research",
      icon: "✍️",
    },
    {
      id: "agent-4",
      name: "Code Generator",
      type: "code-generation",
      description: "Generates code based on requirements",
      icon: "💻",
    },
    {
      id: "agent-5",
      name: "Image Creator",
      type: "image-generation",
      description: "Creates images based on descriptions",
      icon: "🎨",
    },
  ])

  const [editingTeam, setEditingTeam] = useState<Team | null>(null)
  const [newTeamName, setNewTeamName] = useState<string>("")
  const [newTeamDescription, setNewTeamDescription] = useState<string>("")

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) return

    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name: newTeamName,
      description: newTeamDescription,
      agents: [],
    }

    setTeams([...teams, newTeam])
    setNewTeamName("")
    setNewTeamDescription("")
  }

  const handleDeleteTeam = (teamId: string) => {
    setTeams(teams.filter((team) => team.id !== teamId))
  }

  const handleEditTeam = (team: Team) => {
    setEditingTeam({ ...team })
  }

  const handleSaveTeam = () => {
    if (!editingTeam) return

    setTeams(teams.map((team) => (team.id === editingTeam.id ? editingTeam : team)))
    setEditingTeam(null)
  }

  const handleCancelEdit = () => {
    setEditingTeam(null)
  }

  const handleAddAgentToTeam = (teamId: string, agent: Agent) => {
    setTeams(
      teams.map((team) => {
        if (team.id === teamId) {
          return {
            ...team,
            agents: [...team.agents, agent],
          }
        }
        return team
      }),
    )

    setAvailableAgents(availableAgents.filter((a) => a.id !== agent.id))
  }

  const handleRemoveAgentFromTeam = (teamId: string, agentId: string) => {
    const team = teams.find((t) => t.id === teamId)
    if (!team) return

    const agent = team.agents.find((a) => a.id === agentId)
    if (!agent) return

    setTeams(
      teams.map((t) => {
        if (t.id === teamId) {
          return {
            ...t,
            agents: t.agents.filter((a) => a.id !== agentId),
          }
        }
        return t
      }),
    )

    setAvailableAgents([...availableAgents, agent])
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-800 flex items-center">
        <Link href="/dashboard" className="mr-4">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold">Team Management</h1>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Your Teams
            </h2>

            {teams.length === 0 ? (
              <div className="bg-gray-900 rounded-md p-6 text-center">
                <p className="text-gray-400">You haven't created any teams yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {teams.map((team) => (
                  <div key={team.id} className="bg-gray-900 rounded-md p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{team.name}</h3>
                        <p className="text-sm text-gray-400">{team.description}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditTeam(team)}
                          className="p-1 bg-gray-800 rounded-md hover:bg-gray-700"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTeam(team.id)}
                          className="p-1 bg-gray-800 rounded-md hover:bg-gray-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Team Members</h4>
                      {team.agents.length === 0 ? (
                        <p className="text-sm text-gray-500">No agents in this team yet.</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {team.agents.map((agent) => (
                            <div key={agent.id} className="flex items-center bg-gray-800 rounded-md p-2">
                              <div className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-md mr-2">
                                {agent.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">{agent.name}</div>
                                <div className="text-xs text-gray-400 truncate">{agent.type}</div>
                              </div>
                              <button
                                onClick={() => handleRemoveAgentFromTeam(team.id, agent.id)}
                                className="p-1 text-gray-400 hover:text-white"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {availableAgents.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Add Agent</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {availableAgents.map((agent) => (
                            <button
                              key={agent.id}
                              onClick={() => handleAddAgentToTeam(team.id, agent)}
                              className="flex items-center bg-gray-800 rounded-md p-2 hover:bg-gray-700 text-left"
                            >
                              <div className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-md mr-2">
                                {agent.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">{agent.name}</div>
                                <div className="text-xs text-gray-400 truncate">{agent.type}</div>
                              </div>
                              <Plus className="w-4 h-4" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-medium mb-4">Create New Team</h2>
            <div className="bg-gray-900 rounded-md p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Team Name</label>
                  <input
                    type="text"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="E.g., Content Creation Team"
                    className="w-full bg-gray-800 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                  <textarea
                    value={newTeamDescription}
                    onChange={(e) => setNewTeamDescription(e.target.value)}
                    placeholder="Describe the team's purpose and capabilities..."
                    className="w-full bg-gray-800 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={3}
                  />
                </div>

                <button
                  onClick={handleCreateTeam}
                  disabled={!newTeamName.trim()}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md flex items-center justify-center disabled:opacity-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Team
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {editingTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg w-full max-w-md">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-medium">Edit Team</h2>
              <button onClick={handleCancelEdit} className="p-1 rounded-md hover:bg-gray-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Team Name</label>
                <input
                  type="text"
                  value={editingTeam.name}
                  onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value })}
                  className="w-full bg-gray-800 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <textarea
                  value={editingTeam.description}
                  onChange={(e) => setEditingTeam({ ...editingTeam, description: e.target.value })}
                  className="w-full bg-gray-800 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                />
              </div>
            </div>

            <div className="p-4 border-t border-gray-800 flex justify-end">
              <button
                onClick={handleCancelEdit}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTeam}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
