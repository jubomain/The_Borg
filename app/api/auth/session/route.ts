import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client"

export async function GET() {
  try {
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    return NextResponse.json({ session: data.session })
  } catch (error) {
    console.error("Error in session API route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
