export default function QuickStartPage() {
  return (
    <div className="prose prose-invert max-w-none">
      <h2>Quick Start Guide</h2>

      <p>
        This guide will help you get started with The Borg Framework in just a few minutes. You'll learn how to create
        your first agent, test it in the playground, and start building a simple workflow.
      </p>

      <h3>Step 1: Configure API Keys</h3>

      <p>Before you can use all features of The Borg Framework, you need to configure your API keys:</p>

      <ol>
        <li>
          Navigate to the <strong>Settings</strong> page from the sidebar
        </li>
        <li>Enter your Groq API key in the appropriate field</li>
        <li>Configure your Supabase credentials if you want to enable persistence</li>
        <li>
          Click <strong>Save</strong> to apply your changes
        </li>
      </ol>

      <div className="bg-gray-800 p-4 rounded-lg">
        <p className="mb-0">
          <strong>Note:</strong> If you don't have these API keys yet, refer to the{" "}
          <a href="/docs/getting-started/installation" className="text-green-500 hover:text-green-400">
            Installation Guide
          </a>{" "}
          for instructions on how to obtain them.
        </p>
      </div>

      <h3>Step 2: Create Your First Agent</h3>

      <p>Now, let's create a simple agent that can answer questions about technology:</p>

      <ol>
        <li>
          Navigate to the <strong>Agent Studio</strong> from the sidebar
        </li>
        <li>
          Click the <strong>Create New Agent</strong> button
        </li>
        <li>
          Fill in the basic details:
          <ul>
            <li>
              <strong>Name:</strong> Tech Expert
            </li>
            <li>
              <strong>Description:</strong> An agent that specializes in answering questions about technology
            </li>
          </ul>
        </li>
        <li>
          In the <strong>System Prompt</strong> section, enter:
          <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
            <code>
              You are a technology expert who provides clear, accurate information about various tech topics. You
              specialize in explaining complex concepts in simple terms. When you don't know something, you admit it
              rather than making up information. You provide balanced perspectives on controversial tech topics.
            </code>
          </pre>
        </li>
        <li>
          Click <strong>Save Agent</strong> to create your agent
        </li>
      </ol>

      <h3>Step 3: Test Your Agent</h3>

      <p>Let's test your new agent in the Playground:</p>

      <ol>
        <li>
          Navigate to the <strong>Playground</strong> from the sidebar
        </li>
        <li>Select your "Tech Expert" agent from the dropdown menu</li>
        <li>Type a question like "What is quantum computing?" in the input field</li>
        <li>Press Enter or click the Send button to submit your question</li>
        <li>Observe how your agent responds with an explanation of quantum computing</li>
      </ol>

      <p>
        Try asking a few more questions to see how your agent handles different topics. If you notice any issues with
        the responses, you can go back to the Agent Studio to refine the system prompt.
      </p>

      <h3>Step 4: Create a Simple Workflow</h3>

      <p>Now, let's create a simple workflow that uses your agent:</p>

      <ol>
        <li>
          Navigate to the <strong>Command Center</strong> from the sidebar
        </li>
        <li>
          Click <strong>Create New Workflow</strong>
        </li>
        <li>Give your workflow a name, such as "Tech Question Workflow"</li>
        <li>
          From the node palette, drag a <strong>Trigger Node</strong> onto the canvas
        </li>
        <li>Configure the trigger to activate on a specific keyword or schedule</li>
        <li>
          Drag an <strong>Agent Node</strong> onto the canvas and select your "Tech Expert" agent
        </li>
        <li>
          Connect the Trigger Node to the Agent Node by dragging from the output port of the trigger to the input port
          of the agent
        </li>
        <li>
          Add an <strong>Action Node</strong> that sends the agent's response to a destination (e.g., email or Slack)
        </li>
        <li>Connect the Agent Node to the Action Node</li>
        <li>
          Click <strong>Save Workflow</strong>
        </li>
      </ol>

      <h3>Step 5: Enable Self-Evolution (Optional)</h3>

      <p>To allow your agent to learn and improve over time:</p>

      <ol>
        <li>
          Navigate to the <strong>Self Evolution</strong> page from the sidebar
        </li>
        <li>Select your "Tech Expert" agent</li>
        <li>
          Toggle the <strong>Enable Self-Evolution</strong> switch to ON
        </li>
        <li>Configure the learning parameters according to your preferences</li>
        <li>
          Click <strong>Save</strong> to apply the changes
        </li>
      </ol>

      <p>
        With self-evolution enabled, your agent will analyze its performance and make improvements to its capabilities
        over time.
      </p>

      <h3>Next Steps</h3>

      <p>
        Congratulations! You've created your first agent and workflow with The Borg Framework. Here are some suggestions
        for what to explore next:
      </p>

      <ul>
        <li>Create more specialized agents for different domains</li>
        <li>Build a team of agents that can collaborate on complex tasks</li>
        <li>Explore the Memory & RAG features to enhance your agents with external knowledge</li>
        <li>Try the Browser Control capabilities to automate web interactions</li>
        <li>Experiment with more complex workflows involving multiple agents and conditions</li>
      </ul>

      <p>For more detailed information on these topics, explore the rest of the documentation.</p>

      <div className="bg-gray-800 p-4 rounded-lg mt-6">
        <h4 className="text-green-500 mt-0">Need help?</h4>
        <p className="mb-0">
          If you encounter any issues or have questions, check out the{" "}
          <a href="/docs/troubleshooting" className="text-green-500 hover:text-green-400">
            Troubleshooting Guide
          </a>{" "}
          or visit the{" "}
          <a href="/help" className="text-green-500 hover:text-green-400">
            Help & Support
          </a>{" "}
          page.
        </p>
      </div>
    </div>
  )
}
