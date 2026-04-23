"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
}

export default function AdminUsersPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<AdminUser[]>([]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data, error } = await supabase.from("admin_users").select("id, email, name").order("email", { ascending: true });
      if (error) {
        setMessage({ type: "err", text: error.message });
      } else {
        setItems(data as AdminUser[]);
      }
      setLoading(false);
    })();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();
    if (!trimmedEmail) {
      setMessage({ type: "err", text: "E‑mail je povinný." });
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("admin_users")
      .insert({ email: trimmedEmail, name: trimmedName || null })
      .select("id, email, name")
      .single();

    if (error) {
      const msg = error.message.includes("duplicate key") ? "Tento e‑mail už v seznamu je." : error.message;
      setMessage({ type: "err", text: msg });
      setSaving(false);
      return;
    }

    setItems((prev) => [...prev, data as AdminUser].sort((a, b) => a.email.localeCompare(b.email)));
    setEmail("");
    setName("");
    setMessage({ type: "ok", text: "Admin uživatel přidán." });
    setSaving(false);
  }

  async function handleDelete(id: string) {
    // Jednoduché potvrzení; minimální bezpečnost.
    if (!window.confirm("Odebrat tohoto admin uživatele?")) return;

    setSaving(true);
    setMessage(null);
    const supabase = createClient();
    const { error } = await supabase.from("admin_users").delete().eq("id", id);
    if (error) {
      setMessage({ type: "err", text: error.message });
      setSaving(false);
      return;
    }
    setItems((prev) => prev.filter((x) => x.id !== id));
    setMessage({ type: "ok", text: "Admin uživatel odebrán." });
    setSaving(false);
  }

  return (
    <div className="max-w-3xl">
      <h1
        className="mb-2"
        style={{
          fontFamily: "var(--font-bebas), sans-serif",
          fontSize: "2rem",
          letterSpacing: "0.06em",
          color: "#3A0F16",
        }}
      >
        Admin uživatelé
      </h1>
      <p className="text-sm text-[#666] mb-6" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
        E‑mailové adresy, které mají přístup do administrace (pokud není použit env whitelist <code>ADMIN_ALLOWED_EMAILS</code>).
      </p>

      <form onSubmit={handleAdd} className="mb-6 p-4 rounded-xl border border-black/10 bg-white space-y-3">
        {message && (
          <div
            className={`p-2.5 rounded-md text-sm ${
              message.type === "ok" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
            }`}
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            {message.text}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div className="sm:col-span-2">
            <label
              htmlFor="admin-email"
              className="block text-sm font-medium text-[#333] mb-1"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              E‑mail
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="uzivatel@example.com"
              className="w-full px-3 py-2 rounded-lg border border-black/15 bg-white outline-none focus:ring-2 focus:ring-[#7A1E2C]/30"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            />
          </div>
          <div className="sm:col-span-1">
            <label
              htmlFor="admin-name"
              className="block text-sm font-medium text-[#333] mb-1"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              Jméno (nepovinné)
            </label>
            <input
              id="admin-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Zobrazované jméno"
              className="w-full px-3 py-2 rounded-lg border border-black/15 bg-white outline-none focus:ring-2 focus:ring-[#7A1E2C]/30"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-60"
          style={{ backgroundColor: "#7A1E2C", fontFamily: "var(--font-inter), sans-serif" }}
        >
          {saving ? "Ukládám…" : "Přidat admin uživatele"}
        </button>
      </form>

      <div className="rounded-xl border border-black/10 bg-white">
        <div className="px-4 py-3 border-b border-black/10 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#333]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            Seznam adminů
          </h2>
          {loading && (
            <span className="text-xs text-[#888]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
              Načítám…
            </span>
          )}
        </div>
        <div className="divide-y divide-black/10">
          {items.length === 0 && !loading && (
            <div className="px-4 py-4 text-sm text-[#777]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
              Zatím není přidán žádný admin uživatel.
            </div>
          )}
          {items.map((u) => (
            <div key={u.id} className="px-4 py-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-[#222]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                  {u.email}
                </p>
                {u.name && (
                  <p className="text-xs text-[#777]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                    {u.name}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleDelete(u.id)}
                className="text-xs text-red-600 hover:underline"
                disabled={saving}
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                Odebrat
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

