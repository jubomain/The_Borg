import { type NextRequest, NextResponse } from "next/server"

interface TrendingRepo {
  name: string
  owner: string
  description: string
  language: string
  stars: number
  url: string
}

export async function GET(request: NextRequest) {
  try {
    // Fetch the GitHub trending page
    const response = await fetch("https://github.com/trending", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch GitHub trending page: ${response.status} ${response.statusText}`)
    }

    const html = await response.text()

    // Parse the HTML to extract trending repositories
    const repos = parseGitHubTrendingHtml(html)

    return NextResponse.json(repos)
  } catch (error) {
    console.error("Failed to scrape GitHub trending:", error)
    return NextResponse.json({ error: "Failed to scrape GitHub trending" }, { status: 500 })
  }
}

function parseGitHubTrendingHtml(html: string): TrendingRepo[] {
  const repos: TrendingRepo[] = []

  // Simple regex-based parsing (in a real implementation, you'd use a proper HTML parser)
  const repoRegex = /<article class="Box-row">([\s\S]*?)<\/article>/g
  const nameRegex = /<h2 class="h3 lh-condensed">[\s\S]*?<a href="([^"]+)">([\s\S]*?)<\/a>/
  const descriptionRegex = /<p class="col-9 color-fg-muted my-1 pr-4">([\s\S]*?)<\/p>/
  const languageRegex =
    /<span class="d-inline-block ml-0 mr-3">[\s\S]*?<span class="color-fg-muted text-small mr-3">([\s\S]*?)<\/span>/
  const starsRegex = /<a class="Link Link--muted d-inline-block mr-3"[\s\S]*?>([\s\S]*?)<\/a>/

  let match
  while ((match = repoRegex.exec(html)) !== null) {
    const articleHtml = match[1]

    const nameMatch = nameRegex.exec(articleHtml)
    if (!nameMatch) continue

    const repoPath = nameMatch[1].trim()
    const fullName = nameMatch[2].replace(/\s+/g, "").trim()
    const [owner, name] = fullName.split("/")

    const descriptionMatch = descriptionRegex.exec(articleHtml)
    const description = descriptionMatch ? descriptionMatch[1].trim() : ""

    const languageMatch = languageRegex.exec(articleHtml)
    const language = languageMatch ? languageMatch[1].trim() : ""

    const starsMatch = starsRegex.exec(articleHtml)
    const starsText = starsMatch ? starsMatch[1].trim().replace(/,/g, "") : "0"
    const stars = Number.parseInt(starsText, 10) || 0

    repos.push({
      name,
      owner,
      description,
      language,
      stars,
      url: `https://github.com${repoPath}`,
    })
  }

  return repos
}
