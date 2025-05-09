"use client"

import type React from "react"
import { useState } from "react"
import { ChromeIcon as Browser, X } from "lucide-react"
import { initializeBrowser, closeBrowser } from "./serviceAPI"
import type { BrowserConfig } from "./types"

interface BrowserSessionPanelProps {
  onInitialize: (success: boolean) => void
  isInitialized: boolean
}

const BrowserSessionPanel: React.FC<BrowserSessionPanelProps> = ({ onInitialize, isInitialized }) => {
  const [config, setConfig] = useState<BrowserConfig>({
    targetUrl: "",
    selectors: {
      input: "",
      output: "",
      submit: "",
    },
    headless: true,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setConfig((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof BrowserConfig],
          [child]: type === "checkbox" ? checked : value,
        },
      }))
    } else {
      setConfig((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }))
    }
  }

  const handleInitialize = async () => {
    // Validate inputs
    if (!config.targetUrl) {
      setError("Target URL is required")
      return
    }

    if (!config.selectors.input || !config.selectors.output || !config.selectors.submit) {
      setError("All selectors are required")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const success = await initializeBrowser(config)
      onInitialize(success)
    } catch (err) {
      console.error("Failed to initialize browser:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      onInitialize(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setConfig({
      targetUrl: "",
      selectors: {
        input: "",
        output: "",
        submit: "",
      },
      headless: true,
    })
    setError(null)
  }

  const handleClose = async () => {
    setIsLoading(true)

    try {
      await closeBrowser()
      onInitialize(false)
    } catch (err) {
      console.error("Failed to close browser:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Browser Session</h2>
        {isInitialized && (
          <button
            onClick={handleClose}
            className="text-red-600 hover:text-red-800 flex items-center space-x-1"
            disabled={isLoading}
          >
            <X size={16} />
            <span>Close Session</span>
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="targetUrl" className="block text-sm font-medium text-gray-700">
            Target URL
          </label>
          <input
            type="text"
            id="targetUrl"
            name="targetUrl"
            value={config.targetUrl}
            onChange={handleChange}
            disabled={isInitialized || isLoading}
            placeholder="https://example.com"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                      focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                      bg-white border p-2 disabled:bg-gray-100"
          />
        </div>

        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Element Selectors</h3>

          <div className="space-y-3">
            <div>
              <label htmlFor="selectors.input" className="block text-sm font-medium text-gray-700">
                Input Field Selector
              </label>
              <input
                type="text"
                id="selectors.input"
                name="selectors.input"
                value={config.selectors.input}
                onChange={handleChange}
                disabled={isInitialized || isLoading}
                placeholder="#input-field or .input-class"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                          focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                          bg-white border p-2 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label htmlFor="selectors.output" className="block text-sm font-medium text-gray-700">
                Output Field Selector
              </label>
              <input
                type="text"
                id="selectors.output"
                name="selectors.output"
                value={config.selectors.output}
                onChange={handleChange}
                disabled={isInitialized || isLoading}
                placeholder="#output-field or .output-class"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                          focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                          bg-white border p-2 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label htmlFor="selectors.submit" className="block text-sm font-medium text-gray-700">
                Submit Button Selector
              </label>
              <input
                type="text"
                id="selectors.submit"
                name="selectors.submit"
                value={config.selectors.submit}
                onChange={handleChange}
                disabled={isInitialized || isLoading}
                placeholder="#submit-button or .submit-class"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                          focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                          bg-white border p-2 disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Browser Options</h3>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="headless"
              name="headless"
              checked={config.headless}
              onChange={handleChange}
              disabled={isInitialized || isLoading}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="headless" className="text-sm text-gray-700">
              Run in headless mode (no visible browser window)
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        {!isInitialized ? (
          <>
            <button
              type="button"
              onClick={handleReset}
              disabled={isLoading}
              className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium
                        text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2
                        focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleInitialize}
              disabled={isLoading}
              className="inline-flex justify-center items-center rounded-md border border-transparent
                        bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                        disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Initializing...
                </>
              ) : (
                <>
                  <Browser size={16} className="mr-2" />
                  Initialize Browser
                </>
              )}
            </button>
          </>
        ) : (
          <div className="bg-green-50 border-l-4 border-green-500 p-3 w-full">
            <p className="text-sm text-green-700">Browser session is active and ready to use!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BrowserSessionPanel
