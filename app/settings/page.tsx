"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DatabaseInitializer from "@/components/database-initializer"
import { Header } from "@/components/navigation/header"
import { isDemoMode } from "@/lib/supabase-client"

export default function SettingsPage() {
  const [grokApiKey, setGrokApiKey] = useState<string>("")
  const [supabaseUrl, setSupabaseUrl] = useState<string>("")
  const [supabaseKey, setSupabaseKey] = useState<string>("")
  const [defaultInstructions, setDefaultInstructions] = useState<string>(
    "You are a helpful AI assistant that evolves to better serve user needs.",
  )
  const [temperature, setTemperature] = useState<number>(0.7)
  const [maxTokens, setMaxTokens] = useState<number>(4000)
  const [theme, setTheme] = useState<string>("dark")
  const [accentColor, setAccentColor] = useState<string>("#00FF9D")
  const [autoSave, setAutoSave] = useState<boolean>(true)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [isDemo, setIsDemo] = useState<boolean>(false)

  useEffect(() => {
    // Check if we're in demo mode
    setIsDemo(isDemoMode())

    // Load settings from localStorage if available
    try {
      const savedSettings = localStorage.getItem("settings")
      if (savedSettings) {
        const settings = JSON.parse(savedSettings)
        setGrokApiKey(settings.grokApiKey || "")
        setSupabaseUrl(settings.supabaseUrl || "")
        setSupabaseKey(settings.supabaseKey || "")
        setDefaultInstructions(
          settings.defaultInstructions || "You are a helpful AI assistant that evolves to better serve user needs.",
        )
        setTemperature(settings.temperature || 0.7)
        setMaxTokens(settings.maxTokens || 4000)
        setTheme(settings.theme || "dark")
        setAccentColor(settings.accentColor || "#00FF9D")
        setAutoSave(settings.autoSave !== undefined ? settings.autoSave : true)
      }
    } catch (error) {
      console.error("Error loading settings:", error)
    }
  }, [])

  const handleSave = async () => {
    setIsSaving(true)

    // Simulate saving settings
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Save settings to localStorage for now
    try {
      localStorage.setItem(
        "settings",
        JSON.stringify({
          grokApiKey,
          supabaseUrl,
          supabaseKey,
          defaultInstructions,
          temperature,
          maxTokens,
          theme,
          accentColor,
          autoSave,
        }),
      )
    } catch (error) {
      console.error("Error saving settings:", error)
    }

    setIsSaving(false)
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      <Header />

      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        {isDemo && (
          <div className="bg-blue-900 text-white p-4 rounded-md mb-6">
            <p className="font-medium">Demo Mode Active</p>
            <p className="text-sm mt-1">
              You're running in demo mode. Some features like database initialization will be simulated.
            </p>
          </div>
        )}

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="grid gap-6">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h2 className="text-xl font-medium mb-4">General Settings</h2>
                <p className="text-gray-400">Configure general application settings.</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="account">
            <div className="grid gap-6">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h2 className="text-xl font-medium mb-4">Account Settings</h2>
                <p className="text-gray-400">Manage your account details and preferences.</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="database">
            <div className="grid gap-6">
              <DatabaseInitializer />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
