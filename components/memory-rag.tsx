"use client"

import { useState } from "react"
import { Database, Upload, Search, FileText, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function MemoryRag() {
  const [activeTab, setActiveTab] = useState<"memory" | "rag">("memory")
  const [memories, setMemories] = useState<
    Array<{
      id: string
      agentId: string
      agentName: string
      content: string
      type: string
      timestamp: string
    }>
  >([
    {
      id: "mem-1",
      agentId: "agent-1",
      agentName: "Web Researcher",
      content: "User prefers detailed explanations with examples",
      type: "preference",
      timestamp: "2023-05-15T14:30:00Z",
    },
    {
      id: "mem-2",
      agentId: "agent-2",
      agentName: "Data Analyst",
      content: "User is interested in cryptocurrency market trends",
      type: "interest",
      timestamp: "2023-05-16T09:45:00Z",
    },
  ])

  const [documents, setDocuments] = useState<
    Array<{
      id: string
      title: string
      content: string
      type: string
      timestamp: string
    }>
  >([
    {
      id: "doc-1",
      title: "Introduction to AI Agents",
      content:
        "AI agents are autonomous entities that can perceive their environment, make decisions, and take actions to achieve specific goals...",
      type: "article",
      timestamp: "2023-05-10T11:20:00Z",
    },
    {
      id: "doc-2",
      title: "Self-Evolution in AI Systems",
      content:
        "Self-evolution in AI refers to the ability of systems to improve their performance over time without explicit programming...",
      type: "research",
      timestamp: "2023-05-12T15:40:00Z",
    },
  ])

  const [searchQuery, setSearchQuery] = useState<string>("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState<boolean>(false)

  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadTitle, setUploadTitle] = useState<string>("")
  const [isUploading, setIsUploading] = useState<boolean>(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)

    try {
      // Simulate search
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Filter memories and documents based on search query
      const memoryResults = memories.filter((mem) => mem.content.toLowerCase().includes(searchQuery.toLowerCase()))

      const documentResults = documents.filter(
        (doc) =>
          doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.content.toLowerCase().includes(searchQuery.toLowerCase()),
      )

      setSearchResults([...memoryResults, ...documentResults])
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleUpload = async () => {
    if (!uploadFile || !uploadTitle.trim()) return

    setIsUploading(true)

    try {
      // Simulate file upload and processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Add new document
      const newDocument = {
        id: `doc-${Date.now()}`,
        title: uploadTitle,
        content: `Content from ${uploadFile.name}...`,
        type: uploadFile.type.split("/")[1] || "document",
        timestamp: new Date().toISOString(),
      }

      setDocuments([newDocument, ...documents])
      setUploadFile(null)
      setUploadTitle("")
    } catch (error) {
      console.error("Upload error:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteMemory = (id: string) => {
    setMemories(memories.filter((mem) => mem.id !== id))
  }

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id))
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-800 flex items-center">
        <Link href="/dashboard" className="mr-4">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold">Memory & RAG</h1>
      </div>

      <div className="flex border-b border-gray-800">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "memory" ? "border-b-2 border-green-500" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("memory")}
        >
          Agent Memory
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === "rag" ? "border-b-2 border-green-500" : "text-gray-400"}`}
          onClick={() => setActiveTab("rag")}
        >
          Knowledge Base (RAG)
        </button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === "memory" ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Agent Memories
              </h2>

              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Search memories..."
                  className="w-full bg-gray-800 rounded-md pl-8 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>
            </div>

            {memories.length === 0 ? (
              <div className="bg-gray-900 rounded-md p-6 text-center">
                <p className="text-gray-400">No memories stored yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {memories.map((memory) => (
                  <div key={memory.id} className="bg-gray-900 rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium">{memory.agentName}</span>
                          <span className="ml-2 px-2 py-0.5 bg-gray-800 rounded-full text-xs text-gray-400">
                            {memory.type}
                          </span>
                        </div>
                        <p className="mt-2 text-gray-300">{memory.content}</p>
                        <p className="mt-1 text-xs text-gray-500">{new Date(memory.timestamp).toLocaleString()}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteMemory(memory.id)}
                        className="p-1 text-gray-400 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-medium flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Knowledge Base
                  </h2>

                  <div className="flex">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search documents..."
                        className="w-64 bg-gray-800 rounded-l-md pl-8 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                    </div>
                    <button
                      onClick={handleSearch}
                      disabled={isSearching || !searchQuery.trim()}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-r-md disabled:opacity-50"
                    >
                      Search
                    </button>
                  </div>
                </div>

                {searchQuery && searchResults.length > 0 ? (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Search Results ({searchResults.length})</h3>
                    <div className="space-y-4">
                      {searchResults.map((result) => (
                        <div key={result.id} className="bg-gray-900 rounded-md p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              {"title" in result ? (
                                <>
                                  <div className="font-medium">{result.title}</div>
                                  <p className="mt-2 text-gray-300 line-clamp-2">{result.content}</p>
                                </>
                              ) : (
                                <>
                                  <div className="flex items-center">
                                    <span className="font-medium">{result.agentName}</span>
                                    <span className="ml-2 px-2 py-0.5 bg-gray-800 rounded-full text-xs text-gray-400">
                                      {result.type}
                                    </span>
                                  </div>
                                  <p className="mt-2 text-gray-300">{result.content}</p>
                                </>
                              )}
                              <p className="mt-1 text-xs text-gray-500">
                                {new Date(result.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : searchQuery && !isSearching ? (
                  <div className="bg-gray-900 rounded-md p-6 text-center">
                    <p className="text-gray-400">No results found for "{searchQuery}"</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <div key={doc.id} className="bg-gray-900 rounded-md p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <span className="font-medium">{doc.title}</span>
                              <span className="ml-2 px-2 py-0.5 bg-gray-800 rounded-full text-xs text-gray-400">
                                {doc.type}
                              </span>
                            </div>
                            <p className="mt-2 text-gray-300 line-clamp-2">{doc.content}</p>
                            <p className="mt-1 text-xs text-gray-500">{new Date(doc.timestamp).toLocaleString()}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="p-1 text-gray-400 hover:text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-lg font-medium mb-4">Upload Document</h2>
                <div className="bg-gray-900 rounded-md p-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Document Title</label>
                      <input
                        type="text"
                        value={uploadTitle}
                        onChange={(e) => setUploadTitle(e.target.value)}
                        placeholder="Enter document title"
                        className="w-full bg-gray-800 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">File</label>
                      <div className="border-2 border-dashed border-gray-700 rounded-md p-4 text-center relative">
                        {uploadFile ? (
                          <div>
                            <p className="text-sm font-medium">{uploadFile.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{(uploadFile.size / 1024).toFixed(2)} KB</p>
                            <button
                              onClick={() => setUploadFile(null)}
                              className="mt-2 text-xs text-red-400 hover:text-red-300"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <div className="relative">
                            <Upload className="w-8 h-8 mx-auto text-gray-500 mb-2" />
                            <p className="text-sm text-gray-400 mb-1">Drag and drop a file or click to browse</p>
                            <p className="text-xs text-gray-500">Supports PDF, TXT, DOCX, MD (Max 10MB)</p>
                            <label className="block cursor-pointer">
                              <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                style={{ top: 0, left: 0, width: "100%", height: "100%" }}
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    setUploadFile(e.target.files[0])
                                  }
                                }}
                                accept=".pdf,.txt,.docx,.md"
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={handleUpload}
                      disabled={isUploading || !uploadFile || !uploadTitle.trim()}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md flex items-center justify-center disabled:opacity-50"
                    >
                      {isUploading ? "Uploading..." : "Upload Document"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
