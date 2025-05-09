export default function InstallationPage() {
  return (
    <div className="prose prose-invert max-w-none">
      <h2>Installation Guide</h2>

      <p>
        This guide will walk you through the process of installing and configuring The Borg Framework on your system.
      </p>

      <h3>Prerequisites</h3>

      <p>Before you begin, make sure you have the following installed on your system:</p>

      <ul>
        <li>Node.js (v16 or later)</li>
        <li>npm (v7 or later) or yarn</li>
        <li>Git</li>
      </ul>

      <h3>Installation Steps</h3>

      <h4>1. Clone the Repository</h4>

      <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code>git clone https://github.com/your-organization/borg-framework.git cd borg-framework</code>
      </pre>

      <h4>2. Install Dependencies</h4>

      <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code>npm install # or yarn install</code>
      </pre>

      <h4>3. Configure Environment Variables</h4>

      <p>
        Create a <code>.env.local</code> file in the root directory of the project and add the following environment
        variables:
      </p>

      <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code>
          NEXT_PUBLIC_SUPABASE_URL=your_supabase_url NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
          SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key GROQ_API_KEY=your_groq_api_key
        </code>
      </pre>

      <h4>4. Start the Development Server</h4>

      <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code>npm run dev # or yarn dev</code>
      </pre>

      <p>
        The development server will start at <code>http://localhost:3000</code>. You can now access The Borg Framework
        in your browser.
      </p>

      <h3>Setting Up Supabase</h3>

      <p>The Borg Framework uses Supabase for database storage and authentication. To set up Supabase:</p>

      <ol>
        <li>
          Create a new project on{" "}
          <a
            href="https://supabase.com"
            className="text-green-500 hover:text-green-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            Supabase
          </a>
        </li>
        <li>
          Go to the SQL Editor and run the migration scripts located in the <code>migrations</code> folder of the
          project
        </li>
        <li>Copy your Supabase URL and keys from the API settings page</li>
        <li>
          Add them to your <code>.env.local</code> file as shown above
        </li>
      </ol>

      <h3>Setting Up Groq</h3>

      <p>To enable AI capabilities, you'll need to set up a Groq API key:</p>

      <ol>
        <li>
          Create an account on{" "}
          <a
            href="https://groq.com"
            className="text-green-500 hover:text-green-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            Groq
          </a>
        </li>
        <li>Generate an API key from your dashboard</li>
        <li>
          Add it to your <code>.env.local</code> file as shown above
        </li>
      </ol>

      <h3>Troubleshooting</h3>

      <p>If you encounter any issues during installation, check the following:</p>

      <ul>
        <li>Make sure all environment variables are correctly set</li>
        <li>Ensure that your Supabase project has the correct tables and functions</li>
        <li>Check that your Groq API key is valid and has the necessary permissions</li>
      </ul>

      <p>
        For more detailed troubleshooting, refer to the{" "}
        <a href="/docs/troubleshooting" className="text-green-500 hover:text-green-400">
          Troubleshooting Guide
        </a>
        .
      </p>

      <div className="bg-gray-800 p-4 rounded-lg mt-6">
        <h4 className="text-green-500 mt-0">Next Steps</h4>
        <p className="mb-0">
          Now that you have installed The Borg Framework, continue to the{" "}
          <a href="/docs/getting-started/quick-start" className="text-green-500 hover:text-green-400">
            Quick Start Guide
          </a>{" "}
          to create your first agent.
        </p>
      </div>
    </div>
  )
}
