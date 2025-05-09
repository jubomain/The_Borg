"use client"

import { useState } from "react"
import { Send, Loader2, Plus, Save, Trash } from "lucide-react"
import type { Agent, Tool } from "@/types/phidata"
// Import the MCPServerCreator component at the top of the file
import MCPServerCreator from "./agent-studio/mcp-server-creator"

export default function AgentStudio() {
  const [agentName, setAgentName] = useState("")
  const [agentDescription, setAgentDescription] = useState("")
  const [instructions, setInstructions] = useState<string[]>([])
  const [newInstruction, setNewInstruction] = useState("")
  const [tools, setTools] = useState<Tool[]>([])
  const [newToolName, setNewToolName] = useState("")
  const [newToolDescription, setNewToolDescription] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedAgent, setGeneratedAgent] = useState<Agent | null>(null)
  const [plainLanguagePrompt, setPlainLanguagePrompt] = useState("")
  const [isProcessingPrompt, setIsProcessingPrompt] = useState(false)

  // Add a state for the currently selected tab
  const [activeTab, setActiveTab] = useState("agent-creation")

  const handleAddInstruction = () => {
    if (newInstruction.trim()) {
      setInstructions([...instructions, newInstruction.trim()])
      setNewInstruction("")
    }
  }

  const handleRemoveInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index))
  }

  const handleAddTool = () => {
    if (newToolName.trim() && newToolDescription.trim()) {
      setTools([
        ...tools,
        {
          id: `tool-${Date.now()}`,
          name: newToolName.trim(),
          description: newToolDescription.trim(),
        },
      ])
      setNewToolName("")
      setNewToolDescription("")
    }
  }

  const handleRemoveTool = (id: string) => {
    setTools(tools.filter((tool) => tool.id !== id))
  }

  const handleGenerateAgent = () => {
    if (!agentName.trim() || !agentDescription.trim()) return

    setIsGenerating(true)

    // Simulate agent generation
    setTimeout(() => {
      const newAgent: Agent = {
        id: `agent-${Date.now()}`,
        name: agentName,
        type: "custom",
        description: agentDescription,
        icon: "🤖",
        instructions,
        tools,
      }

      setGeneratedAgent(newAgent)
      setIsGenerating(false)
    }, 1500)
  }

  const handleProcessPlainLanguage = async () => {
    if (!plainLanguagePrompt.trim()) return

    setIsProcessingPrompt(true)

    try {
      // Call the API to process the plain language prompt
      const response = await fetch("/api/generate-agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: plainLanguagePrompt }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate agent")
      }

      const data = await response.json()

      // Update the form with the generated agent details
      setAgentName(data.name)
      setAgentDescription(data.description)
      setInstructions(data.instructions || [])
      setTools(data.tools || [])
    } catch (error) {
      console.error("Error generating agent:", error)
    } finally {
      setIsProcessingPrompt(false)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="border-b border-gray-800 mb-4">
        <div className="flex">
          <button
            className={`px-4 py-2 ${activeTab === "agent-creation" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-400"}`}
            onClick={() => setActiveTab("agent-creation")}
          >
            Agent Creation
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "mcp-server" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-400"}`}
            onClick={() => setActiveTab("mcp-server")}
          >
            MCP Server Creator
          </button>
        </div>
      </div>
      {activeTab === "agent-creation" ? (
        <>
          <h1 className="text-2xl font-bold mb-6">Agent Studio</h1>

          {/* Plain language agent creation */}
          <div className="mb-8 bg-gray-800 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3">Create Agent with Plain Language</h2>
            <p className="text-gray-400 mb-4">
              Describe the agent you want to create in plain language, and we'll generate it for you.
            </p>
            <div className="flex mb-4">
              <textarea
                value={plainLanguagePrompt}
                onChange={(e) => setPlainLanguagePrompt(e.target.value)}
                placeholder="E.g., Create a customer support agent that can answer questions about our products, handle returns, and escalate issues to human support when necessary."
                className="flex-1 bg-gray-700 rounded-l-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
              <button
                onClick={handleProcessPlainLanguage}
                disabled={isProcessingPrompt || !plainLanguagePrompt.trim()}
                className="bg-blue-600 rounded-r-md px-4 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessingPrompt ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Manual agent creation form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Agent Details</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                  <input
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="E.g., Customer Support Agent"
                    className="w-full bg-gray-800 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                  <textarea
                    value={agentDescription}
                    onChange={(e) => setAgentDescription(e.target.value)}
                    placeholder="E.g., An agent that helps customers with product inquiries and support issues."
                    className="w-full bg-gray-800 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Instructions</label>
                  <div className="space-y-2">
                    {instructions.map((instruction, index) => (
                      <div key={index} className="flex items-center">
                        <div className="flex-1 bg-gray-700 rounded-l-md px-3 py-2 text-sm">{instruction}</div>
                        <button
                          onClick={() => handleRemoveInstruction(index)}
                          className="bg-red-600 rounded-r-md p-2 text-white"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <div className="flex">
                      <input
                        type="text"
                        value={newInstruction}
                        onChange={(e) => setNewInstruction(e.target.value)}
                        placeholder="Add an instruction"
                        className="flex-1 bg-gray-800 rounded-l-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={handleAddInstruction}
                        disabled={!newInstruction.trim()}
                        className="bg-blue-600 rounded-r-md p-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Tools</h2>

              <div className="space-y-4">
                {tools.map((tool) => (
                  <div key={tool.id} className="bg-gray-800 rounded-md p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{tool.name}</h3>
                        <p className="text-sm text-gray-400 mt-1">{tool.description}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveTool(tool.id)}
                        className="text-red-500 p-1 hover:bg-gray-700 rounded"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="bg-gray-800 rounded-md p-3">
                  <h3 className="font-medium mb-2">Add Tool</h3>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={newToolName}
                      onChange={(e) => setNewToolName(e.target.value)}
                      placeholder="Tool Name"
                      className="w-full bg-gray-700 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      value={newToolDescription}
                      onChange={(e) => setNewToolDescription(e.target.value)}
                      placeholder="Tool Description"
                      className="w-full bg-gray-700 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                    />
                    <button
                      onClick={handleAddTool}
                      disabled={!newToolName.trim() || !newToolDescription.trim()}
                      className="w-full bg-blue-600 rounded-md py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add Tool
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleGenerateAgent}
              disabled={isGenerating || !agentName.trim() || !agentDescription.trim()}
              className="bg-green-600 rounded-md px-4 py-2 text-white flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Save Agent
                </>
              )}
            </button>
          </div>

          {generatedAgent && (
            <div className="mt-8 bg-gray-800 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3">Generated Agent</h2>
              <pre className="bg-gray-900 p-4 rounded-md overflow-x-auto">
                <code>{JSON.stringify(generatedAgent, null, 2)}</code>
              </pre>
              <div className="mt-4 text-center">
                <p className="text-green-400 mb-2">✅ Agent created successfully!</p>
                <p className="text-gray-400">You can now use this agent in your workflows.</p>
              </div>
            </div>
          )}
        </>
      ) : (
        <MCPServerCreator />
      )}
    </div>
  )
}
