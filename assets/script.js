const heroHighlights = [
  {
    title: "Joyful digital products",
    description:
      "Blending design and engineering to deliver experiences that feel personal, polished, and fast.",
    icon: "sparkles",
  },
  {
    title: "AI-native workflows",
    description: "Prototyping copilots and automation that take teams from idea to production quickly.",
    icon: "workflow",
  },
]

const focusAreas = [
  {
    title: "Creative AI copilots",
    description: "Exploring interfaces that amplify imagination and unlock new creative rituals.",
    icon: "wand-2",
  },
  {
    title: "Design systems that scale",
    description: "Establishing cohesive visual languages and component libraries that keep teams aligned.",
    icon: "layers",
  },
  {
    title: "Delightful developer experience",
    description: "Automating the boring parts so builders can focus on shipping meaningful value.",
    icon: "rocket",
  },
]

const expertiseAreas = [
  {
    title: "Software Engineering",
    description: "Building resilient, scalable applications with thoughtful architecture and clean code.",
    icon: "code",
    gradient: "linear-gradient(90deg, rgba(56,189,248,0.9), rgba(99,102,241,0.9))",
    tags: ["Python", "Java", "JavaScript", "HTML", "CSS"],
  },
  {
    title: "AI Development",
    description: "Designing intelligent systems and bringing machine learning ideas into joyful products.",
    icon: "brain",
    gradient: "linear-gradient(90deg, rgba(217,70,239,0.9), rgba(129,140,248,0.9))",
    tags: ["Machine Learning", "Python", "TensorFlow", "AI SDK"],
  },
  {
    title: "Design & Experience",
    description: "Crafting beautiful, intuitive interfaces where aesthetics meet accessible, human-centered UX.",
    icon: "palette",
    gradient: "linear-gradient(90deg, rgba(244,114,182,0.95), rgba(251,191,36,0.95))",
    tags: ["UI/UX", "CSS", "HTML", "Responsive Design"],
  },
]

const projectCards = [
  {
    title: "Markbase",
    description: "An indie SaaS for capturing build-in-public notes with AI-powered summaries and publishing tools.",
    url: "https://markbase-joshiminh.vercel.app/",
    favicon: "https://www.google.com/s2/favicons?domain=markbase-joshiminh.vercel.app&sz=32",
  },
  {
    title: "Watchbase",
    description: "Curated catalog of favourite timepieces with wishlists, notes, and delightful watch nerd details.",
    url: "https://watchbase.vercel.app/",
    favicon: "https://www.google.com/s2/favicons?domain=watchbase.vercel.app&sz=32",
  },
]

const workStyle = [
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
]

const workChips = ["AI", "Full-stack", "Design Systems", "Community"]

const focusChips = ["Product thinking", "Rapid prototyping", "Community-first"]

const coreValues = [
  "Software should feel like a conversation, not a chore.",
  "Learning in public keeps craft honest and energized.",
  "Great systems elevate the humans who rely on them.",
]

const socialLinks = [
  {
    label: "GitHub",
    url: "https://github.com/JoshiMinh",
    icon: githubIcon,
  },
  {
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/nguyen-binh-minh-jm",
    icon: linkedinIcon,
  },
  {
    label: "X/Twitter",
    url: "https://x.com/js_minh",
    icon: xIcon,
  },
  {
    label: "YouTube",
    url: "https://www.youtube.com/channel/UCkt3Mhwb3bduqwtRDZtjvsg",
    icon: youtubeIcon,
  },
  {
    label: "Patreon",
    url: "https://www.patreon.com/c/u16604577",
    icon: patreonIcon,
  },
]

const donationLinks = [
  {
    label: "Support on Ko-fi",
    shortLabel: "Ko-fi",
    url: "https://ko-fi.com/joshiminh",
    icon: "coffee",
    heroClass: "support-button--kofi",
    footerClass: "site-footer__support-link--kofi",
  },
  {
    label: "Join on Patreon",
    shortLabel: "Patreon",
    url: "https://www.patreon.com/c/u16604577",
    icon: "heart-handshake",
    heroClass: "support-button--patreon",
    footerClass: "site-footer__support-link--patreon",
  },
]

function githubIcon() {
  return `
    <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.111.82-.261.82-.577 0-.287-.01-1.244-.015-2.444-3.338.724-4.043-1.61-4.043-1.61-.546-1.385-1.333-1.754-1.333-1.754-1.089-.745.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.775.418-1.305.76-1.605-2.665-.303-5.466-1.335-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.304-.536-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.52 11.52 0 0 1 3.003-.404c1.02.005 2.044.138 3.003.404 2.29-1.552 3.295-1.23 3.295-1.23.653 1.653.241 2.873.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.807 5.624-5.479 5.921.43.372.823 1.105.823 2.226 0 1.606-.014 2.898-.014 3.293 0 .319.216.694.825.576C20.565 22.092 24 17.592 24 12.297 24 5.373 18.627 0 12 .297Z"
      ></path>
    </svg>
  `
}

function linkedinIcon() {
  return `
    <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"
      ></path>
    </svg>
  `
}

function xIcon() {
  return `
    <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298z"
      ></path>
    </svg>
  `
}

function youtubeIcon() {
  return `
    <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93-.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
      ></path>
    </svg>
  `
}

function patreonIcon() {
  return `
    <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M0 .48v23.04h4.22V.48zm15.385 0c-4.764 0-8.641 3.88-8.641 8.65 0 4.755 3.877 8.623 8.641 8.623 4.75 0 8.615-3.868 8.615-8.623C24 4.36 20.136.48 15.385.48z"
      ></path>
    </svg>
  `
}

function createGradient(index, total) {
  const hueStart = 220
  const hueEnd = 320
  const steps = Math.max(total - 1, 1)
  const hue = hueStart + (index / steps) * (hueEnd - hueStart)
  return `linear-gradient(135deg, hsl(${hue}, 70%, 60%) 0%, hsl(${hue + 20}, 70%, 60%) 100%)`
}

function formatUrl(urlString) {
  try {
    const url = new URL(urlString)
    const hostname = url.hostname.replace(/^www\./, "")
    const segments = url.pathname.split("/").filter(Boolean).slice(0, 3)
    return { hostname, segments }
  } catch (error) {
    return { hostname: urlString, segments: [] }
  }
}

function renderHighlights() {
  const container = document.getElementById("hero-highlights")
  heroHighlights.forEach((item) => {
    const card = document.createElement("article")
    card.className = "highlight-card"
    card.innerHTML = `
      <span class="highlight-card__icon" aria-hidden="true">
        <i data-lucide="${item.icon}"></i>
      </span>
      <div class="highlight-card__body">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      </div>
    `
    container.appendChild(card)
  })
}

function renderFocusAreas() {
  const list = document.getElementById("focus-areas")
  focusAreas.forEach((item) => {
    const row = document.createElement("div")
    row.className = "focus-row"
    row.innerHTML = `
      <span class="focus-row__icon" aria-hidden="true">
        <i data-lucide="${item.icon}"></i>
      </span>
      <div class="focus-row__body">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      </div>
    `
    list.appendChild(row)
  })

  const chipContainer = document.getElementById("focus-chips")
  focusChips.forEach((chip) => {
    const span = document.createElement("span")
    span.className = "chip"
    span.textContent = chip
    chipContainer.appendChild(span)
  })
}

function renderExpertise() {
  const grid = document.getElementById("expertise-grid")
  expertiseAreas.forEach((area) => {
    const card = document.createElement("article")
    card.className = "expertise-card"
    card.style.setProperty("--gradient", area.gradient)
    card.innerHTML = `
      <span class="expertise-card__icon" aria-hidden="true">
        <i data-lucide="${area.icon}"></i>
      </span>
      <div>
        <h3>${area.title}</h3>
        <p>${area.description}</p>
      </div>
      <div class="badge-row"></div>
    `

    const badgeRow = card.querySelector(".badge-row")
    area.tags.forEach((tag, index) => {
      const badge = document.createElement("span")
      badge.className = "badge"
      badge.style.background = createGradient(index, area.tags.length)
      badge.textContent = tag
      badgeRow.appendChild(badge)
    })

    grid.appendChild(card)
  })
}

function renderProjects() {
  const grid = document.getElementById("project-grid")
  projectCards.forEach((project) => {
    const { hostname, segments } = formatUrl(project.url)
    const card = document.createElement("a")
    card.className = "project-card"
    card.href = project.url
    card.target = "_blank"
    card.rel = "noopener noreferrer"

    const tags = segments.length
      ? segments.map((segment) => segment.replace(/-/g, " "))
      : ["Live project"]

    card.innerHTML = `
      <div class="project-card__header">
        <div class="project-card__info">
          <span class="project-card__favicon" aria-hidden="true">
            <img src="${project.favicon}" alt="" loading="lazy" />
          </span>
          <div>
            <h3>${project.title}</h3>
            <div class="project-card__domain">${hostname}</div>
          </div>
        </div>
        <span class="project-card__cta">Visit <i data-lucide="external-link"></i></span>
      </div>
      <p class="project-card__description">${project.description}</p>
      <div class="project-card__tags"></div>
    `

    const tagContainer = card.querySelector(".project-card__tags")
    tags.forEach((tag) => {
      const span = document.createElement("span")
      span.className = "project-card__tag"
      span.textContent = tag
      tagContainer.appendChild(span)
    })

    grid.appendChild(card)
  })
}

function renderSocialButtons() {
  const socialContainer = document.getElementById("social-buttons")
  socialLinks.forEach((item) => {
    const link = document.createElement("a")
    link.className = "social-button"
    link.href = item.url
    link.target = "_blank"
    link.rel = "noopener noreferrer"
    link.setAttribute("aria-label", item.label)
    link.innerHTML = item.icon()
    socialContainer.appendChild(link)
  })

  const footer = document.getElementById("footer-links")
  socialLinks.slice(0, 4).forEach((item) => {
    const link = document.createElement("a")
    link.className = "site-footer__link"
    link.href = item.url
    link.target = "_blank"
    link.rel = "noopener noreferrer"
    link.innerHTML = `${item.icon()}<span>${item.label}</span>`
    footer.appendChild(link)
  })
}

function renderDonations() {
  const donationContainer = document.getElementById("donation-buttons")
  const footerContainer = document.getElementById("footer-donations")

  donationLinks.forEach((item) => {
    if (donationContainer) {
      const link = document.createElement("a")
      link.className = `support-button ${item.heroClass}`
      link.href = item.url
      link.target = "_blank"
      link.rel = "noopener noreferrer"
      link.setAttribute("aria-label", item.label)
      link.title = item.label
      link.innerHTML = `<i data-lucide="${item.icon}"></i><span>${item.shortLabel}</span>`
      donationContainer.appendChild(link)
    }

    if (footerContainer) {
      const footerLink = document.createElement("a")
      footerLink.className = `site-footer__support-link ${item.footerClass}`
      footerLink.href = item.url
      footerLink.target = "_blank"
      footerLink.rel = "noopener noreferrer"
      footerLink.setAttribute("aria-label", item.label)
      footerLink.title = item.label
      footerLink.innerHTML = `<i data-lucide="${item.icon}"></i><span>${item.shortLabel}</span>`
      footerContainer.appendChild(footerLink)
    }
  })
}

function renderWorkStyle() {
  const list = document.getElementById("work-style")
  workStyle.forEach((item) => {
    const entry = document.createElement("div")
    entry.className = "work-card__item"
    entry.innerHTML = `<h4>${item.title}</h4><p>${item.body}</p>`
    list.appendChild(entry)
  })

  const chipContainer = document.getElementById("work-chips")
  workChips.forEach((chip) => {
    const span = document.createElement("span")
    span.className = "work-card__chip"
    span.textContent = chip
    chipContainer.appendChild(span)
  })
}

function renderCoreValues() {
  const list = document.getElementById("core-values")
  coreValues.forEach((value) => {
    const li = document.createElement("li")
    const text = document.createElement("span")
    text.textContent = value
    li.appendChild(text)
    list.appendChild(li)
  })
}

function initPage() {
  renderHighlights()
  renderFocusAreas()
  renderExpertise()
  renderProjects()
  renderSocialButtons()
  renderDonations()
  renderWorkStyle()
  renderCoreValues()

  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons()
  }
}

document.addEventListener("DOMContentLoaded", initPage)
