import type { Workflow } from "@/types/phidata"
import { availableAgents } from "./agents"

export const availableWorkflows: Workflow[] = [
  {
    id: "blog-post-generator",
    name: "Blog Post Generator",
    description: "A workflow that searches the web, reads articles, and generates a blog post.",
    icon: "📝",
    agents: [availableAgents.find((a) => a.id === "web-search")!, availableAgents.find((a) => a.id === "python")!],
    steps: [
      {
        id: "search",
        name: "Search for Articles",
        agentId: "web-search",
        description: "Search the web for articles on the topic",
        next: ["write"],
      },
      {
        id: "write",
        name: "Write Blog Post",
        agentId: "python",
        description: "Write a blog post based on the search results",
      },
    ],
  },
  {
    id: "recipe-with-image",
    name: "Recipe with Image",
    description: "A workflow that creates a recipe and generates an image for it.",
    icon: "🍽️",
    agents: [
      availableAgents.find((a) => a.id === "recipe-creator")!,
      availableAgents.find((a) => a.id === "image-generator")!,
    ],
    steps: [
      {
        id: "create-recipe",
        name: "Create Recipe",
        agentId: "recipe-creator",
        description: "Create a recipe based on user preferences",
        next: ["generate-image"],
      },
      {
        id: "generate-image",
        name: "Generate Image",
        agentId: "image-generator",
        description: "Generate an image of the recipe",
      },
    ],
  },
]
