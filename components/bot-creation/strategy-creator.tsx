"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase-client"
import { Cpu, Plus, Trash2, Save, RefreshCw, Check } from "lucide-react"

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

export default function StrategyCreator() {
  const [strategies, setStrategies] = useState<BotStrategy[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newStrategy, setNewStrategy] = useState<Partial<BotStrategy>>({
    name: "",
    description: "",
    capabilities: [],
    integrations: [],
    specialization: "",
    learning_rate: 0.5,
    memory_capacity: 50,
  })
  const [newCapability, setNewCapability] = useState("")
  const [newIntegration, setNewIntegration] = useState("")
  const [generatedStrategies, setGeneratedStrategies] = useState<BotStrategy[]>([])

  const handleAddCapability = () => {
    if (!newCapability.trim()) return
    setNewStrategy({
      ...newStrategy,
      capabilities: [...(newStrategy.capabilities || []), newCapability.trim()],
    })
    setNewCapability("")
  }

  const handleRemoveCapability = (index: number) => {
    const updatedCapabilities = [...(newStrategy.capabilities || [])]
    updatedCapabilities.splice(index, 1)
    setNewStrategy({
      ...newStrategy,
      capabilities: updatedCapabilities,
    })
  }

  const handleAddIntegration = () => {
    if (!newIntegration.trim()) return
    setNewStrategy({
      ...newStrategy,
      integrations: [...(newStrategy.integrations || []), newIntegration.trim()],
    })
    setNewIntegration("")
  }

  const handleRemoveIntegration = (index: number) => {
    const updatedIntegrations = [...(newStrategy.integrations || [])]
    updatedIntegrations.splice(index, 1)
    setNewStrategy({
      ...newStrategy,
      integrations: updatedIntegrations,
    })
  }

  const handleCreateStrategy = async () => {
    if (!newStrategy.name || !newStrategy.description || !newStrategy.specialization) return

    setIsCreating(true)
    try {
      const strategy: BotStrategy = {
        id: `strategy-${Date.now()}`,
        name: newStrategy.name,
        description: newStrategy.description,
        capabilities: newStrategy.capabilities || [],
        integrations: newStrategy.integrations || [],
        specialization: newStrategy.specialization,
        learning_rate: newStrategy.learning_rate || 0.5,
        memory_capacity: newStrategy.memory_capacity || 50,
      }

      // Save strategy to Supabase
      const { error } = await supabase.from("bot_strategies").insert([strategy])

      if (error) throw error

      setStrategies([...strategies, strategy])
      setNewStrategy({
        name: "",
        description: "",
        capabilities: [],
        integrations: [],
        specialization: "",
        learning_rate: 0.5,
        memory_capacity: 50,
      })
    } catch (error) {
      console.error("Error creating strategy:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const generateStrategies = async () => {
    setIsLoading(true)
    try {
      // In a real implementation, this would call an AI model to generate strategies
      // For this demo, we'll simulate the generation
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const generatedStrategies: BotStrategy[] = [
        {
          id: `strategy-${Date.now()}-1`,
          name: "Data Processing Specialist",
          description: "A bot specialized in processing and analyzing large datasets",
          capabilities: [
            "Data cleaning",
            "Statistical analysis",
            "Pattern recognition",
            "Anomaly detection",
            "Data visualization",
          ],
          integrations: ["Database", "API", "Data warehouse", "Visualization tools"],
          specialization: "Data Analysis",
          learning_rate: 0.7,
          memory_capacity: 80,
        },
        {
          id: `strategy-${Date.now()}-2`,
          name: "Content Creation Assistant",
          description: "A bot that helps create and curate content for various platforms",
          capabilities: [
            "Text generation",
            "Content summarization",
            "SEO optimization",
            "Grammar checking",
            "Sentiment analysis",
          ],
          integrations: ["CMS", "Social media", "SEO tools", "Content platforms"],
          specialization: "Content Creation",
          learning_rate: 0.8,
          memory_capacity: 60,
        },
        {
          id: `strategy-${Date.now()}-3`,
          name: "Customer Support Agent",
          description: "A bot designed to handle customer inquiries and support tickets",
          capabilities: [
            "Natural language understanding",
            "Intent recognition",
            "FAQ answering",
            "Ticket routing",
            "Sentiment analysis",
          ],
          integrations: ["CRM", "Ticketing system", "Chat platforms", "Knowledge base"],
          specialization: "Customer Support",
          learning_rate: 0.6,
          memory_capacity: 70,
        },
      ]

      setGeneratedStrategies(generatedStrategies)
    } catch (error) {
      console.error("Error generating strategies:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const adoptStrategy = async (strategy: BotStrategy) => {
    try {
      // Save strategy to Supabase
      const { error } = await supabase.from("bot_strategies").insert([strategy])

      if (error) throw error

      setStrategies([...strategies, strategy])
      setGeneratedStrategies(generatedStrategies.filter((s) => s.id !== strategy.id))
    } catch (error) {
      console.error("Error adopting strategy:", error)
    }
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium flex items-center">
          <Cpu className="w-5 h-5 mr-2" />
          Bot Strategy Creator
        </h2>
        <button
          onClick={generateStrategies}
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md flex items-center text-sm disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-1" />
              Generate Strategies
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-4">Create New Strategy</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Strategy Name</label>
              <input
                type="text"
                value={newStrategy.name || ""}
                onChange={(e) => setNewStrategy({ ...newStrategy, name: e.target.value })}
                className="w-full bg-gray-800 rounded-md px-3 py-2 text-sm"
                placeholder="E.g., Data Analysis Bot"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
              <textarea
                value={newStrategy.description || ""}
                onChange={(e) => setNewStrategy({ ...newStrategy, description: e.target.value })}
                className="w-full bg-gray-800 rounded-md px-3 py-2 text-sm"
                rows={3}
                placeholder="Describe the purpose and functionality of this bot strategy"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Specialization</label>
              <select
                value={newStrategy.specialization || ""}
                onChange={(e) => setNewStrategy({ ...newStrategy, specialization: e.target.value })}
                className="w-full bg-gray-800 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Select a specialization</option>
                <option value="Data Analysis">Data Analysis</option>
                <option value="Content Creation">Content Creation</option>
                <option value="Customer Support">Customer Support</option>
                <option value="Research">Research</option>
                <option value="Monitoring">Monitoring</option>
                <option value="Development">Development</option>
                <option value="Testing">Testing</option>
                <option value="Security">Security</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Capabilities</label>
              <div className="flex mb-2">
                <input
                  type="text"
                  value={newCapability}
                  onChange={(e) => setNewCapability(e.target.value)}
                  className="flex-1 bg-gray-800 rounded-l-md px-3 py-2 text-sm"
                  placeholder="Add a capability"
                />
                <button
                  onClick={handleAddCapability}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-r-md"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {newStrategy.capabilities?.map((capability, index) => (
                  <div key={index} className="flex items-center bg-gray-800 rounded-md p-2">
                    <span className="flex-1 text-sm">{capability}</span>
                    <button onClick={() => handleRemoveCapability(index)} className="text-red-500 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Integrations</label>
              <div className="flex mb-2">
                <input
                  type="text"
                  value={newIntegration}
                  onChange={(e) => setNewIntegration(e.target.value)}
                  className="flex-1 bg-gray-800 rounded-l-md px-3 py-2 text-sm"
                  placeholder="Add an integration"
                />
                <button
                  onClick={handleAddIntegration}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-r-md"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {newStrategy.integrations?.map((integration, index) => (
                  <div key={index} className="flex items-center bg-gray-800 rounded-md p-2">
                    <span className="flex-1 text-sm">{integration}</span>
                    <button onClick={() => handleRemoveIntegration(index)} className="text-red-500 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Learning Rate: {newStrategy.learning_rate || 0.5}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={newStrategy.learning_rate || 0.5}
                  onChange={(e) => setNewStrategy({ ...newStrategy, learning_rate: Number.parseFloat(e.target.value) })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Memory Capacity: {newStrategy.memory_capacity || 50}
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={newStrategy.memory_capacity || 50}
                  onChange={(e) => setNewStrategy({ ...newStrategy, memory_capacity: Number.parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleCreateStrategy}
                disabled={isCreating || !newStrategy.name || !newStrategy.description || !newStrategy.specialization}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center disabled:opacity-50"
              >
                {isCreating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Strategy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-4">Generated Strategies</h3>
          {generatedStrategies.length === 0 ? (
            <div className="bg-gray-800 rounded-md p-6 text-center">
              <p className="text-gray-500">
                No generated strategies yet. Click "Generate Strategies" to create AI-suggested bot strategies.
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {generatedStrategies.map((strategy) => (
                <div key={strategy.id} className="bg-gray-800 rounded-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{strategy.name}</h4>
                    <button
                      onClick={() => adoptStrategy(strategy)}
                      className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded-md text-xs flex items-center"
                    >
                      <Check className="w-3 h-3 mr-1" />
                      Adopt
                    </button>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{strategy.description}</p>
                  <div className="text-xs text-blue-400 mb-1">Specialization: {strategy.specialization}</div>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div>
                      <div className="text-xs font-medium mb-1">Capabilities</div>
                      <ul className="text-xs text-gray-400 list-disc pl-4 space-y-1">
                        {strategy.capabilities.map((capability, index) => (
                          <li key={index}>{capability}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-xs font-medium mb-1">Integrations</div>
                      <ul className="text-xs text-gray-400 list-disc pl-4 space-y-1">
                        {strategy.integrations.map((integration, index) => (
                          <li key={index}>{integration}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
