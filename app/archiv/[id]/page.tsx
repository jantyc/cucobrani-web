import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { DARK_WINE, WINE_RED } from "@/lib/theme";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("years").select("year, edition, title, name").eq("id", id).single();
  const title = data?.title || data?.name || (data?.year ? `Ročník ${data.year}` : "Ročník");
  return {
    title: `${title} | Čůčobraní – archiv`,
    description: `Detail ročníku Čůčobraní: ${title}. Výsledky soutěže, program, fotogalerie.`,
  };
}

export default async function YearPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: year, error } = await supabase
    .from("years")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !year) notFound();

  const isPublished = year.status === "publikováno";
  let results: {
    queen: { name: string | null; wine: string | null; points: string | null } | null;
    audience: { name: string | null; wine: string | null; points: string | null } | null;
    worst: { name: string | null; wine: string | null; points: string | null } | null;
    white: { position: number; name: string | null; wine: string | null; points: string | null }[];
    red: { position: number; name: string | null; wine: string | null; points: string | null }[];
  } | null = null;

  if (isPublished) {
    try {
      const [q, a, w, wh, r] = await Promise.all([
        supabase.from("year_results_queen").select("name, wine, points").eq("year_id", id).maybeSingle(),
        supabase.from("year_results_audience").select("name, wine, points").eq("year_id", id).maybeSingle(),
        supabase.from("year_results_worst").select("name, wine, points").eq("year_id", id).maybeSingle(),
        supabase.from("year_results_white").select("position, name, wine, points").eq("year_id", id).order("position", { ascending: true }),
        supabase.from("year_results_red").select("position, name, wine, points").eq("year_id", id).order("position", { ascending: true }),
      ]);
      const hasAny = q.data || a.data || w.data || (wh.data && wh.data.length) || (r.data && r.data.length);
      if (hasAny) {
        results = {
          queen: q.data ?? null,
          audience: a.data ?? null,
          worst: w.data ?? null,
          white: wh.data ?? [],
          red: r.data ?? [],
        };
      }
    } catch {
      // Tabulky výsledků nemusí existovat (starší migrace)
    }
  }

  let gallery: { storage_path: string }[] = [];
  if (isPublished) {
    try {
      const { data } = await supabase
        .from("year_gallery")
        .select("storage_path")
        .eq("year_id", id)
        .order("sort_order", { ascending: true });
      gallery = data ?? [];
    } catch {
      // Storage bucket nebo tabulka nemusí existovat
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const galleryUrls = gallery.map((g) => `${supabaseUrl}/storage/v1/object/public/year-gallery/${g.storage_path}`);

  const displayTitle = year.title || year.name || (year.year ? `${year.edition || ""}. ročník – ${year.year}` : "Ročník");
  const hasProgram = year.program_title || year.program_author || year.program_description || year.program_image_url || year.program_pdf_url;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F6F4F1" }}>
      <header className="border-b border-black/10 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/#archiv"
            className="text-[#7A1E2C] font-medium hover:underline"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            ← Zpět na archiv
          </Link>
          <Link
            href="/"
            className="font-semibold"
            style={{
              fontFamily: "var(--font-bebas), sans-serif",
              letterSpacing: "0.08em",
              color: DARK_WINE,
              fontSize: "1.25rem",
            }}
          >
            Čůčobraní
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1
          className="mb-2"
          style={{
            fontFamily: "var(--font-bebas), sans-serif",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            color: DARK_WINE,
            letterSpacing: "0.04em",
          }}
        >
          {displayTitle}
        </h1>
        {!hasProgram && !results && galleryUrls.length === 0 && (
          <p className="text-[#666] mb-8" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            Detail ročníku. Výsledky, program a galerie budou doplněny.
          </p>
        )}

        {hasProgram && (
          <section className="mb-8 p-6 rounded-xl bg-white border border-black/10">
            <h2
              className="mb-3"
              style={{
                fontFamily: "var(--font-bebas), sans-serif",
                fontSize: "1.25rem",
                color: DARK_WINE,
              }}
            >
              Program
            </h2>
            {year.program_title && (
              <p className="text-[#333] font-medium mb-1" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                {year.program_title}
              </p>
            )}
            {year.program_author && (
              <p className="text-[#666] text-sm mb-2" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                {year.program_author}
              </p>
            )}
            {year.program_description && (
              <p className="text-[#333] mb-4 whitespace-pre-line" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                {year.program_description}
              </p>
            )}
            {year.program_image_url && (
              <div className="mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={year.program_image_url} alt="Program" className="max-w-full rounded-lg border border-black/10" />
              </div>
            )}
            {year.program_pdf_url && (
              <a
                href={year.program_pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-[#7A1E2C] font-medium hover:underline"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                Program večera (PDF)
              </a>
            )}
          </section>
        )}

        {results && (
          <section className="mb-8 p-6 rounded-xl bg-white border border-black/10">
            <h2
              className="mb-4"
              style={{
                fontFamily: "var(--font-bebas), sans-serif",
                fontSize: "1.25rem",
                color: DARK_WINE,
              }}
            >
              Výsledky soutěže
            </h2>
            <div className="space-y-6" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
              {results.queen && (results.queen.name || results.queen.wine || results.queen.points) && (
                <div>
                  <h3 className="text-sm font-semibold text-[#666] mb-1">Královna sklepa</h3>
                  <p className="text-[#333]">{[results.queen.name, results.queen.wine, results.queen.points].filter(Boolean).join(" – ")}</p>
                </div>
              )}
              {results.audience && (results.audience.name || results.audience.wine || results.audience.points) && (
                <div>
                  <h3 className="text-sm font-semibold text-[#666] mb-1">Cena diváků</h3>
                  <p className="text-[#333]">{[results.audience.name, results.audience.wine, results.audience.points].filter(Boolean).join(" – ")}</p>
                </div>
              )}
              {results.worst && (results.worst.name || results.worst.wine || results.worst.points) && (
                <div>
                  <h3 className="text-sm font-semibold text-[#666] mb-1">Sračka roku</h3>
                  <p className="text-[#333]">{[results.worst.name, results.worst.wine, results.worst.points].filter(Boolean).join(" – ")}</p>
                </div>
              )}
              {results.white.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-[#666] mb-2">Bílá vína</h3>
                  <ul className="list-decimal list-inside space-y-1 text-[#333]">
                    {results.white.map((row, i) => (
                      <li key={i}>{[row.name, row.wine, row.points].filter(Boolean).join(" – ") || "—"}</li>
                    ))}
                  </ul>
                </div>
              )}
              {results.red.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-[#666] mb-2">Červená vína</h3>
                  <ul className="list-decimal list-inside space-y-1 text-[#333]">
                    {results.red.map((row, i) => (
                      <li key={i}>{[row.name, row.wine, row.points].filter(Boolean).join(" – ") || "—"}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {galleryUrls.length > 0 && (
          <section className="mb-8 p-6 rounded-xl bg-white border border-black/10">
            <h2
              className="mb-4"
              style={{
                fontFamily: "var(--font-bebas), sans-serif",
                fontSize: "1.25rem",
                color: DARK_WINE,
              }}
            >
              Fotogalerie
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {galleryUrls.map((url, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg overflow-hidden border border-black/10 aspect-square focus:ring-2 focus:ring-[#7A1E2C]/40"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </a>
              ))}
            </div>
          </section>
        )}

        <Link
          href="/"
          className="inline-block px-5 py-2.5 rounded text-white font-medium"
          style={{ backgroundColor: WINE_RED, fontFamily: "var(--font-inter), sans-serif" }}
        >
          Zpět na úvodní stránku
        </Link>
      </main>
    </div>
  );
}
