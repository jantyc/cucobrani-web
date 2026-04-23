import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { DARK_WINE } from "@/lib/theme";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const allowedEmailsEnv = process.env.ADMIN_ALLOWED_EMAILS;
  const userEmail = user.email?.toLowerCase() ?? null;
  let isAllowedByEnv = false;

  if (allowedEmailsEnv && userEmail) {
    const allowedEmails = allowedEmailsEnv
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);

    if (allowedEmails.includes(userEmail)) {
      isAllowedByEnv = true;
    }
  }

  // Prefer explicit admin_users table when available.
  // Pokud tabulka neexistuje NEBO je prázdná, chováme se jako dřív
  // (povolíme všechny přihlášené uživatele, případně podle env whitelistu).
  let isAllowedByAdminTable: boolean | null = null;
  let hasAnyAdminUser: boolean | null = null;

  if (!isAllowedByEnv && userEmail) {
    try {
      const { data, error, count } = await supabase
        .from("admin_users")
        .select("id", { count: "exact", head: false })
        .eq("email", userEmail)
        .maybeSingle();

      if (!error) {
        isAllowedByAdminTable = !!data;
        if (typeof count === "number") {
          hasAnyAdminUser = count > 0;
        }
      }
    } catch {
      // ignore – most likely the table does not exist yet
    }
  }

  // Pokud admin_users existuje a má aspoň jeden záznam, vynucujeme členství.
  // Pokud je tabulka prázdná nebo neexistuje, povolíme všechny přihlášené
  // (aby šlo první adminy přes UI teprve nastavit).
  if (!isAllowedByEnv && isAllowedByAdminTable === false && hasAnyAdminUser) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#F6F4F1" }}>
      <aside
        className="w-56 flex-shrink-0 border-r border-black/10 flex flex-col"
        style={{ backgroundColor: "#fff" }}
      >
        <div className="p-4 border-b border-black/10">
          <Link
            href="/admin"
            className="font-semibold"
            style={{
              fontFamily: "var(--font-bebas), sans-serif",
              fontSize: "1.25rem",
              letterSpacing: "0.06em",
              color: DARK_WINE,
            }}
          >
            Čůčobraní Admin
          </Link>
        </div>
        <nav className="p-2 flex-1">
          <Link
            href="/admin"
            className="block px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-black/5"
            style={{ fontFamily: "var(--font-inter), sans-serif", color: "#333" }}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/upcoming"
            className="block px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-black/5"
            style={{ fontFamily: "var(--font-inter), sans-serif", color: "#333" }}
          >
            Nadcházející ročník
          </Link>
          <Link
            href="/admin/years"
            className="block px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-black/5"
            style={{ fontFamily: "var(--font-inter), sans-serif", color: "#333" }}
          >
            Archiv ročníků
          </Link>
          <Link
            href="/admin/admin-users"
            className="block px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-black/5"
            style={{ fontFamily: "var(--font-inter), sans-serif", color: "#333" }}
          >
            Admin uživatelé
          </Link>
        </nav>
        <div className="p-3 border-t border-black/10">
          <p className="text-xs text-[#666] truncate" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            {user.email}
          </p>
          <form action="/admin/logout" method="post" className="mt-2">
            <button
              type="submit"
              className="text-xs text-[#7A1E2C] hover:underline"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              Odhlásit se
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
