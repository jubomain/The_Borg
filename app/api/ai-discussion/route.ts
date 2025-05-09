import { NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { topic, message, history } = body

    if (!topic && !message) {
      return NextResponse.json({ error: "Topic or message is required" }, { status: 400 })
    }

    // Prepare the prompt for Groq
    let groqPrompt = ""
    let serperPrompt = ""

    if (topic) {
      // Initial discussion based on topic
      groqPrompt = `Analyze the topic "${topic}" from an AI implementation perspective for the BORG framework. Consider how this could be implemented, what challenges might arise, and what benefits it would provide.`

      serperPrompt = `Search for information about "${topic}" in the context of AI development and implementation. Focus on recent developments, best practices, and existing implementations.`
    } else if (message) {
      // Continuing the discussion based on message and history
      groqPrompt = `Continue the discussion about AI implementation. Respond to: "${message}"`

      serperPrompt = `Search for information related to: "${message}" in the context of AI development and implementation.`

      if (history && history.length > 0) {
        groqPrompt = `Previous conversation:\n${history.map((m: any) => `${m.role}: ${m.content}`).join("\n")}\n\nContinue the discussion and respond to: "${message}"`
      }
    }

    // Call Groq API
    const groqResponse = await generateText({
      model: groq("llama3-70b-8192"),
      prompt: groqPrompt,
      system:
        "You are an AI expert specializing in implementation strategies for AI systems. You are part of a three-way discussion with a user and a search-powered AI. Provide insightful analysis and implementation suggestions.",
      temperature: 0.7,
    })

    // Call Serper API
    let serperResponse = ""
    try {
      const serperApiKey = process.env.SERPER_API_KEY

      if (!serperApiKey) {
        throw new Error("Serper API key not configured")
      }

      const searchResponse = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
          "X-API-KEY": serperApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: topic || message,
          num: 5,
        }),
      })

      if (!searchResponse.ok) {
        throw new Error(`Serper API error: ${searchResponse.status}`)
      }

      const searchData = await searchResponse.json()

      // Extract search results
      const organicResults = searchData.organic || []
      const searchResults = organicResults.map((result: any) => ({
        title: result.title,
        link: result.link,
        snippet: result.snippet,
      }))

      // Generate response based on search results
      const searchResultsText = searchResults
        .map(
          (result: any, index: number) => `[${index + 1}] ${result.title}\n${result.snippet}\nSource: ${result.link}`,
        )
        .join("\n\n")

      const serperPromptWithResults = `
Based on the following search results about "${topic || message}", provide insights and recommendations for implementation in an AI system:

${searchResultsText}

Focus on practical implementation details, recent developments, and best practices. You are part of a three-way discussion with a user and an AI implementation expert.
`

      // Call Groq API for Serper response
      const serperGroqResponse = await generateText({
        model: groq("llama3-8b-8192"),
        prompt: serperPromptWithResults,
        system:
          "You are a search-powered AI assistant that provides information based on web search results. You are part of a three-way discussion with a user and an AI implementation expert. Focus on factual information and cite your sources.",
        temperature: 0.3,
      })

      serperResponse = serperGroqResponse.text
    } catch (serperError) {
      console.error("Error with Serper API:", serperError)
      serperResponse =
        "I apologize, but I couldn't retrieve search results at the moment. Let's continue the discussion based on my existing knowledge."
    }

    return NextResponse.json({
      groqResponse: groqResponse.text,
      serperResponse,
    })
  } catch (error) {
    console.error("Error in AI discussion:", error)
    return NextResponse.json({ error: "Failed to process AI discussion" }, { status: 500 })
  }
}
