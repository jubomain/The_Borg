"use client"

import type React from "react"

import { useState } from "react"
import { ChevronRight, Book, Search, ArrowLeft, Home, Menu, X, ExternalLink, ChevronDown } from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"

interface DocSection {
  id: string
  title: string
  path: string
  icon?: React.ReactNode
  children?: DocSection[]
  isExpanded?: boolean
}

const docSections: DocSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    path: "/docs/getting-started",
    icon: <Book className="w-4 h-4" />,
    children: [
      { id: "introduction", title: "Introduction", path: "/docs/getting-started/introduction" },
      { id: "installation", title: "Installation", path: "/docs/getting-started/installation" },
      { id: "quick-start", title: "Quick Start Guide", path: "/docs/getting-started/quick-start" },
      { id: "key-concepts", title: "Key Concepts", path: "/docs/getting-started/key-concepts" },
    ],
  },
  {
    id: "command-center",
    title: "Command Center",
    path: "/docs/command-center",
    icon: <Menu className="w-4 h-4" />,
    children: [
      { id: "overview", title: "Overview", path: "/docs/command-center/overview" },
      { id: "creating-workflows", title: "Creating Workflows", path: "/docs/command-center/creating-workflows" },
      { id: "node-types", title: "Node Types", path: "/docs/command-center/node-types" },
      { id: "connections", title: "Connections", path: "/docs/command-center/connections" },
      { id: "execution", title: "Execution", path: "/docs/command-center/execution" },
      { id: "debugging", title: "Debugging", path: "/docs/command-center/debugging" },
    ],
  },
  {
    id: "agents",
    title: "Agents",
    path: "/docs/agents",
    icon: <Book className="w-4 h-4" />,
    children: [
      { id: "agent-types", title: "Agent Types", path: "/docs/agents/agent-types" },
      { id: "creating-agents", title: "Creating Agents", path: "/docs/agents/creating-agents" },
      { id: "agent-properties", title: "Agent Properties", path: "/docs/agents/agent-properties" },
      { id: "agent-communication", title: "Agent Communication", path: "/docs/agents/agent-communication" },
    ],
  },
  {
    id: "workflows",
    title: "Workflows",
    path: "/docs/workflows",
    icon: <Book className="w-4 h-4" />,
    children: [
      { id: "workflow-basics", title: "Workflow Basics", path: "/docs/workflows/workflow-basics" },
      { id: "triggers", title: "Triggers", path: "/docs/workflows/triggers" },
      { id: "conditions", title: "Conditions", path: "/docs/workflows/conditions" },
      { id: "actions", title: "Actions", path: "/docs/workflows/actions" },
      { id: "data-nodes", title: "Data Nodes", path: "/docs/workflows/data-nodes" },
    ],
  },
  {
    id: "integrations",
    title: "Integrations",
    path: "/docs/integrations",
    icon: <ExternalLink className="w-4 h-4" />,
    children: [
      { id: "supabase", title: "Supabase", path: "/docs/integrations/supabase" },
      { id: "twitter", title: "Twitter", path: "/docs/integrations/twitter" },
      { id: "email", title: "Email", path: "/docs/integrations/email" },
      { id: "google-drive", title: "Google Drive", path: "/docs/integrations/google-drive" },
    ],
  },
  {
    id: "api-reference",
    title: "API Reference",
    path: "/docs/api-reference",
    icon: <Book className="w-4 h-4" />,
    children: [
      { id: "workflow-api", title: "Workflow API", path: "/docs/api-reference/workflow-api" },
      { id: "agent-api", title: "Agent API", path: "/docs/api-reference/agent-api" },
      { id: "execution-api", title: "Execution API", path: "/docs/api-reference/execution-api" },
      { id: "webhook-api", title: "Webhook API", path: "/docs/api-reference/webhook-api" },
    ],
  },
  {
    id: "examples",
    title: "Examples",
    path: "/docs/examples",
    icon: <Book className="w-4 h-4" />,
    children: [
      { id: "twitter-email", title: "Twitter to Email", path: "/docs/examples/twitter-email" },
      { id: "data-processing", title: "Data Processing", path: "/docs/examples/data-processing" },
      { id: "content-curation", title: "Content Curation", path: "/docs/examples/content-curation" },
      { id: "monitoring", title: "Monitoring System", path: "/docs/examples/monitoring" },
    ],
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    path: "/docs/troubleshooting",
    icon: <Book className="w-4 h-4" />,
  },
]

interface DocSidebarItemProps {
  section: DocSection
  level?: number
  currentPath: string
  onNavigate: (path: string) => void
}

function DocSidebarItem({ section, level = 0, currentPath, onNavigate }: DocSidebarItemProps) {
  const [isExpanded, setIsExpanded] = useState(
    section.children?.some((child) => currentPath.startsWith(child.path)) || false,
  )

  const isActive = currentPath === section.path
  const hasChildren = section.children && section.children.length > 0

  const toggleExpand = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault()
      setIsExpanded(!isExpanded)
    }
  }

  const handleClick = () => {
    onNavigate(section.path)
  }

  return (
    <div>
      <button
        className={`flex items-center w-full px-2 py-1.5 text-sm ${
          isActive ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"
        } rounded-md transition-colors text-left ${level > 0 ? `ml-${level * 2}` : ""}`}
        onClick={hasChildren ? toggleExpand : handleClick}
      >
        {section.icon && <span className="mr-2">{section.icon}</span>}
        <span className="flex-1 truncate">{section.title}</span>
        {hasChildren && (
          <span className="ml-auto">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </span>
        )}
      </button>

      {isExpanded && hasChildren && (
        <div className="mt-1 ml-4 space-y-1">
          {section.children?.map((child) => (
            <DocSidebarItem
              key={child.id}
              section={child}
              level={level + 1}
              currentPath={currentPath}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface DocsLayoutProps {
  children: React.ReactNode
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  const router = useRouter()
  const pathname = usePathname() || "/docs"
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleNavigate = (path: string) => {
    router.push(path)
    setIsMobileMenuOpen(false)
  }

  // Find the current section and page title
  const findCurrentSection = (sections: DocSection[], path: string): { section: DocSection | null; title: string } => {
    for (const section of sections) {
      if (section.path === path) {
        return { section, title: section.title }
      }
      if (section.children) {
        for (const child of section.children) {
          if (child.path === path) {
            return { section, title: child.title }
          }
        }
      }
    }
    return { section: null, title: "Documentation" }
  }

  const { section: currentSection, title: pageTitle } = findCurrentSection(docSections, pathname)

  // Get breadcrumb items
  const getBreadcrumbs = (path: string): { title: string; path: string }[] => {
    const parts = path.split("/").filter(Boolean)
    const breadcrumbs: { title: string; path: string }[] = [{ title: "Docs", path: "/docs" }]

    let currentPath = "/docs"
    for (let i = 1; i < parts.length; i++) {
      currentPath += `/${parts[i]}`
      const section = docSections.find((s) => s.path === currentPath)
      if (section) {
        breadcrumbs.push({ title: section.title, path: section.path })
      } else {
        // Check if it's a child page
        for (const section of docSections) {
          if (section.children) {
            const child = section.children.find((c) => c.path === currentPath)
            if (child) {
              if (!breadcrumbs.some((b) => b.path === section.path)) {
                breadcrumbs.push({ title: section.title, path: section.path })
              }
              breadcrumbs.push({ title: child.title, path: child.path })
              break
            }
          }
        }
      }
    }

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(pathname)

  return (
    <div className="flex h-full">
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-gray-900 rounded-md text-white"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar - desktop always visible, mobile conditional */}
      <div
        className={`${
          isMobileMenuOpen ? "fixed inset-0 z-40 block" : "hidden md:block"
        } w-64 bg-[#1E1E1E] border-r border-gray-800 flex flex-col h-full`}
      >
        <div className="p-4 border-b border-gray-800 flex items-center">
          <Book className="w-5 h-5 mr-2" />
          <span className="font-bold">Documentation</span>
        </div>

        <div className="p-2">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search docs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 rounded-md pl-8 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          </div>

          <nav className="space-y-2">
            {docSections.map((section) => (
              <DocSidebarItem key={section.id} section={section} currentPath={pathname} onNavigate={handleNavigate} />
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 bg-[#1E1E1E] border-b border-gray-800">
          <div className="flex items-center p-4">
            <div className="flex items-center space-x-2">
              <Link href="/dashboard" className="p-2 bg-gray-800 rounded-md hover:bg-gray-700">
                <Home className="w-5 h-5" />
              </Link>
              <button onClick={() => router.back()} className="p-2 bg-gray-800 rounded-md hover:bg-gray-700">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="ml-4 flex items-center text-sm text-gray-400">
              {breadcrumbs.map((item, index) => (
                <div key={item.path} className="flex items-center">
                  {index > 0 && <ChevronRight className="w-3 h-3 mx-1" />}
                  <Link href={item.path} className="hover:text-white">
                    {item.title}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">{pageTitle}</h1>
          {children}
        </div>
      </div>
    </div>
  )
}
