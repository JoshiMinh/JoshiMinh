"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

interface ProjectData {
  title: string
  description: string
  favicon: string
  url: string
}

interface ProjectCardProps {
  url: string
}

const PLACEHOLDER_FAVICON = "/placeholder-logo.png"
const FALLBACK_DESCRIPTION = "Check out this project"
const ERROR_DESCRIPTION = "Click to view project"

const extractTitleFromUrl = (projectUrl: string) => {
  try {
    const urlObj = new URL(projectUrl)
    const pathParts = urlObj.pathname.split("/").filter(Boolean)

    if (urlObj.hostname.includes("github.com") && pathParts.length >= 2) {
      return pathParts[1]
    }

    if (pathParts.length > 0) {
      return pathParts[pathParts.length - 1].replace(/-/g, " ")
    }

    return urlObj.hostname.replace(/^www\./, "")
  } catch {
    return "Project"
  }
}

const buildFaviconUrl = (projectUrl: string) => {
  try {
    const { hostname } = new URL(projectUrl)
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`
  } catch {
    return PLACEHOLDER_FAVICON
  }
}

export function ProjectCard({ url }: ProjectCardProps) {
  const [projectData, setProjectData] = useState<ProjectData | null>(null)
  const [loading, setLoading] = useState(true)

  const fallbackFavicon = useMemo(() => buildFaviconUrl(url), [url])

  useEffect(() => {
    const controller = new AbortController()

    setLoading(true)
    setProjectData(null)

    const fetchProjectData = async () => {
      try {
        const response = await fetch(`/api/fetch-metadata?url=${encodeURIComponent(url)}`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error("Failed to fetch metadata")
        }

        const data = await response.json()

        setProjectData({
          title: data.title?.trim() || extractTitleFromUrl(url),
          description: data.description?.trim() || FALLBACK_DESCRIPTION,
          favicon: data.favicon || fallbackFavicon,
          url,
        })
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          return
        }

        console.error("[ProjectCard] Error fetching project data", error)
        setProjectData({
          title: extractTitleFromUrl(url),
          description: ERROR_DESCRIPTION,
          favicon: fallbackFavicon,
          url,
        })
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchProjectData()

    return () => controller.abort()
  }, [fallbackFavicon, url])

  if (loading) {
    return (
      <Card className="h-full min-h-[200px] bg-card border-border/60 animate-pulse">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-muted" />
              <div className="h-3 w-1/2 rounded bg-muted/80" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="h-3 w-full rounded bg-muted/80" />
          <div className="h-3 w-5/6 rounded bg-muted/60" />
        </CardContent>
      </Card>
    )
  }

  if (!projectData) return null

  const { hostname, pathSegments } = getUrlDetails(projectData.url)

  return (
    <a href={projectData.url} target="_blank" rel="noopener noreferrer" className="group block h-full">
      <Card className="relative h-full overflow-hidden border border-border/60 bg-card/70 transition duration-300 hover:border-primary/40 hover:shadow-[0_30px_60px_-40px_rgba(191,90,242,0.6)]">
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/20" />
        </div>
        <CardHeader className="relative pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/70">
                <img
                  src={projectData.favicon || PLACEHOLDER_FAVICON}
                  alt=""
                  className="h-5 w-5"
                  onError={(e) => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src = PLACEHOLDER_FAVICON
                  }}
                />
              </span>
              <div className="min-w-0">
                <CardTitle className="truncate text-lg leading-tight">{projectData.title}</CardTitle>
                <p className="text-xs text-muted-foreground">{hostname}</p>
              </div>
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              Visit
              <ExternalLink className="h-4 w-4" />
            </span>
          </div>
        </CardHeader>
        <CardContent className="relative space-y-4">
          <CardDescription className="text-sm leading-relaxed text-muted-foreground">
            {projectData.description}
          </CardDescription>
          {pathSegments.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {pathSegments.map((segment, index) => (
                <span
                  key={`${segment}-${index}`}
                  className="rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs uppercase tracking-wide text-muted-foreground"
                >
                  {segment.replace(/-/g, " ")}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </a>
  )
}

const getUrlDetails = (projectUrl: string) => {
  try {
    const urlObj = new URL(projectUrl)
    const pathSegments = urlObj.pathname
      .split("/")
      .filter(Boolean)
      .slice(0, 3)

    return {
      hostname: urlObj.hostname.replace(/^www\./, ""),
      pathSegments,
    }
  } catch {
    return {
      hostname: projectUrl,
      pathSegments: [] as string[],
    }
  }
}
