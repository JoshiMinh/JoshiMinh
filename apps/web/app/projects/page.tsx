import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { getProjectSources } from "@/lib/data";
import { formatUrl, prettifyHostname, normaliseProjectCopy, formatPathSegment } from "@/lib/utils";
import { createAnimationStyle, safeDecodeURIComponent } from "@/lib/animation";
import styles from "../styles.module.css";

export const metadata = {
  title: "Projects - Joshi Minh",
  description: "Explore my featured projects and builds—ranging from indie SaaS products to creative experiments.",
};

async function fetchProjectMetadata(url: string) {
  const { hostname } = formatUrl(url);
  const title = prettifyHostname(hostname);
  return {
    title,
    description: `Explore ${title} — a build straight from my playground.`,
    favicon: `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`,
  };
}

export default async function ProjectsPage() {
  const projectSources = await getProjectSources();

  const projectsWithMetadata = await Promise.all(
    projectSources.map(async (source) => ({
      url: source.url,
      ...(await fetchProjectMetadata(source.url)),
    }))
  );

  return (
    <div className={styles.page}>
      <main>
        <section className={`${styles.section} ${styles.sectionProjects}`} aria-labelledby="projects-heading">
          <div className={styles.sectionIntro}>
            <span className={styles.pill}>Projects</span>
            <h1 id="projects-heading">Featured builds &amp; explorations</h1>
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
      </main>
    </div>
  );
}
