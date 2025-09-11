import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProjectCard } from "@/components/project-card"
import { Code, Brain, Palette, Rocket } from "lucide-react"
import projectsData from "@/data/projects.json"
import socialLinks from "@/data/social-links.json"

const GitHubIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
)

const LinkedInIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const XIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
)

const YouTubeIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

const PatreonIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M0 .48v23.04h4.22V.48zm15.385 0c-4.764 0-8.641 3.88-8.641 8.65 0 4.755 3.877 8.623 8.641 8.623 4.75 0 8.615-3.868 8.615-8.623C24 4.36 20.136.48 15.385.48z" />
  </svg>
)

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 text-balance">
              Hi there! I'm <span className="text-gradient">Joshi Minh</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-pretty">
              Software Engineer, AI Developer & Vibe Coder
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Welcome to my digital space! I'm passionate about creating innovative solutions at the intersection of
              technology and design. Let's build something amazing together!
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Button className="gradient-blue-pink hover:gradient-blue-pink-hover text-white border-0" asChild>
              <a href={socialLinks.links.linkedin} target="_blank" rel="noopener noreferrer">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                  <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                </svg>
                Get In Touch
              </a>
            </Button>
            <Button variant="outline" className="border-border hover:bg-accent bg-transparent" asChild>
              <a href="#projects">
                <GitHubIcon />
                <span className="ml-2">View Projects</span>
              </a>
            </Button>
          </div>

          <div className="flex justify-center gap-6">
            <Button variant="ghost" size="icon" className="hover:bg-accent" asChild>
              <a href={socialLinks.links.github} target="_blank" rel="noopener noreferrer">
                <GitHubIcon />
              </a>
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-accent" asChild>
              <a href={socialLinks.links.linkedin} target="_blank" rel="noopener noreferrer">
                <LinkedInIcon />
              </a>
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-accent" asChild>
              <a href={socialLinks.links.twitter} target="_blank" rel="noopener noreferrer">
                <XIcon />
              </a>
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-accent" asChild>
              <a href={socialLinks.links.youtube} target="_blank" rel="noopener noreferrer">
                <YouTubeIcon />
              </a>
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-accent" asChild>
              <a href={socialLinks.links.patreon} target="_blank" rel="noopener noreferrer">
                <PatreonIcon />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">What I Do</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto text-pretty">
            I love working across different domains, from building intelligent systems to crafting beautiful user
            experiences.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg gradient-blue-pink flex items-center justify-center mb-4">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Software Engineering</CardTitle>
                <CardDescription>
                  Building robust, scalable applications with modern technologies and best practices.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge className="gradient-blue-pink text-white border-0">Python</Badge>
                  <Badge className="gradient-blue-pink text-white border-0">Java</Badge>
                  <Badge className="gradient-blue-pink text-white border-0">JavaScript</Badge>
                  <Badge className="gradient-blue-pink text-white border-0">HTML</Badge>
                  <Badge className="gradient-blue-pink text-white border-0">CSS</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg gradient-blue-pink flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <CardTitle>AI Development</CardTitle>
                <CardDescription>
                  Creating intelligent systems and exploring the frontiers of artificial intelligence.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge className="gradient-blue-pink text-white border-0">Machine Learning</Badge>
                  <Badge className="gradient-blue-pink text-white border-0">Python</Badge>
                  <Badge className="gradient-blue-pink text-white border-0">TensorFlow</Badge>
                  <Badge className="gradient-blue-pink text-white border-0">AI SDK</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg gradient-blue-pink flex items-center justify-center mb-4">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Design & Development</CardTitle>
                <CardDescription>
                  Crafting beautiful, intuitive user experiences with clean code and modern design.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge className="gradient-blue-pink text-white border-0">UI/UX</Badge>
                  <Badge className="gradient-blue-pink text-white border-0">CSS</Badge>
                  <Badge className="gradient-blue-pink text-white border-0">HTML</Badge>
                  <Badge className="gradient-blue-pink text-white border-0">Responsive Design</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">About Me</h2>
              <p className="text-muted-foreground mb-6 text-pretty">
                I'm a passionate student at VKU (Vietnam-Korea University) and a vibe coder who loves exploring the
                intersection of technology and creativity. Currently diving deep into software engineering, AI
                development, and design, I'm always excited to learn new things and tackle challenging problems.
              </p>
              <p className="text-muted-foreground mb-8 text-pretty">
                When I'm not coding, you'll find me experimenting with new design trends, contributing to open-source
                projects, or exploring the latest developments in artificial intelligence and mechatronics. I believe in
                coding with good vibes and creating solutions that make a difference.
              </p>
              <Button className="gradient-blue-pink hover:gradient-blue-pink-hover text-white border-0" asChild>
                <a href={socialLinks.links.linkedin} target="_blank" rel="noopener noreferrer">
                  <Rocket className="w-4 h-4 mr-2" />
                  Let's Collaborate
                </a>
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <div className="text-6xl">👨‍💻</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="py-20 px-6 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">My Projects & Apps</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto text-pretty">
            Check out some of the projects I've been working on. Each one represents a journey of learning and
            creativity.
          </p>

          <div className="overflow-x-auto">
            <div className="flex gap-6 pb-4 min-w-max">
              {projectsData.projects.map((projectUrl, index) => (
                <a key={index} href={projectUrl} target="_blank" rel="noopener noreferrer">
                  <ProjectCard url={projectUrl} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground mb-4">
            Thanks for stopping by! Let's connect and build something incredible together.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="ghost" size="sm" className="hover:bg-accent" asChild>
              <a href={socialLinks.links.github} target="_blank" rel="noopener noreferrer">
                <GitHubIcon />
                <span className="ml-2">GitHub</span>
              </a>
            </Button>
            <Button variant="ghost" size="sm" className="hover:bg-accent" asChild>
              <a href={socialLinks.links.linkedin} target="_blank" rel="noopener noreferrer">
                <LinkedInIcon />
                <span className="ml-2">LinkedIn</span>
              </a>
            </Button>
            <Button variant="ghost" size="sm" className="hover:bg-accent" asChild>
              <a href={socialLinks.links.twitter} target="_blank" rel="noopener noreferrer">
                <XIcon />
                <span className="ml-2">X/Twitter</span>
              </a>
            </Button>
            <Button variant="ghost" size="sm" className="hover:bg-accent" asChild>
              <a href={socialLinks.links.youtube} target="_blank" rel="noopener noreferrer">
                <YouTubeIcon />
                <span className="ml-2">YouTube</span>
              </a>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-8">© 2025 Joshi Minh. Built with ❤️ and lots of ☕</p>
        </div>
      </footer>
    </div>
  )
}
