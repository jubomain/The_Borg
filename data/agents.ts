import type { Agent } from "@/types/phidata"

export const availableAgents: Agent[] = [
  {
    id: "web-search",
    name: "Web Search Agent",
    type: "search",
    description: "An Agent that can search the web.",
    icon: "🌐",
    instructions: [
      "You are a web search agent.",
      "Given a topic, search for relevant information on the internet.",
      "Provide detailed search results with relevant information.",
    ],
    tools: [
      {
        id: "duckduckgo",
        name: "DuckDuckGo Search",
        description: "Search the web using DuckDuckGo",
      },
    ],
  },
  {
    id: "recipe-creator",
    name: "Recipe Creator Agent",
    type: "creative",
    description: "An Agent that can recommend recipes.",
    icon: "🍳",
    instructions: [
      "You are a recipe creator agent.",
      "You recommend recipes based on ingredients, dietary restrictions, and preferences.",
      "Provide detailed instructions and ingredient lists.",
    ],
  },
  {
    id: "finance",
    name: "Finance Agent",
    type: "analysis",
    description: "An Agent that can analyze financial data.",
    icon: "📊",
    instructions: [
      "You are a finance agent.",
      "You analyze financial data and provide insights.",
      "You can help with budgeting, investment advice, and financial planning.",
    ],
  },
  {
    id: "books-recommendation",
    name: "Books Recommendation Agent",
    type: "recommendation",
    description: "An Agent that gives personalized book recommendations to read.",
    icon: "📚",
    instructions: [
      "You are a book recommendation agent.",
      "You suggest books based on user preferences, genres, and reading history.",
      "Provide detailed book descriptions and reasons for recommendations.",
    ],
  },
  {
    id: "python",
    name: "Python Agent",
    type: "coding",
    description: "An Agent that can write and run python code.",
    icon: "🐍",
    instructions: [
      "You are a Python coding agent.",
      "You can write and explain Python code.",
      "When asked to solve a problem, provide the code solution and explain how it works.",
    ],
  },
  {
    id: "image-generator",
    name: "Image Generator Agent",
    type: "creative",
    description: "An Agent that can generate images from text descriptions using Groq.",
    icon: "🖼️",
    instructions: [
      "You are an image generation agent.",
      "You create images based on text descriptions.",
      "Provide detailed descriptions for the best results.",
    ],
  },
  {
    id: "mcp-computer-control",
    name: "MCP Computer Control Agent",
    type: "mcp",
    description: "An Agent that can control and monitor computer systems using MCP.",
    icon: "💻",
    instructions: [
      "You are a computer control agent.",
      "You can perform system operations, manage files, run commands, and monitor system status.",
      "Always prioritize security and confirm before performing potentially destructive operations.",
    ],
    tools: [
      {
        id: "mcp-endpoint",
        name: "MCP Computer Control",
        description: "Control computer systems using MCP protocol",
      },
    ],
  },
]
