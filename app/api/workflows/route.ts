import { NextResponse } from "next/server"
import { supabase, getMockData, isDemoMode } from "@/lib/supabase-client"

export async function GET() {
  try {
    // Check if we're in demo mode
    if (isDemoMode()) {
      console.log("API route running in demo mode - using mock workflows data")
      const mockWorkflows = getMockData("workflows")
      return NextResponse.json({ workflows: mockWorkflows }, { status: 200 })
    }

    // In production mode, fetch from Supabase
    const { data, error } = await supabase.from("workflows").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching workflows from Supabase:", error)
      throw error
    }

    return NextResponse.json({ workflows: data }, { status: 200 })
  } catch (error) {
    console.error("Error in workflows API route:", error)
    return NextResponse.json(
      { error: "Failed to fetch workflows", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
