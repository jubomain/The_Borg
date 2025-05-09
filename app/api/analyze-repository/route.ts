import { NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(request: Request) {
  try {
    const { repoUrl, readme, model = "llama3-70b-8192" } = await request.json()

    if (!repoUrl) {
      return NextResponse.json({ error: "Repository URL is required" }, { status: 400 })
    }

    // Extract repo name from URL
    const urlPattern = /github\.com\/([^/]+)\/([^/]+)/
    const match = repoUrl.match(urlPattern)

    if (!match) {
      return NextResponse.json({ error: "Invalid GitHub repository URL" }, { status: 400 })
    }

    const [, owner, name] = match
    const repoName = `${owner}/${name}`

    // Create the prompt for Groq
    const prompt = `
I need you to analyze the GitHub repository ${repoName} (${repoUrl}) to determine if it can be integrated into the BORG framework.

${readme ? `Here is the repository README:\n\n${readme}\n\n` : ""}

The BORG framework is a self-evolving AI system that uses multiple agents to perform tasks and continuously improve itself. It has components for:
1. Agent management and orchestration
2. Workflow creation and execution
3. Memory and knowledge management
4. Self-evolution and code generation
5. API integrations with various services

Please analyze the repository and provide:
1. Whether it's compatible with the BORG framework (true/false)
2. A compatibility score from 0-100
3. Detailed reasoning for your assessment
4. Implementation steps if it's compatible
5. Potential improvements that could be made
6. Technical requirements for integration

Format your response as a JSON object with the following structure:
{
  "compatible": boolean,
  "score": number,
  "reasoning": string,
  "implementationSteps": string[],
  "potentialImprovements": string[],
  "technicalRequirements": string[]
}
`

    // Call Groq API
    try {
      const result = await generateText({
        model: groq(model),
        prompt,
        system:
          "You are an expert software engineer specializing in AI systems integration. Your task is to analyze GitHub repositories and determine if they can be integrated into the BORG framework.",
        temperature: 0.2,
        max_tokens: 2000,
      })

      // Parse the JSON response
      try {
        const jsonResponse = JSON.parse(result.text)
        return NextResponse.json(jsonResponse)
      } catch (parseError) {
        console.error("Error parsing Groq response as JSON:", parseError)

        // Attempt to extract JSON from the response
        const jsonMatch = result.text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          try {
            const extractedJson = JSON.parse(jsonMatch[0])
            return NextResponse.json(extractedJson)
          } catch (extractError) {
            console.error("Error extracting JSON from response:", extractError)
          }
        }

        // Fallback to a structured response
        return NextResponse.json({
          compatible:
            result.text.toLowerCase().includes("compatible") && !result.text.toLowerCase().includes("not compatible"),
          score: 50,
          reasoning: result.text,
          implementationSteps: [],
          potentialImprovements: [],
          technicalRequirements: ["Python 3.8+", "Access to GitHub API"],
        })
      }
    } catch (groqError) {
      console.error("Error calling Groq API:", groqError)
      throw groqError
    }
  } catch (error) {
    console.error("Error analyzing repository:", error)
    return NextResponse.json({ error: "Failed to analyze repository" }, { status: 500 })
  }
}
