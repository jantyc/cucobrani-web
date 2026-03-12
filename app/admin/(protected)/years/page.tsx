import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { DARK_WINE, WINE_RED } from "@/lib/theme";
import { YearsTable } from "./YearsTable";

export const metadata = {
  title: "Archiv ročníků | Admin Čůčobraní",
  robots: "noindex, nofollow",
};

export default async function AdminYearsPage() {
  const supabase = await createClient();
  const { data: years } = await supabase
    .from("years")
    .select("id, year, edition, title, name, status, created_at")
    .order("created_at", { ascending: false });

  const rows = (years ?? []).map((y) => ({
    id: y.id,
    year: y.year ?? null,
    edition: y.edition ?? null,
    title: y.title ?? y.name ?? "",
    status: y.status ?? "draft",
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
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
            Archiv ročníků
          </h1>
          <p className="text-[#666] text-sm" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            Přehled ročníků, přidat nový, upravit nebo smazat.
          </p>
        </div>
        <Link
          href="/admin/years/new"
          className="inline-block px-5 py-2.5 rounded-lg text-white font-medium"
          style={{ backgroundColor: WINE_RED, fontFamily: "var(--font-inter), sans-serif" }}
        >
          Přidat ročník
        </Link>
      </div>

      <YearsTable rows={rows} />
    </div>
  );
}
