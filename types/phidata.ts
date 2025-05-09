export interface Agent {
  id: string
  name: string
  type: string
  description: string
  icon: string
  parameters?: Record<string, any>
  tools?: Tool[]
  instructions?: string[]
}

export interface Tool {
  id: string
  name: string
  description: string
  parameters?: Record<string, any>
}

export interface Workflow {
  id: string
  name: string
  description: string
  icon: string
  agents: Agent[]
  steps: WorkflowStep[]
}

export interface WorkflowStep {
  id: string
  name: string
  agentId: string
  description: string
  input?: string
  output?: string
  next?: string[]
}

export interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: string
  agent?: Agent
}
