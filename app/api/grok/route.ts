import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { prompt, systemPrompt, temperature = 0.7, maxTokens = 4000 } = await req.json()

    // Get the Grok API key from environment variables
    const apiKey = process.env.GROQ_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "Grok API key not configured" }, { status: 500 })
    }

    // Call the Grok API
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: systemPrompt || "You are a helpful AI assistant.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature,
        max_tokens: maxTokens,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json({ error: "Grok API error", details: errorData }, { status: response.status })
    }

    const data = await response.json()

    return NextResponse.json({
      text: data.choices[0].message.content,
      usage: data.usage,
    })
  } catch (error) {
    console.error("Error in Grok API route:", error)
    return NextResponse.json({ error: "Failed to process your request" }, { status: 500 })
  }
}
