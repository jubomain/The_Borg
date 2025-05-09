import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-client"

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const data = await request.json()

    // Validate the SMTP configuration
    const { host, port, username, password, fromEmail, fromName, secure } = data

    if (!host || !port || !username || !password || !fromEmail) {
      return NextResponse.json({ error: "Missing required SMTP configuration fields" }, { status: 400 })
    }

    // Store the SMTP configuration in the database
    // Note: In a production environment, you should encrypt sensitive data like passwords
    const { error } = await supabase.from("system_settings").upsert({
      key: "smtp_config",
      value: {
        host,
        port,
        username,
        password, // In production, encrypt this value
        fromEmail,
        fromName,
        secure,
      },
    })

    if (error) {
      console.error("Error saving SMTP configuration:", error)
      return NextResponse.json({ error: "Failed to save SMTP configuration" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in SMTP setup:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("system_settings").select("value").eq("key", "smtp_config").single()

    if (error) {
      return NextResponse.json({ error: "Failed to retrieve SMTP configuration" }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ config: null })
    }

    // In production, decrypt the password before returning
    return NextResponse.json({ config: data.value })
  } catch (error) {
    console.error("Error retrieving SMTP configuration:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
