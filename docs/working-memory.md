# Working Memory

*Aktualizuj tento soubor po smysluplné práci. Záznamy nech konkrétní, krátké a užitečné pro další session.*

## Current goal

- Mít v repozitáři trvalou paměť agenta (AGENTS.md, .cursor/rules, docs/working-memory.md, docs/decisions.md) a po každé práci ji udržovat, aby bylo možné navázat v novém chatu.

## Current repository state

- **Stack:** Next.js 14, React 18, TypeScript, Supabase (DB + Auth), Tailwind CSS 3, lucide-react.
- **Veřejný web:** Hero (upcoming_event, dva malé CTA „Mám dotaz“ / „Rezervovat vstupenku“, hlavní „ZJISTIT VÍCE“ / „PŘIHLÁSIT SE“), Navbar (Aktuality, O nás, Archiv, Místo konání, Kontakt), O akci + **testimoniály** (Jan Novák, Anna Dvořáková), Poslední ročník (label „Aktuálně“), Archiv (label „Historie“, vyhledávání „Vyhledat podle roku…“, tlačítko filtr, prázdný stav „NIC NENALEZENO“), Místo konání (label „Lokace“), Kontakt (adresa/tel/email/sociální sítě, placeholder „Formulář / mapa“, organizátoři), Footer (3 sloupce: logo+©+adresa, Menu, Sledujte nás). Detail ročníku `/archiv/[id]`: program, výsledky a **fotogalerie** (mřížka, odkaz na plný obrázek) při stavu publikováno. Barvy: DARK_WINE, WINE_RED, ACID_GREEN, LIGHT_BG. Fonty: Bebas Neue, Inter.
- **Admin:** Přihlášení (Supabase Auth), dashboard, Nadcházející ročník (formulář + live preview), Archiv ročníků (CRUD). Na editaci ročníku (`/admin/years/[id]`): formulář ročníku + **program** (nadpis, autor, popis, URL obrázku/PDF), **Výsledky soutěže** (manuální zadání), **Fotogalerie** (upload do Supabase Storage bucket `year-gallery`, řazení šipkami, mazání). Chráněné route pod `/admin` kromě `/admin/login`.
- **DB:** Obě migrace nasazené (years, upcoming, upcoming_event, rozšíření years, year_results_*, year_gallery). Hero a rozšířené ročníky teď mají plné schéma.
- **Deploy:** GitHub repo, Vercel. Env na Vercelu: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY.

## Recent changes

- **Fotogalerie:** Migrace `20250313000000_storage_year_gallery.sql` – bucket `year-gallery` (veřejné čtení, zápis authenticated), RLS na storage.objects. Admin: komponenta YearGalleryForm (upload obrázků, řazení nahoru/dolů, mazání) na stránce editace ročníku. Veřejný detail `/archiv/[id]`: sekce Fotogalerie (mřížka) při publikovaném ročníku. Pro uplatnění bucketu je potřeba spustit `npx supabase db push`.
- **Frontend 1:1 s Figmou:** Hero – dva malé olivové CTA (Mám dotaz, Rezervovat vstupenku), hlavní tlačítka ZJISTIT VÍCE / PŘIHLÁSIT SE. Navbar – Aktuality, O nás, Archiv, Místo, Kontakt. O akci – testimoniály (Jan Novák 4.5★, Anna Dvořáková 5★). Poslední ročník – label „Aktuálně“, popisek. Archiv – label „Historie“, placeholder „Vyhledat podle roku…“, dropdown filtr, prázdný stav „NIC NENALEZENO“. Lokace – label „Lokace“. Kontakt – adresa, tel, email, FB/IG, placeholder „Formulář / mapa“, organizátoři. Footer – 3 sloupce (logo+©+adresa, Menu, Sledujte nás).
- **Vercel build:** createClient() bez throw při chybějících env (fallback ""), sitemap.ts podmíněné volání DB; build projde i bez env, pro běh je nutné nastavit NEXT_PUBLIC_SUPABASE_* na Vercelu.
- **Admin + veřejný detail ročníku:** YearForm + program, YearResultsForm, `/archiv/[id]` program a výsledky.
- **Druhá migrace nasazena:** db push, idempotentní INSERT upcoming_event.
- Založena struktura pro persistentní agenta: AGENTS.md, .cursor/rules, docs/working-memory.md, docs/decisions.md.

## Constraints

- Design a funkcionalita veřejného webu mají být 1:1 podle Figma exportu a zadání.
- Admin jen pro organizátory; jednoduchý, desktop-first.
- Růžová vína v zadání nejsou (pouze Bílá, Červená, Královna sklepa, Cena diváků, Sračka roku).
- figma-export/ je v tsconfig exclude (nepřekládá se); slouží jako reference.

## Open issues

- První admin uživatel se zakládá v Supabase (Authentication → Users → Add user).
- Volitelně: omezit admin jen na povolené e-maily (tabulka nebo env).
- Podle ZADANI_DOKONCENI.md zbývá: admin – paste výsledků z Excelu/CSV (volitelné); omezit admin na povolené e-maily (volitelné). Fotogalerie a Storage bucket `year-gallery` jsou implementované – po nasazení migrace (`npx supabase db push`) fungují upload i zobrazení na detailu ročníku.

## Next recommended step

- Při další práci: načíst AGENTS.md, .cursor/rules/project.mdc, docs/working-memory.md, docs/decisions.md; shrnout stav; navrhnout nejmenší další krok; po dokončení aktualizovat working-memory (a decisions u arch. rozhodnutí).

## Notes for next session

- Klíčové zdroje pravdy: ZADANI_DOKONCENI.md (co je hotové / co zbývá), KROKY.md (nastavení), tento working-memory a decisions.md.
- **Poslední session:** Implementována fotogalerie: Storage bucket `year-gallery` (migrace), admin YearGalleryForm (upload, řazení, mazání), veřejný detail ročníku zobrazuje galerii. Před použitím spustit `npx supabase db push`. Zbývá volitelně: paste výsledků z Excelu/CSV, omezení adminu na povolené e-maily.
