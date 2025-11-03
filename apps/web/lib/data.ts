import type {
  HeroHighlight,
  IdentityPoint,
  ExpertiseArea,
  ProjectSource,
  SocialLink,
  DonationLink,
} from "@/types/data";
import { promises as fs } from "fs";
import path from "path";

export async function loadJsonData<T>(filename: string): Promise<T> {
  const filePath = path.join(process.cwd(), "data", filename);
  const fileContents = await fs.readFile(filePath, "utf8");
  return JSON.parse(fileContents);
}

export async function getHeroHighlights(): Promise<HeroHighlight[]> {
  return loadJsonData<HeroHighlight[]>("hero-highlights.json");
}

export async function getIdentityPoints(): Promise<IdentityPoint[]> {
  return loadJsonData<IdentityPoint[]>("identity-points.json");
}

export async function getIdentityTags(): Promise<string[]> {
  return loadJsonData<string[]>("identity-tags.json");
}

export async function getExpertiseAreas(): Promise<ExpertiseArea[]> {
  return loadJsonData<ExpertiseArea[]>("expertise-areas.json");
}

export async function getProjectSources(): Promise<ProjectSource[]> {
  return loadJsonData<ProjectSource[]>("project-sources.json");
}

export async function getCoreValues(): Promise<string[]> {
  return loadJsonData<string[]>("core-values.json");
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  return loadJsonData<SocialLink[]>("social-links.json");
}

export async function getDonationLinks(): Promise<DonationLink[]> {
  return loadJsonData<DonationLink[]>("donation-links.json");
}
