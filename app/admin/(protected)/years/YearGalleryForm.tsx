"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Upload, Trash2, ChevronUp, ChevronDown } from "lucide-react";

const BUCKET = "year-gallery";

interface GalleryItem {
  id: string;
  year_id: string;
  sort_order: number;
  storage_path: string;
}

interface YearGalleryFormProps {
  yearId: string;
}

function getExtension(filename: string): string {
  const m = filename.match(/\.(jpe?g|png|webp|gif)$/i);
  return m ? m[1].toLowerCase() : "jpg";
}

export function YearGalleryForm({ yearId }: YearGalleryFormProps) {
  const router = useRouter();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("year_gallery")
      .select("id, year_id, sort_order, storage_path")
      .eq("year_id", yearId)
      .order("sort_order", { ascending: true })
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else setItems((data ?? []) as GalleryItem[]);
        setLoading(false);
      });
  }, [yearId]);

  function getPublicUrl(path: string): string {
    const supabase = createClient();
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setError(null);
    setUploading(true);
    const supabase = createClient();
    const nextOrder = items.length > 0 ? Math.max(...items.map((i) => i.sort_order)) + 1 : 0;
    let order = nextOrder;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = getExtension(file.name);
      const path = `${yearId}/${crypto.randomUUID()}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false });
      if (uploadErr) {
        setError(uploadErr.message);
        setUploading(false);
        e.target.value = "";
        return;
      }
      const { data: row, error: insertErr } = await supabase
        .from("year_gallery")
        .insert({ year_id: yearId, sort_order: order, storage_path: path })
        .select("id, year_id, sort_order, storage_path")
        .single();
      if (insertErr) {
        setError(insertErr.message);
        setUploading(false);
        e.target.value = "";
        return;
      }
      setItems((prev) => [...prev, row as GalleryItem].sort((a, b) => a.sort_order - b.sort_order));
      order++;
    }
    setUploading(false);
    e.target.value = "";
    router.refresh();
  }

  async function handleDelete(id: string, storage_path: string) {
    setError(null);
    const supabase = createClient();
    await supabase.storage.from(BUCKET).remove([storage_path]);
    const { error: err } = await supabase.from("year_gallery").delete().eq("id", id);
    if (err) setError(err.message);
    else {
      setItems((prev) => prev.filter((i) => i.id !== id));
      router.refresh();
    }
  }

  async function moveItem(index: number, direction: "up" | "down") {
    const swap = direction === "up" ? index - 1 : index + 1;
    if (swap < 0 || swap >= items.length) return;
    const a = items[index];
    const b = items[swap];
    const supabase = createClient();
    const { error: err1 } = await supabase.from("year_gallery").update({ sort_order: b.sort_order }).eq("id", a.id);
    const { error: err2 } = await supabase.from("year_gallery").update({ sort_order: a.sort_order }).eq("id", b.id);
    if (err1 || err2) setError(err1?.message ?? err2?.message ?? "Chyba");
    else {
      setItems((prev) =>
        prev
          .map((it) =>
            it.id === a.id ? { ...it, sort_order: b.sort_order } : it.id === b.id ? { ...it, sort_order: a.sort_order } : it
          )
          .sort((x, y) => x.sort_order - y.sort_order)
      );
      router.refresh();
    }
  }

  if (loading) {
    return (
      <div className="p-6 rounded-xl border border-black/10 bg-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
        Načítám galerii…
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-4 p-6 rounded-xl border border-black/10 bg-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
      {error && (
        <div className="p-3 rounded-lg text-sm text-red-700 bg-red-50 border border-red-200">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4">
        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: "#7A1E2C" }}>
          <Upload size={18} />
          {uploading ? "Nahrávám…" : "Přidat fotky"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="sr-only"
            disabled={uploading}
            onChange={handleUpload}
          />
        </label>
        <span className="text-sm text-[#666]">JPEG, PNG, WebP, GIF, max 5 MB</span>
      </div>

      {items.length === 0 ? (
        <p className="text-[#888] text-sm">Zatím žádné fotky. Přidejte je tlačítkem výše.</p>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((item, index) => (
            <li key={item.id} className="relative group rounded-lg overflow-hidden border border-black/10 bg-[#fafafa]">
              <img
                src={getPublicUrl(item.storage_path)}
                alt=""
                className="w-full aspect-square object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => moveItem(index, "up")}
                  disabled={index === 0}
                  className="p-2 rounded-full bg-white/90 text-[#333] disabled:opacity-40"
                  aria-label="Posunout nahoru"
                >
                  <ChevronUp size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(index, "down")}
                  disabled={index === items.length - 1}
                  className="p-2 rounded-full bg-white/90 text-[#333] disabled:opacity-40"
                  aria-label="Posunout dolů"
                >
                  <ChevronDown size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id, item.storage_path)}
                  className="p-2 rounded-full bg-red-500 text-white"
                  aria-label="Smazat"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <span className="absolute bottom-1 left-1 text-xs text-white/90 bg-black/5 px-1.5 py-0.5 rounded">
                {index + 1}. / {items.length}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
