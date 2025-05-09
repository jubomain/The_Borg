import DocsLayout from "@/components/documentation/docs-layout"

export default function CreatingWorkflowsPage() {
  return (
    <DocsLayout>
      <div className="prose prose-invert max-w-none">
        <h2>Creating Workflows</h2>

        <p>
          Workflows in the Command Center are visual representations of processes that connect multiple bots and
          services. This guide will walk you through the process of creating a workflow from scratch.
        </p>

        <h3>Creating a New Workflow</h3>

        <ol>
          <li>
            <p>
              <strong>Navigate to the Command Center</strong> from the dashboard or sidebar.
            </p>
          </li>
          <li>
            <p>
              <strong>Click "Create Workflow"</strong> to start a new workflow.
            </p>
          </li>
          <li>
            <p>
              <strong>Enter a name for your workflow</strong> in the input field at the top of the screen.
            </p>
          </li>
        </ol>

        <h3>Building Your Workflow</h3>

        <h4>Adding Nodes</h4>

        <ol>
          <li>
            <p>
              <strong>Drag node types</strong> from the left sidebar onto the canvas.
            </p>
          </li>
          <li>
            <p>
              <strong>Position nodes</strong> on the canvas to create a logical flow.
            </p>
          </li>
          <li>
            <p>
              <strong>Start with a trigger node</strong> - Every workflow needs a trigger to start execution.
            </p>
          </li>
        </ol>

        <div className="bg-gray-800 p-4 rounded-md my-6">
          <h4 className="text-green-400 mt-0">Best Practice</h4>
          <p className="mb-0">
            Organize your nodes in a top-to-bottom or left-to-right flow to make the workflow easier to understand.
          </p>
        </div>

        <h4>Connecting Nodes</h4>

        <ol>
          <li>
            <p>
              <strong>Connect nodes</strong> by clicking and dragging from a source handle (usually at the bottom of a
              node) to a target handle (usually at the top of another node).
            </p>
          </li>
          <li>
            <p>
              <strong>For condition nodes</strong>, you'll see two output handles labeled "True" and "False". Connect
              these to different nodes based on the condition result.
            </p>
          </li>
        </ol>

        <h4>Configuring Nodes</h4>

        <ol>
          <li>
            <p>
              <strong>Click on a node</strong> to select it and open its properties panel.
            </p>
          </li>
          <li>
            <p>
              <strong>Configure the node's properties</strong> according to its type:
            </p>
            <ul>
              <li>
                <strong>Trigger Nodes</strong>: Set trigger type (cron, webhook, event) and related settings
              </li>
              <li>
                <strong>Agent Nodes</strong>: Configure agent name, description, instructions, and model
              </li>
              <li>
                <strong>Condition Nodes</strong>: Define the condition expression
              </li>
              <li>
                <strong>Action Nodes</strong>: Set action type and related parameters
              </li>
              <li>
                <strong>Data Nodes</strong>: Configure data source and query parameters
              </li>
            </ul>
          </li>
        </ol>

        <h3>Saving Your Workflow</h3>

        <ol>
          <li>
            <p>
              <strong>Click the "Save" button</strong> in the toolbar to save your workflow.
            </p>
          </li>
          <li>
            <p>Your workflow will be saved to Supabase and will appear in your workflows list.</p>
          </li>
        </ol>

        <h3>Example: Twitter to Email Workflow</h3>

        <p>Let's create a simple workflow that monitors Twitter for specific hashtags and sends email notifications:</p>

        <ol>
          <li>
            <p>
              <strong>Add a Trigger Node</strong> (Cron type) to check Twitter periodically
            </p>
          </li>
          <li>
            <p>
              <strong>Add an Agent Node</strong> (Twitter agent) to search for tweets with specific hashtags
            </p>
          </li>
          <li>
            <p>
              <strong>Add a Condition Node</strong> to check if any relevant tweets were found
            </p>
          </li>
          <li>
            <p>
              <strong>Add an Agent Node</strong> (Email agent) on the "True" path to compose an email
            </p>
          </li>
          <li>
            <p>
              <strong>Add an Action Node</strong> (Email action) to send the email
            </p>
          </li>
          <li>
            <p>
              <strong>Add a Data Node</strong> (Google Drive) to save the tweet data
            </p>
          </li>
        </ol>

        <h3>Next Steps</h3>

        <p>Now that you've created a workflow, you can:</p>

        <ul>
          <li>
            <a href="/docs/command-center/execution">Execute your workflow</a> to test it
          </li>
          <li>
            <a href="/docs/command-center/debugging">Debug your workflow</a> if you encounter issues
          </li>
          <li>
            <a href="/docs/examples/twitter-email">View a complete Twitter to Email example</a> for more details
          </li>
        </ul>
      </div>
    </DocsLayout>
  )
}
