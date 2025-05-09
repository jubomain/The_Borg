"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { BrowserController } from "@/components/browser-control"

export default function BrowserControlPage() {
  const [status, setStatus] = useState<string>("Ready to initialize browser")

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-800 flex items-center">
        <Link href="/dashboard" className="mr-4">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold">Browser Control</h1>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-4 bg-gray-800 text-white px-4 py-2 rounded-md">
          <p className="text-sm">Status: {status}</p>
        </div>

        <BrowserController onStatusChange={setStatus} />
      </div>
    </div>
  )
}
