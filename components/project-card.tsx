"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"
import { useState, useEffect } from "react"

interface ProjectData {
  title: string
  description: string
  favicon: string
  url: string
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
        // Extract domain from URL for favicon
        const urlObj = new URL(url)
        const domain = urlObj.hostname

        // Use Google's favicon service as fallback
        const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`

        // For GitHub repos, extract repo name as title
        let title = url
        let description = "Check out this project"

        if (url.includes("github.com")) {
          const pathParts = urlObj.pathname.split("/").filter(Boolean)
          if (pathParts.length >= 2) {
            title = pathParts[1] // repo name
            description = `GitHub repository by ${pathParts[0]}`
          }
        }

        setProjectData({
          title,
          description,
          favicon,
          url,
        })
      } catch (error) {
        console.log("[v0] Error fetching project data:", error)
        setProjectData({
          title: "Project",
          description: "Click to view project",
          favicon: "/project-management-team.png",
          url,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProjectData()
  }, [url])

  if (loading) {
    return (
      <Card className="min-w-[280px] bg-card border-border animate-pulse">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-24"></div>
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
    <Card className="min-w-[280px] bg-card border-border hover:border-primary/50 transition-colors cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <img
            src={projectData.favicon || "/placeholder.svg"}
            alt=""
            className="w-8 h-8 rounded"
            onError={(e) => {
              e.currentTarget.src = "/project-management-team.png"
            }}
          />
          <CardTitle className="text-lg truncate">{projectData.title}</CardTitle>
          <ExternalLink className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-2">{projectData.description}</CardDescription>
      </CardContent>
    </Card>
  )
}
