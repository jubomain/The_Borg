"use client"

import { useState } from "react"
import { Save, Loader2, Plus, Trash, Server } from "lucide-react"

interface Tool {
  name: string
  description: string
  parameters: {
    type: string
    properties: Record<string, any>
    required: string[]
  }
  handlerCode: string
}

interface Resource {
  name: string
  description: string
  content: string
}

export default function MCPServerCreator() {
  const [serverName, setServerName] = useState("")
  const [defaultPrompt, setDefaultPrompt] = useState(
    "You are an AI assistant that can control computer systems and execute tasks.",
  )
  const [tools, setTools] = useState<Tool[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [newToolName, setNewToolName] = useState("")
  const [newToolDescription, setNewToolDescription] = useState("")
  const [newToolParameters, setNewToolParameters] = useState(`{
  "type": "object",
  "properties": {
    "param1": {
      "type": "string",
      "description": "Description of parameter 1"
    }
  },
  "required": ["param1"]
}`)
  const [newToolHandlerCode, setNewToolHandlerCode] = useState(`async ({ param1 }) => {
  console.log(\`Executing tool with param: \${param1}\`);
  // Implement tool logic here
  return {
    result: \`Processed \${param1}\`
  };
}`)
  const [newResourceName, setNewResourceName] = useState("")
  const [newResourceDescription, setNewResourceDescription] = useState("")
  const [newResourceContent, setNewResourceContent] = useState("")

  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCode, setGeneratedCode] = useState("")
  const [includeComputerControl, setIncludeComputerControl] = useState(true)
  const [deploymentUrl, setDeploymentUrl] = useState("")

  const handleAddTool = () => {
    if (!newToolName || !newToolDescription) return

    try {
      // Validate JSON
      JSON.parse(newToolParameters)

      const newTool: Tool = {
        name: newToolName,
        description: newToolDescription,
        parameters: JSON.parse(newToolParameters),
        handlerCode: newToolHandlerCode,
      }

      setTools([...tools, newTool])

      // Clear inputs
      setNewToolName("")
      setNewToolDescription("")
      setNewToolParameters(`{
  "type": "object",
  "properties": {
    "param1": {
      "type": "string",
      "description": "Description of parameter 1"
    }
  },
  "required": ["param1"]
}`)
      setNewToolHandlerCode(`async ({ param1 }) => {
  console.log(\`Executing tool with param: \${param1}\`);
  // Implement tool logic here
  return {
    result: \`Processed \${param1}\`
  };
}`)
    } catch (error) {
      alert("Invalid JSON in parameters")
      console.error(error)
    }
  }

  const handleRemoveTool = (index: number) => {
    const updatedTools = [...tools]
    updatedTools.splice(index, 1)
    setTools(updatedTools)
  }

  const handleAddResource = () => {
    if (!newResourceName || !newResourceDescription || !newResourceContent) return

    const newResource: Resource = {
      name: newResourceName,
      description: newResourceDescription,
      content: newResourceContent,
    }

    setResources([...resources, newResource])

    // Clear inputs
    setNewResourceName("")
    setNewResourceDescription("")
    setNewResourceContent("")
  }

  const handleRemoveResource = (index: number) => {
    const updatedResources = [...resources]
    updatedResources.splice(index, 1)
    setResources(updatedResources)
  }

  const generateMCPServer = () => {
    if (!serverName) return

    setIsGenerating(true)

    try {
      let code = `import { createMCPAdapter } from "@vercel/mcp-adapter";\n`

      // Add computer control tools import if selected
      if (includeComputerControl) {
        code += `import { computerControlTools } from "../tools/computer-control";\n\n`
      } else {
        code += `\n`
      }

      // Redis initialization for SSE transport
      code += `// Initialize Redis client for SSE transport if REDIS_URL is available
const redis = process.env.REDIS_URL ? new Redis(process.env.REDIS_URL) : undefined;\n\n`

      // Start tools definition
      code += `// Define tools that the MCP server can use
const tools = [\n`

      // Add custom tools
      tools.forEach((tool) => {
        code += `  {
    name: "${tool.name}",
    description: "${tool.description}",
    parameters: ${JSON.stringify(tool.parameters, null, 4).replace(/\n/g, "\n    ")},
    handler: ${tool.handlerCode}
  },\n`
      })

      // Add computer control tools if selected
      if (includeComputerControl) {
        code += `
  // Add the computer control tools
  ...computerControlTools,\n`
      }

      code += `];\n\n`

      // Add resources
      code += `// Define resources that the MCP server can access
const resources = [\n`

      resources.forEach((resource) => {
        code += `  {
    name: "${resource.name}",
    description: "${resource.description}",
    content: \`
${resource.content}
    \`,
  },\n`
      })

      code += `];\n\n`

      // Create MCP adapter
      code += `// Create the MCP adapter
export const { GET, POST } = createMCPAdapter({
  tools,
  resources,
  redis,
  maxDuration: 800, // Adjust for Vercel Pro or Enterprise accounts
  defaultPrompt: \`${defaultPrompt}\`,
});\n`

      setGeneratedCode(code)
      // Simulate a deployment URL for demo purposes
      setDeploymentUrl(`https://${serverName.toLowerCase().replace(/\s+/g, "-")}-mcp.vercel.app/mcp/sse`)
    } catch (error) {
      console.error("Error generating MCP server", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Server className="mr-2 h-6 w-6 text-sky-400" />
        <h2 className="text-2xl font-bold">MCP Server Creator</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium mb-4">Server Configuration</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Server Name</label>
                <input
                  type="text"
                  value={serverName}
                  onChange={(e) => setServerName(e.target.value)}
                  className="w-full bg-gray-700 rounded-md px-3 py-2 text-sm"
                  placeholder="My MCP Server"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Default Prompt</label>
                <textarea
                  value={defaultPrompt}
                  onChange={(e) => setDefaultPrompt(e.target.value)}
                  className="w-full bg-gray-700 rounded-md px-3 py-2 text-sm"
                  rows={4}
                  placeholder="You are an AI assistant..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="include-computer-control"
                  checked={includeComputerControl}
                  onChange={(e) => setIncludeComputerControl(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="include-computer-control" className="text-sm">
                  Include Computer Control Tools
                </label>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium mb-4">Tools</h3>

            <div className="space-y-4 mb-4">
              {tools.map((tool, index) => (
                <div key={index} className="bg-gray-700 rounded-md p-3">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{tool.name}</h4>
                    <button onClick={() => handleRemoveTool(index)} className="text-red-400 hover:text-red-300">
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">{tool.description}</p>
                  <div className="mt-2">
                    <span className="text-xs text-sky-400">Parameters:</span>
                    <pre className="text-xs mt-1 bg-gray-800 p-1 rounded">
                      {JSON.stringify(tool.parameters, null, 2)}
                    </pre>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-700 pt-4">
              <h4 className="text-sm font-medium mb-2">Add New Tool</h4>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Name</label>
                  <input
                    type="text"
                    value={newToolName}
                    onChange={(e) => setNewToolName(e.target.value)}
                    className="w-full bg-gray-700 rounded-md px-2 py-1 text-sm"
                    placeholder="get_data"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Description</label>
                  <input
                    type="text"
                    value={newToolDescription}
                    onChange={(e) => setNewToolDescription(e.target.value)}
                    className="w-full bg-gray-700 rounded-md px-2 py-1 text-sm"
                    placeholder="Retrieve data from a source"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Parameters (JSON)</label>
                  <textarea
                    value={newToolParameters}
                    onChange={(e) => setNewToolParameters(e.target.value)}
                    className="w-full bg-gray-700 rounded-md px-2 py-1 text-sm font-mono"
                    rows={6}
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Handler Function</label>
                  <textarea
                    value={newToolHandlerCode}
                    onChange={(e) => setNewToolHandlerCode(e.target.value)}
                    className="w-full bg-gray-700 rounded-md px-2 py-1 text-sm font-mono"
                    rows={6}
                  />
                </div>

                <button
                  onClick={handleAddTool}
                  disabled={!newToolName || !newToolDescription}
                  className="bg-sky-600 hover:bg-sky-700 text-white rounded-md px-3 py-1 text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Tool
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium mb-4">Resources</h3>

            <div className="space-y-4 mb-4">
              {resources.map((resource, index) => (
                <div key={index} className="bg-gray-700 rounded-md p-3">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{resource.name}</h4>
                    <button onClick={() => handleRemoveResource(index)} className="text-red-400 hover:text-red-300">
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">{resource.description}</p>
                  <div className="mt-2">
                    <span className="text-xs text-sky-400">Content:</span>
                    <pre className="text-xs mt-1 bg-gray-800 p-1 rounded overflow-auto max-h-24">
                      {resource.content}
                    </pre>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-700 pt-4">
              <h4 className="text-sm font-medium mb-2">Add New Resource</h4>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Name</label>
                  <input
                    type="text"
                    value={newResourceName}
                    onChange={(e) => setNewResourceName(e.target.value)}
                    className="w-full bg-gray-700 rounded-md px-2 py-1 text-sm"
                    placeholder="product_info"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Description</label>
                  <input
                    type="text"
                    value={newResourceDescription}
                    onChange={(e) => setNewResourceDescription(e.target.value)}
                    className="w-full bg-gray-700 rounded-md px-2 py-1 text-sm"
                    placeholder="Information about our products"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Content</label>
                  <textarea
                    value={newResourceContent}
                    onChange={(e) => setNewResourceContent(e.target.value)}
                    className="w-full bg-gray-700 rounded-md px-2 py-1 text-sm"
                    rows={6}
                    placeholder="# Products\n\n- Product A: Description\n- Product B: Description"
                  />
                </div>

                <button
                  onClick={handleAddResource}
                  disabled={!newResourceName || !newResourceDescription || !newResourceContent}
                  className="bg-sky-600 hover:bg-sky-700 text-white rounded-md px-3 py-1 text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Resource
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Generate MCP Server</h3>
              <button
                onClick={generateMCPServer}
                disabled={isGenerating || !serverName}
                className="bg-green-600 hover:bg-green-700 text-white rounded-md px-3 py-1 text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1" /> Generate Server
                  </>
                )}
              </button>
            </div>

            {generatedCode && (
              <div>
                <div className="bg-gray-900 rounded-md p-2 overflow-auto max-h-80">
                  <pre className="text-xs text-gray-300">{generatedCode}</pre>
                </div>

                {deploymentUrl && (
                  <div className="mt-4 bg-sky-900/30 p-3 rounded-md border border-sky-800">
                    <h4 className="text-sm font-medium text-sky-400 mb-1">Deployment Information</h4>
                    <p className="text-xs mb-2">Your MCP server can be accessed at:</p>
                    <code className="block bg-gray-900 p-2 rounded text-xs">{deploymentUrl}</code>

                    <div className="mt-3 text-xs">
                      <p>To deploy this MCP server:</p>
                      <ol className="list-decimal pl-5 mt-1 space-y-1">
                        <li>Create a new route.ts file at app/mcp/[transport]/route.ts</li>
                        <li>Copy the generated code into the file</li>
                        <li>Deploy to Vercel</li>
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
