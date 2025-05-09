import { createClient } from "@supabase/supabase-js"
export { createClient } from "@supabase/supabase-js"

// Check if we're in demo mode (preview environment or missing credentials)
export const isDemoMode = () => {
  // Force demo mode in preview environments
  if (typeof window !== "undefined" && window.location.hostname.includes("vusercontent.net")) {
    return true
  }

  // Check for missing credentials
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return !supabaseUrl || !supabaseKey
}

// Initialize the Supabase client for client-side operations
const createSupabaseClient = () => {
  if (isDemoMode()) {
    console.log("Running in demo mode - using mock Supabase client")
    return createMockClient()
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase URL or anon key is missing - using mock client")
    return createMockClient()
  }

  return createClient(supabaseUrl, supabaseKey)
}

// Initialize the Supabase admin client for server-side operations
const createSupabaseAdminClient = () => {
  if (isDemoMode()) {
    console.log("Running in demo mode - using mock Supabase admin client")
    return createMockAdminClient()
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn("Supabase URL or service role key is missing - using mock admin client")
    return createMockAdminClient()
  }

  return createClient(supabaseUrl, supabaseServiceKey)
}

// Create clients with fallbacks
export const supabase = createSupabaseClient()
export const supabaseAdmin = createSupabaseAdminClient()

// Mock client for when Supabase is not available
function createMockClient() {
  // Store demo user in memory
  let demoUser = null
  let demoSession = null

  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            limit: () => Promise.resolve({ data: [], error: null }),
          }),
        }),
      }),
      insert: () => Promise.resolve({ data: null, error: null }),
    }),
    auth: {
      signInWithPassword: ({ email, password }) => {
        console.log("Mock signInWithPassword called with:", { email, password })

        // For demo mode, accept any email with password "demo123"
        if (password === "demo123") {
          demoUser = {
            id: "demo-user-id",
            email,
            user_metadata: { name: email.split("@")[0] },
          }
          demoSession = {
            access_token: "mock-token",
            user: demoUser,
          }

          return Promise.resolve({
            data: { user: demoUser, session: demoSession },
            error: null,
          })
        }

        // Otherwise return error
        return Promise.resolve({
          data: { user: null, session: null },
          error: { message: "Invalid login credentials" },
        })
      },
      signUp: ({ email, password }) => {
        console.log("Mock signUp called with:", { email })
        return Promise.resolve({
          data: { user: null, session: null },
          error: null,
        })
      },
      signOut: () => {
        console.log("Mock signOut called")
        demoUser = null
        demoSession = null
        return Promise.resolve({ error: null })
      },
      getSession: () => {
        console.log("Mock getSession called, session:", demoSession ? "exists" : "null")
        return Promise.resolve({
          data: { session: demoSession },
          error: null,
        })
      },
      getUser: () => {
        console.log("Mock getUser called, user:", demoUser ? "exists" : "null")
        return Promise.resolve({
          data: { user: demoUser },
          error: null,
        })
      },
      onAuthStateChange: (callback) => {
        console.log("Mock onAuthStateChange called")
        // Just return a dummy subscription
        return {
          data: {
            subscription: {
              unsubscribe: () => {
                console.log("Mock unsubscribe called")
              },
            },
          },
        }
      },
      resetPasswordForEmail: (email) => {
        console.log("Mock resetPasswordForEmail called with:", email)
        return Promise.resolve({ data: {}, error: null })
      },
      updateUser: (updates) => {
        console.log("Mock updateUser called with:", updates)
        if (demoUser) {
          demoUser = { ...demoUser, ...updates }
        }
        return Promise.resolve({ data: { user: demoUser }, error: null })
      },
    },
    rpc: (functionName, params) => {
      console.log(`Mock RPC call to ${functionName} with params:`, params)
      return Promise.resolve({ data: null, error: null })
    },
  }
}

// Mock admin client for when Supabase admin is not available
function createMockAdminClient() {
  const mockClient = createMockClient()

  return {
    ...mockClient,
    auth: {
      ...mockClient.auth,
      admin: {
        createUser: ({ email, password, user_metadata }) => {
          console.log("Mock admin.createUser called with:", { email, user_metadata })
          return Promise.resolve({
            data: {
              user: {
                id: "mock-admin-user-id",
                email,
                user_metadata,
              },
            },
            error: null,
          })
        },
      },
    },
    rpc: (functionName, params) => {
      console.log(`Mock admin RPC call to ${functionName} with params:`, params)

      // Special handling for exec_sql
      if (functionName === "exec_sql") {
        console.log("Mock SQL execution:", params.sql?.substring(0, 100) + "...")
        return Promise.resolve({ data: { executed: true }, error: null })
      }

      return Promise.resolve({ data: null, error: null })
    },
  }
}

// Function to store a memory
export async function storeMemory(agentId: string, content: string, type = "conversation") {
  if (isDemoMode()) {
    console.log("Demo mode: Simulating memory storage for agent:", agentId)
    return { data: null, error: null }
  }

  if (!supabase) return { error: "Supabase client not initialized" }

  try {
    const { data, error } = await supabase.from("agent_memories").insert([
      {
        agent_id: agentId,
        content,
        type,
        created_at: new Date().toISOString(),
      },
    ])

    return { data, error }
  } catch (e) {
    console.error("Error storing memory:", e)
    return { data: null, error: "Failed to store memory" }
  }
}

// Function to retrieve memories
export async function retrieveMemories(agentId: string, limit = 10) {
  if (isDemoMode()) {
    console.log("Demo mode: Simulating memory retrieval for agent:", agentId)
    return { data: [], error: null }
  }

  if (!supabase) return { error: "Supabase client not initialized" }

  try {
    const { data, error } = await supabase
      .from("agent_memories")
      .select("*")
      .eq("agent_id", agentId)
      .order("created_at", { ascending: false })
      .limit(limit)

    return { data, error }
  } catch (e) {
    console.error("Error retrieving memories:", e)
    return { data: [], error: "Failed to retrieve memories" }
  }
}

// Function to store a document for RAG
export async function storeDocument(title: string, content: string, metadata: any = {}) {
  if (isDemoMode()) {
    console.log("Demo mode: Simulating document storage:", title)
    return { data: null, error: null }
  }

  if (!supabase) return { error: "Supabase client not initialized" }

  try {
    const { data, error } = await supabase.from("documents").insert([
      {
        title,
        content,
        metadata,
        created_at: new Date().toISOString(),
      },
    ])

    return { data, error }
  } catch (e) {
    console.error("Error storing document:", e)
    return { data: null, error: "Failed to store document" }
  }
}

// Function to search documents for RAG
export async function searchDocuments(query: string, limit = 5) {
  if (isDemoMode()) {
    console.log("Demo mode: Simulating document search:", query)
    return { data: [], error: null }
  }

  if (!supabase) return { error: "Supabase client not initialized" }

  try {
    // This assumes you have set up full-text search in Supabase
    const { data, error } = await supabase.rpc("search_documents", {
      query_text: query,
      match_limit: limit,
    })

    return { data, error }
  } catch (e) {
    console.error("Error searching documents:", e)
    return { data: [], error: "Failed to search documents" }
  }
}

// Server-side functions that require admin privileges
export async function runMigration(sql: string) {
  if (isDemoMode()) {
    console.log("Demo mode: Simulating SQL migration")
    // Return a successful mock response
    return {
      data: { executed: true, tables_created: ["agents", "workflows", "memories"] },
      error: null,
    }
  }

  if (!supabaseAdmin) {
    console.error("Supabase admin client not initialized")
    return {
      data: null,
      error: { message: "Supabase admin client not initialized" },
    }
  }

  try {
    // Wrap the RPC call in a try/catch to handle any errors
    const { data, error } = await supabaseAdmin.rpc("exec_sql", { sql })

    if (error) {
      console.error("Error from Supabase RPC:", error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (e) {
    console.error("Exception running migration:", e)
    return {
      data: null,
      error: {
        message: e instanceof Error ? e.message : "Unknown error running migration",
      },
    }
  }
}

export async function createBotUser(email: string, password: string, metadata: any = {}) {
  if (isDemoMode()) {
    console.log("Demo mode: Simulating bot user creation:", email)
    return { data: null, error: null }
  }

  if (!supabaseAdmin) return { error: "Supabase admin client not initialized" }

  try {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: metadata,
      email_confirm: true,
    })

    return { data, error }
  } catch (e) {
    console.error("Error creating bot user:", e)
    return { data: null, error: "Failed to create bot user" }
  }
}

// Create a demo mode flag
const isDemoModeNew = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Export a mock version for demo mode
export const getMockData = (tableName: string) => {
  // Mock data for different tables
  const mockData = {
    workflows: [
      {
        id: "1",
        name: "Email Marketing Automation",
        description: "Automatically send personalized emails based on user behavior",
        status: "active",
        last_run: new Date(Date.now() - 86400000).toISOString(),
        success_rate: 98,
        created_at: new Date(Date.now() - 7776000000).toISOString(),
        updated_at: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: "2",
        name: "Social Media Monitoring",
        description: "Track brand mentions and sentiment across social platforms",
        status: "paused",
        last_run: new Date(Date.now() - 259200000).toISOString(),
        success_rate: 85,
        created_at: new Date(Date.now() - 15552000000).toISOString(),
        updated_at: new Date(Date.now() - 259200000).toISOString(),
      },
      {
        id: "3",
        name: "Content Generation Pipeline",
        description: "Generate blog post drafts from trending topics",
        status: "draft",
        last_run: null,
        success_rate: 0,
        created_at: new Date(Date.now() - 172800000).toISOString(),
        updated_at: new Date(Date.now() - 172800000).toISOString(),
      },
    ],
    // Add other tables as needed
  }

  return mockData[tableName as keyof typeof mockData] || []
}

// Export a demo-aware version of the client
export const getSupabaseClient = () => {
  return {
    from: (tableName: string) => ({
      select: (columns = "*") => {
        if (isDemoModeNew) {
          // In demo mode, return mock data
          return Promise.resolve({
            data: getMockData(tableName),
            error: null,
          })
        }
        // In real mode, use the actual client
        return supabase.from(tableName).select(columns)
      },
      update: (data: any) => ({
        eq: (column: string, value: any) => {
          if (isDemoModeNew) {
            // Mock update in demo mode
            return Promise.resolve({ error: null })
          }
          return supabase.from(tableName).update(data).eq(column, value)
        },
      }),
      delete: () => ({
        eq: (column: string, value: any) => {
          if (isDemoModeNew) {
            // Mock delete in demo mode
            return Promise.resolve({ error: null })
          }
          return supabase.from(tableName).delete().eq(column, value)
        },
      }),
    }),
  }
}

// Default export for compatibility
export default {
  supabase,
  supabaseAdmin,
  isDemoMode,
  getMockData,
  getSupabaseClient,
  runMigration,
}
