"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { GitBranch, Search, Check, AlertTriangle, RefreshCw, FileCode, Cpu } from "lucide-react"
import { supabase } from "@/lib/supabase-client"

type AnalysisResult = {
  compatible: boolean
  score: number
  reasoning: string
  implementationSteps: string[]
  potentialImprovements: string[]
  technicalRequirements: string[]
}

type GroqModel = {
  id: string
  name: string
  description: string
  contextWindow: number
}

export default function RepositoryAnalyzer() {
  const [repoUrl, setRepoUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [selectedModel, setSelectedModel] = useState("llama3-70b-8192")
  const [availableModels, setAvailableModels] = useState<GroqModel[]>([])
  const [repoReadme, setRepoReadme] = useState("")
  const [isLoadingModels, setIsLoadingModels] = useState(true)

  useEffect(() => {
    // Check if there's a repo URL in the query params
    const params = new URLSearchParams(window.location.search)
    const repoParam = params.get("repo")
    if (repoParam) {
      setRepoUrl(repoParam)
    }

    // Fetch available Groq models
    fetchGroqModels()
  }, [])

  const fetchGroqModels = async () => {
    try {
      setIsLoadingModels(true)
      const response = await fetch("/api/groq-models")

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.models) {
          setAvailableModels(data.models)
        } else {
          // Fallback to default models if API fails
          setAvailableModels([
            {
              id: "llama3-70b-8192",
              name: "Llama 3 70B",
              description: "Meta's Llama 3 70B parameter model",
              contextWindow: 8192,
            },
            {
              id: "llama3-8b-8192",
              name: "Llama 3 8B",
              description: "Meta's Llama 3 8B parameter model",
              contextWindow: 8192,
            },
            {
              id: "mixtral-8x7b-32768",
              name: "Mixtral 8x7B",
              description: "Mixtral's 8x7B parameter model with 32K context",
              contextWindow: 32768,
            },
            {
              id: "gemma-7b-it",
              name: "Gemma 7B-IT",
              description: "Google's Gemma 7B instruction-tuned model",
              contextWindow: 8192,
            },
          ])
        }
      }
    } catch (error) {
      console.error("Error fetching Groq models:", error)
    } finally {
      setIsLoadingModels(false)
    }
  }

  const analyzeRepository = async () => {
    if (!repoUrl) return

    setIsAnalyzing(true)
    setAnalysisResult(null)

    try {
      // Extract owner and repo name from URL
      const urlPattern = /github\.com\/([^/]+)\/([^/]+)/
      const match = repoUrl.match(urlPattern)

      if (!match) {
        alert("Invalid GitHub repository URL")
        setIsAnalyzing(false)
        return
      }

      const [, owner, name] = match

      // Fetch README if not provided
      let readme = repoReadme
      if (!readme) {
        const readmeResponse = await fetch(`/api/fetch-repository-readme?owner=${owner}&name=${name}`)
        if (readmeResponse.ok) {
          const readmeData = await readmeResponse.json()
          if (readmeData.success && readmeData.readme) {
            readme = readmeData.readme
            setRepoReadme(readme)
          }
        }
      }

      // Call the API to analyze the repository
      const response = await fetch("/api/analyze-repository", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repoUrl,
          readme,
          model: selectedModel,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze repository")
      }

      const result = await response.json()
      setAnalysisResult(result)

      // Store the analysis result in the database
      await supabase.from("repository_analysis").insert({
        repo_url: repoUrl,
        repo_name: `${owner}/${name}`,
        compatible: result.compatible,
        score: result.score,
        reasoning: result.reasoning,
        implementation_steps: result.implementationSteps,
        potential_improvements: result.potentialImprovements,
        technical_requirements: result.technicalRequirements,
        analyzed_at: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Error analyzing repository:", error)
      alert("Failed to analyze repository")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <GitBranch className="w-5 h-5 text-green-500" />
              <h2 className="text-xl font-semibold">Repository Analyzer</h2>
            </div>

            <p className="text-gray-400 text-sm">
              Analyze GitHub repositories to determine compatibility with the BORG framework and identify potential
              implementation strategies.
            </p>

            <div className="flex flex-col space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="GitHub Repository URL (e.g., https://github.com/owner/repo)"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={analyzeRepository}
                  disabled={isAnalyzing || !repoUrl}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>

              <div className="flex space-x-2">
                <div className="w-full">
                  <label className="text-sm text-gray-400 mb-1 block">Groq Model</label>
                  <Select value={selectedModel} onValueChange={setSelectedModel} disabled={isLoadingModels}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableModels.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          <div className="flex flex-col">
                            <span>{model.name}</span>
                            <span className="text-xs text-gray-400">{model.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">
                  Repository README (Optional - will be fetched automatically if not provided)
                </label>
                <Textarea
                  placeholder="Paste the repository README here for better analysis"
                  value={repoReadme}
                  onChange={(e) => setRepoReadme(e.target.value)}
                  rows={5}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isAnalyzing && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <RefreshCw className="w-12 h-12 text-green-500 animate-spin" />
              <h3 className="text-lg font-semibold">Analyzing Repository</h3>
              <p className="text-gray-400 text-sm">This may take a minute or two...</p>
              <Progress value={45} className="w-full max-w-md" />
            </div>
          </CardContent>
        </Card>
      )}

      {analysisResult && (
        <Card className={analysisResult.compatible ? "border-green-700" : "border-yellow-700"}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-green-500" />
                <h2 className="text-xl font-semibold">Analysis Results</h2>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-sm flex items-center ${
                  analysisResult.compatible
                    ? "bg-green-900/50 text-green-400 border border-green-700"
                    : "bg-yellow-900/50 text-yellow-400 border border-yellow-700"
                }`}
              >
                {analysisResult.compatible ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Compatible
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    Partially Compatible
                  </>
                )}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Compatibility Score</h3>
                <span className="text-sm">{analysisResult.score}/100</span>
              </div>
              <Progress
                value={analysisResult.score}
                className={`h-2 ${
                  analysisResult.score >= 70
                    ? "bg-green-900"
                    : analysisResult.score >= 40
                      ? "bg-yellow-900"
                      : "bg-red-900"
                }`}
              />
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Analysis</h3>
                <p className="text-gray-400 text-sm whitespace-pre-wrap">{analysisResult.reasoning}</p>
              </div>

              {analysisResult.implementationSteps.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Implementation Steps</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {analysisResult.implementationSteps.map((step, index) => (
                      <li key={index} className="text-gray-400 text-sm">
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analysisResult.potentialImprovements.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Potential Improvements</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {analysisResult.potentialImprovements.map((improvement, index) => (
                      <li key={index} className="text-gray-400 text-sm">
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h3 className="font-medium mb-2">Technical Requirements</h3>
                <ul className="list-disc list-inside space-y-1">
                  {analysisResult.technicalRequirements.map((requirement, index) => (
                    <li key={index} className="text-gray-400 text-sm">
                      {requirement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-800 flex justify-end">
              <Button className="bg-green-600 hover:bg-green-700">
                <FileCode className="w-4 h-4 mr-2" />
                Generate Integration Code
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
