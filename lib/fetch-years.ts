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
  program_pdf_url?: string | null;
};

type WineResultRow = {
  position: number;
  name: string | null;
  sample_number: string | null;
  wine: string | null;
  points: string | null;
};

function normalizeWineResultRows(data: unknown): WineResultRow[] {
  if (!Array.isArray(data)) return [];
  return data.map((row) => {
    const r = row as Record<string, unknown>;
    return {
      position: Number(r.position),
      name: (r.name as string | null) ?? null,
      sample_number: (r.sample_number as string | null | undefined) ?? null,
      wine: (r.wine as string | null) ?? null,
      points: (r.points as string | null) ?? null,
    };
  });
}

async function fetchWineRows(
  supabase: SupabaseClient,
  table: "year_results_white" | "year_results_red",
  yearId: string
) {
  const withSampleNumber = await supabase
    .from(table)
    .select("position, name, sample_number, wine, points")
    .eq("year_id", yearId)
    .order("position", { ascending: true });

  if (!withSampleNumber.error) {
    return withSampleNumber;
  }

  // Backward compatibility: DB ještě nemusí mít sample_number (migrace neproběhla).
  return supabase
    .from(table)
    .select("position, name, wine, points")
    .eq("year_id", yearId)
    .order("position", { ascending: true });
}

function rowToGalleryUrl(path: string, supabaseUrl: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${supabaseUrl}/storage/v1/object/public/year-gallery/${path}`;
}

export async function fetchYearsWithData(
  supabase: SupabaseClient,
  supabaseUrl: string
): Promise<YearData[]> {
  const { data: yearsRaw } = await supabase
    .from("years")
    .select("id, year, edition, title, name, status, program_title, program_author, program_description, program_image_url, program_pdf_url")
    // řaď podle skutečného roku, ne podle created_at,
    // aby nejnovější ročník (např. 2026) byl vždy první
    .order("year", { ascending: false })
    .order("created_at", { ascending: false });

  const years = (yearsRaw ?? []).filter(
    (y: YearRow) => !y.status || y.status === "publikováno"
  ) as YearRow[];
  if (!years.length) return [];

  const yearIds = years.map((y) => y.id);
  const [
    queenRes,
    audienceRes,
    worstRes,
    whiteRes,
    redRes,
    galleryRes,
  ] = await Promise.all([
    supabase.from("year_results_queen").select("year_id, name, wine").in("year_id", yearIds),
    supabase.from("year_results_audience").select("year_id, name, wine").in("year_id", yearIds),
    supabase.from("year_results_worst").select("year_id, name, wine").in("year_id", yearIds),
    supabase.from("year_results_white").select("year_id, position, name, sample_number, wine, points").in("year_id", yearIds).order("position", { ascending: true }),
    supabase.from("year_results_red").select("year_id, position, name, sample_number, wine, points").in("year_id", yearIds).order("position", { ascending: true }),
    supabase.from("year_gallery").select("year_id, storage_path, sort_order").in("year_id", yearIds).order("sort_order", { ascending: true }),
  ]);

  const whiteRowsByYear = new Map<string, WineResultRow[]>();
  const redRowsByYear = new Map<string, WineResultRow[]>();
  const galleryByYear = new Map<string, string[]>();
  const queenByYear = new Map<string, { name: string | null; wine: string | null }>();
  const audienceByYear = new Map<string, { name: string | null; wine: string | null }>();
  const worstByYear = new Map<string, { name: string | null; wine: string | null }>();

  if (!whiteRes.error) {
    for (const row of whiteRes.data ?? []) {
      const yearId = (row as { year_id: string }).year_id;
      const list = whiteRowsByYear.get(yearId) ?? [];
      list.push(normalizeWineResultRows([row])[0]);
      whiteRowsByYear.set(yearId, list);
    }
  } else {
    for (const id of yearIds) {
      const legacy = await fetchWineRows(supabase, "year_results_white", id);
      whiteRowsByYear.set(id, normalizeWineResultRows(legacy.data));
    }
  }

  if (!redRes.error) {
    for (const row of redRes.data ?? []) {
      const yearId = (row as { year_id: string }).year_id;
      const list = redRowsByYear.get(yearId) ?? [];
      list.push(normalizeWineResultRows([row])[0]);
      redRowsByYear.set(yearId, list);
    }
  } else {
    for (const id of yearIds) {
      const legacy = await fetchWineRows(supabase, "year_results_red", id);
      redRowsByYear.set(id, normalizeWineResultRows(legacy.data));
    }
  }

  for (const row of galleryRes.data ?? []) {
    const r = row as { year_id: string; storage_path: string };
    const list = galleryByYear.get(r.year_id) ?? [];
    list.push(rowToGalleryUrl(r.storage_path, supabaseUrl));
    galleryByYear.set(r.year_id, list);
  }
  for (const row of queenRes.data ?? []) {
    const r = row as { year_id: string; name: string | null; wine: string | null };
    queenByYear.set(r.year_id, { name: r.name, wine: r.wine });
  }
  for (const row of audienceRes.data ?? []) {
    const r = row as { year_id: string; name: string | null; wine: string | null };
    audienceByYear.set(r.year_id, { name: r.name, wine: r.wine });
  }
  for (const row of worstRes.data ?? []) {
    const r = row as { year_id: string; name: string | null; wine: string | null };
    worstByYear.set(r.year_id, { name: r.name, wine: r.wine });
  }

  return years.map((row) => {
    const whiteRows = whiteRowsByYear.get(row.id) ?? [];
    const redRows = redRowsByYear.get(row.id) ?? [];
    const galleryUrls = galleryByYear.get(row.id) ?? [];
    const queen = queenByYear.get(row.id);
    const audience = audienceByYear.get(row.id);
    const worst = worstByYear.get(row.id);
    const whiteFirst = whiteRows[0];
    const redFirst = redRows[0];

    const theme: YearTheme | undefined =
      row.program_title || row.program_author || row.program_description || row.program_pdf_url
        ? {
            title: row.program_title || row.title || row.name || "",
            sceneTitle: row.program_author ?? undefined,
            sceneDescription: row.program_description ?? undefined,
            programPdfUrl: row.program_pdf_url ?? undefined,
            programThumbnailUrl: row.program_pdf_url ?? undefined,
          }
        : undefined;

    return {
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
        white: whiteRows.map((x) => ({
          place: x.position,
          name: x.name ?? "",
          sampleNumber: x.sample_number ?? undefined,
          wine: x.wine ?? "",
          points: x.points ? parseFloat(x.points) : undefined,
        })),
        red: redRows.map((x) => ({
          place: x.position,
          name: x.name ?? "",
          sampleNumber: x.sample_number ?? undefined,
          wine: x.wine ?? "",
          points: x.points ? parseFloat(x.points) : undefined,
        })),
      },
      hasGallery: galleryUrls.length > 0,
      gallery: galleryUrls,
      theme,
    };
  });
}

export async function fetchYearWithDataById(
  supabase: SupabaseClient,
  supabaseUrl: string,
  yearId: string
): Promise<YearData | null> {
  const { data: row, error } = await supabase
    .from("years")
    .select("id, year, edition, title, name, status, program_title, program_author, program_description, program_pdf_url")
    .eq("id", yearId)
    .maybeSingle();

  if (error || !row || (row.status && row.status !== "publikováno")) {
    return null;
  }

  const [q, a, w, wh, r, g] = await Promise.all([
    supabase.from("year_results_queen").select("name, wine").eq("year_id", yearId).maybeSingle(),
    supabase.from("year_results_audience").select("name, wine").eq("year_id", yearId).maybeSingle(),
    supabase.from("year_results_worst").select("name, wine").eq("year_id", yearId).maybeSingle(),
    fetchWineRows(supabase, "year_results_white", yearId),
    fetchWineRows(supabase, "year_results_red", yearId),
    supabase.from("year_gallery").select("storage_path").eq("year_id", yearId).order("sort_order", { ascending: true }),
  ]);

  const queen = q.data;
  const audience = a.data;
  const worst = w.data;
  const whiteRows = normalizeWineResultRows(wh.data);
  const redRows = normalizeWineResultRows(r.data);
  const galleryRows = g.data ?? [];
  const galleryUrls = galleryRows.map((x: { storage_path: string }) =>
    rowToGalleryUrl(x.storage_path, supabaseUrl)
  );
  const whiteFirst = whiteRows[0];
  const redFirst = redRows[0];

  const theme: YearTheme | undefined =
    row.program_title || row.program_author || row.program_description || row.program_pdf_url
      ? {
          title: row.program_title || row.title || row.name || "",
          sceneTitle: row.program_author ?? undefined,
          sceneDescription: row.program_description ?? undefined,
          programPdfUrl: row.program_pdf_url ?? undefined,
          programThumbnailUrl: row.program_pdf_url ?? undefined,
        }
      : undefined;

  return {
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
      white: whiteRows.map((x) => ({
        place: x.position,
        name: x.name ?? "",
        sampleNumber: x.sample_number ?? undefined,
        wine: x.wine ?? "",
        points: x.points ? parseFloat(x.points) : undefined,
      })),
      red: redRows.map((x) => ({
        place: x.position,
        name: x.name ?? "",
        sampleNumber: x.sample_number ?? undefined,
        wine: x.wine ?? "",
        points: x.points ? parseFloat(x.points) : undefined,
      })),
    },
    hasGallery: galleryUrls.length > 0,
    gallery: galleryUrls,
    theme,
  };
}
