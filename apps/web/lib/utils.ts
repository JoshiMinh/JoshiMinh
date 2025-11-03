import type { ProjectSource } from "@/types/data";

export function formatUrl(urlString: string) {
  try {
    const url = new URL(urlString);
    const hostname = url.hostname.replace(/^www\./, "");
    const segments = url.pathname.split("/").filter(Boolean).slice(0, 3);
    return { hostname, segments };
  } catch (error) {
    return { hostname: urlString, segments: [] };
  }
}

export function prettifyHostname(hostname: string) {
  const primary = hostname.split(".")[0];
  return primary
    .split(/[-_]/)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export function createGradient(index: number, total: number) {
  const hueStart = 220;
  const hueEnd = 320;
  const steps = Math.max(total - 1, 1);
  const hue = hueStart + (index / steps) * (hueEnd - hueStart);
  return `linear-gradient(135deg, hsl(${hue}, 70%, 60%) 0%, hsl(${hue + 20}, 70%, 60%) 100%)`;
}

export function formatPathSegment(segment: string) {
  return segment
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function normaliseProjectCopy(value: string | undefined, fallback = "") {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}
