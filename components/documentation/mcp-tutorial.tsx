"use client"
import { Copy, LucideCheckCheck, Terminal } from "lucide-react"
import { useState } from "react"

export function MCPTutorial() {
  const [copied, setCopied] = useState<string | null>(null)

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="prose prose-invert max-w-none">
      <h1 className="text-3xl font-bold mb-6">MCP Server Integration Guide</h1>

      <div className="bg-gray-900 p-6 rounded-lg my-6 border border-gray-800">
        <h3 className="text-xl font-semibold text-sky-300 mb-3">Machine Communication Protocol (MCP)</h3>
        <p className="text-gray-300">
          MCP enables seamless, standardized communication between machines and AI systems. With the Borg Framework's
          MCP integration, you can create, deploy, and manage AI-powered MCP servers that can control computer systems,
          execute workflows, and interface with other applications.
        </p>
      </div>

      <h2>What is MCP?</h2>
      <p>
        Machine Communication Protocol (MCP) is Vercel's standardized protocol for AI agents to communicate with
        machines. It allows AI models to:
      </p>
      <ul>
        <li>Execute tools and functions in a standardized way</li>
        <li>Maintain access to resources and contextual information</li>
        <li>Persist conversation state across multiple interactions</li>
        <li>Control computer systems through a secure, well-defined interface</li>
      </ul>

      <h2>Creating an MCP Server</h2>
      <p>
        The Borg Framework provides a streamlined way to create and deploy MCP servers. Each server can be equipped with
        custom tools and resources that define what the AI can do and what information it can access.
      </p>

      <div className="bg-gray-800 p-4 rounded-md my-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-md font-semibold m-0 text-sky-300">Basic MCP Server</h4>
          <button
            onClick={() => handleCopy(basicMCPServerCode, "basic-mcp")}
            className="bg-gray-700 hover:bg-gray-600 rounded p-1"
          >
            {copied === "basic-mcp" ? (
              <LucideCheckCheck className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
        <pre className="text-sm overflow-auto p-2 bg-gray-900 rounded">{basicMCPServerCode}</pre>
      </div>

      <h2>Computer Control Tools</h2>
      <p>
        One of the most powerful features of MCP is the ability to control computer systems through natural language
        instructions. The Borg Framework provides a set of pre-built computer control tools:
      </p>

      <ul>
        <li>
          <strong>system_info</strong>: Get information about the operating system, CPU, memory, and more
        </li>
        <li>
          <strong>list_directory</strong>: Browse files and directories
        </li>
        <li>
          <strong>read_file</strong>: Read the contents of files
        </li>
        <li>
          <strong>write_file</strong>: Create or modify files
        </li>
        <li>
          <strong>run_command</strong>: Execute shell commands with safety restrictions
        </li>
        <li>
          <strong>process_list</strong>: View running processes
        </li>
      </ul>

      <div className="bg-gray-800 p-4 rounded-md my-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-md font-semibold m-0 text-sky-300">Computer Control Tool Example</h4>
          <button
            onClick={() => handleCopy(computerControlToolExample, "cc-tool")}
            className="bg-gray-700 hover:bg-gray-600 rounded p-1"
          >
            {copied === "cc-tool" ? (
              <LucideCheckCheck className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
        <pre className="text-sm overflow-auto p-2 bg-gray-900 rounded">{computerControlToolExample}</pre>
      </div>

      <h2>Integrating MCP with Borg Agents</h2>
      <p>
        The real power of MCP comes from integrating it with the Borg Framework's agent ecosystem. You can create agents
        that leverage MCP servers to:
      </p>

      <ul>
        <li>Automate system administration tasks</li>
        <li>Control development environments</li>
        <li>Perform data analysis on local files</li>
        <li>Execute workflows that interact with the local system</li>
        <li>Create self-evolving systems that can modify their own code</li>
      </ul>

      <h3>Agent-MCP Integration</h3>
      <p>
        To integrate an MCP server with a Borg agent, you need to configure the agent to use the MCP endpoint and
        provide the necessary authentication:
      </p>

      <div className="bg-gray-800 p-4 rounded-md my-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-md font-semibold m-0 text-sky-300">Agent-MCP Integration</h4>
          <button
            onClick={() => handleCopy(agentMCPIntegrationCode, "agent-mcp")}
            className="bg-gray-700 hover:bg-gray-600 rounded p-1"
          >
            {copied === "agent-mcp" ? (
              <LucideCheckCheck className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
        <pre className="text-sm overflow-auto p-2 bg-gray-900 rounded">{agentMCPIntegrationCode}</pre>
      </div>

      <h2>Building Self-Evolving Systems</h2>
      <p>
        One of the most powerful applications of MCP in the Borg Framework is creating self-evolving systems. By giving
        an agent the ability to modify its own code through MCP tools, you can create systems that continuously improve
        themselves.
      </p>

      <div className="bg-gray-900 p-4 rounded-md my-4 border border-sky-900">
        <h4 className="text-lg font-semibold text-sky-300 mb-2">Self-Evolution Example</h4>
        <p className="text-sm">
          A Borg agent with MCP computer control capabilities can analyze its own performance, identify areas for
          improvement, and modify its code to enhance its capabilities.
        </p>
        <ol className="list-decimal pl-6 text-sm mt-2 space-y-1">
          <li>Agent identifies a pattern of user requests that it could handle more efficiently</li>
          <li>
            Using the <code>read_file</code> tool, it reads its own implementation code
          </li>
          <li>It analyzes the code and designs an improved algorithm or function</li>
          <li>
            Using the <code>write_file</code> tool, it updates its code with the improvement
          </li>
          <li>The system restarts the agent to apply the changes</li>
          <li>The agent now performs better on that class of requests</li>
        </ol>
      </div>

      <h2>Security Considerations</h2>
      <p>
        When working with MCP servers that can control computer systems, security is paramount. The Borg Framework
        implements several security measures:
      </p>

      <ul>
        <li>
          <strong>Sandboxed Execution</strong>: Tools run in a controlled environment
        </li>
        <li>
          <strong>Access Restrictions</strong>: File operations are limited to specific directories
        </li>
        <li>
          <strong>Command Filtering</strong>: Dangerous shell commands are blocked
        </li>
        <li>
          <strong>Rate Limiting</strong>: Prevents excessive tool usage
        </li>
        <li>
          <strong>Authentication</strong>: MCP servers require proper authentication
        </li>
      </ul>

      <h2>Getting Started with MCP</h2>
      <p>To start using MCP in your Borg Framework:</p>

      <ol>
        <li>Navigate to the Agent Studio and create a new agent with MCP capabilities</li>
        <li>Configure the tools you want your agent to have access to</li>
        <li>Deploy your MCP server using the built-in deployment tools</li>
        <li>Test your agent's abilities using the Computer Control interface</li>
        <li>Integrate your MCP-powered agent into your workflows</li>
      </ol>

      <div className="bg-sky-900/30 p-4 rounded-md my-6 border border-sky-800">
        <h4 className="flex items-center text-lg font-semibold text-sky-300 mb-2">
          <Terminal className="mr-2 h-5 w-5" />
          MCP Server Quick Setup
        </h4>
        <p className="text-sm mb-2">You can quickly set up a basic MCP server with the following command:</p>
        <div className="bg-gray-900 p-2 rounded flex justify-between items-center">
          <code className="text-sm">npx create-mcp-server my-borg-agent</code>
          <button
            onClick={() => handleCopy("npx create-mcp-server my-borg-agent", "setup-cmd")}
            className="bg-gray-700 hover:bg-gray-600 rounded p-1"
          >
            {copied === "setup-cmd" ? (
              <LucideCheckCheck className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <h2>Related Resources</h2>
      <ul>
        <li>
          <a href="https://vercel.com/docs/ai/mcp" className="text-sky-400 hover:text-sky-300">
            Vercel MCP Documentation
          </a>
        </li>
        <li>
          <a href="/agent-studio" className="text-sky-400 hover:text-sky-300">
            Borg Agent Studio
          </a>
        </li>
        <li>
          <a href="/computer-control" className="text-sky-400 hover:text-sky-300">
            Computer Control Interface
          </a>
        </li>
      </ul>
    </div>
  )
}

// Example code snippets for the tutorial
const basicMCPServerCode = `import { createMCPAdapter } from "@vercel/mcp-adapter";

export const { GET, POST } = createMCPAdapter({
  tools: [
    {
      name: "get_weather",
      description: "Get weather information for a location",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The city and state, e.g. San Francisco, CA",
          },
        },
        required: ["location"],
      },
      handler: async ({ location }) => {
        // Implementation details
        return { temperature: 72, conditions: "sunny" };
      },
    },
  ],
  resources: [
    {
      name: "company_info",
      description: "Information about our company",
      content: "Founded in 2023, we specialize in AI solutions...",
    },
  ],
});`

const computerControlToolExample = `{
  name: "system_info",
  description: "Get information about the system",
  parameters: {
    type: "object",
    properties: {},
    required: [],
  },
  handler: async () => {
    const os = await import('os');
    return {
      platform: os.platform(),
      release: os.release(),
      type: os.type(),
      arch: os.arch(),
      cpus: os.cpus().length,
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      uptime: os.uptime(),
    };
  },
}`

const agentMCPIntegrationCode = `// In your agent configuration
{
  id: "system-control-agent",
  name: "System Control Agent",
  type: "mcp",
  description: "An agent that can control computer systems",
  icon: "💻",
  instructions: [
    "You are a system control agent.",
    "You can perform various system operations like file management, process control, and system monitoring.",
    "Always verify before performing potentially destructive operations.",
  ],
  tools: [
    {
      id: "mcp-endpoint",
      name: "MCP System Control",
      description: "Control computer systems using MCP",
      endpoint: "/mcp/sse", // MCP server endpoint
      authentication: {
        type: "bearer",
        token: "{API_TOKEN}",
      },
    },
  ],
}`
