"use client"

import DocsLayout from "@/components/documentation/docs-layout"

export default function TwitterEmailExamplePage() {
  return (
    <DocsLayout>
      <div className="prose prose-invert max-w-none">
        <h2>Twitter to Email Notification Example</h2>

        <p>
          This example demonstrates how to create a workflow that monitors Twitter for specific hashtags and sends email
          notifications when relevant tweets are found. The workflow also saves the tweets to Google Drive for further
          analysis.
        </p>

        <h3>Overview</h3>

        <p>The workflow consists of the following steps:</p>

        <ol>
          <li>A trigger node runs on a schedule to check Twitter</li>
          <li>A Twitter agent searches for tweets with specific hashtags</li>
          <li>A condition node checks if any relevant tweets were found</li>
          <li>If tweets are found, an email agent composes a notification</li>
          <li>An email action node sends the notification</li>
          <li>A Google Drive action node saves the tweet data</li>
        </ol>

        <div className="bg-gray-800 p-4 rounded-md my-6">
          <h4 className="text-green-400 mt-0">Prerequisites</h4>
          <ul className="mb-0">
            <li>Twitter API credentials</li>
            <li>Email service configuration</li>
            <li>Google Drive API credentials</li>
          </ul>
        </div>

        <h3>Step 1: Create a New Workflow</h3>

        <ol>
          <li>Navigate to the Command Center</li>
          <li>Click "Create Workflow"</li>
          <li>Name your workflow "Twitter to Email Notification"</li>
        </ol>

        <h3>Step 2: Add a Trigger Node</h3>

        <ol>
          <li>Drag a Trigger node onto the canvas</li>
          <li>Click on the node to open its properties</li>
          <li>Set the Trigger Type to "Cron"</li>
          <li>Set the Cron Expression to "0 * * * *" (runs hourly)</li>
        </ol>

        <div className="bg-gray-800 p-4 rounded-md my-4">
          <h4 className="text-blue-400 mt-0">Cron Expression</h4>
          <p className="mb-0">
            The cron expression "0 * * * *" means "at minute 0 of every hour". You can adjust this based on how
            frequently you want to check Twitter.
          </p>
        </div>

        <h3>Step 3: Add a Twitter Agent Node</h3>

        <ol>
          <li>Drag an Agent node onto the canvas</li>
          <li>Connect the Trigger node to the Agent node</li>
          <li>Click on the Agent node to open its properties</li>
          <li>Set the Name to "Twitter Monitor"</li>
          <li>Set the Description to "Monitors Twitter for specific hashtags"</li>
          <li>
            Set the Instructions to:
            <pre className="bg-gray-900 p-3 rounded-md">
              You are a Twitter monitoring agent. Search for tweets containing the hashtags #AINews, #MachineLearning,
              or #DataScience. Return only tweets from verified accounts with at least 100 likes. Format the results as
              a list with the tweet text, author, and link.
            </pre>
          </li>
          <li>Set the Model to "Grok-1"</li>
        </ol>

        <h3>Step 4: Add a Condition Node</h3>

        <ol>
          <li>Drag a Condition node onto the canvas</li>
          <li>Connect the Twitter Agent node to the Condition node</li>
          <li>Click on the Condition node to open its properties</li>
          <li>Set the Condition to "tweets.length &gt; 0"</li>
          <li>Set the True Label to "Tweets Found"</li>
          <li>Set the False Label to "No Tweets"</li>
        </ol>

        <h3>Step 5: Add an Email Agent Node</h3>

        <ol>
          <li>Drag an Agent node onto the canvas</li>
          <li>Connect the "True" output of the Condition node to the Agent node</li>
          <li>Click on the Agent node to open its properties</li>
          <li>Set the Name to "Email Composer"</li>
          <li>Set the Description to "Composes email notifications for tweets"</li>
          <li>
            Set the Instructions to:
            <pre className="bg-gray-900 p-3 rounded-md">
              You are an email composition agent. Create a concise email summarizing the tweets provided. Format the
              email with a clear subject line, greeting, summary paragraph, and a list of the tweets with links. Sign
              the email as "The Borg Framework".
            </pre>
          </li>
          <li>Set the Model to "Grok-1"</li>
        </ol>

        <h3>Step 6: Add an Email Action Node</h3>

        <ol>
          <li>Drag an Action node onto the canvas</li>
          <li>Connect the Email Agent node to the Action node</li>
          <li>Click on the Action node to open its properties</li>
          <li>Set the Action Type to "Email"</li>
          <li>Set the Recipient to the email address where you want to receive notifications</li>
          <li>Set the Subject to "Twitter AI News Update"</li>
          <li>Leave the Template blank (the Email Agent will provide the content)</li>
        </ol>

        <h3>Step 7: Add a Google Drive Action Node</h3>

        <ol>
          <li>Drag an Action node onto the canvas</li>
          <li>Connect the Email Action node to this new Action node</li>
          <li>Click on the Action node to open its properties</li>
          <li>Set the Action Type to "Google Drive"</li>
          <li>Configure the Google Drive settings (folder ID, file name template, etc.)</li>
        </ol>

        <h3>Step 8: Save and Execute the Workflow</h3>

        <ol>
          <li>Click the "Save" button to save your workflow</li>
          <li>Click the "Execute" button to test the workflow</li>
          <li>Monitor the execution in the logs panel</li>
        </ol>

        <div className="bg-gray-800 p-4 rounded-md my-6">
          <h4 className="text-green-400 mt-0">Pro Tip</h4>
          <p className="mb-0">
            You can add a Data node before the Google Drive action to store the tweets in your Supabase database for
            historical tracking and analysis.
          </p>
        </div>

        <h3>Complete Workflow Diagram</h3>

        <div className="bg-gray-900 p-4 rounded-md my-4 text-center">
          <p className="italic text-gray-400">
            [Workflow Diagram: Trigger → Twitter Agent → Condition → Email Agent → Email Action → Google Drive Action]
          </p>
        </div>

        <h3>Next Steps</h3>

        <p>Now that you've created this workflow, you can:</p>

        <ul>
          <li>Customize the hashtags and filtering criteria in the Twitter Agent</li>
          <li>Modify the email format in the Email Agent</li>
          <li>Add more actions, such as posting a summary to Slack</li>
          <li>Set up a more complex condition to filter tweets based on content</li>
        </ul>

        <p>For more examples, check out:</p>

        <ul>
          <li>
            <a href="/docs/examples/data-processing">Data Processing Pipeline</a>
          </li>
          <li>
            <a href="/docs/examples/content-curation">Content Curation</a>
          </li>
          <li>
            <a href="/docs/examples/monitoring">Monitoring System</a>
          </li>
        </ul>
      </div>
    </DocsLayout>
  )
}
