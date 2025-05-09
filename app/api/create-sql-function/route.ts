import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST() {
  try {
    // Only allow if explicitly enabled
    if (process.env.ALLOW_DB_INIT !== "true") {
      return NextResponse.json(
        {
          success: false,
          error: "Function creation is not enabled. Set ALLOW_DB_INIT=true to enable.",
        },
        { status: 403 },
      )
    }

    // Create a fresh Supabase client for this request
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ success: false, error: "Missing Supabase credentials" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // SQL to create the exec_sql function
    const createFunctionSql = `
      CREATE OR REPLACE FUNCTION exec_sql(sql_query TEXT)
      RETURNS VOID AS $$
      BEGIN
        EXECUTE sql_query;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `

    // Try to execute the SQL directly
    const { error } = await supabase.rpc("exec_sql", { sql_query: createFunctionSql })

    if (error) {
      // If that fails, try using the REST API
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({ sql_query: createFunctionSql }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          return NextResponse.json({
            success: false,
            error: "Failed to create function via REST API",
            details: errorData,
          })
        }

        return NextResponse.json({
          success: true,
          message: "SQL function created successfully via REST API",
        })
      } catch (restError) {
        return NextResponse.json({
          success: false,
          error: "Failed to create SQL function",
          details: restError.message,
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: "SQL function created successfully",
    })
  } catch (error) {
    console.error("Error creating SQL function:", error)
    return NextResponse.json({ success: false, error: "Failed to create SQL function" }, { status: 500 })
  }
}
