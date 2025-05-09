import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bot, Plus } from "lucide-react"
import Link from "next/link"

export default function AgentStudioPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Agent Studio</h1>
        <Link href="/agent-studio/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create New Agent
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="my-agents" className="w-full">
        <TabsList>
          <TabsTrigger value="my-agents">My Agents</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
        </TabsList>
        <TabsContent value="my-agents">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Agent {i}</CardTitle>
                    <Bot className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardDescription>Created 2 days ago</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    This agent helps with task automation and data processing.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      Run
                    </Button>
                    <Button variant="outline" size="sm" className="ml-auto">
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Agent Templates</CardTitle>
              <CardDescription>Start with pre-built agent templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  "Research Assistant",
                  "Data Analyst",
                  "Content Creator",
                  "Customer Support",
                  "Code Assistant",
                  "Task Manager",
                ].map((template) => (
                  <Card key={template}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{template}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        A pre-configured agent template for {template.toLowerCase()} tasks.
                      </p>
                      <Button size="sm">Use Template</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="marketplace">
          <Card>
            <CardHeader>
              <CardTitle>Agent Marketplace</CardTitle>
              <CardDescription>Discover and install community-built agents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full bg-muted/20 rounded-md flex items-center justify-center">
                <p className="text-muted">Marketplace coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
