import MCPIntegration from "@/components/mcp-integration"

export const metadata = {
  title: "MCP Integration - Borg Framework",
  description: "Interact with the Borg Framework using the Machine Communication Protocol",
}

export default function MCPIntegrationPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">MCP Integration</h1>
      <MCPIntegration />

      <div className="mt-12 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">About MCP Integration</h2>
        <p className="mb-4">
          The Machine Communication Protocol (MCP) integration allows AI agents in the Borg Framework to communicate
          with tools and resources in a standardized way.
        </p>
        <p className="mb-4">With MCP, you can:</p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Create workflows and agents through natural language</li>
          <li>Execute workflows with specific parameters</li>
          <li>Search for information and integrate it into your workflows</li>
          <li>Access documentation and resources programmatically</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">Technical Details</h3>
        <p className="mb-4">
          This integration uses the @vercel/mcp-adapter package to implement the MCP server. The server exposes HTTP and
          SSE transports for communication.
        </p>
        <p>
          For SSE transport, Redis is required. Make sure to set the REDIS_URL environment variable if you want to use
          the SSE transport.
        </p>
      </div>
    </div>
  )
}
