import type { SupabaseClient } from "@supabase/supabase-js";
import type { YearData, YearTheme } from "./year-data";

type YearRow = {
  id: string;
  year?: number | null;
  edition?: string | null;
  title?: string | null;
  name?: string | null;
  status?: string | null;
  program_title?: string | null;
  program_author?: string | null;
  program_description?: string | null;
  program_image_url?: string | null;
  program_pdf_url?: string | null;
};

export async function fetchYearsWithData(
  supabase: SupabaseClient,
  supabaseUrl: string
): Promise<YearData[]> {
  const { data: yearsRaw } = await supabase
    .from("years")
    .select("id, year, edition, title, name, status, program_title, program_author, program_description, program_image_url, program_pdf_url")
    .order("created_at", { ascending: false });

  const years = (yearsRaw ?? []).filter(
    (y: YearRow) => !y.status || y.status === "publikováno"
  ) as YearRow[];
  if (!years.length) return [];

  const result: YearData[] = [];

  for (const row of years as YearRow[]) {
    const id = row.id;
    const [q, a, w, wh, r, g] = await Promise.all([
      supabase.from("year_results_queen").select("name, wine").eq("year_id", id).maybeSingle(),
      supabase.from("year_results_audience").select("name, wine").eq("year_id", id).maybeSingle(),
      supabase.from("year_results_worst").select("name, wine").eq("year_id", id).maybeSingle(),
      supabase.from("year_results_white").select("position, name, wine, points").eq("year_id", id).order("position", { ascending: true }),
      supabase.from("year_results_red").select("position, name, wine, points").eq("year_id", id).order("position", { ascending: true }),
      supabase.from("year_gallery").select("storage_path").eq("year_id", id).order("sort_order", { ascending: true }),
    ]);

    const queen = q.data;
    const audience = a.data;
    const worst = w.data;
    const whiteRows = wh.data ?? [];
    const redRows = r.data ?? [];
    const galleryRows = g.data ?? [];

    const galleryUrls = galleryRows.map(
      (x: { storage_path: string }) => `${supabaseUrl}/storage/v1/object/public/year-gallery/${x.storage_path}`
    );

    const theme: YearTheme | undefined =
      row.program_title || row.program_author || row.program_description || row.program_pdf_url || row.program_image_url
        ? {
            title: row.program_title || row.title || row.name || "",
            sceneTitle: row.program_author ?? undefined,
            sceneDescription: row.program_description ?? undefined,
            programPdfUrl: row.program_pdf_url ?? undefined,
            programThumbnailUrl: row.program_image_url ?? undefined,
          }
        : undefined;

    const whiteFirst = whiteRows[0];
    const redFirst = redRows[0];

    result.push({
      id: row.id,
      year: row.year ?? 0,
      edition: row.edition ?? "",
      description: row.title || row.name || "",
      winners: {
        ...(queen?.name || queen?.wine ? { queenOfCellar: { name: queen.name ?? "", wine: queen.wine ?? "" } } : {}),
        ...(whiteFirst ? { white: { place: whiteFirst.position, name: whiteFirst.name ?? "", wine: whiteFirst.wine ?? "" } } : {}),
        ...(redFirst ? { red: { place: redFirst.position, name: redFirst.name ?? "", wine: redFirst.wine ?? "" } } : {}),
        ...(audience?.name || audience?.wine ? { audience: { name: audience.name ?? "", wine: audience.wine ?? "" } } : {}),
        ...(worst?.name || worst?.wine ? { worst: { name: worst.name ?? "", wine: worst.wine ?? "" } } : {}),
      },
      results: {
        white: whiteRows.map((x: { position: number; name: string | null; wine: string | null; points: string | null }) => ({
          place: x.position,
          name: x.name ?? "",
          wine: x.wine ?? "",
          points: x.points ? parseFloat(x.points) : undefined,
        })),
        red: redRows.map((x: { position: number; name: string | null; wine: string | null; points: string | null }) => ({
          place: x.position,
          name: x.name ?? "",
          wine: x.wine ?? "",
          points: x.points ? parseFloat(x.points) : undefined,
        })),
        rose: [],
      },
      hasGallery: galleryUrls.length > 0,
      gallery: galleryUrls,
      theme,
    });
  }

  return result;
}
