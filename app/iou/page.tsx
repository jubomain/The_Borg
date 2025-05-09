"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import RepositoryAnalyzer from "@/components/iou/repository-analyzer"
import AIDiscussionPanel from "@/components/iou/ai-discussion-panel"
import SystemHealthDashboard from "@/components/iou/system-health-dashboard"
import TrendingRepositories from "@/components/iou/trending-repositories"
import { Cpu, GitBranch, Activity, TrendingUp } from "lucide-react"
import Preloader from "@/components/preloader"

export default function IOUPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <Preloader minDisplayTime={3000} />
  }

  return (
    <div className="container mx-auto p-4 space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Optimizations, Implementations & Upgrades</h1>
      </div>

      <p className="text-gray-400">
        This module enables the BORG framework to continuously evolve by analyzing external repositories, implementing
        useful upgrades, and integrating new tools through AI-powered evaluation.
      </p>

      <Tabs defaultValue="repository-analyzer" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="repository-analyzer" className="flex items-center">
            <GitBranch className="w-4 h-4 mr-2" />
            Repository Analyzer
          </TabsTrigger>
          <TabsTrigger value="ai-discussion" className="flex items-center">
            <Cpu className="w-4 h-4 mr-2" />
            AI Discussion
          </TabsTrigger>
          <TabsTrigger value="system-health" className="flex items-center">
            <Activity className="w-4 h-4 mr-2" />
            System Health
          </TabsTrigger>
          <TabsTrigger value="trending-repos" className="flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Trending Repositories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="repository-analyzer" className="space-y-4">
          <RepositoryAnalyzer />
        </TabsContent>

        <TabsContent value="ai-discussion" className="space-y-4">
          <AIDiscussionPanel />
        </TabsContent>

        <TabsContent value="system-health" className="space-y-4">
          <SystemHealthDashboard />
        </TabsContent>

        <TabsContent value="trending-repos" className="space-y-4">
          <TrendingRepositories />
        </TabsContent>
      </Tabs>
    </div>
  )
}
