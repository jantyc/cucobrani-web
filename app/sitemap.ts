import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://cucobrani-web.vercel.app";
  const slugs: { url: string; lastModified?: Date }[] = [
    { url: `${base}/`, lastModified: new Date() },
  ];

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const supabase = await createClient();
      const { data } = await supabase.from("years").select("id, updated_at").or("status.is.null,status.eq.publikováno");
      for (const y of data ?? []) {
        slugs.push({
          url: `${base}/archiv/${y.id}`,
          lastModified: y.updated_at ? new Date(y.updated_at) : new Date(),
        });
      }
    }
  } catch {
    // Bez env nebo při chybě DB vrátíme jen úvodní stránku
  }

  return slugs.map((s) => ({
    url: s.url,
    lastModified: s.lastModified,
    changeFrequency: "yearly" as const,
    priority: s.url === `${base}/` ? 1 : 0.8,
  }));
}
