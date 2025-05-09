import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { data: sessionData } = await supabase.auth.getSession()

    if (!sessionData.session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = sessionData.session.user.id
    const chatId = params.id

    const { data, error } = await supabase.from("chats").select("*").eq("id", chatId).eq("user_id", userId).single()

    if (error) {
      throw error
    }

    if (!data) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    // Parse messages from JSON string
    const messages = JSON.parse(data.messages || "[]")

    return NextResponse.json({ ...data, messages })
  } catch (error) {
    console.error("Error in get chat API route:", error)
    return NextResponse.json({ error: "Failed to fetch chat" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { data: sessionData } = await supabase.auth.getSession()

    if (!sessionData.session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = sessionData.session.user.id
    const chatId = params.id
    const { title, messages } = await req.json()

    // First check if the chat belongs to the user
    const { data: chatData, error: chatError } = await supabase
      .from("chats")
      .select("user_id")
      .eq("id", chatId)
      .single()

    if (chatError || !chatData) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    if (chatData.user_id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Update the chat
    const { data, error } = await supabase
      .from("chats")
      .update({
        title,
        messages: JSON.stringify(messages),
        updated_at: new Date().toISOString(),
      })
      .eq("id", chatId)
      .select()

    if (error) {
      throw error
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Error in update chat API route:", error)
    return NextResponse.json({ error: "Failed to update chat" }, { status: 500 })
  }
}
