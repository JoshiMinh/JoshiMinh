export interface HeroHighlight {
  title: string;
  description: string;
  icon: string;
}

export interface IdentityPoint {
  label: string;
  value: string;
}

export interface ExpertiseArea {
  title: string;
  description: string;
  icon: string;
  gradient: string;
  tags: string[];
}

export interface ProjectSource {
  slug: string;
  name: string;
  url: string;
}

export interface SocialLink {
  label: string;
  url: string;
  icon: string;
}

export interface DonationLink {
  label: string;
  shortLabel: string;
  url: string;
  icon: string;
  heroClass: string;
}

export interface ProjectMetadata {
  title: string;
  description: string;
  favicon: string;
  url: string;
}
