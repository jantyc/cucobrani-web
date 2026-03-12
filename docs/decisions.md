# Architecture Decisions

Zapisuj jen rozhodnutí, která mají dopad mimo jednu malou úpravu. Nové záznamy přidávej na konec, nepřepisuj staré.

---

## 2025-03-12

### Decision

Backend a databáze v Supabase; veřejný web + admin v jednom Next.js projektu (App Router). Admin pod `/admin` s route group `(protected)` a vlastním layoutem s kontrolou Supabase Auth.

### Reason

Zadání požadovalo DB a backend v Supabase a jednoduchý admin s loginem. Jedna codebase zjednodušuje deploy (Vercel) a sdílení typů a Supabase klienta.

### Impact

- Veřejné stránky na `/`, `/archiv/[id]`; admin na `/admin`, `/admin/login`, `/admin/upcoming`, `/admin/years`, `/admin/years/new`, `/admin/years/[id]`.
- Middleware obnovuje Supabase session pro `/admin/*`.
- RLS: čtení pro všechny, zápis jen pro authenticated.

### Alternatives considered

- Samostatný admin projekt – odmítnuto kvůli jednoduchosti a sdílení konfigurace.
- API routes pro admin místo přímého Supabase z klienta – pro malý počet adminů a jednoduché CRUD stačí přímý Supabase s RLS.

---

## 2025-03-12

### Decision

Design veřejného webu 1:1 z Figma exportu (složka figma-export/). Barvy a fonty v lib/theme.ts; komponenty v components/public/; stránky v app/.

### Reason

Zadání požadovalo design a funkcionalitu 1:1. Figma export (Vite/React) byl rozbalen do figma-export/ a slouží jako reference; komponenty byly přepsány do Next.js s daty z Supabase.

### Impact

- Konzistentní vzhled (Bebas Neue, Inter, DARK_WINE, WINE_RED, ACID_GREEN, LIGHT_BG).
- figma-export/ je v tsconfig exclude, nepoužívá se v buildu.
- Změny designu by se měly odrážet v components/public/ a lib/theme.ts, ne v figma-export/.

### Alternatives considered

- Použití figma-exportu jako submodulu nebo npm balíčku – zbytečně složité; stačí reference a ruční soulad.

---

## 2025-03-12

### Decision

Po každé smysluplné práci agent rovnou aktualizuje docs/working-memory.md (Recent changes, Current repository state, Notes for next session) a při architektonických/designových změnách docs/decisions.md. Nečeká na vyzvání uživatele.

### Reason

Uživatel požadoval „vždy rovnou updatuj všechny agents.md, docs, memory atd“, aby kontext zůstal aktuální a další session mohla navázat bez ztráty informací.

### Impact

- Session workflow v AGENTS.md explicitně zmiňuje aktualizaci paměťových souborů po dokončení práce.
- working-memory obsahuje konkrétní Recent changes a stav repozitáře; decisions zachytává větší rozhodnutí.

---

## 2025-03-13

### Decision

Fotogalerie ročníků: obrázky se ukládají do Supabase Storage bucketu `year-gallery` (veřejný read, zápis jen authenticated). Metadata (year_id, sort_order, storage_path) v tabulce `year_gallery`. Admin uploaduje přes YearGalleryForm, veřejný detail `/archiv/[id]` zobrazuje galerii při publikovaném ročníku.

### Reason

Zadání požadovalo fotogalerii s uploadem a pořadím. Storage umožňuje přímý upload z klienta bez vlastního API; RLS zajišťuje oprávnění.

### Impact

- Migrace `20250313000000_storage_year_gallery.sql` vytváří bucket a RLS. Před použitím je nutné `npx supabase db push`.
- Public URL obrázků: `{SUPABASE_URL}/storage/v1/object/public/year-gallery/{path}`.
