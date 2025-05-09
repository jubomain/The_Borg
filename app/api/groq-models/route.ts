import { type NextRequest, NextResponse } from "next/server"

interface GroqModel {
  id: string
  name: string
  description: string
  contextLength: number
  trainingData: string
}

export async function GET(request: NextRequest) {
  try {
    // In a real implementation, this would fetch models from the Groq API
    // For now, we'll return mock data
    const models: GroqModel[] = [
      {
        id: "llama3-8b-8192",
        name: "Llama-3 8B",
        description: "Meta's Llama 3 8B model with 8,192 token context window",
        contextLength: 8192,
        trainingData: "Up to early 2023",
      },
      {
        id: "llama3-70b-8192",
        name: "Llama-3 70B",
        description: "Meta's Llama 3 70B model with 8,192 token context window",
        contextLength: 8192,
        trainingData: "Up to early 2023",
      },
      {
        id: "mixtral-8x7b-32768",
        name: "Mixtral 8x7B",
        description: "Mixtral's 8x7B model with 32,768 token context window",
        contextLength: 32768,
        trainingData: "Up to early 2023",
      },
      {
        id: "gemma-7b-it",
        name: "Gemma 7B",
        description: "Google's Gemma 7B instruction-tuned model",
        contextLength: 8192,
        trainingData: "Up to early 2023",
      },
    ]

    return NextResponse.json(models)
  } catch (error) {
    console.error("Failed to fetch Groq models:", error)
    return NextResponse.json({ error: "Failed to fetch Groq models" }, { status: 500 })
  }
}
