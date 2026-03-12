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

  const displayTitle = year.title || year.name || (year.year ? `${year.edition || ""}. ročník – ${year.year}` : "Ročník");

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
        <p
          className="text-[#666] mb-8"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          Detail ročníku. Výsledky, program a fotogalerie budou doplněny po dokončení administrace.
        </p>

        {year.program_title && (
          <section className="mb-8 p-6 rounded-xl bg-white border border-black/10">
            <h2
              className="mb-2"
              style={{
                fontFamily: "var(--font-bebas), sans-serif",
                fontSize: "1.25rem",
                color: DARK_WINE,
              }}
            >
              Program
            </h2>
            <p
              className="text-[#333]"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              {year.program_title}
            </p>
            {year.program_pdf_url && (
              <a
                href={year.program_pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-[#7A1E2C] font-medium hover:underline"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                Program večera (PDF)
              </a>
            )}
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
