import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Code, Command, Cpu, Database, GitBranch, Layers, Rocket, Sparkles } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button variant="outline" asChild>
          <Link href="/command-center">
            <Command className="mr-2 h-4 w-4" /> Command Center
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agent Studio</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Create & Manage Agents</div>
            <p className="text-xs text-muted-foreground">Design intelligent agents for specific tasks</p>
            <Button variant="outline" className="mt-4 w-full" asChild>
              <Link href="/agent-studio">
                <Cpu className="mr-2 h-4 w-4" /> Open Studio
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workflow Builder</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Design Workflows</div>
            <p className="text-xs text-muted-foreground">Create automated sequences of agent actions</p>
            <Button variant="outline" className="mt-4 w-full" asChild>
              <Link href="/command-center">
                <Layers className="mr-2 h-4 w-4" /> Build Workflows
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Self-Evolution</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Evolve Your System</div>
            <p className="text-xs text-muted-foreground">Enable agents to improve themselves over time</p>
            <Button variant="outline" className="mt-4 w-full" asChild>
              <Link href="/self-evolution">
                <Rocket className="mr-2 h-4 w-4" /> Explore Evolution
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documentation</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Learn & Reference</div>
            <p className="text-xs text-muted-foreground">Comprehensive guides and API documentation</p>
            <Button variant="outline" className="mt-4 w-full" asChild>
              <Link href="/docs">
                <Code className="mr-2 h-4 w-4" /> View Docs
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Manage Data</div>
            <p className="text-xs text-muted-foreground">Configure and manage your database connection</p>
            <Button variant="outline" className="mt-4 w-full" asChild>
              <Link href="/database">
                <Database className="mr-2 h-4 w-4" /> Database Settings
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
