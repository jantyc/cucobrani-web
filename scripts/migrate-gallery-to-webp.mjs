#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "year-gallery";
const QUALITY = 82;

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const raw = fs.readFileSync(filePath, "utf8");
  const env = {};
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx <= 0) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

function resolveEnv() {
  const root = process.cwd();
  const merged = {
    ...loadEnvFile(path.join(root, ".env")),
    ...loadEnvFile(path.join(root, ".env.local")),
    ...process.env,
  };
  return {
    url: merged.NEXT_PUBLIC_SUPABASE_URL,
    serviceRoleKey: merged.SUPABASE_SERVICE_ROLE_KEY,
  };
}

function parseArgs(argv) {
  const args = {
    dryRun: false,
    limit: 0,
    verbose: false,
  };
  for (const token of argv) {
    if (token === "--dry-run") args.dryRun = true;
    if (token === "--verbose") args.verbose = true;
    if (token.startsWith("--limit=")) {
      const n = Number(token.split("=")[1]);
      if (Number.isFinite(n) && n > 0) args.limit = Math.floor(n);
    }
  }
  return args;
}

function isExternalUrl(p) {
  return p.startsWith("http://") || p.startsWith("https://");
}

function isWebpPath(p) {
  return p.toLowerCase().endsWith(".webp");
}

function buildWebpPath(oldPath) {
  const slash = oldPath.lastIndexOf("/");
  const dir = slash >= 0 ? oldPath.slice(0, slash + 1) : "";
  return `${dir}${crypto.randomUUID()}.webp`;
}

async function run() {
  const args = parseArgs(process.argv.slice(2));
  const { url, serviceRoleKey } = resolveEnv();
  if (!url || !serviceRoleKey) {
    throw new Error(
      "Chybí NEXT_PUBLIC_SUPABASE_URL nebo SUPABASE_SERVICE_ROLE_KEY v .env/.env.local."
    );
  }

  const supabase = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: rows, error } = await supabase
    .from("year_gallery")
    .select("id, storage_path")
    .order("sort_order", { ascending: true });

  if (error) throw error;

  const allRows = rows ?? [];
  const candidates = allRows.filter(
    (row) => !isExternalUrl(row.storage_path) && !isWebpPath(row.storage_path)
  );
  const selected = args.limit > 0 ? candidates.slice(0, args.limit) : candidates;

  const stats = {
    total: allRows.length,
    candidates: candidates.length,
    selected: selected.length,
    converted: 0,
    skipped: 0,
    failed: 0,
    bytesBefore: 0,
    bytesAfter: 0,
  };

  console.log(`Rows total: ${stats.total}`);
  console.log(`Rows to convert: ${stats.candidates}`);
  if (args.dryRun) console.log("Mode: DRY RUN");
  if (args.limit > 0) console.log(`Limit: ${args.limit}`);

  for (const row of selected) {
    try {
      const oldPath = row.storage_path;
      const newPath = buildWebpPath(oldPath);

      const { data: fileData, error: downloadErr } = await supabase.storage
        .from(BUCKET)
        .download(oldPath);
      if (downloadErr || !fileData) {
        throw new Error(downloadErr?.message ?? "Download failed");
      }

      const inBuffer = Buffer.from(await fileData.arrayBuffer());
      const outBuffer = await sharp(inBuffer).rotate().webp({ quality: QUALITY }).toBuffer();
      stats.bytesBefore += inBuffer.byteLength;
      stats.bytesAfter += outBuffer.byteLength;

      if (args.dryRun) {
        stats.converted += 1;
        if (args.verbose) {
          console.log(`DRY ${oldPath} -> ${newPath}`);
        } else if (stats.converted % 25 === 0 || stats.converted === selected.length) {
          console.log(`DRY progress: ${stats.converted}/${selected.length}`);
        }
        continue;
      }

      const { error: uploadErr } = await supabase.storage
        .from(BUCKET)
        .upload(newPath, outBuffer, {
          upsert: false,
          contentType: "image/webp",
        });
      if (uploadErr) throw new Error(uploadErr.message);

      const { error: dbErr } = await supabase
        .from("year_gallery")
        .update({ storage_path: newPath })
        .eq("id", row.id);
      if (dbErr) throw new Error(dbErr.message);

      const { error: removeErr } = await supabase.storage.from(BUCKET).remove([oldPath]);
      if (removeErr) {
        console.warn(`WARN remove old file failed: ${oldPath} (${removeErr.message})`);
      }

      stats.converted += 1;
      if (args.verbose) {
        console.log(`OK  ${oldPath} -> ${newPath}`);
      } else if (stats.converted % 25 === 0 || stats.converted === selected.length) {
        console.log(`Progress: ${stats.converted}/${selected.length}`);
      }
    } catch (e) {
      stats.failed += 1;
      const msg = e instanceof Error ? e.message : "Unknown error";
      console.error(`ERR ${row.storage_path}: ${msg}`);
    }
  }

  const saved = Math.max(0, stats.bytesBefore - stats.bytesAfter);
  const savedMb = (saved / (1024 * 1024)).toFixed(2);
  console.log("");
  console.log("Summary:");
  console.log(`- converted: ${stats.converted}`);
  console.log(`- failed: ${stats.failed}`);
  console.log(`- estimated saved: ${savedMb} MB`);
}

run().catch((err) => {
  console.error("Fatal:", err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
