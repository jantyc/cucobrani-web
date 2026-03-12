"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { ACID_GREEN } from "@/lib/theme";

const HERO_PREVIEW_ID = "upcoming-live-preview";

interface UpcomingFormProps {
  initial: { text: string; location: string; datetime: string };
}

export function UpcomingForm({ initial }: UpcomingFormProps) {
  const [text, setText] = useState(initial.text);
  const [location, setLocation] = useState(initial.location);
  const [datetime, setDatetime] = useState(initial.datetime);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    setText(initial.text);
    setLocation(initial.location);
    setDatetime(initial.datetime);
  }, [initial.text, initial.location, initial.datetime]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("upcoming_event")
      .upsert(
        { id: "00000000-0000-0000-0000-000000000001", text, location, datetime },
        { onConflict: "id" }
      );
    if (error) {
      setMessage({ type: "err", text: error.message });
      setSaving(false);
      return;
    }
    setMessage({ type: "ok", text: "Uloženo." });
    setSaving(false);
  }

  return (
    <div className="max-w-2xl space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6 p-6 rounded-xl border border-black/10 bg-white">
        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${message.type === "ok" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            {message.text}
          </div>
        )}
        <div>
          <label htmlFor="text" className="block text-sm font-medium text-[#333] mb-1" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            Text nad komponentou
          </label>
          <input
            id="text"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="XXXVIII. ROČNÍK ČŮČOBRANÍ SE KONÁ:"
            className="w-full px-4 py-2.5 rounded-lg border border-black/15 bg-white outline-none focus:ring-2 focus:ring-[#7A1E2C]/30"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-[#333] mb-1" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            Místo konání (zobrazí se s ikonou 📍)
          </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Žďár nad Metují"
            className="w-full px-4 py-2.5 rounded-lg border border-black/15 bg-white outline-none focus:ring-2 focus:ring-[#7A1E2C]/30"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          />
        </div>
        <div>
          <label htmlFor="datetime" className="block text-sm font-medium text-[#333] mb-1" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            Datum a čas (zobrazí se s ikonou 🕒)
          </label>
          <input
            id="datetime"
            type="text"
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
            placeholder="30. ledna 2027 od 16:00"
            className="w-full px-4 py-2.5 rounded-lg border border-black/15 bg-white outline-none focus:ring-2 focus:ring-[#7A1E2C]/30"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-lg text-white font-medium disabled:opacity-60"
          style={{ backgroundColor: "#7A1E2C", fontFamily: "var(--font-inter), sans-serif" }}
        >
          {saving ? "Ukládám…" : "Uložit"}
        </button>
      </form>

      <div>
        <h2 className="text-sm font-semibold text-[#666] mb-3" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
          Náhled komponenty
        </h2>
        <div
          id={HERO_PREVIEW_ID}
          className="p-6 rounded-xl border border-black/10 bg-[#3A0F16] text-white"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          <p className="text-sm mb-3" style={{ color: ACID_GREEN, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}>
            {text || "XXXVIII. ROČNÍK ČŮČOBRANÍ SE KONÁ:"}
          </p>
          <div className="flex flex-wrap gap-2">
            <span
              className="inline-block px-4 py-2 rounded-full text-sm font-semibold"
              style={{ backgroundColor: "rgba(167,209,41,0.2)", border: "1px solid rgba(167,209,41,0.45)" }}
            >
              📍 {location || "Žďár nad Metují"}
            </span>
            <span
              className="inline-block px-4 py-2 rounded-full text-sm font-semibold"
              style={{ backgroundColor: "rgba(167,209,41,0.2)", border: "1px solid rgba(167,209,41,0.45)" }}
            >
              🕒 {datetime || "30. ledna 2027 od 16:00"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
