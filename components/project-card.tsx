"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"
import { useState, useEffect } from "react"

interface ProjectData {
  title: string
  description: string
  favicon: string
  url: string
  previewImage?: string
}

interface ProjectCardProps {
  url: string
}

export function ProjectCard({ url }: ProjectCardProps) {
  const [projectData, setProjectData] = useState<ProjectData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await fetch(`/api/fetch-metadata?url=${encodeURIComponent(url)}`)

        if (response.ok) {
          const data = await response.json()
          setProjectData({
            title: data.title || extractTitleFromUrl(url),
            description: data.description || "Check out this project",
            favicon: data.favicon || `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=32`,
            previewImage: data.image || "/project-preview.png",
            url,
          })
        } else {
          throw new Error("Failed to fetch metadata")
        }
      } catch (error) {
        console.log("[v0] Error fetching project data:", error)
        setProjectData({
          title: extractTitleFromUrl(url),
          description: "Click to view project",
          favicon: `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=32`,
          previewImage: "/project-preview.png",
          url,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProjectData()
  }, [url])

  const extractTitleFromUrl = (url: string) => {
    try {
      const urlObj = new URL(url)
      const pathParts = urlObj.pathname.split("/").filter(Boolean)

      if (urlObj.hostname.includes("github.com") && pathParts.length >= 2) {
        return pathParts[1] // repo name
      }

      if (pathParts.length > 0) {
        return pathParts[pathParts.length - 1].replace(/-/g, " ")
      }

      return urlObj.hostname.replace("www.", "")
    } catch {
      return "Project"
    }
  }

  if (loading) {
    return (
      <Card className="min-w-[320px] max-w-[320px] bg-card border-border animate-pulse">
        <div className="w-full h-48 bg-muted rounded-t-lg"></div>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded flex-1"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-3 bg-muted rounded w-full mb-2"></div>
          <div className="h-3 bg-muted rounded w-2/3"></div>
        </CardContent>
      </Card>
    )
  }

  if (!projectData) return null

  return (
    <Card className="min-w-[320px] max-w-[320px] bg-card border-border hover:border-primary/50 transition-colors cursor-pointer group overflow-hidden">
      <div className="w-full h-48 overflow-hidden bg-muted">
        <img
          src={projectData.previewImage || "/project-preview.png"}
          alt={`Preview of ${projectData.title}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = "/project-preview.png"
          }}
        />
      </div>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <img
            src={projectData.favicon || "/placeholder.svg"}
            alt=""
            className="w-8 h-8 rounded flex-shrink-0"
            onError={(e) => {
              e.currentTarget.src = "/project-management-team.png"
            }}
          />
          <CardTitle className="text-lg flex-1 min-w-0 leading-tight">
            <span className="block truncate">{projectData.title}</span>
          </CardTitle>
          <ExternalLink className="w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-2 text-sm leading-relaxed">{projectData.description}</CardDescription>
      </CardContent>
    </Card>
  )
}
