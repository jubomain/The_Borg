"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainSidebar } from "@/components/navigation/main-sidebar"

export default function KeyboardShortcutsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <MainSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container py-6 space-y-6 max-w-5xl">
          <div>
            <h1 className="text-3xl font-bold mb-2">Keyboard Shortcuts</h1>
            <p className="text-muted-foreground">
              Master the Borg Framework with these keyboard shortcuts to boost your productivity.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Navigation</CardTitle>
              <CardDescription>Shortcuts for navigating around the application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Toggle Sidebar</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl + B</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Go to Dashboard</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">G + D</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Go to Playground</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">G + P</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Go to Command Center</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">G + C</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Go to Agent Studio</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">G + A</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Go to Settings</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">G + S</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Go to Documentation</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">G + H</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Search</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">/</kbd>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Command Center</CardTitle>
              <CardDescription>Shortcuts for working with workflows in the Command Center</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Save Workflow</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl + S</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Execute Workflow</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl + Enter</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Undo</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl + Z</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Redo</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl + Y</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Delete Selected Node</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Delete</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Duplicate Selected Node</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl + D</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Fit View to Screen</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl + 0</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Toggle Execution Panel</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl + L</kbd>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Playground</CardTitle>
              <CardDescription>Shortcuts for working in the Playground</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Send Message</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Enter</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">New Line</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Shift + Enter</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Clear Chat</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl + K</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Toggle Endpoint Panel</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl + E</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Focus Input</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Alt + I</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Scroll to Bottom</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">End</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Scroll to Top</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Home</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Save Conversation</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl + Shift + S</kbd>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Agent Studio</CardTitle>
              <CardDescription>Shortcuts for working in the Agent Studio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Save Agent</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl + S</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Add Instruction</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl + I</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Add Tool</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl + T</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Generate Agent</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl + G</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Test Agent</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl + Enter</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Clear Form</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl + Shift + C</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Focus Name Field</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Alt + N</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Focus Description Field</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Alt + D</kbd>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Global Shortcuts</CardTitle>
              <CardDescription>Shortcuts that work throughout the application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Open Command Palette</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl + P</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Toggle Dark Mode</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl + Shift + D</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Open Settings</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl + ,</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Help</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">F1</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Refresh</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">F5</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Zoom In</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl + +</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Zoom Out</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl + -</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Reset Zoom</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl + 0</kbd>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
