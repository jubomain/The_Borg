import { parse } from "node-html-parser"

export type TrendingRepository = {
  name: string
  owner: string
  fullName: string
  description: string
  url: string
  language: string
  languageColor: string
  stars: number
  forks: number
  todayStars: number
  topics: string[]
}

export async function scrapeGithubTrending(): Promise<TrendingRepository[]> {
  try {
    // Fetch the GitHub trending page
    const response = await fetch("https://github.com/trending", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch GitHub trending: ${response.status}`)
    }

    const html = await response.text()
    const root = parse(html)

    // Select all repository articles
    const repoArticles = root.querySelectorAll("article.Box-row")

    const repositories: TrendingRepository[] = []

    for (const article of repoArticles) {
      try {
        // Extract repository information
        const repoHeading = article.querySelector("h2.h3.lh-condensed")
        const repoLink = repoHeading?.querySelector("a")
        const repoPath = repoLink?.getAttribute("href")?.substring(1) // Remove leading slash

        if (!repoPath) continue

        const [owner, name] = repoPath.split("/")

        const description = article.querySelector("p")?.text.trim() || ""

        // Extract language
        const languageSpan = article.querySelector('span[itemprop="programmingLanguage"]')
        const language = languageSpan?.text.trim() || ""

        // Extract language color
        const languageColorSpan = languageSpan?.previousElementSibling
        const languageColor =
          languageColorSpan?.getAttribute("style")?.replace("background-color:", "").trim() || "#ccc"

        // Extract stars
        const starsLink = article.querySelectorAll('a[href*="/stargazers"]')
        const stars = Number.parseInt(starsLink[0]?.text.trim().replace(",", "") || "0", 10)

        // Extract forks
        const forksLink = article.querySelector('a[href*="/network/members"]')
        const forks = Number.parseInt(forksLink?.text.trim().replace(",", "") || "0", 10)

        // Extract today's stars
        const todayStarsSpan = article.querySelector("span.d-inline-block.float-sm-right")
        const todayStarsText = todayStarsSpan?.text.trim().match(/\d+/)?.[0] || "0"
        const todayStars = Number.parseInt(todayStarsText, 10)

        repositories.push({
          name,
          owner,
          fullName: `${owner}/${name}`,
          description,
          url: `https://github.com/${owner}/${name}`,
          language,
          languageColor,
          stars,
          forks,
          todayStars,
          topics: [], // We'll need to fetch these separately as they're not on the trending page
        })
      } catch (error) {
        console.error("Error parsing repository article:", error)
      }
    }

    return repositories
  } catch (error) {
    console.error("Error scraping GitHub trending:", error)
    throw error
  }
}

export async function fetchRepositoryTopics(owner: string, name: string): Promise<string[]> {
  try {
    // Fetch the repository page to extract topics
    const response = await fetch(`https://github.com/${owner}/${name}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })

    if (!response.ok) {
      return []
    }

    const html = await response.text()
    const root = parse(html)

    // Extract topics
    const topicLinks = root.querySelectorAll("a.topic-tag")
    const topics = topicLinks.map((link) => link.text.trim())

    return topics
  } catch (error) {
    console.error(`Error fetching topics for ${owner}/${name}:`, error)
    return []
  }
}

export async function fetchRepositoryReadme(owner: string, name: string): Promise<string> {
  try {
    // Fetch the repository README
    const response = await fetch(`https://raw.githubusercontent.com/${owner}/${name}/main/README.md`)

    if (!response.ok) {
      // Try master branch if main doesn't exist
      const masterResponse = await fetch(`https://raw.githubusercontent.com/${owner}/${name}/master/README.md`)

      if (!masterResponse.ok) {
        return ""
      }

      return await masterResponse.text()
    }

    return await response.text()
  } catch (error) {
    console.error(`Error fetching README for ${owner}/${name}:`, error)
    return ""
  }
}
