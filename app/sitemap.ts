import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://cucobrani-web.vercel.app";
  const supabase = await createClient();

  const slugs: { url: string; lastModified?: Date }[] = [
    { url: `${base}/`, lastModified: new Date() },
  ];

  try {
    const { data } = await supabase.from("years").select("id, updated_at").or("status.is.null,status.eq.publikováno");
    for (const y of data ?? []) {
      slugs.push({
        url: `${base}/archiv/${y.id}`,
        lastModified: y.updated_at ? new Date(y.updated_at) : new Date(),
      });
    }
  } catch {
    // ignore
  }

  return slugs.map((s) => ({
    url: s.url,
    lastModified: s.lastModified,
    changeFrequency: "yearly" as const,
    priority: s.url === `${base}/` ? 1 : 0.8,
  }));
}
