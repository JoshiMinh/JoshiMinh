import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { getProjectSources } from "@/lib/data";
import { formatUrl, prettifyHostname } from "@/lib/utils";
import styles from "../../styles.module.css";

async function fetchProjectMetadata(url: string) {
  const { hostname } = formatUrl(url);
  const title = prettifyHostname(hostname);
  return {
    title,
    description: `Explore ${title} — a build straight from my playground.`,
    favicon: `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`,
  };
}

export async function generateStaticParams() {
  const projects = await getProjectSources();
  return projects.map((project) => ({
    projectname: project.slug,
  }));
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ projectname: string }> 
}) {
  const { projectname } = await params;
  const projects = await getProjectSources();
  const project = projects.find((p) => p.slug === projectname);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.name} - Joshi Minh`,
    description: `Learn more about ${project.name}, one of my featured projects.`,
  };
}

export default async function ProjectPage({ 
  params 
}: { 
  params: Promise<{ projectname: string }> 
}) {
  const { projectname } = await params;
  const projects = await getProjectSources();
  const project = projects.find((p) => p.slug === projectname);

  if (!project) {
    notFound();
  }

  const metadata = await fetchProjectMetadata(project.url);
  const { hostname } = formatUrl(project.url);

  return (
    <div className={styles.page}>
      <main>
        <section className={styles.section} aria-labelledby="project-heading">
          <div className={styles.sectionIntro}>
            <h1 id="project-heading">{project.name}</h1>
            <p>{metadata.description}</p>
          </div>

          <div style={{ maxWidth: "600px", margin: "3rem auto" }}>
            <div className={`${styles.projectCard}`} style={{ cursor: "default" }}>
              <div className={styles.projectCardHeader}>
                <div className={styles.projectCardInfo}>
                  <span className={styles.projectCardFavicon} aria-hidden="true">
                    <Image src={metadata.favicon} alt="" width={20} height={20} />
                  </span>
                  <div>
                    <h2>{metadata.title}</h2>
                    <div className={styles.projectCardDomain}>{hostname}</div>
                  </div>
                </div>
              </div>
              <p className={styles.projectCardDescription}>{metadata.description}</p>
              
              <a
                className={`${styles.button} ${styles.buttonPrimary}`}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginTop: "1.5rem" }}
              >
                <ExternalLink size={18} />
                <span>Visit Project</span>
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
