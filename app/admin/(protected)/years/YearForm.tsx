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
    program_title?: string;
    program_author?: string;
    program_description?: string;
    program_image_url?: string;
    program_pdf_url?: string;
  };
}

export function YearForm({ id, initial }: YearFormProps) {
  const router = useRouter();
  const [year, setYear] = useState(initial?.year ?? new Date().getFullYear());
  const [edition, setEdition] = useState(initial?.edition ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [status, setStatus] = useState<"draft" | "publikováno">(initial?.status ?? "draft");
  const [programTitle, setProgramTitle] = useState(initial?.program_title ?? "");
  const [programAuthor, setProgramAuthor] = useState(initial?.program_author ?? "");
  const [programDescription, setProgramDescription] = useState(initial?.program_description ?? "");
  const [programImageUrl, setProgramImageUrl] = useState(initial?.program_image_url ?? "");
  const [programPdfUrl, setProgramPdfUrl] = useState(initial?.program_pdf_url ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const supabase = createClient();
    const payload = {
      year,
      edition,
      title,
      status,
      program_title: programTitle || null,
      program_author: programAuthor || null,
      program_description: programDescription || null,
      program_image_url: programImageUrl || null,
      program_pdf_url: programPdfUrl || null,
    };
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
      <div className="border-t border-black/10 pt-6 mt-6">
        <h3 className="text-base font-semibold text-[#333] mb-4" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
          Program večera
        </h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="program_title" className="block text-sm font-medium text-[#333] mb-1" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
              Nadpis programu
            </label>
            <input
              id="program_title"
              type="text"
              value={programTitle}
              onChange={(e) => setProgramTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-black/15 bg-white outline-none focus:ring-2 focus:ring-[#7A1E2C]/30"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            />
          </div>
          <div>
            <label htmlFor="program_author" className="block text-sm font-medium text-[#333] mb-1" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
              Zpracování (autor)
            </label>
            <input
              id="program_author"
              type="text"
              value={programAuthor}
              onChange={(e) => setProgramAuthor(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-black/15 bg-white outline-none focus:ring-2 focus:ring-[#7A1E2C]/30"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            />
          </div>
          <div>
            <label htmlFor="program_description" className="block text-sm font-medium text-[#333] mb-1" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
              Popis
            </label>
            <textarea
              id="program_description"
              rows={3}
              value={programDescription}
              onChange={(e) => setProgramDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-black/15 bg-white outline-none focus:ring-2 focus:ring-[#7A1E2C]/30"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            />
          </div>
          <div>
            <label htmlFor="program_image_url" className="block text-sm font-medium text-[#333] mb-1" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
              URL obrázku programu
            </label>
            <input
              id="program_image_url"
              type="url"
              value={programImageUrl}
              onChange={(e) => setProgramImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2.5 rounded-lg border border-black/15 bg-white outline-none focus:ring-2 focus:ring-[#7A1E2C]/30"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            />
          </div>
          <div>
            <label htmlFor="program_pdf_url" className="block text-sm font-medium text-[#333] mb-1" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
              URL PDF programu
            </label>
            <input
              id="program_pdf_url"
              type="url"
              value={programPdfUrl}
              onChange={(e) => setProgramPdfUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2.5 rounded-lg border border-black/15 bg-white outline-none focus:ring-2 focus:ring-[#7A1E2C]/30"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            />
          </div>
        </div>
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
