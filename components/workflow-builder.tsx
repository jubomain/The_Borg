"use client"

import type React from "react"

import { useState } from "react"
import { Send, Loader2, ArrowRight } from "lucide-react"
import type { Message, Workflow } from "@/types/phidata"

interface WorkflowBuilderProps {
  workflows: Workflow[]
  selectedWorkflow: Workflow | null
  onSelectWorkflow: (workflow: Workflow) => void
  messages: Message[]
  isLoading: boolean
  onSendMessage: (content: string) => void
  endpointConnected: boolean
}

export default function WorkflowBuilder({
  workflows,
  selectedWorkflow,
  onSelectWorkflow,
  messages,
  isLoading,
  onSendMessage,
  endpointConnected,
}: WorkflowBuilderProps) {
  const [input, setInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || !endpointConnected) return

    onSendMessage(input)
    setInput("")
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {selectedWorkflow ? (
        <>
          {/* Workflow visualization */}
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold mb-2">{selectedWorkflow.name}</h2>
            <p className="text-gray-400 mb-4">{selectedWorkflow.description}</p>
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              {selectedWorkflow.steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="bg-gray-800 rounded-md p-3 min-w-[150px]">
                    <div className="text-xs text-gray-400">Step {index + 1}</div>
                    <div className="font-medium">{step.name}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {selectedWorkflow.agents.find((a) => a.id === step.agentId)?.name}
                    </div>
                  </div>
                  {index < selectedWorkflow.steps.length - 1 && <ArrowRight className="mx-2 text-gray-500" />}
                </div>
              ))}
            </div>
          </div>

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
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <p className="text-gray-400">
                  This workflow will execute the following steps:
                  <ol className="list-decimal list-inside mt-2 text-left">
                    {selectedWorkflow.steps.map((step) => (
                      <li key={step.id} className="mb-1">
                        {step.name}: {step.description}
                      </li>
                    ))}
                  </ol>
                </p>
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
                placeholder="Enter your workflow input..."
                className="flex-1 bg-gray-800 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-blue-600 rounded-md p-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </form>
          </div>
        </>
      ) : (
        <div className="h-full flex flex-col items-center justify-center p-4">
          <h2 className="text-xl font-semibold mb-4">Select a Workflow</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
            {workflows.map((workflow) => (
              <div
                key={workflow.id}
                className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors"
                onClick={() => onSelectWorkflow(workflow)}
              >
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">{workflow.icon}</span>
                  <h3 className="text-lg font-medium">{workflow.name}</h3>
                </div>
                <p className="text-gray-400 text-sm">{workflow.description}</p>
                <div className="mt-3 text-xs text-gray-500">
                  {workflow.agents.length} agents • {workflow.steps.length} steps
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
