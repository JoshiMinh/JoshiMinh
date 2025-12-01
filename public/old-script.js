let animationObserver = null
const pendingAnimationQueue = []

function setupAnimationObserver() {
  if (animationObserver) {
    animationObserver.disconnect()
    animationObserver = null
  }

  const animatedElements = document.querySelectorAll(".animate-in")
  const supportsObserver = typeof window !== "undefined" && "IntersectionObserver" in window

  if (supportsObserver) {
    animationObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            animationObserver.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -10%",
      }
    )

    animatedElements.forEach((element) => {
      animationObserver.observe(element)
    })

    if (pendingAnimationQueue.length > 0) {
      const queuedElements = pendingAnimationQueue.splice(0)
      queuedElements.forEach((element) => {
        if (element instanceof Element) {
          animationObserver.observe(element)
        }
      })
    }
  } else {
    animatedElements.forEach((element) => {
      element.classList.add("is-visible")
    })

    if (pendingAnimationQueue.length > 0) {
      const queuedElements = pendingAnimationQueue.splice(0)
      queuedElements.forEach((element) => {
        if (element instanceof Element) {
          element.classList.add("is-visible")
        }
      })
    }
  }
}

function applyEntrance(element, delaySeconds = 0) {
  if (!element) {
    return
  }

  element.classList.add("animate-in")

  if (typeof delaySeconds === "number" && Number.isFinite(delaySeconds)) {
    element.style.setProperty("--delay", `${Math.max(delaySeconds, 0).toFixed(2)}s`)
  }

  const scheduleFrame =
    typeof window !== "undefined" && typeof window.requestAnimationFrame === "function"
      ? window.requestAnimationFrame.bind(window)
      : (callback) => setTimeout(callback, 16)

  scheduleFrame(() => {
    if (animationObserver) {
      animationObserver.observe(element)
      return
    }

    const supportsObserver = typeof window !== "undefined" && "IntersectionObserver" in window

    if (supportsObserver) {
      pendingAnimationQueue.push(element)
    } else {
      element.classList.add("is-visible")
    }
  })
}

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

const iconMap = {
  github: githubIcon,
  linkedin: linkedinIcon,
  x: xIcon,
  youtube: youtubeIcon,
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

function prettifyHostname(hostname) {
  const primary = hostname.split(".")[0]
  return primary
    .split(/[-_]/)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ")
}

function resolveFaviconHref(href, baseUrl) {
  if (!href) {
    return null
  }

  try {
    return new URL(href, baseUrl).href
  } catch (error) {
    return href
  }
}

async function fetchProjectMetadata(url) {
  const fallback = () => {
    const { hostname } = formatUrl(url)
    const title = prettifyHostname(hostname)
    return {
      title,
      description: `Explore ${title} — a build straight from my playground.`,
      favicon: `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`,
    }
  }

  const fallbackMeta = fallback()

  try {
    const response = await fetch(url, { mode: "cors" })

    if (!response.ok) {
      return fallbackMeta
    }

    const html = await response.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")

    const title =
      doc.querySelector("meta[property='og:title']")?.getAttribute("content") ||
      doc.querySelector("meta[name='twitter:title']")?.getAttribute("content") ||
      doc.querySelector("title")?.textContent?.trim()

    const description =
      doc.querySelector("meta[property='og:description']")?.getAttribute("content") ||
      doc.querySelector("meta[name='description']")?.getAttribute("content") ||
      doc.querySelector("meta[name='twitter:description']")?.getAttribute("content") ||
      fallbackMeta.description

    const faviconHref =
      doc.querySelector("link[rel='icon']")?.getAttribute("href") ||
      doc.querySelector("link[rel='shortcut icon']")?.getAttribute("href") ||
      doc.querySelector("link[rel='apple-touch-icon']")?.getAttribute("href") ||
      null

    const resolvedFavicon = resolveFaviconHref(faviconHref, url) || fallbackMeta.favicon

    return {
      title: title || fallbackMeta.title,
      description,
      favicon: resolvedFavicon,
    }
  } catch (error) {
    console.warn(`Falling back to metadata for ${url}`, error)
    return fallbackMeta
  }
}

function renderHighlights(heroHighlights) {
  const container = document.getElementById("hero-highlights")
  if (!container) {
    return
  }

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
    const delay = 0.2 + container.children.length * 0.08
    applyEntrance(card, delay)
    container.appendChild(card)
  })
}

function renderExpertise(expertiseAreas) {
  const grid = document.getElementById("expertise-grid")
  if (!grid) {
    return
  }

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

    const cardIndex = grid.children.length
    const delay = 0.25 + cardIndex * 0.12
    applyEntrance(card, delay)
    grid.appendChild(card)
  })
}

function createElement(tag, options = {}) {
  const element = document.createElement(tag)
  const { className, text, attrs, props } = options

  if (className) {
    element.className = className
  }

  if (text != null) {
    element.textContent = text
  }

  if (attrs) {
    Object.entries(attrs).forEach(([name, value]) => {
      if (value != null) {
        element.setAttribute(name, value)
      }
    })
  }

  if (props) {
    Object.entries(props).forEach(([name, value]) => {
      if (value != null) {
        element[name] = value
      }
    })
  }

  return element
}

function safeDecodeURIComponent(value) {
  try {
    return decodeURIComponent(value)
  } catch (error) {
    return value
  }
}

function formatPathSegment(segment) {
  return segment
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function normaliseProjectCopy(value, fallback = "") {
  if (typeof value !== "string") {
    return fallback
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : fallback
}

function createProjectCard(project) {
  if (!project || !project.url) {
    console.warn("Skipped rendering project due to missing URL", project)
    return null
  }

  const { hostname, segments } = formatUrl(project.url)

  const tags = segments
    .map((segment) => normaliseProjectCopy(formatPathSegment(safeDecodeURIComponent(segment))))
    .filter(Boolean)

  if (tags.length === 0) {
    tags.push("Live project")
  }

  const fallbackTitle = normaliseProjectCopy(prettifyHostname(hostname), "Untitled project")
  const titleText = normaliseProjectCopy(project.title, fallbackTitle)
  const descriptionText = normaliseProjectCopy(
    project.description,
    `Explore ${fallbackTitle} — a build straight from my playground.`
  )

  const card = createElement("a", {
    className: "project-card",
    attrs: {
      href: project.url,
      target: "_blank",
      rel: "noopener noreferrer",
    },
  })

  const header = createElement("div", { className: "project-card__header" })
  const info = createElement("div", { className: "project-card__info" })

  const faviconWrapper = createElement("span", {
    className: "project-card__favicon",
    attrs: { "aria-hidden": "true" },
  })

  const faviconImage = createElement("img", {
    attrs: { alt: "", loading: "lazy" },
    props: { src: project.favicon },
  })
  faviconWrapper.appendChild(faviconImage)

  const textContainer = document.createElement("div")

  const title = createElement("h3", { text: titleText })
  const domain = createElement("div", {
    className: "project-card__domain",
    text: hostname,
  })
  textContainer.append(title, domain)

  info.append(faviconWrapper, textContainer)

  const cta = createElement("span", { className: "project-card__cta" })
  cta.append("Visit ")
  cta.appendChild(
    createElement("i", {
      attrs: { "data-lucide": "external-link" },
    })
  )

  header.append(info, cta)

  const description = createElement("p", {
    className: "project-card__description",
    text: descriptionText,
  })

  const tagContainer = createElement("div", { className: "project-card__tags" })
  const tagsFragment = document.createDocumentFragment()

  tags.forEach((tag) => {
    tagsFragment.appendChild(
      createElement("span", {
        className: "project-card__tag",
        text: tag,
      })
    )
  })

  tagContainer.appendChild(tagsFragment)

  card.append(header, description, tagContainer)

  return card
}

async function renderProjects(projectSources) {
  const grid = document.getElementById("project-grid")
  if (!grid) {
    return
  }
  grid.innerHTML = ""

  const projectsWithMetadata = await Promise.all(
    projectSources.map(async (source) => ({
      url: source.url,
      metadata: await fetchProjectMetadata(source.url),
    }))
  )

  const fragment = document.createDocumentFragment()

  projectsWithMetadata.forEach((item, index) => {
    const card = createProjectCard({ ...item.metadata, url: item.url })
    if (!card) {
      return
    }

    applyEntrance(card, 0.2 + index * 0.12)
    fragment.appendChild(card)
  })

  grid.appendChild(fragment)
}

function renderSocialButtons(socialLinks) {
  const socialContainer = document.getElementById("social-buttons")
  if (!socialContainer) {
    return
  }

  socialLinks.forEach((item, index) => {
    const link = document.createElement("a")
    link.className = "social-button"
    link.href = item.url
    link.target = "_blank"
    link.rel = "noopener noreferrer"
    link.setAttribute("aria-label", item.label)
    link.title = item.label
    link.innerHTML = iconMap[item.icon]()
    applyEntrance(link, 0.42 + index * 0.06)
    socialContainer.appendChild(link)
  })
}

function renderDonations(donationLinks) {
  const donationContainer = document.getElementById("donation-buttons")
  if (!donationContainer) {
    return
  }

  donationLinks.forEach((item, index) => {
    const link = document.createElement("a")
    link.className = `support-button ${item.heroClass}`
    link.href = item.url
    link.target = "_blank"
    link.rel = "noopener noreferrer"
    link.setAttribute("aria-label", item.label)
    link.title = item.label
    link.innerHTML = `<i data-lucide="${item.icon}"></i><span>${item.shortLabel}</span>`
    applyEntrance(link, 0.48 + index * 0.06)
    donationContainer.appendChild(link)
  })
}

function renderCoreValues(coreValues) {
  const list = document.getElementById("core-values")
  if (!list) {
    return
  }

  coreValues.forEach((value, index) => {
    const li = document.createElement("li")
    const text = document.createElement("span")
    text.textContent = value
    li.appendChild(text)
    applyEntrance(li, 0.2 + index * 0.08)
    list.appendChild(li)
  })
}

function renderIdentitySnapshot(identityPoints, identityTags) {
  const list = document.getElementById("identity-list")
  const tags = document.getElementById("identity-tags")
  if (!list || !tags) {
    return
  }

  identityPoints.forEach((item, index) => {
    const li = document.createElement("li")
    li.className = "identity-point"
    li.innerHTML = `
      <span class="identity-point__label">${item.label}</span>
      <span class="identity-point__value">${item.value}</span>
    `
    applyEntrance(li, 0.32 + index * 0.08)
    list.appendChild(li)
  })

  identityTags.forEach((tag, index) => {
    const span = document.createElement("span")
    span.className = "identity-tag"
    span.textContent = tag
    applyEntrance(span, 0.5 + index * 0.08)
    tags.appendChild(span)
  })
}

function createGameCard(game) {
  if (!game || !game.url) {
    console.warn("Skipped rendering game due to missing URL", game)
    return null
  }

  const card = createElement("a", {
    className: "game-card",
    attrs: {
      href: game.url,
    },
  })

  const iconWrapper = createElement("span", {
    className: "game-card__icon",
    attrs: { "aria-hidden": "true" },
  })
  iconWrapper.textContent = game.icon || "🎮"

  const textContainer = createElement("div", {
    className: "game-card__text",
  })

  const title = createElement("h3", { text: game.title || "Untitled Game" })
  const description = createElement("p", {
    className: "game-card__description",
    text: game.description || "An interactive experience.",
  })
  textContainer.append(title, description)

  const cta = createElement("span", { className: "game-card__cta" })
  cta.append("Play ")
  cta.appendChild(
    createElement("i", {
      attrs: { "data-lucide": "arrow-right" },
    })
  )

  card.append(iconWrapper, textContainer, cta)

  return card
}

async function renderGames(gameSources) {
  const grid = document.getElementById("games-grid")
  if (!grid) {
    return
  }
  grid.innerHTML = ""

  const fragment = document.createDocumentFragment()

  gameSources.forEach((game, index) => {
    const card = createGameCard(game)
    if (!card) {
      return
    }

    applyEntrance(card, 0.2 + index * 0.1)
    fragment.appendChild(card)
  })

  grid.appendChild(fragment)
}

async function fetchData() {
  const [
    heroHighlights,
    identityPoints,
    identityTags,
    expertiseAreas,
    projectSources,
    gameSources,
    coreValues,
    socialLinks,
    donationLinks,
  ] = await Promise.all([
    fetch("./data/hero-highlights.json").then((res) => res.json()),
    fetch("./data/identity-points.json").then((res) => res.json()),
    fetch("./data/identity-tags.json").then((res) => res.json()),
    fetch("./data/expertise-areas.json").then((res) => res.json()),
    fetch("./data/project-sources.json").then((res) => res.json()),
    fetch("./data/game-sources.json").then((res) => res.json()),
    fetch("./data/core-values.json").then((res) => res.json()),
    fetch("./data/social-links.json").then((res) => res.json()),
    fetch("./data/donation-links.json").then((res) => res.json()),
  ]);

  return {
    heroHighlights,
    identityPoints,
    identityTags,
    expertiseAreas,
    projectSources,
    gameSources,
    coreValues,
    socialLinks,
    donationLinks,
  };
}

async function initPage() {
  setupAnimationObserver()
  const data = await fetchData();
  renderHighlights(data.heroHighlights)
  renderIdentitySnapshot(data.identityPoints, data.identityTags)
  renderExpertise(data.expertiseAreas)
  await renderProjects(data.projectSources)
  await renderGames(data.gameSources)
  renderSocialButtons(data.socialLinks)
  renderDonations(data.donationLinks)
  renderCoreValues(data.coreValues)

  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons()
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initPage().catch((error) => {
    console.error("Failed to initialise page", error)
  })
})