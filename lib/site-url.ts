const FALLBACK_SITE_URL = "https://www.cucobrani.cz";
const ALLOWED_HOSTNAMES = new Set(["cucobrani.cz", "www.cucobrani.cz"]);

function normalizeSiteUrl(raw: string | undefined): string {
  const value = (raw ?? "").trim();
  if (!value) return FALLBACK_SITE_URL;

  try {
    const url = new URL(value.startsWith("http://") || value.startsWith("https://") ? value : `https://${value}`);
    if (!ALLOWED_HOSTNAMES.has(url.hostname.toLowerCase())) {
      return FALLBACK_SITE_URL;
    }
    return url.origin;
  } catch {
    return FALLBACK_SITE_URL;
  }
}

export function getSiteUrl(): string {
  return normalizeSiteUrl(process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL);
}
