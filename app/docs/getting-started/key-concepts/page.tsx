export default function KeyConceptsPage() {
  return (
    <div className="prose prose-invert max-w-none">
      <h2>Key Concepts</h2>

      <p>
        This page explains the fundamental concepts and terminology used throughout The Borg Framework. Understanding
        these concepts will help you make the most of the framework's capabilities.
      </p>

      <h3>Agents</h3>

      <p>
        <strong>Agents</strong> are the core building blocks of The Borg Framework. An agent is an AI entity with
        specific capabilities, knowledge, and personality traits. Agents can perform tasks, answer questions, and
        interact with users and other agents.
      </p>

      <p>Each agent has:</p>

      <ul>
        <li>
          <strong>Name and Description</strong>: Identifies the agent and describes its purpose
        </li>
        <li>
          <strong>System Prompt</strong>: Defines the agent's behavior, knowledge, and constraints
        </li>
        <li>
          <strong>Capabilities</strong>: Specific functions the agent can perform
        </li>
        <li>
          <strong>Memory</strong>: Information the agent can recall from past interactions
        </li>
        <li>
          <strong>Tools</strong>: External functions the agent can use to accomplish tasks
        </li>
      </ul>

      <h3>Teams</h3>

      <p>
        <strong>Teams</strong> are collections of agents that work together to accomplish complex tasks. Teams enable
        agents to collaborate, share information, and delegate subtasks based on each agent's specialization.
      </p>

      <p>Teams include:</p>

      <ul>
        <li>
          <strong>Team Composition</strong>: The agents that make up the team
        </li>
        <li>
          <strong>Coordination Strategy</strong>: How agents communicate and collaborate
        </li>
        <li>
          <strong>Team Objective</strong>: The overall goal the team is working toward
        </li>
        <li>
          <strong>Shared Memory</strong>: Information accessible to all team members
        </li>
      </ul>

      <h3>Workflows</h3>

      <p>
        <strong>Workflows</strong> are sequences of actions that can be automated using agents. Workflows define the
        flow of information and control between different steps, allowing complex processes to be executed
        automatically.
      </p>

      <p>Workflows consist of:</p>

      <ul>
        <li>
          <strong>Nodes</strong>: Individual steps in the workflow (agents, conditions, actions, etc.)
        </li>
        <li>
          <strong>Edges</strong>: Connections between nodes that define the flow of execution
        </li>
        <li>
          <strong>Triggers</strong>: Events that initiate the workflow
        </li>
        <li>
          <strong>Data Flow</strong>: How information passes between nodes
        </li>
      </ul>

      <h3>Self-Evolution</h3>

      <p>
        <strong>Self-Evolution</strong> is the ability of agents to learn and improve over time based on interactions
        and feedback. The Borg Framework includes mechanisms for agents to analyze their performance, identify areas for
        improvement, and update their capabilities accordingly.
      </p>

      <p>Self-Evolution includes:</p>

      <ul>
        <li>
          <strong>Performance Monitoring</strong>: Tracking agent effectiveness
        </li>
        <li>
          <strong>Feedback Integration</strong>: Incorporating user feedback
        </li>
        <li>
          <strong>Capability Enhancement</strong>: Improving agent skills and knowledge
        </li>
        <li>
          <strong>Adaptation</strong>: Adjusting to changing requirements and environments
        </li>
      </ul>

      <h3>RAG (Retrieval-Augmented Generation)</h3>

      <p>
        <strong>RAG</strong> enhances agent responses by incorporating external knowledge. Instead of relying solely on
        the knowledge embedded in the AI model, RAG allows agents to retrieve relevant information from documents,
        databases, or other sources.
      </p>

      <p>RAG components include:</p>

      <ul>
        <li>
          <strong>Knowledge Base</strong>: The collection of documents and information
        </li>
        <li>
          <strong>Retrieval System</strong>: Finds relevant information based on queries
        </li>
        <li>
          <strong>Generation</strong>: Creates responses that incorporate the retrieved information
        </li>
        <li>
          <strong>Indexing</strong>: Organizes information for efficient retrieval
        </li>
      </ul>

      <h3>Memory</h3>

      <p>
        <strong>Memory</strong> allows agents to recall information from past interactions. The Borg Framework supports
        different types of memory to enable agents to maintain context and build on previous conversations.
      </p>

      <p>Memory types include:</p>

      <ul>
        <li>
          <strong>Short-term Memory</strong>: Recent conversation history
        </li>
        <li>
          <strong>Long-term Memory</strong>: Persistent information stored across sessions
        </li>
        <li>
          <strong>Episodic Memory</strong>: Specific interactions or events
        </li>
        <li>
          <strong>Semantic Memory</strong>: General knowledge and concepts
        </li>
      </ul>

      <h3>Browser Control</h3>

      <p>
        <strong>Browser Control</strong> enables agents to interact with web interfaces, allowing them to navigate
        websites, fill forms, extract information, and perform actions that would typically require human interaction
        with a web browser.
      </p>

      <h3>Autopilot</h3>

      <p>
        <strong>Autopilot</strong> mode allows agents to operate autonomously, making decisions and taking actions
        without direct human intervention. Users can observe the agent's actions and intervene if necessary.
      </p>

      <div className="bg-gray-800 p-4 rounded-lg mt-6">
        <h4 className="text-green-500 mt-0">Ready to get started?</h4>
        <p className="mb-0">
          Now that you understand the key concepts, continue to the{" "}
          <a href="/docs/getting-started/quick-start" className="text-green-500 hover:text-green-400">
            Quick Start Guide
          </a>{" "}
          to create your first agent.
        </p>
      </div>
    </div>
  )
}
