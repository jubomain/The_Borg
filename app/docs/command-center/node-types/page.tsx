import DocsLayout from "@/components/documentation/docs-layout"

export default function NodeTypesPage() {
  return (
    <DocsLayout>
      <div className="prose prose-invert max-w-none">
        <h2>Node Types</h2>

        <p>
          The Command Center provides several types of nodes that you can use to build your workflows. Each node type
          serves a specific purpose and has unique properties and capabilities.
        </p>

        <h3>Trigger Nodes</h3>

        <p>
          Trigger nodes are the starting points of your workflows. They define when and how a workflow should be
          executed.
        </p>

        <div className="bg-blue-900/30 border border-blue-800 rounded-md p-4 my-4">
          <h4 className="mt-0 text-blue-400">Trigger Node Properties</h4>
          <ul className="mb-0">
            <li>
              <strong>Trigger Type</strong>: Cron, Webhook, or Event
            </li>
            <li>
              <strong>Cron Expression</strong>: For scheduled triggers (e.g., "0 * * * *" for hourly)
            </li>
            <li>
              <strong>Webhook URL</strong>: For webhook triggers
            </li>
            <li>
              <strong>Event Name</strong>: For event-based triggers
            </li>
          </ul>
        </div>

        <h4>Trigger Types</h4>

        <ul>
          <li>
            <strong>Cron</strong> - Executes the workflow on a schedule using cron expressions
          </li>
          <li>
            <strong>Webhook</strong> - Executes the workflow when an HTTP request is received at a specific URL
          </li>
          <li>
            <strong>Event</strong> - Executes the workflow when a specific event occurs in the system
          </li>
        </ul>

        <h3>Agent Nodes</h3>

        <p>Agent nodes represent AI agents that can process information, make decisions, and generate content.</p>

        <div className="bg-green-900/30 border border-green-800 rounded-md p-4 my-4">
          <h4 className="mt-0 text-green-400">Agent Node Properties</h4>
          <ul className="mb-0">
            <li>
              <strong>Name</strong>: The name of the agent
            </li>
            <li>
              <strong>Description</strong>: A description of what the agent does
            </li>
            <li>
              <strong>Instructions</strong>: Specific instructions for the agent
            </li>
            <li>
              <strong>Model</strong>: The AI model to use (e.g., Grok-1, Llama 3)
            </li>
            <li>
              <strong>Temperature</strong>: Controls randomness in the agent's responses
            </li>
          </ul>
        </div>

        <p>Agents can be specialized for different tasks, such as:</p>

        <ul>
          <li>Twitter monitoring</li>
          <li>Email composition</li>
          <li>Content generation</li>
          <li>Data analysis</li>
          <li>Decision making</li>
        </ul>

        <h3>Condition Nodes</h3>

        <p>Condition nodes allow you to create branching logic in your workflows based on conditions.</p>

        <div className="bg-yellow-900/30 border border-yellow-800 rounded-md p-4 my-4">
          <h4 className="mt-0 text-yellow-400">Condition Node Properties</h4>
          <ul className="mb-0">
            <li>
              <strong>Condition</strong>: The expression to evaluate (e.g., &quot;value &gt; 10&quot;)
            </li>
            <li>
              <strong>True Label</strong>: Label for the "true" output path
            </li>
            <li>
              <strong>False Label</strong>: Label for the "false" output path
            </li>
          </ul>
        </div>

        <p>Condition nodes have two output paths:</p>

        <ul>
          <li>
            <strong>True Path</strong> - Followed when the condition evaluates to true
          </li>
          <li>
            <strong>False Path</strong> - Followed when the condition evaluates to false
          </li>
        </ul>

        <h3>Action Nodes</h3>

        <p>Action nodes perform specific actions or operations, such as sending emails or making API calls.</p>

        <div className="bg-purple-900/30 border border-purple-800 rounded-md p-4 my-4">
          <h4 className="mt-0 text-purple-400">Action Node Properties</h4>
          <ul className="mb-0">
            <li>
              <strong>Action Type</strong>: The type of action to perform
            </li>
            <li>
              <strong>Configuration</strong>: Settings specific to the action type
            </li>
          </ul>
        </div>

        <h4>Action Types</h4>

        <ul>
          <li>
            <strong>Email</strong> - Sends an email
            <ul>
              <li>Recipient</li>
              <li>Subject</li>
              <li>Template</li>
            </ul>
          </li>
          <li>
            <strong>Webhook</strong> - Makes an HTTP request
            <ul>
              <li>URL</li>
              <li>Method (GET, POST, etc.)</li>
              <li>Headers</li>
              <li>Body</li>
            </ul>
          </li>
          <li>
            <strong>Database</strong> - Performs a database operation
          </li>
          <li>
            <strong>Google Drive</strong> - Interacts with Google Drive
          </li>
          <li>
            <strong>Twitter</strong> - Performs Twitter actions
            <ul>
              <li>Post Tweet</li>
              <li>Search Tweets</li>
              <li>Monitor Hashtag</li>
            </ul>
          </li>
        </ul>

        <h3>Data Nodes</h3>

        <p>Data nodes interact with data sources to retrieve, store, or process data.</p>

        <div className="bg-gray-800 border border-gray-700 rounded-md p-4 my-4">
          <h4 className="mt-0 text-gray-300">Data Node Properties</h4>
          <ul className="mb-0">
            <li>
              <strong>Data Source</strong>: The source of the data
            </li>
            <li>
              <strong>Table</strong>: For database sources, the table to interact with
            </li>
            <li>
              <strong>Query</strong>: The query or operation to perform
            </li>
          </ul>
        </div>

        <h4>Data Sources</h4>

        <ul>
          <li>
            <strong>Supabase</strong> - Interacts with Supabase tables
          </li>
          <li>
            <strong>Google Sheets</strong> - Reads from or writes to Google Sheets
          </li>
          <li>
            <strong>Airtable</strong> - Interacts with Airtable bases
          </li>
          <li>
            <strong>CSV</strong> - Reads from or writes to CSV files
          </li>
        </ul>

        <h3>Next Steps</h3>

        <p>Now that you understand the different node types, learn how to:</p>

        <ul>
          <li>
            <a href="/docs/command-center/connections">Connect nodes</a> to create a workflow
          </li>
          <li>
            <a href="/docs/command-center/execution">Execute your workflow</a>
          </li>
          <li>
            <a href="/docs/examples/twitter-email">View a complete workflow example</a>
          </li>
        </ul>
      </div>
    </DocsLayout>
  )
}
