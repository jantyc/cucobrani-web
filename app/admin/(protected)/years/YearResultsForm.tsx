"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type SingleRow = { id?: string; name: string; wine: string; points: string };
type PositionRow = { id?: string; position: number; name: string; sampleNumber: string; wine: string; points: string };

interface YearResultsFormProps {
  yearId: string;
}

export function YearResultsForm({ yearId }: YearResultsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [whitePasteText, setWhitePasteText] = useState("");
  const [redPasteText, setRedPasteText] = useState("");

  const [queen, setQueen] = useState<SingleRow>({ name: "", wine: "", points: "" });
  const [audience, setAudience] = useState<SingleRow>({ name: "", wine: "", points: "" });
  const [worst, setWorst] = useState<SingleRow>({ name: "", wine: "", points: "" });
  const [white, setWhite] = useState<PositionRow[]>([]);
  const [red, setRed] = useState<PositionRow[]>([]);

  function parsePastedList(text: string): PositionRow[] {
    return text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => {
        const cleaned = line.replace(/^\d+\s*[.\)]\s*/, "");
        const parts = cleaned.split(/[;\t]/).map((p) => p.trim());
        const [name = "", sampleNumber = "", wine = "", points = ""] = parts;
        return { position: 0, name, sampleNumber, wine, points };
      })
      .filter((row) => row.name || row.sampleNumber || row.wine || row.points);
  }

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const [q, a, w, wh, r] = await Promise.all([
        supabase.from("year_results_queen").select("*").eq("year_id", yearId).maybeSingle(),
        supabase.from("year_results_audience").select("*").eq("year_id", yearId).maybeSingle(),
        supabase.from("year_results_worst").select("*").eq("year_id", yearId).maybeSingle(),
        supabase.from("year_results_white").select("*").eq("year_id", yearId).order("position", { ascending: true }),
        supabase.from("year_results_red").select("*").eq("year_id", yearId).order("position", { ascending: true }),
      ]);
      if (q.data) setQueen({ id: q.data.id, name: q.data.name ?? "", wine: q.data.wine ?? "", points: q.data.points ?? "" });
      if (a.data) setAudience({ id: a.data.id, name: a.data.name ?? "", wine: a.data.wine ?? "", points: a.data.points ?? "" });
      if (w.data) setWorst({ id: w.data.id, name: w.data.name ?? "", wine: w.data.wine ?? "", points: w.data.points ?? "" });
      if (wh.data) setWhite(wh.data.map((x) => ({ id: x.id, position: x.position ?? 0, name: x.name ?? "", sampleNumber: x.sample_number ?? "", wine: x.wine ?? "", points: x.points ?? "" })));
      if (r.data) setRed(r.data.map((x) => ({ id: x.id, position: x.position ?? 0, name: x.name ?? "", sampleNumber: x.sample_number ?? "", wine: x.wine ?? "", points: x.points ?? "" })));
      setLoading(false);
    })();
  }, [yearId]);

  async function saveSingle(table: "year_results_queen" | "year_results_audience" | "year_results_worst", row: SingleRow) {
    const supabase = createClient();
    const payload = { year_id: yearId, name: row.name || null, wine: row.wine || null, points: row.points || null };
    const { error: err } = await supabase.from(table).upsert(payload, { onConflict: "year_id" });
    if (err) throw err;
  }

  async function saveList(table: "year_results_white" | "year_results_red", rows: PositionRow[]) {
    const supabase = createClient();
    const { error: delErr } = await supabase.from(table).delete().eq("year_id", yearId);
    if (delErr) throw delErr;
    if (rows.length) {
      const payloadWithSampleNumber = rows.map((r, i) => ({
        year_id: yearId,
        position: i + 1,
        name: r.name || null,
        sample_number: r.sampleNumber || null,
        wine: r.wine || null,
        points: r.points || null,
      }));
      const { error: insErr } = await supabase.from(table).insert(payloadWithSampleNumber);

      // Backward compatibility: lokální DB ještě nemusí mít sloupec sample_number.
      if (
        insErr &&
        typeof insErr.message === "string" &&
        insErr.message.includes("sample_number")
      ) {
        const payloadWithoutSampleNumber = rows.map((r, i) => ({
          year_id: yearId,
          position: i + 1,
          name: r.name || null,
          wine: r.wine || null,
          points: r.points || null,
        }));
        const { error: fallbackErr } = await supabase.from(table).insert(payloadWithoutSampleNumber);
        if (fallbackErr) throw fallbackErr;
        return;
      }

      if (insErr) throw insErr;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setSaving(true);
    try {
      await saveSingle("year_results_queen", queen);
      await saveSingle("year_results_audience", audience);
      await saveSingle("year_results_worst", worst);
      await saveList("year_results_white", white);
      await saveList("year_results_red", red);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chyba při ukládání");
      setSaving(false);
      return;
    }
    setMessage("Výsledky byly uloženy.");
    setSaving(false);
  }

  const inputCls = "w-full px-3 py-2 rounded-lg border border-black/15 bg-white outline-none focus:ring-2 focus:ring-[#7A1E2C]/30";
  const labelCls = "block text-sm font-medium text-[#333] mb-1";
  const sectionCls = "p-4 rounded-lg border border-black/10 bg-white/50";

  if (loading) {
    return (
      <div className="max-w-3xl p-6 rounded-xl border border-black/10 bg-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
        Načítám výsledky…
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {error && (
        <div className="p-3 rounded-lg text-sm text-red-700 bg-red-50 border border-red-200" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
          {error}
        </div>
      )}
      {message && (
        <div className="p-3 rounded-lg text-sm text-green-800 bg-green-50 border border-green-200" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
          {message}
        </div>
      )}

      <div className={sectionCls}>
        <h3 className="text-base font-semibold text-[#333] mb-3" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
          Královna sklepa
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className={labelCls}>Jméno</label>
            <input type="text" value={queen.name} onChange={(e) => setQueen((p) => ({ ...p, name: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Víno</label>
            <input type="text" value={queen.wine} onChange={(e) => setQueen((p) => ({ ...p, wine: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Body</label>
            <input type="text" value={queen.points} onChange={(e) => setQueen((p) => ({ ...p, points: e.target.value }))} className={inputCls} />
          </div>
        </div>
      </div>

      <div className={sectionCls}>
        <h3 className="text-base font-semibold text-[#333] mb-3" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
          Cena diváků
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className={labelCls}>Jméno</label>
            <input type="text" value={audience.name} onChange={(e) => setAudience((p) => ({ ...p, name: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Víno</label>
            <input type="text" value={audience.wine} onChange={(e) => setAudience((p) => ({ ...p, wine: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Body</label>
            <input type="text" value={audience.points} onChange={(e) => setAudience((p) => ({ ...p, points: e.target.value }))} className={inputCls} />
          </div>
        </div>
      </div>

      <div className={sectionCls}>
        <h3 className="text-base font-semibold text-[#333] mb-3" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
          Sračka roku
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className={labelCls}>Jméno</label>
            <input type="text" value={worst.name} onChange={(e) => setWorst((p) => ({ ...p, name: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Víno</label>
            <input type="text" value={worst.wine} onChange={(e) => setWorst((p) => ({ ...p, wine: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Body</label>
            <input type="text" value={worst.points} onChange={(e) => setWorst((p) => ({ ...p, points: e.target.value }))} className={inputCls} />
          </div>
        </div>
      </div>

      <div className={sectionCls}>
        <h3 className="text-base font-semibold text-[#333] mb-3" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
          Bílá vína
        </h3>
        <p className="text-xs text-[#666] mb-2" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
          Můžeš ručně vyplnit tabulku níže, nebo vložit řádky z Excelu/CSV (každý řádek ve formátu „jméno; vzorek č.; víno; body“).
        </p>
        <details className="mb-3">
          <summary className="text-xs text-[#7A1E2C] cursor-pointer" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            Vložit seznam z Excelu / CSV
          </summary>
          <div className="mt-2 space-y-2">
            <textarea
              value={whitePasteText}
              onChange={(e) => setWhitePasteText(e.target.value)}
              rows={4}
              className={`${inputCls} w-full text-xs`}
              placeholder={"Jan Novák; 17; Ryzlink rýnský; 92\nPetra Veselá; 24; Pálava; 89"}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const parsed = parsePastedList(whitePasteText);
                  if (parsed.length === 0) return;
                  setWhite(parsed.map((r, i) => ({ ...r, position: i + 1 })));
                }}
                className="px-3 py-1.5 rounded-lg text-xs text-white font-medium"
                style={{ backgroundColor: "#7A1E2C", fontFamily: "var(--font-inter), sans-serif" }}
              >
                Přepsat bílá vína podle vloženého textu
              </button>
              <button
                type="button"
                onClick={() => {
                  const parsed = parsePastedList(whitePasteText);
                  if (parsed.length === 0) return;
                  setWhite((prev) => [...prev, ...parsed.map((r, i) => ({ ...r, position: prev.length + i + 1 }))]);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-black/15 text-[#333]"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                Přidat na konec seznamu
              </button>
            </div>
          </div>
        </details>
        <div className="space-y-2">
          {white.map((row, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <span className="col-span-1 text-sm text-[#666]">{i + 1}.</span>
              <input placeholder="Jméno" value={row.name} onChange={(e) => setWhite((p) => p.map((r, j) => (j === i ? { ...r, name: e.target.value } : r)))} className={`col-span-3 ${inputCls}`} />
              <input placeholder="Vzorek č." value={row.sampleNumber} onChange={(e) => setWhite((p) => p.map((r, j) => (j === i ? { ...r, sampleNumber: e.target.value } : r)))} className={`col-span-2 ${inputCls}`} />
              <input placeholder="Víno" value={row.wine} onChange={(e) => setWhite((p) => p.map((r, j) => (j === i ? { ...r, wine: e.target.value } : r)))} className={`col-span-3 ${inputCls}`} />
              <input placeholder="Body" value={row.points} onChange={(e) => setWhite((p) => p.map((r, j) => (j === i ? { ...r, points: e.target.value } : r)))} className={`col-span-2 ${inputCls}`} />
              <button type="button" onClick={() => setWhite((p) => p.filter((_, j) => j !== i))} className="col-span-1 text-red-600 hover:underline text-sm">
                Smazat
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setWhite((p) => [...p, { position: p.length + 1, name: "", sampleNumber: "", wine: "", points: "" }])} className="mt-2 text-sm text-[#7A1E2C] font-medium hover:underline">
          + Přidat řádek
        </button>
      </div>

      <div className={sectionCls}>
        <h3 className="text-base font-semibold text-[#333] mb-3" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
          Červená vína
        </h3>
        <p className="text-xs text-[#666] mb-2" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
          Můžeš ručně vyplnit tabulku níže, nebo vložit řádky z Excelu/CSV (každý řádek ve formátu „jméno; vzorek č.; víno; body“).
        </p>
        <details className="mb-3">
          <summary className="text-xs text-[#7A1E2C] cursor-pointer" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            Vložit seznam z Excelu / CSV
          </summary>
          <div className="mt-2 space-y-2">
            <textarea
              value={redPasteText}
              onChange={(e) => setRedPasteText(e.target.value)}
              rows={4}
              className={`${inputCls} w-full text-xs`}
              placeholder={"Jan Novák; 11; Frankovka; 91\nPetra Veselá; 19; Modrý Portugal; 88"}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const parsed = parsePastedList(redPasteText);
                  if (parsed.length === 0) return;
                  setRed(parsed.map((r, i) => ({ ...r, position: i + 1 })));
                }}
                className="px-3 py-1.5 rounded-lg text-xs text-white font-medium"
                style={{ backgroundColor: "#7A1E2C", fontFamily: "var(--font-inter), sans-serif" }}
              >
                Přepsat červená vína podle vloženého textu
              </button>
              <button
                type="button"
                onClick={() => {
                  const parsed = parsePastedList(redPasteText);
                  if (parsed.length === 0) return;
                  setRed((prev) => [...prev, ...parsed.map((r, i) => ({ ...r, position: prev.length + i + 1 }))]);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-black/15 text-[#333]"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                Přidat na konec seznamu
              </button>
            </div>
          </div>
        </details>
        <div className="space-y-2">
          {red.map((row, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <span className="col-span-1 text-sm text-[#666]">{i + 1}.</span>
              <input placeholder="Jméno" value={row.name} onChange={(e) => setRed((p) => p.map((r, j) => (j === i ? { ...r, name: e.target.value } : r)))} className={`col-span-3 ${inputCls}`} />
              <input placeholder="Vzorek č." value={row.sampleNumber} onChange={(e) => setRed((p) => p.map((r, j) => (j === i ? { ...r, sampleNumber: e.target.value } : r)))} className={`col-span-2 ${inputCls}`} />
              <input placeholder="Víno" value={row.wine} onChange={(e) => setRed((p) => p.map((r, j) => (j === i ? { ...r, wine: e.target.value } : r)))} className={`col-span-3 ${inputCls}`} />
              <input placeholder="Body" value={row.points} onChange={(e) => setRed((p) => p.map((r, j) => (j === i ? { ...r, points: e.target.value } : r)))} className={`col-span-2 ${inputCls}`} />
              <button type="button" onClick={() => setRed((p) => p.filter((_, j) => j !== i))} className="col-span-1 text-red-600 hover:underline text-sm">
                Smazat
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setRed((p) => [...p, { position: p.length + 1, name: "", sampleNumber: "", wine: "", points: "" }])} className="mt-2 text-sm text-[#7A1E2C] font-medium hover:underline">
          + Přidat řádek
        </button>
      </div>

      <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-lg text-white font-medium disabled:opacity-60" style={{ backgroundColor: "#7A1E2C", fontFamily: "var(--font-inter), sans-serif" }}>
        {saving ? "Ukládám výsledky…" : "Uložit výsledky"}
      </button>
    </form>
  );
}
