import { NextResponse } from "next/server"
import { fetchRepositoryReadme } from "@/lib/services/github-scraper"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const owner = searchParams.get("owner")
    const name = searchParams.get("name")

    if (!owner || !name) {
      return NextResponse.json({ error: "Owner and name parameters are required" }, { status: 400 })
    }

    const readme = await fetchRepositoryReadme(owner, name)

    return NextResponse.json({
      success: true,
      readme,
    })
  } catch (error) {
    console.error("Error fetching repository README:", error)
    return NextResponse.json({ error: "Failed to fetch repository README" }, { status: 500 })
  }
}
