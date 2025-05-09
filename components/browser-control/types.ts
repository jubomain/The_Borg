export interface BrowserConfig {
  targetUrl: string
  selectors: {
    input: string
    output: string
    submit: string
  }
  headless: boolean
}

export interface Task {
  id: string
  prompt: string
  description: string
  status: "pending" | "processing" | "completed" | "failed"
  error?: string
  result?: TaskResult
}

export interface TaskResult {
  raw_response: string
  analysis: ResultAnalysis
  timestamp: string
}

export interface ResultAnalysis {
  sentiment: "positive" | "negative" | "neutral"
  key_points?: string[]
  next_actions?: string[]
}
