import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 })
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; MetadataBot/1.0)",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const html = await response.text()

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const title = titleMatch ? titleMatch[1].trim() : ""

    // Extract description
    const descMatch =
      html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i)
    const description = descMatch ? descMatch[1].trim() : ""

    // Extract favicon
    const faviconMatch = html.match(/<link[^>]*rel=["'](?:icon|shortcut icon)["'][^>]*href=["']([^"']+)["']/i)
    let favicon = faviconMatch ? faviconMatch[1] : ""

    if (favicon && !favicon.startsWith("http")) {
      const baseUrl = new URL(url)
      favicon = favicon.startsWith("/") ? `${baseUrl.origin}${favicon}` : `${baseUrl.origin}/${favicon}`
    }

    const imageMatch =
      html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]*property=["']og:image:url["'][^>]*content=["']([^"']+)["']/i)

    let image = imageMatch ? imageMatch[1].trim() : ""

    if (image && !image.startsWith("http")) {
      const baseUrl = new URL(url)
      image = image.startsWith("/") ? `${baseUrl.origin}${image}` : `${baseUrl.origin}/${image}`
    }

    return NextResponse.json({
      title,
      description,
      favicon: favicon || `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=32`,
      image: image || null,
    })
  } catch (error) {
    console.error("Error fetching metadata:", error)
    return NextResponse.json({ error: "Failed to fetch metadata" }, { status: 500 })
  }
}
