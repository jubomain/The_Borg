"use client"

import { useState, useEffect } from "react"
import { Star, ExternalLink, RefreshCw, Plus } from "lucide-react"

interface Repository {
  name: string
  owner: string
  description: string
  language: string
  stars: number
  url: string
}

export default function TrendingRepositories() {
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTrendingRepositories = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/scrape-github-trending")

      if (!response.ok) {
        throw new Error(`Failed to fetch trending repositories: ${response.status}`)
      }

      const data = await response.json()
      setRepositories(data)
    } catch (err) {
      console.error("Error fetching trending repositories:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch trending repositories")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrendingRepositories()
  }, [])

  const handleAddRepository = (repo: Repository) => {
    // In a real implementation, this would add the repository to the user's list
    alert(`Repository ${repo.owner}/${repo.name} added to your list!`)
  }

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Trending Repositories</h2>
        <button
          onClick={fetchTrendingRepositories}
          className="flex items-center text-sm text-gray-400 hover:text-white"
          disabled={loading}
        >
          <RefreshCw size={14} className={`mr-1 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 p-3 rounded mb-4">
          <p>{error}</p>
          <p className="text-sm mt-1">Using fallback data instead.</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : repositories.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {repositories.map((repo, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-3 hover:bg-gray-750">
              <div className="flex justify-between items-start">
                <div>
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 font-medium flex items-center"
                  >
                    {repo.owner}/{repo.name}
                    <ExternalLink size={14} className="ml-1" />
                  </a>
                  <p className="text-gray-400 text-sm mt-1">{repo.description || "No description available"}</p>
                </div>
                <button
                  onClick={() => handleAddRepository(repo)}
                  className="text-gray-400 hover:text-green-400"
                  title="Add to your repositories"
                >
                  <Plus size={18} />
                </button>
              </div>
              <div className="flex items-center mt-2 text-xs text-gray-500">
                {repo.language && (
                  <span className="flex items-center mr-3">
                    <span className="w-2 h-2 rounded-full bg-blue-400 mr-1"></span>
                    {repo.language}
                  </span>
                )}
                <span className="flex items-center">
                  <Star size={14} className="mr-1" />
                  {repo.stars.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <p className="text-gray-400">No trending repositories found</p>
        </div>
      )}
    </div>
  )
}
