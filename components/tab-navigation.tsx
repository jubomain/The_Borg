"use client"

interface TabNavigationProps {
  selectedTab: "chat" | "workflows" | "studio"
  onSelectTab: (tab: string) => void
  logSessions: boolean
  onToggleLogSessions: () => void
}

export default function TabNavigation({
  selectedTab,
  onSelectTab,
  logSessions,
  onToggleLogSessions,
}: TabNavigationProps) {
  return (
    <div className="flex items-center border-b border-gray-800">
      <div className="flex-1 flex">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            selectedTab === "chat" ? "border-b-2 border-white" : "text-gray-400"
          }`}
          onClick={() => onSelectTab("chat")}
        >
          <div className="flex items-center">
            <span className="mr-2">💬</span>
            Chat
          </div>
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            selectedTab === "workflows" ? "border-b-2 border-white" : "text-gray-400"
          }`}
          onClick={() => onSelectTab("workflows")}
        >
          <div className="flex items-center">
            <span className="mr-2">⚙️</span>
            Workflows
          </div>
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            selectedTab === "studio" ? "border-b-2 border-white" : "text-gray-400"
          }`}
          onClick={() => onSelectTab("studio")}
        >
          <div className="flex items-center">
            <span className="mr-2">🧪</span>
            Studio
          </div>
        </button>
      </div>

      <div className="flex items-center px-4">
        <span className="text-sm mr-2">Log sessions</span>
        <div
          className={`w-10 h-5 rounded-full flex items-center p-0.5 cursor-pointer ${
            logSessions ? "bg-blue-600" : "bg-gray-700"
          }`}
          onClick={onToggleLogSessions}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
              logSessions ? "translate-x-5" : "translate-x-0"
            }`}
          ></div>
        </div>
      </div>
    </div>
  )
}
