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

function getBaseName(filename: string): string {
  return filename.replace(/\.[^/.]+$/, "");
}

async function convertToWebp(file: File, quality = 0.82): Promise<File> {
  if (file.type === "image/webp") {
    return file;
  }

  const objectUrl = URL.createObjectURL(file);
  const img = new Image();
  img.decoding = "async";
  img.src = objectUrl;

  try {
    await img.decode();
  } catch {
    URL.revokeObjectURL(objectUrl);
    throw new Error(`Soubor ${file.name} se nepodařilo načíst jako obrázek.`);
  }

  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    URL.revokeObjectURL(objectUrl);
    throw new Error("Nepodařilo se vytvořit 2D canvas pro převod obrázku.");
  }

  ctx.drawImage(img, 0, 0);
  URL.revokeObjectURL(objectUrl);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/webp", quality);
  });

  if (!blob) {
    throw new Error(`Soubor ${file.name} se nepodařilo převést do WebP.`);
  }

  return new File([blob], `${getBaseName(file.name)}.webp`, {
    type: "image/webp",
    lastModified: Date.now(),
  });
}

export function YearGalleryForm({ yearId }: YearGalleryFormProps) {
  const router = useRouter();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importUrls, setImportUrls] = useState("");

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
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
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
      let webpFile: File;
      try {
        webpFile = await convertToWebp(file);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nepodařilo se převést obrázek do WebP.");
        setUploading(false);
        e.target.value = "";
        return;
      }

      const path = `${yearId}/${crypto.randomUUID()}.webp`;
      const { error: uploadErr } = await supabase.storage.from(BUCKET).upload(path, webpFile, {
        upsert: false,
        contentType: "image/webp",
      });
      if (uploadErr) {
        if (uploadErr.message?.toLowerCase().includes("bucket not found")) {
          setError(
            "Bucket 'year-gallery' neexistuje v této databázi. Spusť migraci 20250313000000_storage_year_gallery.sql (nebo ručně založ bucket v Supabase Storage)."
          );
        } else {
          setError(uploadErr.message);
        }
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
    if (!storage_path.startsWith("http://") && !storage_path.startsWith("https://")) {
      await supabase.storage.from(BUCKET).remove([storage_path]);
    }
    const { error: err } = await supabase.from("year_gallery").delete().eq("id", id);
    if (err) setError(err.message);
    else {
      setItems((prev) => prev.filter((i) => i.id !== id));
      router.refresh();
    }
  }

  async function handleImportFromUrls() {
    const lines = importUrls
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    if (lines.length === 0) return;

    setError(null);
    setImporting(true);
    const supabase = createClient();
    const startOrder = items.length > 0 ? Math.max(...items.map((i) => i.sort_order)) + 1 : 0;

    const payload = lines.map((url, idx) => ({
      year_id: yearId,
      sort_order: startOrder + idx,
      storage_path: url,
    }));

    const { data, error: err } = await supabase
      .from("year_gallery")
      .insert(payload)
      .select("id, year_id, sort_order, storage_path");

    if (err) {
      setError(err.message);
      setImporting(false);
      return;
    }

    setItems((prev) =>
      [...prev, ...(data as GalleryItem[])].sort((a, b) => a.sort_order - b.sort_order)
    );
    setImporting(false);
    setImportUrls("");
    router.refresh();
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
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="sr-only"
            disabled={uploading}
            onChange={handleUpload}
          />
        </label>
        <span className="text-sm text-[#666]">JPEG/PNG/WebP, při uploadu se uloží jako WebP (max 5 MB)</span>
      </div>

      <details className="mt-2">
        <summary className="text-sm text-[#7A1E2C] cursor-pointer">
          Hromadný import z URL (např. fotky z původního webu)
        </summary>
        <div className="mt-3 space-y-2">
          <textarea
            rows={4}
            value={importUrls}
            onChange={(e) => setImportUrls(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-black/15 bg-white text-xs outline-none focus:ring-2 focus:ring-[#7A1E2C]/30"
            placeholder={"Každý řádek jedna URL obrázku, např.\nhttps://cucobrani-web.vercel.app/images/rocnik-2025-1.jpg\nhttps://cucobrani-web.vercel.app/images/rocnik-2025-2.jpg"}
          />
          <button
            type="button"
            disabled={importing}
            onClick={handleImportFromUrls}
            className="px-4 py-2 rounded-lg text-white text-xs font-medium disabled:opacity-60"
            style={{ backgroundColor: "#7A1E2C" }}
          >
            {importing ? "Importuji…" : "Importovat URL do galerie"}
          </button>
          <p className="text-xs text-[#777]">
            URL se uloží přímo do databáze. Tyto externí odkazy se automaticky nepřevádí do WebP.
          </p>
        </div>
      </details>

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
