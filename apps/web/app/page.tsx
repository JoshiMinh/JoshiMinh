import {
  Rocket,
  Github,
  Linkedin,
  Twitter,
  Youtube,
  Coffee,
  HeartHandshake,
  ExternalLink,
  AppWindow,
  Sparkles,
  Layers,
  Bot,
  Palette,
} from "lucide-react";
import Image from "next/image";
import {
  getHeroHighlights,
  getIdentityPoints,
  getIdentityTags,
  getExpertiseAreas,
  getProjectSources,
  getCoreValues,
  getSocialLinks,
  getDonationLinks,
} from "@/lib/data";
import { createGradient, formatUrl, prettifyHostname, normaliseProjectCopy, formatPathSegment } from "@/lib/utils";
import { createAnimationStyle, safeDecodeURIComponent } from "@/lib/animation";
import styles from "./styles.module.css";
import { AsciiArt } from "@/components/AsciiArt";

const iconMap = {
  rocket: Rocket,
  github: Github,
  linkedin: Linkedin,
  x: Twitter,
  youtube: Youtube,
  coffee: Coffee,
  "heart-handshake": HeartHandshake,
  "external-link": ExternalLink,
  "app-window": AppWindow,
  sparkles: Sparkles,
  layers: Layers,
  bot: Bot,
  palette: Palette,
} as const;

function getIcon(iconName: string) {
  return iconMap[iconName as keyof typeof iconMap] || AppWindow;
}

async function fetchProjectMetadata(url: string) {
  const { hostname } = formatUrl(url);
  const title = prettifyHostname(hostname);
  return {
    title,
    description: `Explore ${title} — a build straight from my playground.`,
    favicon: `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`,
  };
}

export default async function Home() {
  const [
    heroHighlights,
    identityPoints,
    identityTags,
    expertiseAreas,
    projectSources,
    coreValues,
    socialLinks,
    donationLinks,
  ] = await Promise.all([
    getHeroHighlights(),
    getIdentityPoints(),
    getIdentityTags(),
    getExpertiseAreas(),
    getProjectSources(),
    getCoreValues(),
    getSocialLinks(),
    getDonationLinks(),
  ]);

  const projectsWithMetadata = await Promise.all(
    projectSources.map(async (source) => ({
      url: source.url,
      ...(await fetchProjectMetadata(source.url)),
    }))
  );

  return (
    <div className={styles.page} id="top">
      <header className={styles.hero} aria-labelledby="intro-heading">
        <div className={styles.heroBackground} aria-hidden="true">
          <span className={`${styles.blurBall} ${styles.blurBallPrimary}`}></span>
          <span className={`${styles.blurBall} ${styles.blurBallSecondary}`}></span>
          <span className={`${styles.blurBall} ${styles.blurBallAccent}`}></span>
        </div>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <AsciiArt />
            <div className={`${styles.statusPill} animate-in`} style={createAnimationStyle(0)}>
              <span className={styles.statusPillDot} aria-hidden="true"></span>
              <span>Joshi Minh · Undergraduate cross-platform builder</span>
            </div>
            <h1 id="intro-heading" className={`${styles.heroTitle} animate-in`} style={createAnimationStyle(0.05)}>
              Hi, I&apos;m <span className={styles.textGradient}>Joshi Minh</span>.
            </h1>
            <p className={`${styles.heroSubtitle} animate-in`} style={createAnimationStyle(0.1)}>
              Undergraduate software engineer · Product designer · AI tinkerer
            </p>
            <p className={`${styles.heroLead} animate-in`} style={createAnimationStyle(0.15)}>
              I love building apps and software across Android, web, and Windows—blending AI and design to vibe-code
              cross-platform experiences that feel alive.
            </p>
            <div className={`${styles.heroActions} animate-in`} style={createAnimationStyle(0.22)}>
              <a
                className={`${styles.button} ${styles.buttonPrimary}`}
                href="https://www.linkedin.com/in/nguyen-binh-minh-jm"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Rocket aria-hidden="true" size={18} />
                <span>Get in touch</span>
              </a>
              <a className={`${styles.button} ${styles.buttonOutline}`} href="#projects">
                <Github aria-hidden="true" size={18} />
                <span>View projects</span>
              </a>
            </div>
            <div className={styles.heroHighlights}>
              {heroHighlights.map((item, index) => {
                const Icon = getIcon(item.icon);
                return (
                  <article
                    key={index}
                    className={`${styles.highlightCard} animate-in`}
                    style={createAnimationStyle(0.2 + index * 0.08)}
                  >
                    <span className={styles.highlightCardIcon} aria-hidden="true">
                      <Icon size={20} />
                    </span>
                    <div className={styles.highlightCardBody}>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className={`${styles.heroSocial} animate-in`} style={createAnimationStyle(0.32)}>
              <span className={styles.heroSocialLabel}>Connect</span>
              <div className={styles.heroSocialButtons}>
                {socialLinks.map((link, index) => {
                  const Icon = getIcon(link.icon);
                  return (
                    <a
                      key={index}
                      className={`${styles.socialButton} animate-in`}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      title={link.label}
                      style={createAnimationStyle(0.42 + index * 0.06)}
                    >
                      <Icon size={20} />
                    </a>
                  );
                })}
              </div>
            </div>
            <div className={`${styles.heroSupport} animate-in`} style={createAnimationStyle(0.38)}>
              <span className={styles.heroSupportLabel}>Support</span>
              <div className={styles.heroSupportButtons}>
                {donationLinks.map((link, index) => {
                  const Icon = getIcon(link.icon);
                  const buttonClass = link.heroClass === "support-button--kofi" 
                    ? styles.supportButtonKofi 
                    : styles.supportButtonPatreon;
                  return (
                    <a
                      key={index}
                      className={`${styles.supportButton} ${buttonClass} animate-in`}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      title={link.label}
                      style={createAnimationStyle(0.48 + index * 0.06)}
                    >
                      <Icon size={18} />
                      <span>{link.shortLabel}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
          <div className={`${styles.heroProfile} animate-in`} style={createAnimationStyle(0.25)} aria-labelledby="identity-heading">
            <div className={styles.heroProfileGlow} aria-hidden="true"></div>
            <header className={styles.heroProfileHeader}>
              <h2 id="identity-heading">Identity snapshot</h2>
              <p>
                Undergraduate maker mixing craft, play, and technology. I chase the edges of cross-platform products
                while keeping people at the center.
              </p>
            </header>
            <ul className={styles.heroProfileList}>
              {identityPoints.map((item, index) => (
                <li
                  key={index}
                  className={`${styles.identityPoint} animate-in`}
                  style={createAnimationStyle(0.32 + index * 0.08)}
                >
                  <span className={styles.identityPointLabel}>{item.label}</span>
                  <span className={styles.identityPointValue}>{item.value}</span>
                </li>
              ))}
            </ul>
            <div className={styles.heroProfileTags}>
              {identityTags.map((tag, index) => (
                <span
                  key={index}
                  className={`${styles.identityTag} animate-in`}
                  style={createAnimationStyle(0.5 + index * 0.08)}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className={styles.section} aria-labelledby="expertise-heading">
          <div className={styles.sectionIntro}>
            <h2 id="expertise-heading">What I do</h2>
            <p>
              I bounce between code, pixels, and AI—shipping reliable software while shaping playful experiences that
              travel across platforms.
            </p>
          </div>
          <div className={styles.cardGrid}>
            {expertiseAreas.map((area, index) => {
              const Icon = getIcon(area.icon);
              return (
                <article
                  key={index}
                  className={`${styles.expertiseCard} animate-in`}
                  style={createAnimationStyle(0.25 + index * 0.12)}
                >
                  <span className={styles.expertiseCardIcon} aria-hidden="true">
                    <Icon size={24} />
                  </span>
                  <div>
                    <h3>{area.title}</h3>
                    <p>{area.description}</p>
                  </div>
                  <div className={styles.badgeRow}>
                    {area.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className={styles.badge}
                        style={{ background: createGradient(tagIndex, area.tags.length) }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className={`${styles.section} ${styles.sectionProjects}`} id="projects" aria-labelledby="projects-heading">
          <div className={styles.sectionIntro}>
            <span className={styles.pill}>Projects</span>
            <h2 id="projects-heading">Featured builds &amp; explorations</h2>
            <p>
              Each project is a playground for new ideas—ranging from indie SaaS products to delightful experiments that
              push my understanding of what&apos;s possible.
            </p>
          </div>
          <div className={`${styles.cardGrid} ${styles.cardGridProjects}`}>
            {projectsWithMetadata.map((project, index) => {
              const { hostname, segments } = formatUrl(project.url);
              const tags = segments
                .map((segment) => normaliseProjectCopy(formatPathSegment(safeDecodeURIComponent(segment))))
                .filter(Boolean);

              if (tags.length === 0) {
                tags.push("Live project");
              }

              const fallbackTitle = normaliseProjectCopy(prettifyHostname(hostname), "Untitled project");
              const titleText = normaliseProjectCopy(project.title, fallbackTitle);
              const descriptionText = normaliseProjectCopy(
                project.description,
                `Explore ${fallbackTitle} — a build straight from my playground.`
              );

              return (
                <a
                  key={index}
                  className={`${styles.projectCard} animate-in`}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={createAnimationStyle(0.2 + index * 0.12)}
                >
                  <div className={styles.projectCardHeader}>
                    <div className={styles.projectCardInfo}>
                      <span className={styles.projectCardFavicon} aria-hidden="true">
                        <Image src={project.favicon} alt="" width={20} height={20} />
                      </span>
                      <div>
                        <h3>{titleText}</h3>
                        <div className={styles.projectCardDomain}>{hostname}</div>
                      </div>
                    </div>
                    <span className={styles.projectCardCta}>
                      Visit <ExternalLink size={14} />
                    </span>
                  </div>
                  <p className={styles.projectCardDescription}>{descriptionText}</p>
                  <div className={styles.projectCardTags}>
                    {tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className={styles.projectCardTag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </a>
              );
            })}
          </div>
          <p className={styles.sectionNote}>Links open in a new tab.</p>
        </section>

        <section className={`${styles.section} ${styles.sectionAbout}`} aria-labelledby="about-heading">
          <div className={styles.about}>
            <div className={styles.aboutText}>
              <h2 id="about-heading">About me</h2>
              <p>
                Hey! I&apos;m Joshi Minh—an undergraduate, multi-disciplinary maker blending software engineering,
                product design, and AI experimentation. I live for turning fuzzy ideas into cross-platform systems that
                feel intentional and joyful.
              </p>
              <p>
                From Android apps and responsive web builds to Windows tools and creative experiments, I care about the
                energy the work carries as much as the features it ships.
              </p>
              <ul className={styles.aboutValues}>
                {coreValues.map((value, index) => (
                  <li
                    key={index}
                    className="animate-in"
                    style={createAnimationStyle(0.2 + index * 0.08)}
                  >
                    <span>{value}</span>
                  </li>
                ))}
              </ul>
              <a
                className={`${styles.button} ${styles.buttonPrimary}`}
                href="https://www.linkedin.com/in/nguyen-binh-minh-jm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Let&apos;s collaborate
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.siteFooter}>
        <div className={styles.siteFooterContent}>
          <div>
            <p>Thanks for visiting my little corner of the internet. Let&apos;s build something incredible together.</p>
            <p className={styles.siteFooterMeta}>© 2025 Joshi Minh. Built with ❤️ and plenty of ☕.</p>
          </div>
          <a
            className={`${styles.siteFooterReturn} animate-in`}
            style={createAnimationStyle(0.1)}
            href="#top"
          >
            Back to top
          </a>
        </div>
      </footer>
    </div>
  );
}
