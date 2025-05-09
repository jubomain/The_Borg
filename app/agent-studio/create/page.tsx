"use client"

import AgentStudio from "@/components/agent-studio"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function CreateAgentPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-gray-800 p-4">
        <div className="flex items-center">
          <Link href="/agent-studio">
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Agent Studio
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Create New Agent</h1>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <AgentStudio />
      </div>
    </div>
  )
}
