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
  if (allowedEmailsEnv && user.email) {
    const allowedEmails = allowedEmailsEnv
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);

    if (!allowedEmails.includes(user.email.toLowerCase())) {
      redirect("/");
    }
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
