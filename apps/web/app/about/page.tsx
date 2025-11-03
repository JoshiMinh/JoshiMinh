import { getCoreValues } from "@/lib/data";
import { createAnimationStyle } from "@/lib/animation";
import styles from "../styles.module.css";

export const metadata = {
  title: "About - Joshi Minh",
  description: "Learn more about Joshi Minh, an undergraduate software engineer, product designer, and AI tinkerer.",
};

export default async function AboutPage() {
  const coreValues = await getCoreValues();

  return (
    <div className={styles.page}>
      <main>
        <section className={`${styles.section} ${styles.sectionAbout}`} aria-labelledby="about-heading">
          <div className={styles.about}>
            <div className={styles.aboutText}>
              <h1 id="about-heading">About me</h1>
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
    </div>
  );
}
