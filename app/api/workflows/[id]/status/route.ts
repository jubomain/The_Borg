import { type NextRequest, NextResponse } from "next/server"
import { supabase, isDemoMode } from "@/lib/supabase-client"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { status } = await request.json()

    // Check if we're in demo mode
    if (isDemoMode()) {
      console.log(`API route running in demo mode - simulating status update for workflow ${id} to ${status}`)
      return NextResponse.json({ success: true }, { status: 200 })
    }

    // In production mode, update in Supabase
    const { error } = await supabase
      .from("workflows")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)

    if (error) {
      console.error("Error updating workflow status in Supabase:", error)
      throw error
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error in workflow status update API route:", error)
    return NextResponse.json(
      { error: "Failed to update workflow status", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
