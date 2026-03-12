import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { DARK_WINE } from "@/lib/theme";
import { YearForm } from "../YearForm";

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
    </div>
  );
}
