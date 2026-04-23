"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DARK_WINE, WINE_RED } from "@/lib/theme";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError(err.message === "Invalid login credentials" ? "Nesprávný e-mail nebo heslo." : err.message);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="max-w-md w-full mx-auto">
      <h1
        className="mb-2 text-center"
        style={{
          fontFamily: "var(--font-bebas), sans-serif",
          fontSize: "2rem",
          color: DARK_WINE,
          letterSpacing: "0.06em",
        }}
      >
        Přihlášení do administrace
      </h1>
      <p className="text-center text-[#666] text-sm mb-8" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
        Pouze pro organizátory akce.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div
            className="p-3 rounded-lg text-sm text-red-700 bg-red-50 border border-red-200"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            {error}
          </div>
        )}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#333] mb-1" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            E-mail
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full px-4 py-2.5 rounded-lg border border-black/15 bg-white outline-none focus:ring-2 focus:ring-[#7A1E2C]/30"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[#333] mb-1" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            Heslo
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full px-4 py-2.5 rounded-lg border border-black/15 bg-white outline-none focus:ring-2 focus:ring-[#7A1E2C]/30"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg text-white font-medium disabled:opacity-60 transition-opacity"
          style={{ backgroundColor: WINE_RED, fontFamily: "var(--font-inter), sans-serif" }}
        >
          {loading ? "Přihlašování…" : "Přihlásit se"}
        </button>
      </form>

      <p className="mt-6 text-center">
        <Link href="/" className="text-[#666] hover:underline text-sm" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
          ← Zpět na web
        </Link>
      </p>
    </div>
  );
}
