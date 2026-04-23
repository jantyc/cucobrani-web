"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

const PROGRAM_BUCKET = "year-program";

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
  const [programPdfUrl, setProgramPdfUrl] = useState(initial?.program_pdf_url ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [programPdfMeta, setProgramPdfMeta] = useState<{ name: string; size: number } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const supabase = createClient();
    const trimmedTitle = title.trim();
    const derivedName =
      trimmedTitle ||
      edition.trim() ||
      (year ? `${year}` : "");

    // Pokud se ročník publikuje, ověř, že už neexistuje jiný
    // publikovaný se stejným rokem nebo názvem.
    if (status === "publikováno") {
      const orConditions: string[] = [];
      if (year) {
        orConditions.push(`year.eq.${year}`);
      }
      if (trimmedTitle) {
        // Supabase or() neumí snadno escapovat tečky/čárky v title,
        // ale běžné názvy typu "XXXVI. ročník Čůčobraní – 2025" projdou.
        orConditions.push(`title.eq.${trimmedTitle}`);
      }
      if (orConditions.length > 0) {
        let query = supabase
          .from("years")
          .select("id, year, title, status")
          .eq("status", "publikováno");
        if (id) {
          query = query.neq("id", id);
        }
        const { data: existing, error: existingErr } = await query.or(orConditions.join(","));
        if (!existingErr && existing && existing.length > 0) {
          setError("Už existuje jiný publikovaný ročník se stejným rokem nebo názvem. Změň rok/název nebo nech ročník jako draft.");
          setSaving(false);
          return;
        }
      }
    }
    const payload = {
      year,
      edition,
      title,
      // DB sloupec "name" je not-null – držíme ho v souladu s title / edition.
      name: derivedName || "Ročník",
      status,
      program_title: programTitle || null,
      program_author: programAuthor || null,
      program_description: programDescription || null,
      program_pdf_url: programPdfUrl || null,
    };
    if (id) {
      const { error: err } = await supabase.from("years").update(payload).eq("id", id);
      if (err) {
        setError(err.message);
        setSaving(false);
        return;
      }
      router.push(`/admin/years/${id}`);
      router.refresh();
    } else {
      const { data, error: err } = await supabase.from("years").insert(payload).select("id").single();
      if (err || !data) {
        setError(err?.message ?? "Chyba při vytváření ročníku");
        setSaving(false);
        return;
      }
      router.push(`/admin/years/${data.id}`);
      router.refresh();
    }
    setSaving(false);
  }

  async function handleProgramPdfUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploadingPdf(true);
    const supabase = createClient();
    // Supabase Storage klíče nesnesou některé speciální znaky, proto používáme
    // čisté UUID a příponu .pdf, ne původní název souboru.
    const path = `${crypto.randomUUID()}.pdf`;
    const { error: uploadErr } = await supabase.storage.from(PROGRAM_BUCKET).upload(path, file, {
      upsert: false,
    });
    if (uploadErr) {
      if (uploadErr.message?.toLowerCase().includes("bucket not found")) {
        setError(
          "Bucket 'year-program' neexistuje v této databázi. Spusť migraci 20250314021000_storage_year_program.sql (nebo ručně založ bucket v Supabase Storage)."
        );
      } else {
        setError(uploadErr.message);
      }
      setUploadingPdf(false);
      e.target.value = "";
      return;
    }
    const { data } = supabase.storage.from(PROGRAM_BUCKET).getPublicUrl(path);
    setProgramPdfUrl(data.publicUrl);
    setProgramPdfMeta({ name: file.name, size: file.size });
    setUploadingPdf(false);
    e.target.value = "";
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
            <label
              htmlFor="program_pdf_url"
              className="block text-sm font-medium text-[#333] mb-1"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              PDF programu
            </label>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: "#7A1E2C" }}>
                  {uploadingPdf ? "Nahrávám…" : "Nahrát PDF"}
                  <input
                    type="file"
                    accept="application/pdf"
                    className="sr-only"
                    disabled={uploadingPdf}
                    onChange={handleProgramPdfUpload}
                  />
                </label>
                <span className="text-xs text-[#666]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                  PDF, max 10 MB
                </span>
              </div>
              {programPdfUrl && (
                <div className="text-xs text-[#666] space-y-1" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                  <div>
                    Nahraný soubor:{" "}
                    {programPdfMeta ? (
                      <>
                        <strong>{programPdfMeta.name}</strong>{" "}
                        <span>
                          ({(programPdfMeta.size / (1024 * 1024)).toFixed(2)} MB)
                        </span>
                      </>
                    ) : (
                      <span className="break-all">{programPdfUrl}</span>
                    )}
                  </div>
                  <a
                    href={programPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#7A1E2C] hover:underline"
                  >
                    Otevřít PDF v novém okně
                  </a>
                </div>
              )}
            </div>
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
