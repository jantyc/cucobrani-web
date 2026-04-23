"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { DARK_WINE } from "@/lib/theme";

interface Row {
  id: string;
  year: number | null;
  edition: string | null;
  title: string;
  status: string;
}

interface YearsTableProps {
  rows: Row[];
}

export function YearsTable({ rows }: YearsTableProps) {
  const router = useRouter();
  const [filterStatus, setFilterStatus] = useState<"all" | "draft" | "publikováno">("all");
  const [search, setSearch] = useState("");

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Opravdu smazat ročník „${title}“?`)) return;
    const supabase = createClient();
    const { error } = await supabase.from("years").delete().eq("id", id);
    if (error) {
      alert("Chyba: " + error.message);
      return;
    }
    router.refresh();
  }

  async function handleDuplicate(id: string) {
    const supabase = createClient();
    const { data: year, error } = await supabase
      .from("years")
      .select("year, edition, title, name, status, program_title, program_author, program_description, program_image_url, program_pdf_url")
      .eq("id", id)
      .maybeSingle();

    if (error || !year) {
      alert("Chyba při čtení ročníku: " + (error?.message ?? "Nenalezeno"));
      return;
    }

    const baseTitle = year.title ?? year.name ?? "";
    const clonedTitle = baseTitle ? `${baseTitle} (kopie)` : "";
    const derivedName =
      clonedTitle ||
      year.name ||
      year.edition ||
      (year.year ? String(year.year) : "Ročník");

    const payload = {
      year: year.year ?? null,
      edition: year.edition ?? null,
      title: clonedTitle,
      name: derivedName,
      status: "draft",
      program_title: year.program_title ?? null,
      program_author: year.program_author ?? null,
      program_description: year.program_description ?? null,
      program_image_url: year.program_image_url ?? null,
      program_pdf_url: year.program_pdf_url ?? null,
    };

    const { error: insertError } = await supabase.from("years").insert(payload);
    if (insertError) {
      alert("Chyba při duplikaci ročníku: " + insertError.message);
      return;
    }

    router.refresh();
  }

  const filteredRows = rows.filter((r) => {
    if (filterStatus !== "all" && r.status !== filterStatus) return false;
    if (!search.trim()) return true;
    const term = search.trim().toLowerCase();
    return (
      (r.title && r.title.toLowerCase().includes(term)) ||
      (r.edition && r.edition.toLowerCase().includes(term)) ||
      (r.year && String(r.year).includes(term))
    );
  });

  if (rows.length === 0) {
    return (
      <div className="p-8 rounded-xl border border-black/10 bg-white text-center text-[#666]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
        Zatím žádné ročníky. Klikněte na „Přidat ročník“.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <label
            htmlFor="status-filter"
            className="text-xs font-medium text-[#555]"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            Stav
          </label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as "all" | "draft" | "publikováno")}
            className="px-2.5 py-1.5 rounded-lg border border-black/15 bg-white text-xs outline-none focus:ring-2 focus:ring-[#7A1E2C]/30"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            <option value="all">Vše</option>
            <option value="draft">Jen drafty</option>
            <option value="publikováno">Jen publikované</option>
          </select>
        </div>
        <div className="flex-1 flex justify-end">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Hledat podle roku, názvu…"
            className="w-full sm:w-64 px-3 py-1.5 rounded-lg border border-black/15 bg-white text-sm outline-none focus:ring-2 focus:ring-[#7A1E2C]/30"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          />
        </div>
      </div>

      <div className="rounded-xl border border-black/10 bg-white overflow-hidden">
        <table className="w-full" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
          <thead>
            <tr className="border-b border-black/10 bg-black/[0.02]">
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#666] uppercase tracking-wider">Rok</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#666] uppercase tracking-wider">Pořadí</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#666] uppercase tracking-wider">Název</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#666] uppercase tracking-wider">Stav</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-[#666] uppercase tracking-wider">Akce</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((r) => (
              <tr key={r.id} className="border-b border-black/5 hover:bg-black/[0.02]">
                <td className="py-3 px-4 font-medium text-[#222]">{r.year ?? "—"}</td>
                <td className="py-3 px-4 text-[#555]">{r.edition ?? "—"}</td>
                <td className="py-3 px-4 text-[#333]">{r.title || "—"}</td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                      r.status === "publikováno" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {r.status === "publikováno" ? "publikováno" : "draft"}
                  </span>
                </td>
                <td className="py-3 px-4 text-right space-x-3 whitespace-nowrap">
                  <Link
                    href={`/admin/years/${r.id}`}
                    className="text-[#7A1E2C] hover:underline text-sm font-medium"
                  >
                    Upravit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDuplicate(r.id)}
                    className="text-[#555] hover:underline text-sm"
                  >
                    Duplikovat
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(r.id, r.title)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Smazat
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
