import Link from "next/link";
import { DARK_WINE, WINE_RED } from "@/lib/theme";

export const metadata = {
  title: "Dashboard | Admin Čůčobraní",
  robots: "noindex, nofollow",
};

export default function AdminDashboardPage() {
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
        Dashboard
      </h1>
      <p className="text-[#666] text-sm mb-8" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
        Rozcestník administrace. Pouze dvě hlavní sekce.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
        <Link
          href="/admin/upcoming"
          className="block p-6 rounded-xl border border-black/10 bg-white hover:border-[#7A1E2C]/40 hover:shadow-md transition-all"
        >
          <h2
            className="mb-2"
            style={{
              fontFamily: "var(--font-bebas), sans-serif",
              fontSize: "1.35rem",
              color: DARK_WINE,
              letterSpacing: "0.04em",
            }}
          >
            Nadcházející ročník
          </h2>
          <p className="text-sm text-[#666]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            Upravit text, místo a datum v hero sekci na webu.
          </p>
        </Link>

        <Link
          href="/admin/years"
          className="block p-6 rounded-xl border border-black/10 bg-white hover:border-[#7A1E2C]/40 hover:shadow-md transition-all"
        >
          <h2
            className="mb-2"
            style={{
              fontFamily: "var(--font-bebas), sans-serif",
              fontSize: "1.35rem",
              color: DARK_WINE,
              letterSpacing: "0.04em",
            }}
          >
            Archiv ročníků
          </h2>
          <p className="text-sm text-[#666]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            Přehled ročníků, přidat nový, upravit nebo smazat.
          </p>
        </Link>

        <Link
          href="/admin/admin-users"
          className="block p-6 rounded-xl border border-black/10 bg-white hover:border-[#7A1E2C]/40 hover:shadow-md transition-all"
        >
          <h2
            className="mb-2"
            style={{
              fontFamily: "var(--font-bebas), sans-serif",
              fontSize: "1.35rem",
              color: DARK_WINE,
              letterSpacing: "0.04em",
            }}
          >
            Admin uživatelé
          </h2>
          <p className="text-sm text-[#666]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            Správa e‑mailů, které mají přístup do administrace.
          </p>
        </Link>
      </div>
    </div>
  );
}
