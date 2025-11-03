export function createAnimationStyle(delaySeconds: number): React.CSSProperties {
  return { "--delay": `${delaySeconds}s` } as React.CSSProperties;
}

export function safeDecodeURIComponent(str: string): string {
  try {
    return decodeURIComponent(str);
  } catch {
    return str;
  }
}
