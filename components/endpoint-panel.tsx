"use client"

import { useState } from "react"
import { RefreshCw } from "lucide-react"
import type { Agent, Workflow } from "@/types/phidata"

interface EndpointPanelProps {
  agents: Agent[]
  workflows: Workflow[]
  selectedAgent: Agent | null
  selectedWorkflow: Workflow | null
  selectedTab: string
  onSelectAgent: (agent: Agent) => void
  onSelectWorkflow: (workflow: Workflow) => void
}

export default function EndpointPanel({
  agents,
  workflows,
  selectedAgent,
  selectedWorkflow,
  selectedTab,
  onSelectAgent,
  onSelectWorkflow,
}: EndpointPanelProps) {
  const [activeTab, setActiveTab] = useState<"sessions" | "config">("sessions")

  return (
    <div className="w-[300px] border-l border-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
        <h3 className="font-medium">ENDPOINT</h3>
        <button className="p-1 hover:bg-gray-800 rounded">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Endpoint selector */}
      <div className="p-4">
        {selectedTab === "workflows" ? (
          <div className="relative">
            <select
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedWorkflow?.id || ""}
              onChange={(e) => {
                const workflow = workflows.find((w) => w.id === e.target.value)
                if (workflow) onSelectWorkflow(workflow)
              }}
            >
              <option value="" disabled>
                Select a workflow
              </option>
              {workflows.map((workflow) => (
                <option key={workflow.id} value={workflow.id}>
                  {workflow.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        ) : (
          <div className="relative">
            <select
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedAgent?.id || ""}
              onChange={(e) => {
                const agent = agents.find((a) => a.id === e.target.value)
                if (agent) onSelectAgent(agent)
              }}
            >
              <option value="" disabled>
                Select an agent
              </option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        )}

        {selectedTab === "workflows" && !selectedWorkflow && (
          <div className="mt-4 p-3 bg-red-900/30 border border-red-800 rounded-md">
            <p className="text-red-400 text-sm flex items-center">
              <span className="mr-2">⚠️</span>
              No workflow selected
            </p>
            <p className="text-red-400 text-sm mt-1">Please select a workflow</p>
          </div>
        )}

        {selectedTab !== "workflows" && !selectedAgent && (
          <div className="mt-4 p-3 bg-red-900/30 border border-red-800 rounded-md">
            <p className="text-red-400 text-sm flex items-center">
              <span className="mr-2">⚠️</span>
              No agent selected
            </p>
            <p className="text-red-400 text-sm mt-1">Please select an agent</p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-800">
        <div className="flex border-b border-gray-800">
          <button
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === "sessions" ? "border-b-2 border-white" : "text-gray-400"
            }`}
            onClick={() => setActiveTab("sessions")}
          >
            SESSIONS
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === "config" ? "border-b-2 border-white" : "text-gray-400"
            }`}
            onClick={() => setActiveTab("config")}
          >
            CONFIG
          </button>
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "sessions" ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <h3 className="text-lg font-medium mb-2">No history</h3>
            <p className="text-gray-400 text-sm">
              {selectedTab === "workflows"
                ? "Select a workflow to see the history."
                : "Select an agent to see the history."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {selectedTab === "workflows" && selectedWorkflow && (
              <>
                <div>
                  <h4 className="text-sm font-medium mb-1">Workflow Type</h4>
                  <p className="text-sm text-gray-400">Multi-agent workflow</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Description</h4>
                  <p className="text-sm text-gray-400">{selectedWorkflow.description}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Agents</h4>
                  <ul className="text-sm text-gray-400 list-disc pl-5">
                    {selectedWorkflow.agents.map((agent) => (
                      <li key={agent.id}>{agent.name}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Steps</h4>
                  <ol className="text-sm text-gray-400 list-decimal pl-5">
                    {selectedWorkflow.steps.map((step) => (
                      <li key={step.id}>{step.name}</li>
                    ))}
                  </ol>
                </div>
              </>
            )}

            {selectedTab !== "workflows" && selectedAgent && (
              <>
                <div>
                  <h4 className="text-sm font-medium mb-1">Agent Type</h4>
                  <p className="text-sm text-gray-400">{selectedAgent.type}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Description</h4>
                  <p className="text-sm text-gray-400">{selectedAgent.description}</p>
                </div>
                {selectedAgent.instructions && selectedAgent.instructions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Instructions</h4>
                    <ul className="text-sm text-gray-400 list-disc pl-5">
                      {selectedAgent.instructions.map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {selectedAgent.tools && selectedAgent.tools.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Tools</h4>
                    <ul className="text-sm text-gray-400 list-disc pl-5">
                      {selectedAgent.tools.map((tool) => (
                        <li key={tool.id}>{tool.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-medium mb-1">Model</h4>
                  <p className="text-sm text-gray-400">Groq - llama3-70b-8192</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
