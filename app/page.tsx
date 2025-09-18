import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProjectCard } from "@/components/project-card"
import {
  Brain,
  Code,
  Coffee,
  Layers,
  Palette,
  Rocket,
  Sparkles,
  HeartHandshake,
  Wand2,
  Workflow,
  type LucideIcon,
} from "lucide-react"
import socialLinks from "@/data/social-links.json"

const GitHubIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      fill="currentColor"
      d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.111.82-.261.82-.577 0-.287-.01-1.244-.015-2.444-3.338.724-4.043-1.61-4.043-1.61-.546-1.385-1.333-1.754-1.333-1.754-1.089-.745.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.775.418-1.305.76-1.605-2.665-.303-5.466-1.335-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.304-.536-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.52 11.52 0 0 1 3.003-.404c1.02.005 2.044.138 3.003.404 2.29-1.552 3.295-1.23 3.295-1.23.653 1.653.241 2.873.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.807 5.624-5.479 5.921.43.372.823 1.105.823 2.226 0 1.606-.014 2.898-.014 3.293 0 .319.216.694.825.576C20.565 22.092 24 17.592 24 12.297 24 5.373 18.627 0 12 .297Z"
    />
  </svg>
)

const LinkedInIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const XIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
)

const YouTubeIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93-.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

const PatreonIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M0 .48v23.04h4.22V.48zm15.385 0c-4.764 0-8.641 3.88-8.641 8.65 0 4.755 3.877 8.623 8.641 8.623 4.75 0 8.615-3.868 8.615-8.623C24 4.36 20.136.48 15.385.48z" />
  </svg>
)

type ExpertiseArea = {
  title: string
  description: string
  tags: string[]
  icon: LucideIcon
  accent: string
}

type Highlight = {
  title: string
  description: string
  icon: LucideIcon
}

type FocusArea = {
  title: string
  description: string
  icon: LucideIcon
}

type DonationLink = {
  label: string
  shortLabel: string
  href: string
  icon: LucideIcon
  heroClass: string
  footerClass: string
}

const createGradientStyle = (index: number, total: number) => {
  const hueStart = 220
  const hueEnd = 320
  const steps = Math.max(total - 1, 1)
  const hue = hueStart + (index / steps) * (hueEnd - hueStart)

  return {
    background: `linear-gradient(135deg, hsl(${hue}, 70%, 60%) 0%, hsl(${hue + 20}, 70%, 60%) 100%)`,
    color: "white",
    border: "0",
  }
}

const PROJECT_URLS = [
  "https://markbase-joshiminh.vercel.app/",
  "https://watchbase.vercel.app/",
]

const SKILL_TAGS = ["Python", "Java", "JavaScript", "HTML", "CSS"]
const AI_TAGS = ["Machine Learning", "Python", "TensorFlow", "AI SDK"]
const DESIGN_TAGS = ["UI/UX", "CSS", "HTML", "Responsive Design"]

const EXPERTISE_AREAS: ExpertiseArea[] = [
  {
    title: "Software Engineering",
    description: "Building resilient, scalable applications with thoughtful architecture and clean code.",
    tags: SKILL_TAGS,
    icon: Code,
    accent: "from-sky-400/70 via-blue-500/60 to-indigo-500/70",
  },
  {
    title: "AI Development",
    description: "Designing intelligent systems and bringing machine learning ideas into joyful products.",
    tags: AI_TAGS,
    icon: Brain,
    accent: "from-fuchsia-400/70 via-purple-500/60 to-indigo-500/60",
  },
  {
    title: "Design & Experience",
    description: "Crafting beautiful, intuitive interfaces where aesthetics meet accessible, human-centered UX.",
    tags: DESIGN_TAGS,
    icon: Palette,
    accent: "from-rose-400/70 via-pink-400/60 to-orange-400/70",
  },
]

const HERO_HIGHLIGHTS: Highlight[] = [
  {
    title: "Joyful digital products",
    description: "Blending design and engineering to deliver experiences that feel personal, polished, and fast.",
    icon: Sparkles,
  },
  {
    title: "AI-native workflows",
    description: "Prototyping copilots and automation that take teams from idea to production quickly.",
    icon: Workflow,
  },
]

const FOCUS_AREAS: FocusArea[] = [
  {
    title: "Creative AI copilots",
    description: "Exploring interfaces that amplify imagination and unlock new creative rituals.",
    icon: Wand2,
  },
  {
    title: "Design systems that scale",
    description: "Establishing cohesive visual languages and component libraries that keep teams aligned.",
    icon: Layers,
  },
  {
    title: "Delightful developer experience",
    description: "Automating the boring parts so builders can focus on shipping meaningful value.",
    icon: Rocket,
  },
]

const SOCIAL_BUTTONS = [
  { label: "GitHub", href: socialLinks.links.github, icon: GitHubIcon },
  { label: "LinkedIn", href: socialLinks.links.linkedin, icon: LinkedInIcon },
  { label: "X/Twitter", href: socialLinks.links.twitter, icon: XIcon },
  { label: "YouTube", href: socialLinks.links.youtube, icon: YouTubeIcon },
  { label: "Patreon", href: socialLinks.links.patreon, icon: PatreonIcon },
]

const DONATION_LINKS: DonationLink[] = [
  {
    label: "Support on Ko-fi",
    shortLabel: "Ko-fi",
    href: "https://ko-fi.com/joshiminh",
    icon: Coffee,
    heroClass: "border-sky-400/60 bg-background/60 text-sky-200 hover:bg-sky-500/15 hover:text-white",
    footerClass: "border-sky-400/60 bg-sky-500/10 text-sky-200 hover:bg-sky-500/20 hover:text-white",
  },
  {
    label: "Join on Patreon",
    shortLabel: "Patreon",
    href: "https://www.patreon.com/c/u16604577",
    icon: HeartHandshake,
    heroClass: "border-rose-400/60 bg-background/60 text-rose-200 hover:bg-rose-500/15 hover:text-white",
    footerClass: "border-rose-400/60 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20 hover:text-white",
  },
]

const CORE_VALUES = [
  "Software should feel like a conversation, not a chore.",
  "Learning in public keeps craft honest and energized.",
  "Great systems elevate the humans who rely on them.",
]

const HOW_I_WORK_TAGS = ["AI", "Full-stack", "Design Systems", "Community"] as const

export default function Portfolio() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:py-24">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-[-25%] h-96 w-96 -translate-x-1/2 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute bottom-[-30%] left-[-10%] h-80 w-80 rounded-full bg-secondary/25 blur-3xl" />
          <div className="absolute right-[-20%] top-1/3 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
        </div>
        <div className="relative mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[1.15fr,0.85fr]">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left lg:max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-sm text-primary backdrop-blur lg:self-start">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              <span>Joshi Minh · Software · AI · Design</span>
            </div>
            <h1 className="mt-6 text-balance text-4xl font-semibold leading-tight md:text-6xl lg:text-7xl">
              Hi, I'm <span className="text-gradient">Joshi Minh</span>.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground text-pretty md:text-xl mx-auto lg:mx-0 lg:text-left">
              I'm a software engineer and vibe coder building human-centered experiences across full-stack web, AI
              systems, and visual design. I love taking ideas from messy sketch to polished product.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4 lg:justify-start">
              <Button className="gradient-blue-pink hover:gradient-blue-pink-hover border-0 text-white" asChild>
                <a href={socialLinks.links.linkedin} target="_blank" rel="noopener noreferrer">
                  <Rocket className="mr-2 h-4 w-4" />
                  Get in touch
                </a>
              </Button>
              <Button variant="outline" className="border-border/60 bg-transparent hover:bg-accent/20" asChild>
                <a href="#projects">
                  <GitHubIcon />
                  <span className="ml-2">View projects</span>
                </a>
              </Button>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {HERO_HIGHLIGHTS.map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.title}
                    className="rounded-3xl border border-border/60 bg-card/70 p-5 backdrop-blur transition hover:border-primary/40"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-base font-medium text-foreground">{item.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <span className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Connect</span>
              {SOCIAL_BUTTONS.map((social) => {
                const Icon = social.icon
                return (
                  <Button
                    key={social.label}
                    variant="ghost"
                    size="icon"
                    className="hover:bg-accent/20"
                    asChild
                  >
                    <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                      <Icon />
                    </a>
                  </Button>
                )
              })}
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <span className="text-xs uppercase tracking-[0.32em] text-muted-foreground">Support</span>
              {DONATION_LINKS.map((donation) => {
                const Icon = donation.icon
                return (
                  <Button
                    key={donation.shortLabel}
                    variant="outline"
                    size="sm"
                    className={`border ${donation.heroClass}`}
                    asChild
                  >
                    <a href={donation.href} target="_blank" rel="noopener noreferrer" aria-label={donation.label}>
                      <Icon className="h-4 w-4" />
                      <span>{donation.shortLabel}</span>
                    </a>
                  </Button>
                )
              })}
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-xl lg:mx-0">
            <Card className="relative overflow-hidden border border-border/60 bg-card/70 shadow-[0_25px_70px_-40px_rgba(191,90,242,0.6)] backdrop-blur">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/20" />
              <CardHeader className="relative space-y-3">
                <CardTitle className="text-2xl">Designing experiences for humans</CardTitle>
                <CardDescription className="text-pretty text-base leading-relaxed text-muted-foreground">
                  I'm currently exploring how AI can extend craftsmanship. From idea validation to launch-ready
                  products, I love pairing rigorous systems thinking with a strong sense of vibe.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-4">
                {FOCUS_AREAS.map((area) => {
                  const Icon = area.icon
                  return (
                    <div
                      key={area.title}
                      className="flex items-start gap-3 rounded-2xl border border-border/50 bg-background/60 p-4"
                    >
                      <span className="mt-1 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-foreground">{area.title}</p>
                        <p className="text-sm text-muted-foreground">{area.description}</p>
                      </div>
                    </div>
                  )
                })}
                <div className="flex flex-wrap gap-2 pt-2">
                  {"Product thinking,Rapid prototyping,Community-first".split(",").map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs uppercase tracking-wide text-muted-foreground"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-semibold md:text-4xl">What I do</h2>
            <p className="mt-4 text-muted-foreground text-pretty">
              I move comfortably between shipping reliable software, experimenting with machine intelligence, and shaping
              design systems that make teams faster.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {EXPERTISE_AREAS.map((area) => {
              const Icon = area.icon
              return (
                <Card
                  key={area.title}
                  className="relative overflow-hidden border border-border/60 bg-card/70 transition hover:border-primary/40"
                >
                  <div className={`pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r ${area.accent}`} />
                  <CardHeader className="space-y-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </span>
                    <CardTitle>{area.title}</CardTitle>
                    <CardDescription>{area.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {area.tags.map((tag, index) => (
                        <Badge key={tag} className="text-xs font-medium" style={createGradientStyle(index, area.tags.length)}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section id="projects" className="relative overflow-hidden px-4 py-20 sm:px-6 lg:py-24">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-primary">
              Projects
            </span>
            <h2 className="mt-6 text-3xl font-semibold md:text-4xl">Featured builds & explorations</h2>
            <p className="mt-4 text-muted-foreground text-pretty">
              Each project is a playground for new ideas—ranging from indie SaaS products to delightful experiments that
              push my understanding of what's possible.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {PROJECT_URLS.map((projectUrl) => (
              <ProjectCard key={projectUrl} url={projectUrl} />
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-muted-foreground">Links open in a new tab.</p>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:py-24">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1.1fr,0.9fr] lg:gap-16">
          <div>
            <h2 className="text-3xl font-semibold md:text-4xl">About me</h2>
            <p className="mt-6 text-muted-foreground text-pretty">
              Hey! I'm Joshi Minh—a developer who lives at the intersection of software engineering, AI experimentation,
              and thoughtful design. I thrive on turning fuzzy ideas into systems that feel alive and intentional.
            </p>
            <p className="mt-6 text-muted-foreground text-pretty">
              Whether it's crafting intelligent tooling, building full-stack products, or hosting build-in-public jams, I
              love working with curious teams who care about people as much as pixels.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
              {CORE_VALUES.map((value) => (
                <li key={value} className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-primary" />
                  <span>{value}</span>
                </li>
              ))}
            </ul>
            <Button className="mt-10 gradient-blue-pink hover:gradient-blue-pink-hover border-0 text-white" asChild>
              <a href={socialLinks.links.linkedin} target="_blank" rel="noopener noreferrer">
                Let's collaborate
              </a>
            </Button>
          </div>
          <Card className="relative overflow-hidden border border-border/60 bg-card/70 backdrop-blur">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-primary/10" />
            <CardHeader className="relative space-y-2">
              <CardTitle>How I work</CardTitle>
              <CardDescription className="text-pretty">
                Intentional systems, rapid iteration, and empathy for the humans in the loop.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-4">
              {[
                {
                  title: "Product loops",
                  body: "Discover → prototype → learn → refine. Short feedback loops keep momentum high.",
                },
                {
                  title: "Collaborative energy",
                  body: "I love jamming with designers, storytellers, and engineers to co-create resonant work.",
                },
                {
                  title: "Beyond the screen",
                  body: "Workshops, content, and community events keep me exploring new perspectives.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-border/50 bg-background/60 p-4">
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
                </div>
              ))}
              <div className="flex flex-wrap gap-2 pt-2">
                {HOW_I_WORK_TAGS.map((chip) => (
                  <Badge
                    key={chip}
                    variant="secondary"
                    className="border-border/60 bg-background/70 text-xs uppercase tracking-wide text-muted-foreground"
                  >
                    {chip}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="border-t border-border/60 px-4 py-12 sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <div>
            <p className="text-muted-foreground">
              Thanks for visiting my little corner of the internet. Let's build something incredible together.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">© 2025 Joshi Minh. Built with ❤️ and plenty of ☕.</p>
          </div>
          <div className="flex flex-col items-center gap-5 md:items-end">
            <div className="flex flex-wrap justify-center gap-3 md:justify-end">
              {SOCIAL_BUTTONS.slice(0, 4).map((social) => {
                const Icon = social.icon
                return (
                  <Button key={social.label} variant="ghost" size="sm" className="hover:bg-accent/20" asChild>
                    <a href={social.href} target="_blank" rel="noopener noreferrer">
                      <Icon />
                      <span className="ml-2 text-sm">{social.label}</span>
                    </a>
                  </Button>
                )
              })}
            </div>
            <div className="flex flex-col items-center gap-2 md:items-end">
              <span className="text-xs uppercase tracking-[0.32em] text-muted-foreground">Support</span>
              <div className="flex flex-wrap justify-center gap-2 md:justify-end">
                {DONATION_LINKS.map((donation) => {
                  const Icon = donation.icon
                  return (
                    <Button
                      key={`footer-${donation.shortLabel}`}
                      variant="outline"
                      size="sm"
                      className={`border ${donation.footerClass}`}
                      asChild
                    >
                      <a href={donation.href} target="_blank" rel="noopener noreferrer">
                        <Icon className="h-4 w-4" />
                        <span>{donation.shortLabel}</span>
                      </a>
                    </Button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
