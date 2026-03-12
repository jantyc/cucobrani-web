import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DARK_WINE } from "@/lib/theme";
import { YearForm } from "../YearForm";

export const metadata = {
  title: "Přidat ročník | Admin Čůčobraní",
  robots: "noindex, nofollow",
};

export default async function AdminYearNewPage() {
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
        Přidat ročník
      </h1>
      <p className="text-[#666] text-sm mb-8" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
        Základní údaje. Výsledky, program a galerii lze doplnit po uložení.
      </p>
      <YearForm />
    </div>
  );
}
