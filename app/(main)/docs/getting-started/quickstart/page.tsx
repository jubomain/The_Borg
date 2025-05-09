import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"

export default function QuickstartPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight">Quickstart Guide</h1>
      <p className="text-muted-foreground">Get up and running with the Borg Framework in minutes</p>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Note</AlertTitle>
        <AlertDescription>
          This guide assumes you have already installed the Borg Framework. If not, please see the{" "}
          <a href="/docs/getting-started/installation" className="text-blue-500 hover:underline">
            Installation Guide
          </a>
          .
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="ui" className="w-full mt-4">
        <TabsList>
          <TabsTrigger value="ui">Using the UI</TabsTrigger>
          <TabsTrigger value="api">Using the API</TabsTrigger>
        </TabsList>
        <TabsContent value="ui">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started with the UI</CardTitle>
              <CardDescription>Learn how to use the Borg Framework through its user interface</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Step 1: Create Your First Agent</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Navigate to the{" "}
                  <a href="/agent-studio" className="text-blue-500 hover:underline">
                    Agent Studio
                  </a>{" "}
                  and click on "Create New Agent". Fill in the required details and configure your agent's capabilities.
                </p>
                <div className="mt-2 rounded-md bg-muted p-4">
                  <pre className="text-sm">
                    {`// Example agent configuration
{
  "name": "Research Assistant",
  "description": "Helps with online research and summarization",
  "capabilities": ["web_search", "summarization", "question_answering"],
  "model": "grok-1"
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">Step 2: Create a Simple Workflow</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Go to the{" "}
                  <a href="/command-center" className="text-blue-500 hover:underline">
                    Command Center
                  </a>{" "}
                  to create a workflow. Add a trigger node, connect it to your agent, and add an action node for the
                  output.
                </p>
                <div className="mt-2 h-40 rounded-md bg-muted flex items-center justify-center">
                  <p className="text-muted">Workflow diagram placeholder</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">Step 3: Test Your Workflow</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Use the execution panel in the Command Center to test your workflow. Enter a test input and observe
                  how your agent processes it.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium">Step 4: Deploy Your Workflow</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Once you're satisfied with your workflow, deploy it using the "Deploy" button. You can then access it
                  via API or schedule it to run automatically.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started with the API</CardTitle>
              <CardDescription>Learn how to use the Borg Framework through its API</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Step 1: Authentication</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  First, obtain your API key from the{" "}
                  <a href="/settings" className="text-blue-500 hover:underline">
                    Settings
                  </a>{" "}
                  page. You'll use this key to authenticate your API requests.
                </p>
                <div className="mt-2 rounded-md bg-muted p-4">
                  <pre className="text-sm">
                    {`// Example API request with authentication
fetch('https://api.borgframework.com/v1/agents', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
})`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">Step 2: Create an Agent</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Use the Agents API to create a new agent programmatically.
                </p>
                <div className="mt-2 rounded-md bg-muted p-4">
                  <pre className="text-sm">
                    {`// Create a new agent
fetch('https://api.borgframework.com/v1/agents', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Research Assistant',
    description: 'Helps with online research and summarization',
    capabilities: ['web_search', 'summarization', 'question_answering'],
    model: 'grok-1'
  })
})`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">Step 3: Create a Workflow</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Use the Workflows API to create a new workflow that uses your agent.
                </p>
                <div className="mt-2 rounded-md bg-muted p-4">
                  <pre className="text-sm">
                    {`// Create a new workflow
fetch('https://api.borgframework.com/v1/workflows', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Research Workflow',
    description: 'Performs research and summarizes results',
    nodes: [
      {
        id: 'trigger1',
        type: 'trigger',
        position: { x: 100, y: 100 },
        data: { type: 'manual' }
      },
      {
        id: 'agent1',
        type: 'agent',
        position: { x: 300, y: 100 },
        data: { agentId: 'YOUR_AGENT_ID' }
      },
      {
        id: 'action1',
        type: 'action',
        position: { x: 500, y: 100 },
        data: { type: 'output' }
      }
    ],
    edges: [
      {
        id: 'edge1',
        source: 'trigger1',
        target: 'agent1'
      },
      {
        id: 'edge2',
        source: 'agent1',
        target: 'action1'
      }
    ]
  })
})`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">Step 4: Execute a Workflow</h3>
                <p className="text-sm text-muted-foreground mt-1">Execute your workflow using the Workflows API.</p>
                <div className="mt-2 rounded-md bg-muted p-4">
                  <pre className="text-sm">
                    {`// Execute a workflow
fetch('https://api.borgframework.com/v1/workflows/YOUR_WORKFLOW_ID/execute', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    input: 'Research the latest advancements in AI and provide a summary'
  })
})`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
          <CardDescription>Where to go from here</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li>
              <a href="/docs/guides/creating-agents" className="text-blue-500 hover:underline">
                Learn more about creating advanced agents
              </a>
            </li>
            <li>
              <a href="/docs/guides/building-workflows" className="text-blue-500 hover:underline">
                Explore complex workflow patterns
              </a>
            </li>
            <li>
              <a href="/docs/guides/agent-teams" className="text-blue-500 hover:underline">
                Create teams of agents that work together
              </a>
            </li>
            <li>
              <a href="/docs/advanced/self-evolution" className="text-blue-500 hover:underline">
                Set up self-evolution for your agents
              </a>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
