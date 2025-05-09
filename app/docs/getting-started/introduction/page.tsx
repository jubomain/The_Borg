export default function IntroductionPage() {
  return (
    <div className="prose prose-invert max-w-none">
      <h2>Introduction to The Borg Framework</h2>

      <p>
        The Borg Framework is a powerful, self-evolving agent orchestration system designed to help developers create,
        manage, and deploy intelligent AI agents that can learn and improve over time. Built with modern web
        technologies and a focus on extensibility, The Borg Framework provides a comprehensive solution for AI agent
        development.
      </p>

      <h3>Core Philosophy</h3>

      <p>
        The core philosophy behind The Borg Framework is <strong>collective intelligence</strong>. Just as the name
        suggests, the framework is inspired by the concept of interconnected entities working together to achieve goals
        that would be impossible for individual components.
      </p>

      <p>Our framework is built on three fundamental principles:</p>

      <ul>
        <li>
          <strong>Self-Evolution</strong>: Agents should be able to learn and improve from their interactions,
          continuously adapting to new challenges and requirements.
        </li>
        <li>
          <strong>Collaboration</strong>: Complex problems are best solved through the collaboration of specialized
          agents, each contributing their unique capabilities.
        </li>
        <li>
          <strong>Extensibility</strong>: The framework should be easily extensible, allowing developers to add new
          capabilities and integrate with external systems.
        </li>
      </ul>

      <h3>Key Features</h3>

      <ul>
        <li>
          <strong>Agent Studio</strong>: Create and customize AI agents with specific capabilities, knowledge, and
          personalities.
        </li>
        <li>
          <strong>Team Builder</strong>: Combine multiple agents into teams that can collaborate to solve complex
          problems.
        </li>
        <li>
          <strong>Command Center</strong>: Design and manage workflows that automate sequences of actions across
          multiple agents.
        </li>
        <li>
          <strong>Self-Evolution Engine</strong>: Enable agents to learn and improve based on interactions and feedback.
        </li>
        <li>
          <strong>Memory & RAG</strong>: Enhance agent responses with external knowledge through Retrieval-Augmented
          Generation.
        </li>
        <li>
          <strong>Browser Control</strong>: Allow agents to interact with web interfaces for data collection and
          automation.
        </li>
        <li>
          <strong>Autopilot Mode</strong>: Let agents operate autonomously while you observe their actions and
          decision-making.
        </li>
      </ul>

      <h3>Use Cases</h3>

      <p>The Borg Framework is designed to support a wide range of use cases, including:</p>

      <ul>
        <li>Customer support automation</li>
        <li>Content creation and curation</li>
        <li>Data analysis and reporting</li>
        <li>Research assistance</li>
        <li>Process automation</li>
        <li>Personalized learning</li>
        <li>Decision support systems</li>
      </ul>

      <h3>Getting Started</h3>

      <p>
        To get started with The Borg Framework, we recommend following our{" "}
        <a href="/docs/getting-started/quick-start" className="text-green-500 hover:text-green-400">
          Quick Start Guide
        </a>
        , which will walk you through the process of setting up your first agent and creating a simple workflow.
      </p>

      <p>
        If you're new to AI agent development, you might also want to check out our{" "}
        <a href="/docs/getting-started/key-concepts" className="text-green-500 hover:text-green-400">
          Key Concepts
        </a>{" "}
        page, which explains the fundamental concepts and terminology used throughout the framework.
      </p>

      <div className="bg-gray-800 p-4 rounded-lg mt-6">
        <h4 className="text-green-500 mt-0">Ready to dive in?</h4>
        <p className="mb-0">
          Continue to the{" "}
          <a href="/docs/getting-started/installation" className="text-green-500 hover:text-green-400">
            Installation Guide
          </a>{" "}
          to set up The Borg Framework on your system.
        </p>
      </div>
    </div>
  )
}
