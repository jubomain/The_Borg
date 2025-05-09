import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    // Create a fresh Supabase client for this request
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        {
          connected: false,
          error:
            "Missing Supabase credentials. Please add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to your environment variables.",
        },
        { status: 500 },
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // First, let's just check if we can connect at all with a simple query
    const { data: connectionTest, error: connectionError } = await supabase.from("bots").select("*").limit(1)

    // If we can't connect to 'bots' table, it might not exist yet
    if (connectionError) {
      // Try a different approach - check if we can at least connect to Supabase
      try {
        // This will intentionally fail with a "relation does not exist" error
        // but will confirm the connection works
        const { error: pingError } = await supabase.from("_dummy_query_for_connection_test_").select("*").limit(1)

        // If we get a specific error about relation not existing, that's actually good
        // It means we can connect to the database
        if (pingError && pingError.code === "42P01") {
          // 42P01 is "relation does not exist"
          // We can connect but no tables exist yet
          return NextResponse.json({
            connected: true,
            tables: [],
            note: "Connected to database but no tables exist yet",
          })
        } else if (pingError) {
          // Some other error occurred
          return NextResponse.json(
            {
              connected: false,
              error: pingError.message || "Unknown database error",
            },
            { status: 500 },
          )
        }
      } catch (e) {
        console.error("Error during ping test:", e)
        return NextResponse.json(
          {
            connected: false,
            error: "Failed to connect to database. Please check your Supabase credentials.",
          },
          { status: 500 },
        )
      }
    }

    // Now let's check which tables exist by querying information_schema
    try {
      const { data: tablesData, error: tablesError } = await supabase
        .from("information_schema.tables")
        .select("table_name")
        .eq("table_schema", "public")

      if (tablesError) {
        // If we can't query information_schema, fall back to checking individual tables
        const expectedTables = [
          "bots",
          "bot_teams",
          "bot_strategies",
          "evolution_tasks",
          "code_analysis",
          "system_reports",
          "server_instances",
          "code_stats",
        ]

        const existingTables = []

        // Check each table
        for (const table of expectedTables) {
          try {
            const { error } = await supabase.from(table).select("*").limit(1)

            if (!error) {
              existingTables.push(table)
            }
          } catch (e) {
            console.error(`Error checking table ${table}:`, e)
            // Continue to the next table
          }
        }

        return NextResponse.json({
          connected: true,
          tables: existingTables,
          note:
            existingTables.length === 0
              ? "Connected to database but no tables exist yet"
              : `Found ${existingTables.length} of ${expectedTables.length} expected tables`,
        })
      }

      // If we successfully queried information_schema
      const tables = tablesData?.map((row) => row.table_name) || []

      return NextResponse.json({
        connected: true,
        tables,
        note: tables.length === 0 ? "Connected to database but no tables exist yet" : `Found ${tables.length} tables`,
      })
    } catch (error) {
      console.error("Error querying tables:", error)
      return NextResponse.json({
        connected: true,
        tables: [],
        note: "Connected to database but couldn't query tables",
      })
    }
  } catch (error) {
    console.error("Error checking database status:", error)
    return NextResponse.json(
      {
        connected: false,
        error: error instanceof Error ? error.message : "Failed to check database status",
      },
      { status: 500 },
    )
  }
}
