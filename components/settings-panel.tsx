"use client"

import type React from "react"

import { useState } from "react"
import { Save, RefreshCw, X } from "lucide-react"

interface SettingsProps {
  // Add props if needed
  onClose?: () => void
}

export default function SettingsPanel({ onClose }: SettingsProps) {
  const [generalSettings, setGeneralSettings] = useState({
    darkMode: true,
    notifications: true,
    autoSave: true,
  })

  const [apiSettings, setApiSettings] = useState({
    groqApiKey: process.env.GROQ_API_KEY || "",
    serperApiKey: process.env.SERPER_API_KEY || "",
    openaiApiKey: process.env.OPEN_API_KEY || "",
  })

  const [groqModels, setGroqModels] = useState([
    { id: "llama3-8b-8192", name: "Llama-3 8B", selected: true },
    { id: "llama3-70b-8192", name: "Llama-3 70B", selected: false },
    { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B", selected: false },
    { id: "gemma-7b-it", name: "Gemma 7B", selected: false },
  ])

  const [serperSettings, setSerperSettings] = useState({
    defaultEngine: "google",
    countryCode: "us",
    resultsPerPage: 10,
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleGeneralSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setGeneralSettings((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleApiSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setApiSettings((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSerperSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setSerperSettings((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleModelToggle = (modelId: string) => {
    setGroqModels((prev) =>
      prev.map((model) => ({
        ...model,
        selected: model.id === modelId ? !model.selected : model.selected,
      })),
    )
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real implementation, this would save the settings to a database
      console.log("Settings saved:", {
        generalSettings,
        apiSettings,
        groqModels: groqModels.filter((m) => m.selected).map((m) => m.id),
        serperSettings,
      })

      alert("Settings saved successfully!")
    } catch (error) {
      console.error("Error saving settings:", error)
      alert("Failed to save settings")
    } finally {
      setIsSaving(false)
      if (onClose) {
        onClose()
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1E1E1E] rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold">Settings</h2>
          {onClose && (
            <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-800">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="p-4">
          <div className="space-y-8">
            <div>
              <p className="text-gray-400 mb-6">Configure your application preferences and API keys</p>
            </div>

            <div className="space-y-6">
              {/* General Settings */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">General Settings</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="darkMode" className="font-medium">
                        Dark Mode
                      </label>
                      <p className="text-sm text-gray-400">Enable dark theme for the application</p>
                    </div>
                    <div className="relative inline-block w-12 h-6">
                      <input
                        type="checkbox"
                        id="darkMode"
                        name="darkMode"
                        className="opacity-0 w-0 h-0"
                        checked={generalSettings.darkMode}
                        onChange={handleGeneralSettingsChange}
                      />
                      <span
                        className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors duration-300 ${
                          generalSettings.darkMode ? "bg-green-500" : "bg-gray-600"
                        }`}
                      >
                        <span
                          className={`absolute h-4 w-4 left-1 bottom-1 bg-white rounded-full transition-transform duration-300 ${
                            generalSettings.darkMode ? "transform translate-x-6" : ""
                          }`}
                        ></span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="notifications" className="font-medium">
                        Notifications
                      </label>
                      <p className="text-sm text-gray-400">Receive notifications for important events</p>
                    </div>
                    <div className="relative inline-block w-12 h-6">
                      <input
                        type="checkbox"
                        id="notifications"
                        name="notifications"
                        className="opacity-0 w-0 h-0"
                        checked={generalSettings.notifications}
                        onChange={handleGeneralSettingsChange}
                      />
                      <span
                        className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors duration-300 ${
                          generalSettings.notifications ? "bg-green-500" : "bg-gray-600"
                        }`}
                      >
                        <span
                          className={`absolute h-4 w-4 left-1 bottom-1 bg-white rounded-full transition-transform duration-300 ${
                            generalSettings.notifications ? "transform translate-x-6" : ""
                          }`}
                        ></span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="autoSave" className="font-medium">
                        Auto Save
                      </label>
                      <p className="text-sm text-gray-400">Automatically save changes to workflows</p>
                    </div>
                    <div className="relative inline-block w-12 h-6">
                      <input
                        type="checkbox"
                        id="autoSave"
                        name="autoSave"
                        className="opacity-0 w-0 h-0"
                        checked={generalSettings.autoSave}
                        onChange={handleGeneralSettingsChange}
                      />
                      <span
                        className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors duration-300 ${
                          generalSettings.autoSave ? "bg-green-500" : "bg-gray-600"
                        }`}
                      >
                        <span
                          className={`absolute h-4 w-4 left-1 bottom-1 bg-white rounded-full transition-transform duration-300 ${
                            generalSettings.autoSave ? "transform translate-x-6" : ""
                          }`}
                        ></span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* API Keys */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">API Keys</h3>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="groqApiKey" className="block text-sm font-medium mb-1">
                      Groq API Key
                    </label>
                    <input
                      type="password"
                      id="groqApiKey"
                      name="groqApiKey"
                      value={apiSettings.groqApiKey}
                      onChange={handleApiSettingsChange}
                      placeholder="Enter your Groq API key"
                      className="w-full bg-gray-700 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">Used for AI model inference with Groq</p>
                  </div>

                  <div>
                    <label htmlFor="serperApiKey" className="block text-sm font-medium mb-1">
                      Serper API Key
                    </label>
                    <input
                      type="password"
                      id="serperApiKey"
                      name="serperApiKey"
                      value={apiSettings.serperApiKey}
                      onChange={handleApiSettingsChange}
                      placeholder="Enter your Serper API key"
                      className="w-full bg-gray-700 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">Used for search capabilities with Serper</p>
                  </div>

                  <div>
                    <label htmlFor="openaiApiKey" className="block text-sm font-medium mb-1">
                      OpenAI API Key
                    </label>
                    <input
                      type="password"
                      id="openaiApiKey"
                      name="openaiApiKey"
                      value={apiSettings.openaiApiKey}
                      onChange={handleApiSettingsChange}
                      placeholder="Enter your OpenAI API key"
                      className="w-full bg-gray-700 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">Used for AI model inference with OpenAI</p>
                  </div>
                </div>
              </div>

              {/* Groq Models */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">Groq Models</h3>

                <div className="space-y-2">
                  {groqModels.map((model) => (
                    <div key={model.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={model.id}
                        checked={model.selected}
                        onChange={() => handleModelToggle(model.id)}
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <label htmlFor={model.id} className="ml-2 block text-sm">
                        {model.name}
                      </label>
                    </div>
                  ))}
                  <p className="text-xs text-gray-400 mt-2">
                    Select the Groq models you want to use in your application
                  </p>
                </div>
              </div>

              {/* Serper Settings */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">Serper Settings</h3>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="defaultEngine" className="block text-sm font-medium mb-1">
                      Default Search Engine
                    </label>
                    <select
                      id="defaultEngine"
                      name="defaultEngine"
                      value={serperSettings.defaultEngine}
                      onChange={handleSerperSettingsChange}
                      className="w-full bg-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="google">Google</option>
                      <option value="bing">Bing</option>
                      <option value="yahoo">Yahoo</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="countryCode" className="block text-sm font-medium mb-1">
                      Country Code
                    </label>
                    <input
                      type="text"
                      id="countryCode"
                      name="countryCode"
                      value={serperSettings.countryCode}
                      onChange={handleSerperSettingsChange}
                      placeholder="us"
                      className="w-full bg-gray-700 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">Two-letter country code for localized search results</p>
                  </div>

                  <div>
                    <label htmlFor="resultsPerPage" className="block text-sm font-medium mb-1">
                      Results Per Page
                    </label>
                    <input
                      type="number"
                      id="resultsPerPage"
                      name="resultsPerPage"
                      value={serperSettings.resultsPerPage}
                      onChange={handleSerperSettingsChange}
                      min="1"
                      max="100"
                      className="w-full bg-gray-700 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-4 border-t border-gray-800">
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
