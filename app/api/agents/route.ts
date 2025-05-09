import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client"

export async function GET() {
  try {
    const { data: sessionData } = await supabase.auth.getSession()

    if (!sessionData.session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase.from("agents").select("*")

    if (error) {
      throw error
    }

    return NextResponse.json({ agents: data })
  } catch (error) {
    console.error("Error in agents API route:", error)

    // Return demo data if there's an error
    return NextResponse.json({
      agents: [
        {
          id: "1",
          name: "Research Assistant",
          icon: "📚",
          description: "Helps with research and information gathering",
        },
        { id: "2", name: "Code Assistant", icon: "💻", description: "Assists with coding tasks and debugging" },
        { id: "3", name: "Data Analyst", icon: "📊", description: "Analyzes data and provides insights" },
        { id: "4", name: "Creative Writer", icon: "✍️", description: "Helps with content creation and writing" },
      ],
    })
  }
}
