"use client"

import type React from "react"

import { useState } from "react"
import {
  Book,
  Code,
  Search,
  ArrowLeft,
  Zap,
  Database,
  BotIcon as Robot,
  Network,
  ShieldCheck,
  Workflow,
  Terminal,
} from "lucide-react"
import Link from "next/link"
import { AnimatedTechSvg } from "./animated-tech-svg"
import { MCPTutorial } from "./mcp-tutorial"

interface DocSection {
  id: string
  title: string
  icon: React.ReactNode
  content: React.ReactNode
}

export function EnhancedDocs() {
  const [activeSection, setActiveSection] = useState<string>("quickstart")
  const [searchQuery, setSearchQuery] = useState<string>("")

  const sections: DocSection[] = [
    {
      id: "quickstart",
      title: "Quickstart Guide",
      icon: <Zap className="w-5 h-5" />,
      content: <QuickstartGuide />,
    },
    {
      id: "architecture",
      title: "Architecture",
      icon: <Network className="w-5 h-5" />,
      content: <ArchitectureGuide />,
    },
    {
      id: "api-reference",
      title: "API Reference",
      icon: <Code className="w-5 h-5" />,
      content: <ApiReference />,
    },
    {
      id: "mcp-integration",
      title: "MCP Integration",
      icon: <Terminal className="w-5 h-5" />,
      content: <MCPTutorial />,
    },
    {
      id: "agent-creation",
      title: "Agent Creation",
      icon: <Robot className="w-5 h-5" />,
      content: <AgentCreationGuide />,
    },
    {
      id: "workflows",
      title: "Workflow Design",
      icon: <Workflow className="w-5 h-5" />,
      content: <WorkflowGuide />,
    },
    {
      id: "databases",
      title: "Database Setup",
      icon: <Database className="w-5 h-5" />,
      content: <DatabaseGuide />,
    },
    {
      id: "security",
      title: "Security & Compliance",
      icon: <ShieldCheck className="w-5 h-5" />,
      content: <SecurityGuide />,
    },
  ]

  const filteredSections = sections.filter((section) => section.title.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="flex h-full">
      <div className="w-64 bg-[#1E1E1E] border-r border-gray-800 flex flex-col h-full">
        <div className="p-4 border-b border-gray-800 flex items-center">
          <Book className="w-5 h-5 mr-2" />
          <span className="font-bold">Documentation</span>
        </div>

        <div className="p-2">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search docs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 rounded-md pl-8 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          </div>

          <nav>
            <ul className="space-y-1">
              {filteredSections.map((section) => (
                <li key={section.id}>
                  <button
                    className={`flex items-center w-full px-2 py-2 text-sm rounded-md transition-colors text-left ${
                      activeSection === section.id
                        ? "bg-gray-800 text-sky-300"
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                    }`}
                    onClick={() => setActiveSection(section.id)}
                  >
                    <span className="mr-2">{section.icon}</span>
                    <span>{section.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <Link href="/dashboard" className="flex items-center text-sm text-gray-400 hover:text-sky-300">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Link>
        </div>

        <div className="flex justify-center mb-6">
          <div className="w-64 h-64">
            <AnimatedTechSvg />
          </div>
        </div>

        {sections.find((section) => section.id === activeSection)?.content}
      </div>
    </div>
  )
}

function QuickstartGuide() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Quickstart Guide</h1>

      <div className="prose prose-invert max-w-none">
        <h2>Welcome to The Borg Framework</h2>
        <p>
          The Borg is a self-evolving agent framework that allows you to create, manage, and deploy intelligent AI
          agents that can learn and improve over time. This guide will help you get up and running quickly.
        </p>

        <div className="bg-gray-900 p-6 rounded-lg my-6 border border-gray-800">
          <h3 className="text-xl font-semibold text-sky-300 mb-3">Assimilate Intelligence. Orchestrate Excellence.</h3>
          <p className="text-gray-300">
            The Borg Framework represents a paradigm shift in AI orchestration technology. By combining advanced
            agent-based architecture with self-evolving capabilities, Borg enables organizations to deploy, manage, and
            optimize intelligent systems at unprecedented scale and efficiency.
          </p>
        </div>

        <h3>Getting Started in 5 Minutes</h3>
        <ol>
          <li>
            <strong>Configure your API keys</strong>
            <p>Go to Settings and add your Grok API key and Supabase credentials to enable all features.</p>
            <div className="bg-gray-800 p-3 rounded-md my-2 overflow-auto">
              <code>
                # Example API Key Configuration
                <br />
                GROK_API_KEY=your-api-key-here
                <br />
                SUPABASE_URL=https://your-project.supabase.co
                <br />
                SUPABASE_ANON_KEY=your-anon-key-here
              </code>
            </div>
          </li>
          <li>
            <strong>Create your first agent</strong>
            <p>
              Navigate to the Agent Studio and create a new agent using the intuitive interface or plain language
              description.
            </p>
            <div className="my-2 border border-gray-700 rounded-md p-4">
              <p className="text-sm italic text-gray-400">Example agent definition:</p>
              <pre className="bg-gray-800 p-3 rounded-md mt-2 overflow-auto">
                {`{
  "name": "DataAnalyst",
  "description": "Performs data analysis on structured datasets",
  "capabilities": ["data-processing", "chart-generation", "insight-extraction"],
  "learningEnabled": true
}`}
              </pre>
            </div>
          </li>
          <li>
            <strong>Test your agent</strong>
            <p>Use the Playground to interact with your agent and test its capabilities.</p>
          </li>
          <li>
            <strong>Build a team</strong>
            <p>Combine multiple agents into a team to solve complex problems through collaboration.</p>
          </li>
          <li>
            <strong>Enable self-evolution</strong>
            <p>
              Turn on the self-evolution feature to allow your agents to learn and improve based on interactions and
              feedback.
            </p>
          </li>
        </ol>

        <h3>Key Concepts</h3>
        <ul>
          <li>
            <strong>Agents</strong>: Individual AI entities with specific capabilities and knowledge.
          </li>
          <li>
            <strong>Teams</strong>: Groups of agents working together to accomplish tasks.
          </li>
          <li>
            <strong>Workflows</strong>: Sequences of actions that agents can perform automatically.
          </li>
          <li>
            <strong>Self-Evolution</strong>: The ability of agents to improve their capabilities over time.
          </li>
          <li>
            <strong>RAG (Retrieval-Augmented Generation)</strong>: Enhances agent responses with external knowledge.
          </li>
          <li>
            <strong>Autopilot</strong>: Allows agents to operate autonomously while you observe.
          </li>
        </ul>

        <h3>Core Features & Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
            <h4 className="text-sky-300 font-medium">Intelligent Agent Ecosystem</h4>
            <p className="text-sm text-gray-300 mb-2">
              Modular agent architecture with specialized capabilities and self-evolving agents that improve through
              experience.
            </p>
            <p className="text-xs text-sky-200">
              Reduce development time by 78% compared to traditional AI implementation.
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
            <h4 className="text-sky-300 font-medium">Visual Workflow Orchestration</h4>
            <p className="text-sm text-gray-300 mb-2">
              Intuitive node-based workflow builder with real-time execution monitoring and debugging.
            </p>
            <p className="text-xs text-sky-200">Design complex AI workflows without coding.</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
            <h4 className="text-sky-300 font-medium">Enterprise-Grade Security</h4>
            <p className="text-sm text-gray-300 mb-2">
              End-to-end encryption for data in transit and at rest with comprehensive audit logging.
            </p>
            <p className="text-xs text-sky-200">Protect sensitive data throughout the AI lifecycle.</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
            <h4 className="text-sky-300 font-medium">Seamless Integration</h4>
            <p className="text-sm text-gray-300 mb-2">
              Open API architecture with pre-built connectors for popular enterprise systems.
            </p>
            <p className="text-xs text-sky-200">Connect to existing enterprise systems without disruption.</p>
          </div>
        </div>

        <h3>Production Deployment Checklist</h3>
        <div className="bg-gray-800 p-4 rounded-md my-4">
          <ul className="list-none space-y-2">
            <li className="flex items-start">
              <span className="bg-sky-700 text-white rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0">
                ✓
              </span>
              <span>Configure environment variables in production environment</span>
            </li>
            <li className="flex items-start">
              <span className="bg-sky-700 text-white rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0">
                ✓
              </span>
              <span>Set up database backup and recovery procedures</span>
            </li>
            <li className="flex items-start">
              <span className="bg-sky-700 text-white rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0">
                ✓
              </span>
              <span>Implement rate limiting and API usage monitoring</span>
            </li>
            <li className="flex items-start">
              <span className="bg-sky-700 text-white rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0">
                ✓
              </span>
              <span>Set up monitoring and alerting for system health</span>
            </li>
            <li className="flex items-start">
              <span className="bg-sky-700 text-white rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0">
                ✓
              </span>
              <span>Configure logging and error tracking</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function ArchitectureGuide() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Architecture Overview</h1>

      <div className="prose prose-invert max-w-none">
        <p>
          The Borg Framework is built on a modular architecture designed for scalability, extensibility, and
          performance. This guide explains the core components and how they interact.
        </p>

        <div className="bg-gray-900 p-6 rounded-lg my-6 border border-gray-800">
          <h3 className="text-xl font-semibold text-sky-300 mb-3">Component System Implementation</h3>
          <p className="text-gray-300">
            The Borg Framework's component system provides unparalleled flexibility and extensibility, allowing
            organizations to customize and extend the platform to meet their specific needs.
          </p>
        </div>

        <h2>System Architecture</h2>
        <div className="bg-gray-900 p-6 rounded-lg my-4 border border-gray-700">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-3 bg-gray-800 p-4 rounded-md text-center">Frontend Layer</div>
            <div className="col-span-3 bg-gray-800 p-4 rounded-md text-center">API Gateway</div>
            <div className="bg-gray-800 p-4 rounded-md text-center">Agent Service</div>
            <div className="bg-gray-800 p-4 rounded-md text-center">Workflow Engine</div>
            <div className="bg-gray-800 p-4 rounded-md text-center">Memory Service</div>
            <div className="col-span-3 bg-gray-800 p-4 rounded-md text-center">Data Storage Layer</div>
          </div>
        </div>

        <h2>Key Components</h2>

        <h3>1. Agent Service</h3>
        <p>
          The Agent Service manages the creation, configuration, and execution of AI agents. Each agent is a specialized
          AI entity with specific capabilities and knowledge domains.
        </p>
        <div className="bg-gray-800 p-4 rounded-md my-3">
          <h4 className="text-sky-300 font-medium mb-2">Node Library</h4>
          <p className="text-sm">
            Our extensive node library includes specialized components for data processing, API integration, natural
            language processing, decision logic, and machine learning model deployment.
          </p>
        </div>

        <h3>2. Workflow Engine</h3>
        <p>
          The Workflow Engine orchestrates the execution of workflows, which are sequences of operations performed by
          one or more agents. Workflows can be triggered by events, scheduled, or manually initiated.
        </p>
        <div className="bg-gray-800 p-4 rounded-md my-3">
          <h4 className="text-sky-300 font-medium mb-2">Custom Component Development</h4>
          <p className="text-sm">
            Extend the platform with custom components tailored to your specific needs using our Component SDK with
            comprehensive documentation and visual component builder for non-technical users.
          </p>
        </div>

        <h3>3. Memory Service</h3>
        <p>
          The Memory Service provides persistent storage for agent knowledge, experiences, and learned patterns. It
          implements Retrieval-Augmented Generation (RAG) to enhance agent capabilities with external knowledge.
        </p>
        <div className="bg-gray-800 p-4 rounded-md my-3">
          <h4 className="text-sky-300 font-medium mb-2">Advanced Memory & Knowledge Management</h4>
          <p className="text-sm">
            Retrieval-Augmented Generation (RAG) for enhanced responses, persistent memory across agent interactions,
            knowledge graph visualization, and automated knowledge extraction.
          </p>
        </div>

        <h3>4. Evolution Engine</h3>
        <p>
          The Evolution Engine enables agents to learn and improve over time based on interactions, feedback, and
          performance metrics. It implements various reinforcement learning techniques.
        </p>

        <h2>Integration Points</h2>
        <p>The Borg Framework provides several integration points for extending its functionality:</p>

        <ul>
          <li>
            <strong>Custom Node Types</strong>: Extend the workflow engine with specialized nodes
          </li>
          <li>
            <strong>API Hooks</strong>: Integrate with external systems via webhooks and API endpoints
          </li>
          <li>
            <strong>Custom Data Sources</strong>: Connect to external data sources for agent knowledge
          </li>
          <li>
            <strong>Model Providers</strong>: Integrate with various AI model providers
          </li>
        </ul>

        <h2>Component Marketplace</h2>
        <p>Access a growing ecosystem of pre-built components:</p>
        <ul>
          <li>Industry-specific solution accelerators</li>
          <li>Connector packs for popular enterprise systems</li>
          <li>Advanced analytics and visualization components</li>
          <li>Specialized AI model integrations</li>
        </ul>
      </div>
    </div>
  )
}

function ApiReference() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">API Reference</h1>

      <div className="prose prose-invert max-w-none">
        <p>
          The Borg Framework provides a comprehensive API for programmatic interaction with all system components. This
          reference documents the endpoints, request formats, and response structures.
        </p>

        <h2>Authentication</h2>
        <p>All API requests require authentication using an API key. Include the API key in the request header:</p>

        <div className="bg-gray-800 p-3 rounded-md my-2 overflow-auto">
          <code>Authorization: Bearer your-api-key</code>
        </div>

        <h2>Agent API</h2>

        <h3>Create Agent</h3>
        <div className="bg-gray-800 p-3 rounded-md my-2 overflow-auto">
          <code>POST /api/agent</code>
        </div>

        <h4>Request Body</h4>
        <div className="bg-gray-800 p-3 rounded-md my-2 overflow-auto">
          <pre>{`{
  "name": "string",
  "description": "string",
  "capabilities": ["string"],
  "learningEnabled": boolean,
  "parameters": {
    // Agent-specific parameters
  }
}`}</pre>
        </div>

        <h4>Response</h4>
        <div className="bg-gray-800 p-3 rounded-md my-2 overflow-auto">
          <pre>{`{
  "id": "string",
  "name": "string",
  "description": "string",
  "capabilities": ["string"],
  "learningEnabled": boolean,
  "parameters": {
    // Agent-specific parameters
  },
  "createdAt": "string",
  "updatedAt": "string"
}`}</pre>
        </div>

        <h3>List Agents</h3>
        <div className="bg-gray-800 p-3 rounded-md my-2 overflow-auto">
          <code>GET /api/agent</code>
        </div>

        <h4>Query Parameters</h4>
        <ul>
          <li>
            <code>limit</code>: Maximum number of agents to return (default: 10)
          </li>
          <li>
            <code>offset</code>: Number of agents to skip (default: 0)
          </li>
          <li>
            <code>search</code>: Search term to filter agents by name or description
          </li>
        </ul>

        <h4>Response</h4>
        <div className="bg-gray-800 p-3 rounded-md my-2 overflow-auto">
          <pre>{`{
  "items": [
    // Agent objects
  ],
  "total": number,
  "limit": number,
  "offset": number
}`}</pre>
        </div>

        <h2>Workflow API</h2>

        <h3>Create Workflow</h3>
        <div className="bg-gray-800 p-3 rounded-md my-2 overflow-auto">
          <code>POST /api/workflow</code>
        </div>

        <h4>Request Body</h4>
        <div className="bg-gray-800 p-3 rounded-md my-2 overflow-auto">
          <pre>{`{
  "name": "string",
  "description": "string",
  "nodes": [
    // Node objects
  ],
  "edges": [
    // Edge objects
  ],
  "triggers": [
    // Trigger objects
  ]
}`}</pre>
        </div>

        <h4>Response</h4>
        <div className="bg-gray-800 p-3 rounded-md my-2 overflow-auto">
          <pre>{`{
  "id": "string",
  "name": "string",
  "description": "string",
  "nodes": [
    // Node objects
  ],
  "edges": [
    // Edge objects
  ],
  "triggers": [
    // Trigger objects
  ],
  "createdAt": "string",
  "updatedAt": "string"
}`}</pre>
        </div>
      </div>
    </div>
  )
}

function AgentCreationGuide() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Agent Creation Guide</h1>

      <div className="prose prose-invert max-w-none">
        <p>
          Creating effective agents is a key part of working with the Borg Framework. This guide explains the agent
          creation process, best practices, and advanced configuration options.
        </p>

        <h2>Agent Types</h2>
        <p>The Borg Framework supports several types of agents, each with specific capabilities and use cases:</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
            <h4 className="text-sky-300 font-medium">Data Analyst</h4>
            <p className="text-sm text-gray-300">
              Processes and analyzes structured data to extract insights and generate visualizations.
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
            <h4 className="text-sky-300 font-medium">Research Assistant</h4>
            <p className="text-sm text-gray-300">
              Retrieves, summarizes, and synthesizes information from various sources.
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
            <h4 className="text-sky-300 font-medium">Content Creator</h4>
            <p className="text-sm text-gray-300">
              Generates various types of content, including text, images, and code.
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
            <h4 className="text-sky-300 font-medium">Task Executor</h4>
            <p className="text-sm text-gray-300">
              Performs specific tasks based on predefined workflows and instructions.
            </p>
          </div>
        </div>

        <h2>Creation Process</h2>

        <ol>
          <li>
            <strong>Define Agent Purpose</strong>
            <p>
              Clearly define what you want your agent to accomplish. Be specific about its responsibilities and
              limitations.
            </p>
          </li>
          <li>
            <strong>Select Capabilities</strong>
            <p>
              Choose the capabilities your agent needs to fulfill its purpose. These determine what the agent can do.
            </p>
          </li>
          <li>
            <strong>Configure Parameters</strong>
            <p>Set agent-specific parameters such as model preferences, response formats, and execution constraints.</p>
          </li>
          <li>
            <strong>Define Knowledge Base</strong>
            <p>Optionally, connect the agent to knowledge sources that it can use to augment its responses.</p>
          </li>
          <li>
            <strong>Test and Refine</strong>
            <p>Test the agent with sample inputs and refine its configuration based on the results.</p>
          </li>
        </ol>

        <h2>Advanced Configuration</h2>

        <h3>System Prompts</h3>
        <p>
          System prompts provide initial instructions to the agent. They shape the agent's behavior and responses.
          Here's an example system prompt for a research assistant agent:
        </p>

        <div className="bg-gray-800 p-3 rounded-md my-2 overflow-auto">
          <pre>{`You are a research assistant specialized in scientific literature.
Your task is to:
1. Find relevant papers and research on a given topic
2. Summarize key findings and methodologies
3. Identify gaps in the research
4. Suggest areas for further investigation

Always cite your sources and provide links to original papers when available.
Maintain scientific rigor and avoid speculation.`}</pre>
        </div>

        <h3>Learning Configuration</h3>
        <p>For self-evolving agents, you can configure how they learn from interactions:</p>

        <div className="bg-gray-800 p-3 rounded-md my-2 overflow-auto">
          <pre>{`{
  "learningEnabled": true,
  "learningParameters": {
    "feedbackSources": ["user", "system", "metrics"],
    "adaptationRate": 0.3,
    "memoryRetention": 0.8,
    "explorationRate": 0.2
  }
}`}</pre>
        </div>
      </div>
    </div>
  )
}

function WorkflowGuide() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Workflow Design Guide</h1>

      <div className="prose prose-invert max-w-none">
        <p>
          Workflows are sequences of operations performed by agents to accomplish complex tasks. This guide explains how
          to design, implement, and optimize workflows in the Borg Framework.
        </p>

        <div className="bg-gray-900 p-6 rounded-lg my-6 border border-gray-800">
          <h3 className="text-xl font-semibold text-sky-300 mb-3">Visual Workflow Orchestration</h3>
          <p className="text-gray-300">
            Our intuitive node-based workflow builder with real-time execution monitoring and debugging allows you to
            design complex AI workflows without coding, identify and resolve bottlenecks through visual analysis, and
            create adaptive processes that respond to changing conditions.
          </p>
        </div>

        <h2>Workflow Components</h2>

        <h3>Nodes</h3>
        <p>Nodes represent individual operations in a workflow. The Borg Framework provides several types of nodes:</p>

        <ul>
          <li>
            <strong>Agent Nodes</strong>: Execute agent operations
          </li>
          <li>
            <strong>Trigger Nodes</strong>: Initiate workflow execution based on events
          </li>
          <li>
            <strong>Condition Nodes</strong>: Control flow based on conditions
          </li>
          <li>
            <strong>Action Nodes</strong>: Perform system actions
          </li>
          <li>
            <strong>Data Nodes</strong>: Process and transform data
          </li>
        </ul>

        <h3>Edges</h3>
        <p>
          Edges connect nodes and define the flow of execution in a workflow. Each edge can optionally include
          transformation logic for data passed between nodes.
        </p>

        <h2>Design Patterns</h2>

        <h3>Sequential Processing</h3>
        <p>
          A simple pattern where nodes execute in sequence, with each node processing the output of the previous node.
        </p>

        <div className="bg-gray-800 p-4 rounded-md my-2">
          <div className="flex items-center justify-between">
            <div className="bg-sky-800 p-2 rounded-md">Node A</div>
            <div>→</div>
            <div className="bg-sky-800 p-2 rounded-md">Node B</div>
            <div>→</div>
            <div className="bg-sky-800 p-2 rounded-md">Node C</div>
          </div>
        </div>

        <h3>Parallel Processing</h3>
        <p>Multiple nodes execute in parallel and their results are combined by a subsequent node.</p>

        <div className="bg-gray-800 p-4 rounded-md my-2">
          <div className="flex flex-col items-center">
            <div className="bg-sky-800 p-2 rounded-md mb-4">Source Node</div>
            <div className="flex items-center justify-center space-x-8 mb-4">
              <div className="bg-sky-800 p-2 rounded-md">Node A</div>
              <div className="bg-sky-800 p-2 rounded-md">Node B</div>
              <div className="bg-sky-800 p-2 rounded-md">Node C</div>
            </div>
            <div className="bg-sky-800 p-2 rounded-md">Aggregator Node</div>
          </div>
        </div>

        <h3>Conditional Branching</h3>
        <p>Execution flow is determined by conditions, allowing for different paths based on data or system state.</p>

        <div className="bg-gray-800 p-4 rounded-md my-2">
          <div className="flex flex-col items-center">
            <div className="bg-sky-800 p-2 rounded-md mb-4">Source Node</div>
            <div className="bg-yellow-800 p-2 rounded-md mb-4">Condition Node</div>
            <div className="flex items-center justify-center space-x-8">
              <div className="flex flex-col items-center">
                <div className="text-xs mb-1">True</div>
                <div className="bg-sky-800 p-2 rounded-md">Path A</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-xs mb-1">False</div>
                <div className="bg-sky-800 p-2 rounded-md">Path B</div>
              </div>
            </div>
          </div>
        </div>

        <h2>Industry Applications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
            <h4 className="text-sky-300 font-medium">Financial Services</h4>
            <ul className="text-sm text-gray-300 list-disc pl-5 mt-2">
              <li>Automated regulatory compliance monitoring</li>
              <li>Intelligent fraud detection systems</li>
              <li>Personalized financial advisory services</li>
            </ul>
          </div>
          <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
            <h4 className="text-sky-300 font-medium">Healthcare & Life Sciences</h4>
            <ul className="text-sm text-gray-300 list-disc pl-5 mt-2">
              <li>Clinical decision support systems</li>
              <li>Automated medical coding and billing</li>
              <li>Research acceleration through literature analysis</li>
            </ul>
          </div>
          <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
            <h4 className="text-sky-300 font-medium">Manufacturing & Supply Chain</h4>
            <ul className="text-sm text-gray-300 list-disc pl-5 mt-2">
              <li>Predictive maintenance systems</li>
              <li>Supply chain optimization</li>
              <li>Quality control automation</li>
            </ul>
          </div>
          <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
            <h4 className="text-sky-300 font-medium">Customer Service & Support</h4>
            <ul className="text-sm text-gray-300 list-disc pl-5 mt-2">
              <li>Omnichannel support agents</li>
              <li>Automated ticket routing and prioritization</li>
              <li>Knowledge base management</li>
            </ul>
          </div>
        </div>

        <h2>Best Practices</h2>

        <ul>
          <li>
            <strong>Keep workflows focused</strong> on specific tasks or objectives
          </li>
          <li>
            <strong>Design for error handling</strong> by including fallback paths and recovery mechanisms
          </li>
          <li>
            <strong>Optimize for reusability</strong> by creating modular workflows that can be composed
          </li>
          <li>
            <strong>Include monitoring points</strong> to track workflow execution and performance
          </li>
          <li>
            <strong>Test workflows thoroughly</strong> with various inputs and edge cases
          </li>
        </ul>
      </div>
    </div>
  )
}

function DatabaseGuide() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Database Setup Guide</h1>

      <div className="prose prose-invert max-w-none">
        <p>
          The Borg Framework requires a database to store agent data, workflow definitions, execution logs, and more.
          This guide explains how to set up and configure the database for production use.
        </p>

        <h2>Supported Databases</h2>
        <p>The Borg Framework officially supports the following database systems:</p>

        <ul>
          <li>
            <strong>PostgreSQL</strong> (recommended for production)
          </li>
          <li>
            <strong>SQLite</strong> (for development and testing)
          </li>
          <li>
            <strong>Supabase</strong> (PostgreSQL with additional features)
          </li>
        </ul>

        <h2>Schema Structure</h2>
        <p>The database schema includes the following key tables:</p>

        <div className="bg-gray-800 p-3 rounded-md my-2 overflow-auto">
          <pre>{`-- Agents table
CREATE TABLE agents (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  capabilities JSONB,
  learning_enabled BOOLEAN DEFAULT FALSE,
  parameters JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workflows table
CREATE TABLE workflows (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  nodes JSONB,
  edges JSONB,
  triggers JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Executions table
CREATE TABLE executions (
  id UUID PRIMARY KEY,
  workflow_id UUID REFERENCES workflows(id),
  status TEXT NOT NULL,
  input JSONB,
  output JSONB,
  logs JSONB,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);`}</pre>
        </div>

        <h2>Database Initialization</h2>
        <p>
          The Borg Framework includes database initialization scripts that create the necessary tables and indexes. You
          can initialize the database using the following steps:
        </p>

        <ol>
          <li>Configure database connection parameters in environment variables</li>
          <li>
            Run the database initialization API endpoint: <code>POST /api/init-database</code>
          </li>
          <li>Verify that the tables were created successfully</li>
        </ol>

        <h2>Backup and Recovery</h2>
        <p>For production deployments, it's important to set up regular database backups:</p>

        <h3>PostgreSQL Backup</h3>
        <div className="bg-gray-800 p-3 rounded-md my-2 overflow-auto">
          <code>pg_dump -h hostname -U username -d dbname -F c -f backup.dump</code>
        </div>

        <h3>PostgreSQL Restore</h3>
        <div className="bg-gray-800 p-3 rounded-md my-2 overflow-auto">
          <code>pg_restore -h hostname -U username -d dbname -c backup.dump</code>
        </div>

        <h2>Migration</h2>
        <p>The Borg Framework includes migration scripts for updating the database schema:</p>

        <ol>
          <li>Back up the current database</li>
          <li>
            Run the migration API endpoint: <code>POST /api/migrate-database</code>
          </li>
          <li>Verify that the migration was successful</li>
        </ol>
      </div>
    </div>
  )
}

function SecurityGuide() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Security & Compliance Guide</h1>

      <div className="prose prose-invert max-w-none">
        <p>
          Securing your Borg Framework deployment is critical, especially when working with sensitive data or in
          regulated environments. This guide covers security best practices and compliance considerations.
        </p>

        <div className="bg-gray-900 p-6 rounded-lg my-6 border border-gray-800">
          <h3 className="text-xl font-semibold text-sky-300 mb-3">Enterprise-Grade Security & Compliance</h3>
          <p className="text-gray-300">
            With end-to-end encryption for data in transit and at rest, role-based access control with granular
            permissions, comprehensive audit logging and compliance reporting, and a secure API gateway with rate
            limiting and threat detection, the Borg Framework ensures your data remains protected throughout the AI
            lifecycle.
          </p>
        </div>

        <h2>Authentication & Authorization</h2>
        <p>The Borg Framework uses a multi-layered security approach:</p>

        <ul>
          <li>
            <strong>API Keys</strong>: For server-to-server authentication
          </li>
          <li>
            <strong>JWT Tokens</strong>: For user authentication
          </li>
          <li>
            <strong>Role-Based Access Control</strong>: For fine-grained authorization
          </li>
        </ul>

        <h3>API Key Management</h3>
        <p>Best practices for API key management:</p>

        <ul>
          <li>Rotate API keys regularly</li>
          <li>Use different API keys for different environments</li>
          <li>Limit API key permissions to only what's necessary</li>
          <li>Store API keys securely (e.g., in environment variables or secrets management systems)</li>
        </ul>

        <h2>Data Protection</h2>

        <h3>Encryption</h3>
        <p>The Borg Framework encrypts sensitive data:</p>

        <ul>
          <li>
            <strong>In Transit</strong>: All API communications use TLS/SSL
          </li>
          <li>
            <strong>At Rest</strong>: Sensitive data is encrypted in the database
          </li>
          <li>
            <strong>API Keys</strong>: Stored using one-way hashing
          </li>
        </ul>

        <h3>Data Minimization</h3>
        <p>Implement data minimization practices:</p>

        <ul>
          <li>Only collect data necessary for the intended purpose</li>
          <li>Implement data retention policies</li>
          <li>Provide mechanisms for data deletion</li>
        </ul>

        <h2>Network Security & IT Operations</h2>
        <p>Strengthen your security posture with intelligent threat detection and response:</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
            <h4 className="text-sky-300 font-medium">Adaptive Security Monitoring</h4>
            <p className="text-sm text-gray-300">
              Evolving threat detection systems that adapt to identify novel security threats.
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
            <h4 className="text-sky-300 font-medium">Automated Incident Response</h4>
            <p className="text-sm text-gray-300">
              Coordinated agent teams that respond to security incidents automatically.
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
            <h4 className="text-sky-300 font-medium">Network Anomaly Detection</h4>
            <p className="text-sm text-gray-300">
              Contextual analysis of network traffic to identify suspicious patterns.
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
            <h4 className="text-sky-300 font-medium">Compliance Monitoring</h4>
            <p className="text-sm text-gray-300">Automated compliance checks and remediation for security standards.</p>
          </div>
        </div>

        <h2>Compliance Considerations</h2>

        <h3>GDPR Compliance</h3>
        <p>For European deployments, consider these GDPR requirements:</p>

        <ul>
          <li>Implement data subject access rights</li>
          <li>Document lawful bases for processing</li>
          <li>Implement data protection impact assessments</li>
          <li>Ensure vendor compliance</li>
        </ul>

        <h3>HIPAA Compliance</h3>
        <p>For healthcare applications in the US:</p>

        <ul>
          <li>Implement additional security measures for PHI</li>
          <li>Conduct regular security risk assessments</li>
          <li>Implement audit logs for all PHI access</li>
          <li>Ensure proper BAAs with all vendors</li>
        </ul>

        <h2>Software Development & Testing</h2>
        <p>Accelerate development cycles while improving code quality:</p>

        <ul>
          <li>Intelligent code review and optimization</li>
          <li>Automated test generation based on code changes</li>
          <li>Bug prediction and proactive resolution</li>
          <li>Documentation generation and maintenance</li>
        </ul>

        <h2>Security Monitoring</h2>
        <p>Implement continuous security monitoring:</p>

        <ul>
          <li>Log all authentication attempts</li>
          <li>Monitor API usage patterns</li>
          <li>Set up alerts for suspicious activities</li>
          <li>Conduct regular security reviews</li>
        </ul>
      </div>
    </div>
  )
}
