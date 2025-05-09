"use client"
import dynamic from "next/dynamic"
import { Suspense } from "react"
import ErrorBoundary from "@/components/error-boundary"
import WorkflowsFallback from "./fallback"

// Dynamically import components to avoid import errors
const Header = dynamic(() => import("@/components/navigation/header"), {
  ssr: false,
  loading: () => <div className="h-16 bg-[#1A1A1A] border-b border-gray-800"></div>,
})

const WorkflowsContent = dynamic(() => import("./workflows-content"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 p-6 flex items-center justify-center">
      <p className="text-white">Loading workflows...</p>
    </div>
  ),
})

export default function WorkflowsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#121212]">
      <Header title="Workflows" />
      <ErrorBoundary fallback={<WorkflowsFallback />}>
        <Suspense
          fallback={
            <div className="flex-1 p-6 flex items-center justify-center">
              <p className="text-white">Loading workflows...</p>
            </div>
          }
        >
          <WorkflowsContent />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}
