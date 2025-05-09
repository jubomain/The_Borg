"use client"

import { useState } from "react"
import { Globe, Play, Code, Save, ArrowLeft, RefreshCw } from "lucide-react"
import Link from "next/link"

export function BrowserController() {
  const [url, setUrl] = useState<string>("")
  const [task, setTask] = useState<string>("")
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [code, setCode] = useState<string>("")
  const [output, setOutput] = useState<string>("")

  const handleRun = async () => {
    if (!url.trim() || !task.trim()) return

    setIsRunning(true)
    setOutput("Connecting to browser...")

    try {
      // Simulate browser control
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setOutput((prev) => prev + "\nAnalyzing webpage...")
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setOutput((prev) => prev + "\nGenerating automation script...")
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate sample code
      const sampleCode = `// Browser automation for ${url}
async function performTask() {
  // Navigate to the URL
  await page.goto("${url}");
  
  // Wait for page to load
  await page.waitForSelector('body');
  
  // Perform the requested task: ${task}
  console.log("Starting task execution");
  
  // Example: Fill a search form
  await page.type('input[type="search"]', "search query");
  await page.click('button[type="submit"]');
  
  // Wait for results
  await page.waitForSelector('.results');
  
  // Extract data
  const results = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.result-item'))
      .map(item => item.textContent);
  });
  
  return results;
}`

      setCode(sampleCode)
      setOutput((prev) => prev + "\nScript generated successfully. Ready to execute.")
    } catch (error) {
      setOutput((prev) => prev + `\nError: ${error}`)
    } finally {
      setIsRunning(false)
    }
  }

  const handleExecute = async () => {
    if (!code.trim()) return

    setIsRunning(true)
    setOutput("Executing script...")

    try {
      // Simulate execution
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setOutput((prev) => prev + "\nConnecting to browser...")
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setOutput((prev) => prev + "\nNavigating to page...")
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setOutput((prev) => prev + "\nPerforming actions...")
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setOutput((prev) => prev + "\nTask completed successfully!")
    } catch (error) {
      setOutput((prev) => prev + `\nExecution error: ${error}`)
    } finally {
      setIsRunning(false)
    }
  }

  const handleSave = () => {
    // Implement save functionality
    alert("Script saved successfully!")
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-800 flex items-center">
        <Link href="/dashboard" className="mr-4">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold">Browser Control</h1>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="bg-gray-900 rounded-md p-4 mb-6">
              <h2 className="text-lg font-medium mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Target Website
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">URL</label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full bg-gray-800 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={isRunning}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Task Description</label>
                  <textarea
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    placeholder="Describe what you want the AI to do on this website..."
                    className="w-full bg-gray-800 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={4}
                    disabled={isRunning}
                  />
                </div>

                <button
                  onClick={handleRun}
                  disabled={isRunning || !url.trim() || !task.trim()}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center disabled:opacity-50"
                >
                  {isRunning ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Generate Script
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-gray-900 rounded-md p-4">
              <h2 className="text-lg font-medium mb-4">Output</h2>
              <pre className="bg-black rounded-md p-4 text-sm text-gray-300 h-64 overflow-y-auto whitespace-pre-wrap">
                {output || "Output will appear here..."}
              </pre>
            </div>
          </div>

          <div>
            <div className="bg-gray-900 rounded-md p-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium flex items-center">
                  <Code className="w-5 h-5 mr-2" />
                  Automation Script
                </h2>

                <div className="flex space-x-2">
                  <button
                    onClick={handleExecute}
                    disabled={isRunning || !code.trim()}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm flex items-center disabled:opacity-50"
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Execute
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={!code.trim()}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm flex items-center disabled:opacity-50"
                  >
                    <Save className="w-3 h-3 mr-1" />
                    Save
                  </button>
                </div>
              </div>

              <div className="flex-1">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-full bg-black rounded-md p-4 text-sm text-green-400 font-mono focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  placeholder="// Browser automation code will appear here"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Export as default for compatibility
export default BrowserController
