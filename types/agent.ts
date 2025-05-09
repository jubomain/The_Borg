export interface Agent {
  id: string
  name: string
  type: string
  description: string
  icon: string
}

export interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: string
  agent?: Agent
}
