import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { supabaseAdmin, runMigration, isDemoMode } from "@/lib/supabase-client"

async function readFileSafe(filePath: string): Promise<string | null> {
  try {
    return fs.readFileSync(filePath, "utf8")
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error)
    return null
  }
}

export async function POST() {
  try {
    // Check if we're in demo mode
    if (isDemoMode()) {
      console.log("Running in demo mode - simulating database initialization")
      // Simulate a delay to make it feel real
      await new Promise((resolve) => setTimeout(resolve, 1500))
      return NextResponse.json({
        success: true,
        message: "Database initialized successfully (Demo Mode)",
      })
    }

    // Check if we have admin access
    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: "Supabase admin client not initialized. Check your SUPABASE_SERVICE_ROLE_KEY.",
        },
        { status: 500 },
      )
    }

    // Read the SQL file
    const sqlFilePath = path.join(process.cwd(), "migrations", "create_all_tables.sql")
    let sql

    try {
      sql = fs.readFileSync(sqlFilePath, "utf8")
    } catch (error) {
      console.error("Error reading SQL file:", error)
      return NextResponse.json(
        {
          success: false,
          error: "Could not read SQL migration file. Make sure it exists in the migrations directory.",
        },
        { status: 500 },
      )
    }

    // Run the migration
    const { data, error } = await runMigration(sql)

    if (error) {
      console.error("Error running migration:", error)
      return NextResponse.json(
        {
          success: false,
          error: `Failed to run migration: ${error.message}`,
        },
        { status: 500 },
      )
    }

    // Add chats table migration
    const chatsMigration = await readFileSafe(path.join(process.cwd(), "migrations/create_chats_table.sql"))
    if (chatsMigration) {
      console.log("Running chats table migration...")
      const { data: chatsResult, error: chatsError } = await runMigration(chatsMigration)

      if (chatsError) {
        console.error("Error creating chats table:", chatsError)
        return NextResponse.json({ error: "Failed to create chats table", details: chatsError }, { status: 500 })
      }

      console.log("Chats table migration result:", chatsResult)
    }

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
    })
  } catch (error: any) {
    console.error("Unexpected error initializing database:", error)
    return NextResponse.json(
      {
        success: false,
        error: `An unexpected error occurred: ${error.message}`,
      },
      { status: 500 },
    )
  }
}
