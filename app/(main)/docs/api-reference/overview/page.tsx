import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ApiOverviewPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight">Borg API Reference</h1>
      <p className="text-muted-foreground">Comprehensive documentation for the Borg Framework API</p>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>API Base URL</AlertTitle>
        <AlertDescription className="flex items-center gap-2">
          <code className="bg-muted px-2 py-1 rounded">https://api.borgframework.com/v1</code>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Copy className="h-3 w-3" />
          </Button>
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="overview" className="w-full mt-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="authentication">Authentication</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>API Overview</CardTitle>
              <CardDescription>The Borg Framework API follows RESTful principles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">API Endpoints</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  The Borg API is organized around the following main resources:
                </p>
                <ul className="mt-2 space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium mt-0.5">GET</div>
                    <div>
                      <code className="bg-muted px-2 py-1 rounded">/agents</code>
                      <p className="text-xs text-muted-foreground mt-1">List all agents</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium mt-0.5">POST</div>
                    <div>
                      <code className="bg-muted px-2 py-1 rounded">/agents</code>
                      <p className="text-xs text-muted-foreground mt-1">Create a new agent</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium mt-0.5">GET</div>
                    <div>
                      <code className="bg-muted px-2 py-1 rounded">/agents/{"{agent_id}"}</code>
                      <p className="text-xs text-muted-foreground mt-1">Get a specific agent</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium mt-0.5">GET</div>
                    <div>
                      <code className="bg-muted px-2 py-1 rounded">/workflows</code>
                      <p className="text-xs text-muted-foreground mt-1">List all workflows</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium mt-0.5">POST</div>
                    <div>
                      <code className="bg-muted px-2 py-1 rounded">/workflows</code>
                      <p className="text-xs text-muted-foreground mt-1">Create a new workflow</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium mt-0.5">POST</div>
                    <div>
                      <code className="bg-muted px-2 py-1 rounded">/workflows/{"{workflow_id}"}/execute</code>
                      <p className="text-xs text-muted-foreground mt-1">Execute a workflow</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium">Response Format</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  All API responses are returned in JSON format. Successful responses include a{" "}
                  <code className="bg-muted px-1 rounded">data</code> field containing the requested information.
                </p>
                <div className="mt-2 rounded-md bg-muted p-4">
                  <pre className="text-sm">
                    {`// Example successful response
{
  "data": {
    "id": "agent_123456",
    "name": "Research Assistant",
    "description": "Helps with online research and summarization",
    "capabilities": ["web_search", "summarization", "question_answering"],
    "model": "grok-1",
    "created_at": "2023-05-01T12:00:00Z",
    "updated_at": "2023-05-01T12:00:00Z"
  }
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">Pagination</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  List endpoints support pagination using <code className="bg-muted px-1 rounded">limit</code> and{" "}
                  <code className="bg-muted px-1 rounded">offset</code> query parameters.
                </p>
                <div className="mt-2 rounded-md bg-muted p-4">
                  <pre className="text-sm">
                    {`// Example paginated request
GET /agents?limit=10&offset=20

// Example paginated response
{
  "data": [...],
  "pagination": {
    "total": 45,
    "limit": 10,
    "offset": 20,
    "has_more": true
  }
}`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="authentication">
          <Card>
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
              <CardDescription>How to authenticate with the Borg API</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">API Keys</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  The Borg API uses API keys for authentication. You can generate an API key in the{" "}
                  <a href="/settings" className="text-blue-500 hover:underline">
                    Settings
                  </a>{" "}
                  page.
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
                <h3 className="text-lg font-medium">API Key Security</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Keep your API keys secure and never expose them in client-side code. If you believe your API key has
                  been compromised, you can revoke it and generate a new one in the Settings page.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium">Rate Limiting</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  API requests are rate-limited based on your plan. The rate limit information is included in the
                  response headers.
                </p>
                <div className="mt-2 rounded-md bg-muted p-4">
                  <pre className="text-sm">
                    {`// Example rate limit headers
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1620000000`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="errors">
          <Card>
            <CardHeader>
              <CardTitle>Error Handling</CardTitle>
              <CardDescription>Understanding API error responses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Error Format</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  When an error occurs, the API returns an error response with an appropriate HTTP status code and an
                  error message.
                </p>
                <div className="mt-2 rounded-md bg-muted p-4">
                  <pre className="text-sm">
                    {`// Example error response
{
  "error": {
    "code": "invalid_request",
    "message": "The agent ID is invalid or does not exist",
    "status": 404
  }
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">Common Error Codes</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Here are some common error codes you might encounter:
                </p>
                <ul className="mt-2 space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="bg-red-500/10 text-red-500 px-2 py-1 rounded text-xs font-medium mt-0.5">400</div>
                    <div>
                      <p className="font-medium">Bad Request</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        The request was malformed or contained invalid parameters
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-red-500/10 text-red-500 px-2 py-1 rounded text-xs font-medium mt-0.5">401</div>
                    <div>
                      <p className="font-medium">Unauthorized</p>
                      <p className="text-xs text-muted-foreground mt-1">Authentication failed or was not provided</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-red-500/10 text-red-500 px-2 py-1 rounded text-xs font-medium mt-0.5">403</div>
                    <div>
                      <p className="font-medium">Forbidden</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        You don't have permission to access the requested resource
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-red-500/10 text-red-500 px-2 py-1 rounded text-xs font-medium mt-0.5">404</div>
                    <div>
                      <p className="font-medium">Not Found</p>
                      <p className="text-xs text-muted-foreground mt-1">The requested resource does not exist</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-red-500/10 text-red-500 px-2 py-1 rounded text-xs font-medium mt-0.5">429</div>
                    <div>
                      <p className="font-medium">Too Many Requests</p>
                      <p className="text-xs text-muted-foreground mt-1">You've exceeded the rate limit</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-red-500/10 text-red-500 px-2 py-1 rounded text-xs font-medium mt-0.5">500</div>
                    <div>
                      <p className="font-medium">Internal Server Error</p>
                      <p className="text-xs text-muted-foreground mt-1">Something went wrong on our end</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium">Error Handling Best Practices</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  When integrating with the Borg API, always implement proper error handling to ensure a smooth user
                  experience.
                </p>
                <div className="mt-2 rounded-md bg-muted p-4">
                  <pre className="text-sm">
                    {`// Example error handling
async function fetchAgents() {
  try {
    const response = await fetch('https://api.borgframework.com/v1/agents', {
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message || 'An error occurred');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching agents:', error);
    // Handle the error appropriately in your application
  }
}`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>API Resources</CardTitle>
          <CardDescription>Explore the available API resources</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li>
              <a href="/docs/api-reference/agents" className="text-blue-500 hover:underline">
                Agents API
              </a>
            </li>
            <li>
              <a href="/docs/api-reference/workflows" className="text-blue-500 hover:underline">
                Workflows API
              </a>
            </li>
            <li>
              <a href="/docs/api-reference/teams" className="text-blue-500 hover:underline">
                Teams API
              </a>
            </li>
            <li>
              <a href="/docs/api-reference/execution" className="text-blue-500 hover:underline">
                Execution API
              </a>
            </li>
            <li>
              <a href="/docs/api-reference/memory" className="text-blue-500 hover:underline">
                Memory & RAG API
              </a>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
