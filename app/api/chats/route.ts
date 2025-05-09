import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client"

export async function GET() {
  try {
    const { data: sessionData } = await supabase.auth.getSession()

    if (!sessionData.session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = sessionData.session.user.id

    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ chats: data })
  } catch (error) {
    console.error("Error in chats API route:", error)
    return NextResponse.json({ error: "Failed to fetch chats" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { data: sessionData } = await supabase.auth.getSession()

    if (!sessionData.session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = sessionData.session.user.id
    const { title, messages } = await req.json()

    const { data, error } = await supabase
      .from("chats")
      .insert({
        title,
        user_id: userId,
        messages: JSON.stringify(messages),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()

    if (error) {
      throw error
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Error in create chat API route:", error)
    return NextResponse.json({ error: "Failed to create chat" }, { status: 500 })
  }
}
