"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface YearFormProps {
  id?: string;
  initial?: {
    year?: number;
    edition: string;
    title: string;
    status: "draft" | "publikováno";
  };
}

export function YearForm({ id, initial }: YearFormProps) {
  const router = useRouter();
  const [year, setYear] = useState(initial?.year ?? new Date().getFullYear());
  const [edition, setEdition] = useState(initial?.edition ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [status, setStatus] = useState<"draft" | "publikováno">(initial?.status ?? "draft");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const supabase = createClient();
    const payload = { year, edition, title, status };
    if (id) {
      const { error: err } = await supabase.from("years").update(payload).eq("id", id);
      if (err) {
        setError(err.message);
        setSaving(false);
        return;
      }
      router.push("/admin/years");
      router.refresh();
    } else {
      const { error: err } = await supabase.from("years").insert(payload);
      if (err) {
        setError(err.message);
        setSaving(false);
        return;
      }
      router.push("/admin/years");
      router.refresh();
    }
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-6 p-6 rounded-xl border border-black/10 bg-white">
      {error && (
        <div className="p-3 rounded-lg text-sm text-red-700 bg-red-50 border border-red-200" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
          {error}
        </div>
      )}
      <div>
        <label htmlFor="year" className="block text-sm font-medium text-[#333] mb-1" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
          Rok
        </label>
        <input
          id="year"
          type="number"
          min={1988}
          max={2100}
          value={year || ""}
          onChange={(e) => setYear(parseInt(e.target.value, 10) || 0)}
          className="w-full px-4 py-2.5 rounded-lg border border-black/15 bg-white outline-none focus:ring-2 focus:ring-[#7A1E2C]/30"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        />
      </div>
      <div>
        <label htmlFor="edition" className="block text-sm font-medium text-[#333] mb-1" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
          Pořadí ročníku (např. XXXVI)
        </label>
        <input
          id="edition"
          type="text"
          value={edition}
          onChange={(e) => setEdition(e.target.value)}
          placeholder="XXXVI"
          className="w-full px-4 py-2.5 rounded-lg border border-black/15 bg-white outline-none focus:ring-2 focus:ring-[#7A1E2C]/30"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        />
      </div>
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-[#333] mb-1" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
          Název ročníku
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="XXXVI. ročník Čůčobraní – 2025"
          className="w-full px-4 py-2.5 rounded-lg border border-black/15 bg-white outline-none focus:ring-2 focus:ring-[#7A1E2C]/30"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#333] mb-2" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
          Stav
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "draft" | "publikováno")}
          className="w-full px-4 py-2.5 rounded-lg border border-black/15 bg-white outline-none focus:ring-2 focus:ring-[#7A1E2C]/30"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          <option value="draft">Draft</option>
          <option value="publikováno">Publikováno</option>
        </select>
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-lg text-white font-medium disabled:opacity-60"
          style={{ backgroundColor: "#7A1E2C", fontFamily: "var(--font-inter), sans-serif" }}
        >
          {saving ? "Ukládám…" : "Uložit"}
        </button>
        <Link
          href="/admin/years"
          className="px-6 py-2.5 rounded-lg border border-black/15 text-[#333] font-medium hover:bg-black/5"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          Zrušit
        </Link>
      </div>
    </form>
  );
}
