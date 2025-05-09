import { Command } from "@/components/ui/command"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Code, Rocket, Sparkles } from "lucide-react"
import Link from "next/link"

export default function DocsPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Documentation</h1>
        <Button variant="outline" asChild>
          <Link href="https://github.com/your-org/borg-framework" target="_blank">
            <Code className="mr-2 h-4 w-4" /> GitHub
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Learn the basics of the Borg Framework</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <Link href="/docs/getting-started/introduction" className="text-blue-500 hover:underline">
                  Introduction
                </Link>
              </li>
              <li>
                <Link href="/docs/getting-started/quickstart" className="text-blue-500 hover:underline">
                  Quickstart Guide
                </Link>
              </li>
              <li>
                <Link href="/docs/getting-started/installation" className="text-blue-500 hover:underline">
                  Installation
                </Link>
              </li>
              <li>
                <Link href="/docs/getting-started/key-concepts" className="text-blue-500 hover:underline">
                  Key Concepts
                </Link>
              </li>
            </ul>
            <Button variant="outline" className="mt-4 w-full" asChild>
              <Link href="/docs/getting-started">
                <Rocket className="mr-2 h-4 w-4" /> Get Started
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Reference</CardTitle>
            <CardDescription>Comprehensive API documentation</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <Link href="/docs/api-reference/overview" className="text-blue-500 hover:underline">
                  API Overview
                </Link>
              </li>
              <li>
                <Link href="/docs/api-reference/agents" className="text-blue-500 hover:underline">
                  Agents API
                </Link>
              </li>
              <li>
                <Link href="/docs/api-reference/workflows" className="text-blue-500 hover:underline">
                  Workflows API
                </Link>
              </li>
              <li>
                <Link href="/docs/api-reference/authentication" className="text-blue-500 hover:underline">
                  Authentication
                </Link>
              </li>
            </ul>
            <Button variant="outline" className="mt-4 w-full" asChild>
              <Link href="/docs/api-reference">
                <Code className="mr-2 h-4 w-4" /> Explore API
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Guides & Tutorials</CardTitle>
            <CardDescription>Step-by-step guides for common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <Link href="/docs/guides/creating-agents" className="text-blue-500 hover:underline">
                  Creating Agents
                </Link>
              </li>
              <li>
                <Link href="/docs/guides/building-workflows" className="text-blue-500 hover:underline">
                  Building Workflows
                </Link>
              </li>
              <li>
                <Link href="/docs/guides/agent-teams" className="text-blue-500 hover:underline">
                  Working with Agent Teams
                </Link>
              </li>
              <li>
                <Link href="/docs/guides/self-evolution" className="text-blue-500 hover:underline">
                  Self-Evolution Setup
                </Link>
              </li>
            </ul>
            <Button variant="outline" className="mt-4 w-full" asChild>
              <Link href="/docs/guides">
                <BookOpen className="mr-2 h-4 w-4" /> View Guides
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Command Center</CardTitle>
            <CardDescription>Learn about the Command Center</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <Link href="/docs/command-center/overview" className="text-blue-500 hover:underline">
                  Overview
                </Link>
              </li>
              <li>
                <Link href="/docs/command-center/creating-workflows" className="text-blue-500 hover:underline">
                  Creating Workflows
                </Link>
              </li>
              <li>
                <Link href="/docs/command-center/node-types" className="text-blue-500 hover:underline">
                  Node Types
                </Link>
              </li>
              <li>
                <Link href="/docs/command-center/execution" className="text-blue-500 hover:underline">
                  Workflow Execution
                </Link>
              </li>
            </ul>
            <Button variant="outline" className="mt-4 w-full" asChild>
              <Link href="/docs/command-center">
                <Command className="mr-2 h-4 w-4" /> Explore Command Center
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Advanced Features</CardTitle>
            <CardDescription>Explore advanced capabilities</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <Link href="/docs/advanced/self-evolution" className="text-blue-500 hover:underline">
                  Self-Evolution
                </Link>
              </li>
              <li>
                <Link href="/docs/advanced/memory-rag" className="text-blue-500 hover:underline">
                  Memory & RAG
                </Link>
              </li>
              <li>
                <Link href="/docs/advanced/browser-control" className="text-blue-500 hover:underline">
                  Browser Control
                </Link>
              </li>
              <li>
                <Link href="/docs/advanced/autopilot" className="text-blue-500 hover:underline">
                  Autopilot Mode
                </Link>
              </li>
            </ul>
            <Button variant="outline" className="mt-4 w-full" asChild>
              <Link href="/docs/advanced">
                <Sparkles className="mr-2 h-4 w-4" /> Advanced Features
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Examples</CardTitle>
            <CardDescription>Real-world examples and use cases</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <Link href="/docs/examples/twitter-email" className="text-blue-500 hover:underline">
                  Twitter Monitoring & Email Alerts
                </Link>
              </li>
              <li>
                <Link href="/docs/examples/content-creation" className="text-blue-500 hover:underline">
                  Automated Content Creation
                </Link>
              </li>
              <li>
                <Link href="/docs/examples/customer-support" className="text-blue-500 hover:underline">
                  Customer Support Bot
                </Link>
              </li>
              <li>
                <Link href="/docs/examples/data-analysis" className="text-blue-500 hover:underline">
                  Data Analysis Pipeline
                </Link>
              </li>
            </ul>
            <Button variant="outline" className="mt-4 w-full" asChild>
              <Link href="/docs/examples">
                <BookOpen className="mr-2 h-4 w-4" /> View Examples
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
