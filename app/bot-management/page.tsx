"use client"

import { useState } from "react"
import Header from "@/components/navigation/header"
import StrategyCreator from "@/components/bot-creation/strategy-creator"
import TeamCreator from "@/components/bot-creation/team-creator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Cpu, Users } from "lucide-react"

export default function BotManagementPage() {
  const [activeTab, setActiveTab] = useState("strategies")

  return (
    <div className="flex flex-col h-full">
      <Header title="Bot Management" />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="strategies" onValueChange={setActiveTab} value={activeTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="strategies" className="flex items-center">
                <Cpu className="w-4 h-4 mr-2" />
                Bot Strategies
              </TabsTrigger>
              <TabsTrigger value="teams" className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Bot Teams
              </TabsTrigger>
            </TabsList>
            <TabsContent value="strategies">
              <StrategyCreator />
            </TabsContent>
            <TabsContent value="teams">
              <TeamCreator />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
