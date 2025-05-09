import { type NextRequest, NextResponse } from "next/server"
import { supabase, isDemoMode } from "@/lib/supabase-client"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Check if we're in demo mode
    if (isDemoMode()) {
      console.log(`API route running in demo mode - simulating deletion of workflow ${id}`)
      return NextResponse.json({ success: true }, { status: 200 })
    }

    // In production mode, delete from Supabase
    const { error } = await supabase.from("workflows").delete().eq("id", id)

    if (error) {
      console.error("Error deleting workflow from Supabase:", error)
      throw error
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error in workflow deletion API route:", error)
    return NextResponse.json(
      { error: "Failed to delete workflow", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
