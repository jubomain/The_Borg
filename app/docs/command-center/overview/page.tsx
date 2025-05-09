import DocsLayout from "@/components/documentation/docs-layout"

export default function CommandCenterOverviewPage() {
  return (
    <DocsLayout>
      <div className="prose prose-invert max-w-none">
        <h2>Command Center Overview</h2>

        <p>
          The Command Center is the central hub for creating, managing, and executing bot workflows in the Borg
          Framework. It provides a visual, drag-and-drop interface for designing complex workflows that connect multiple
          bots and services.
        </p>

        <h3>Key Features</h3>

        <ul>
          <li>
            <strong>Visual Workflow Builder</strong> - Create workflows using an intuitive drag-and-drop interface
          </li>
          <li>
            <strong>Multiple Node Types</strong> - Use specialized nodes for triggers, agents, conditions, actions, and
            data operations
          </li>
          <li>
            <strong>Real-time Execution</strong> - Execute workflows and watch them run in real-time with visual
            feedback
          </li>
          <li>
            <strong>Execution Logs</strong> - Monitor workflow execution with detailed logs
          </li>
          <li>
            <strong>State Persistence</strong> - Save workflow state to Supabase for reliable execution
          </li>
        </ul>

        <h3>Command Center Interface</h3>

        <p>The Command Center interface consists of several key components:</p>

        <ol>
          <li>
            <strong>Node Palette</strong> - The left sidebar containing different node types that can be dragged onto
            the canvas
          </li>
          <li>
            <strong>Canvas</strong> - The main area where you build your workflow by placing and connecting nodes
          </li>
          <li>
            <strong>Properties Panel</strong> - Appears when a node is selected, allowing you to configure its
            properties
          </li>
          <li>
            <strong>Execution Panel</strong> - Shows logs and status information during workflow execution
          </li>
          <li>
            <strong>Toolbar</strong> - Contains actions like Save, Execute, and Stop
          </li>
        </ol>

        <h3>Getting Started</h3>

        <p>To get started with the Command Center:</p>

        <ol>
          <li>Navigate to the Command Center from the dashboard</li>
          <li>Click "Create Workflow" to start a new workflow</li>
          <li>Drag nodes from the palette onto the canvas</li>
          <li>Connect nodes by dragging from one node's handle to another</li>
          <li>Configure each node by clicking on it and setting its properties</li>
          <li>Save your workflow</li>
          <li>Execute the workflow to test it</li>
        </ol>

        <div className="bg-gray-800 p-4 rounded-md my-6">
          <h4 className="text-green-400 mt-0">Pro Tip</h4>
          <p className="mb-0">
            Start with a Trigger node to define when your workflow should run. Every workflow needs at least one trigger
            to start execution.
          </p>
        </div>

        <h3>Next Steps</h3>

        <p>Now that you understand the basics of the Command Center, explore the following topics to learn more:</p>

        <ul>
          <li>
            <a href="/docs/command-center/creating-workflows">Creating Workflows</a> - Learn how to create and save
            workflows
          </li>
          <li>
            <a href="/docs/command-center/node-types">Node Types</a> - Detailed information about each node type
          </li>
          <li>
            <a href="/docs/command-center/connections">Connections</a> - How to connect nodes and manage data flow
          </li>
          <li>
            <a href="/docs/command-center/execution">Execution</a> - Running and monitoring workflows
          </li>
        </ul>
      </div>
    </DocsLayout>
  )
}
