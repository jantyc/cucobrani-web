import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { DARK_WINE } from "@/lib/theme";
import { YearForm } from "../YearForm";
import { YearResultsForm } from "../YearResultsForm";
import { YearGalleryForm } from "../YearGalleryForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("years").select("year, edition, title").eq("id", id).single();
  const title = data?.title || (data?.year ? `Ročník ${data.year}` : "Upravit ročník");
  return { title: `${title} | Admin Čůčobraní`, robots: "noindex, nofollow" };
}

export default async function AdminYearEditPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: year, error } = await supabase.from("years").select("*").eq("id", id).single();
  if (error || !year) notFound();

  const initial = {
    year: year.year ?? undefined,
    edition: year.edition ?? year.name ?? "",
    title: year.title ?? year.name ?? "",
    status: (year.status as "draft" | "publikováno") ?? "draft",
    program_title: year.program_title ?? "",
    program_author: year.program_author ?? "",
    program_description: year.program_description ?? "",
    program_image_url: year.program_image_url ?? "",
    program_pdf_url: year.program_pdf_url ?? "",
  };

  return (
    <div>
      <h1
        className="mb-2"
        style={{
          fontFamily: "var(--font-bebas), sans-serif",
          fontSize: "2rem",
          color: DARK_WINE,
          letterSpacing: "0.06em",
        }}
      >
        Upravit ročník
      </h1>
      <p className="text-[#666] text-sm mb-8" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
        {year.year ?? year.title ?? year.name ?? id}
      </p>
      <YearForm id={id} initial={initial} />

      <div className="mt-10">
        <h2
          className="mb-4"
          style={{
            fontFamily: "var(--font-bebas), sans-serif",
            fontSize: "1.5rem",
            color: DARK_WINE,
            letterSpacing: "0.04em",
          }}
        >
          Výsledky soutěže
        </h2>
        <YearResultsForm yearId={id} />
      </div>

      <div className="mt-10">
        <h2
          className="mb-4"
          style={{
            fontFamily: "var(--font-bebas), sans-serif",
            fontSize: "1.5rem",
            color: DARK_WINE,
            letterSpacing: "0.04em",
          }}
        >
          Fotogalerie
        </h2>
        <YearGalleryForm yearId={id} />
      </div>
    </div>
  );
}
