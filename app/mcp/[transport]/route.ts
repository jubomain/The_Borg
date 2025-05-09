import { createMCPAdapter } from "@vercel/mcp-adapter"
import { Redis } from "ioredis"
import { computerControlTools } from "../tools/computer-control"

// Initialize Redis client for SSE transport if REDIS_URL is available
const redis = process.env.REDIS_URL ? new Redis(process.env.REDIS_URL) : undefined

// Define tools that the MCP server can use
const tools = [
  {
    name: "search",
    description: "Search for information on the web",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The search query",
        },
      },
      required: ["query"],
    },
    handler: async ({ query }) => {
      console.log(`Searching for: ${query}`)
      // Mock search results for demonstration
      return {
        results: [
          { title: "Result 1", snippet: "This is the first result for " + query },
          { title: "Result 2", snippet: "This is the second result for " + query },
        ],
      }
    },
  },
  {
    name: "create_workflow",
    description: "Create a new workflow in the Borg Framework",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "The name of the workflow",
        },
        description: {
          type: "string",
          description: "Description of the workflow",
        },
        nodes: {
          type: "array",
          description: "Array of nodes in the workflow",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              type: { type: "string" },
              position: { type: "object" },
              data: { type: "object" },
            },
          },
        },
        edges: {
          type: "array",
          description: "Array of edges connecting nodes",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              source: { type: "string" },
              target: { type: "string" },
            },
          },
        },
      },
      required: ["name"],
    },
    handler: async ({ name, description, nodes, edges }) => {
      console.log(`Creating workflow: ${name}`)
      // In a real implementation, this would create a workflow in the database
      return {
        id: `wf_${Date.now()}`,
        name,
        description,
        status: "created",
        created_at: new Date().toISOString(),
      }
    },
  },
  {
    name: "create_agent",
    description: "Create a new AI agent in the Borg Framework",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "The name of the agent",
        },
        description: {
          type: "string",
          description: "Description of the agent",
        },
        model: {
          type: "string",
          description: "The AI model to use for this agent",
        },
        system_prompt: {
          type: "string",
          description: "The system prompt for the agent",
        },
      },
      required: ["name", "model"],
    },
    handler: async ({ name, description, model, system_prompt }) => {
      console.log(`Creating agent: ${name} with model ${model}`)
      // In a real implementation, this would create an agent in the database
      return {
        id: `agent_${Date.now()}`,
        name,
        description,
        model,
        system_prompt,
        status: "created",
        created_at: new Date().toISOString(),
      }
    },
  },
  {
    name: "execute_workflow",
    description: "Execute a workflow in the Borg Framework",
    parameters: {
      type: "object",
      properties: {
        workflow_id: {
          type: "string",
          description: "The ID of the workflow to execute",
        },
        input_data: {
          type: "object",
          description: "Input data for the workflow execution",
        },
      },
      required: ["workflow_id"],
    },
    handler: async ({ workflow_id, input_data }) => {
      console.log(`Executing workflow: ${workflow_id}`)
      // In a real implementation, this would trigger a workflow execution
      return {
        execution_id: `exec_${Date.now()}`,
        workflow_id,
        status: "running",
        started_at: new Date().toISOString(),
      }
    },
  },

  // Add the computer control tools
  ...computerControlTools,
]

// Define resources that the MCP server can access
const resources = [
  {
    name: "borg_framework_docs",
    description: "Documentation for the Borg Framework",
    content: `
      # Borg Framework Documentation
      
      The Borg Framework is an AI orchestration platform that allows you to create, manage, and execute AI workflows.
      
      ## Key Components
      
      - **Agents**: AI agents that can perform specific tasks
      - **Workflows**: Visual workflows that orchestrate multiple agents
      - **Command Center**: Central dashboard for managing workflows
      - **Self-Evolution**: System for AI self-improvement
      
      ## API Reference
      
      The Borg Framework provides a comprehensive API for creating and managing agents and workflows.
    `,
  },
  {
    name: "computer_control_docs",
    description: "Documentation for computer control capabilities",
    content: `
      # Computer Control Capabilities
      
      The Borg Framework provides tools for controlling and monitoring computer systems.
      
      ## Available Tools
      
      - **system_info**: Get system information such as OS, CPU, memory, etc.
      - **list_directory**: List files and directories in a specified path
      - **read_file**: Read the contents of a file
      - **write_file**: Write content to a file
      - **run_command**: Run a shell command (with safety restrictions)
      - **process_list**: Get a list of running processes
      - **network_scan**: Scan network for open ports on a specific host
      
      ## Security Considerations
      
      All computer control tools have built-in security measures to prevent dangerous operations.
      File operations are restricted to a safe directory, and command execution is filtered for potentially harmful commands.
    `,
  },
]

// Create the MCP adapter
export const { GET, POST } = createMCPAdapter({
  tools,
  resources,
  redis,
  maxDuration: 800, // Adjust for Vercel Pro or Enterprise accounts
  defaultPrompt: `You are an AI assistant for the Borg Framework, an AI orchestration platform. 
  Help users create and manage AI agents and workflows. 
  You can also help with computer control tasks using the available tools.
  Use the available tools to search for information, create workflows and agents, execute workflows, and control computer systems.
  Always provide helpful and accurate information about the Borg Framework.`,
})
