import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const urls: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date() },
    {
      url: `${base}/archiv/prehistorie`,
      changeFrequency: "yearly",
      priority: 0.7,
    },
  ];

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const supabase = await createClient();
      const { data } = await supabase
        .from("years")
        .select("id, updated_at")
        .eq("status", "publikováno");
      for (const y of data ?? []) {
        urls.push({
          url: `${base}/archiv/${y.id}`,
          lastModified: y.updated_at ? new Date(y.updated_at) : new Date(),
          changeFrequency: "yearly",
          priority: 0.7,
        });
      }
    }
  } catch {
    // Bez env nebo při chybě DB vrátíme jen úvodní stránku
  }

  return urls.map((entry) => {
    if (entry.url === `${base}/`) {
      return {
        ...entry,
        changeFrequency: "weekly" as const,
        priority: 1,
      };
    }

    return entry;
  });
}
