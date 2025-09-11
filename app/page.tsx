import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProjectCard } from "@/components/project-card"
import { Github, Linkedin, Mail, Code, Brain, Palette, Rocket, Youtube, Twitter } from "lucide-react"
import projectsData from "@/data/projects.json"

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 text-balance">
              Hey there! I'm <span className="text-gradient">Joshi Minh</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-pretty">
              VKU Student, Software Engineer, AI Developer & Vibe Coder
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Welcome to my digital space! I'm passionate about creating innovative solutions at the intersection of
              technology and design. Let's build something amazing together!
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Button className="gradient-blue-pink hover:gradient-blue-pink-hover text-white border-0">
              <Mail className="w-4 h-4 mr-2" />
              Get In Touch
            </Button>
            <Button variant="outline" className="border-border hover:bg-accent bg-transparent">
              <Github className="w-4 h-4 mr-2" />
              View Projects
            </Button>
          </div>

          <div className="flex justify-center gap-6">
            <Button variant="ghost" size="icon" className="hover:bg-accent" asChild>
              <a href="https://github.com/JoshiMinh" target="_blank" rel="noopener noreferrer">
                <Github className="w-5 h-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-accent" asChild>
              <a href="https://www.linkedin.com/in/nguyen-binh-minh-jm" target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-5 h-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-accent" asChild>
              <a href="https://x.com/js_minh" target="_blank" rel="noopener noreferrer">
                <Twitter className="w-5 h-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-accent" asChild>
              <a
                href="https://www.youtube.com/channel/UCkt3Mhwb3bduqwtRDZtjvsg"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-accent" asChild>
              <a href="https://www.patreon.com/cw/u16604577" target="_blank" rel="noopener noreferrer">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M0 .48v23.04h4.22V.48zm15.385 0c-4.764 0-8.641 3.88-8.641 8.65 0 4.755 3.877 8.623 8.641 8.623 4.75 0 8.615-3.868 8.615-8.623C24 4.36 20.136.48 15.385.48z" />
                </svg>
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
                  <Badge variant="secondary">Python</Badge>
                  <Badge variant="secondary">Java</Badge>
                  <Badge variant="secondary">JavaScript</Badge>
                  <Badge variant="secondary">HTML</Badge>
                  <Badge variant="secondary">CSS</Badge>
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
                  <Badge variant="secondary">Machine Learning</Badge>
                  <Badge variant="secondary">Python</Badge>
                  <Badge variant="secondary">TensorFlow</Badge>
                  <Badge variant="secondary">AI SDK</Badge>
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
                  <Badge variant="secondary">UI/UX</Badge>
                  <Badge variant="secondary">CSS</Badge>
                  <Badge variant="secondary">HTML</Badge>
                  <Badge variant="secondary">Responsive Design</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-card/30">
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
              <Button className="gradient-blue-pink hover:gradient-blue-pink-hover text-white border-0">
                <Rocket className="w-4 h-4 mr-2" />
                Let's Collaborate
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

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground mb-4">
            Thanks for stopping by! Let's connect and build something incredible together.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="ghost" size="sm" className="hover:bg-accent" asChild>
              <a href="https://github.com/JoshiMinh" target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </a>
            </Button>
            <Button variant="ghost" size="sm" className="hover:bg-accent" asChild>
              <a href="https://www.linkedin.com/in/nguyen-binh-minh-jm" target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-4 h-4 mr-2" />
                LinkedIn
              </a>
            </Button>
            <Button variant="ghost" size="sm" className="hover:bg-accent" asChild>
              <a href="https://x.com/js_minh" target="_blank" rel="noopener noreferrer">
                <Twitter className="w-4 h-4 mr-2" />
                X/Twitter
              </a>
            </Button>
            <Button variant="ghost" size="sm" className="hover:bg-accent" asChild>
              <a
                href="https://www.youtube.com/channel/UCkt3Mhwb3bduqwtRDZtjvsg"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Youtube className="w-4 h-4 mr-2" />
                YouTube
              </a>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-8">© 2025 Joshi Minh. Built with ❤️ and lots of ☕</p>
        </div>
      </footer>
    </div>
  )
}
