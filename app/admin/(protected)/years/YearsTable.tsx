"use client";

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

  if (rows.length === 0) {
    return (
      <div className="p-8 rounded-xl border border-black/10 bg-white text-center text-[#666]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
        Zatím žádné ročníky. Klikněte na „Přidat ročník“.
      </div>
    );
  }

  return (
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
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-black/5 hover:bg-black/[0.02]">
              <td className="py-3 px-4 font-medium text-[#222]">{r.year ?? "—"}</td>
              <td className="py-3 px-4 text-[#555]">{r.edition ?? "—"}</td>
              <td className="py-3 px-4 text-[#333]">{r.title || "—"}</td>
              <td className="py-3 px-4">
                <span
                  className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${r.status === "publikováno" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}
                >
                  {r.status === "publikováno" ? "publikováno" : "draft"}
                </span>
              </td>
              <td className="py-3 px-4 text-right">
                <Link
                  href={`/admin/years/${r.id}`}
                  className="text-[#7A1E2C] hover:underline text-sm font-medium mr-4"
                >
                  Upravit
                </Link>
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
  );
}
