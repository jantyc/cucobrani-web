# Working Memory

*Aktualizuj tento soubor po smysluplné práci. Záznamy nech konkrétní, krátké a užitečné pro další session.*

## Current goal

- Mít v repozitáři trvalou paměť agenta (AGENTS.md, .cursor/rules, docs/working-memory.md, docs/decisions.md) a po každé práci ji udržovat, aby bylo možné navázat v novém chatu.

## Current repository state

- **Stack:** Next.js 14, React 18, TypeScript, Supabase (DB + Auth), Tailwind CSS 3, lucide-react.
- **Veřejný web:** Hero (upcoming_event), Navbar, O akci, Aktuální ročník, Archiv (grid/timeline), Místo konání, Kontakt, Footer. Detail ročníku `/archiv/[id]`: zobrazuje **program** (nadpis, autor, popis, obrázek, PDF) a **výsledky soutěže** (Královna sklepa, Cena diváků, Sračka roku, Bílá vína, Červená vína) jen když je ročník ve stavu „publikováno“. Design 1:1 z Figmy (figma-export/). Barvy: DARK_WINE, WINE_RED, ACID_GREEN, LIGHT_BG. Fonty: Bebas Neue, Inter.
- **Admin:** Přihlášení (Supabase Auth), dashboard, Nadcházející ročník (formulář + live preview), Archiv ročníků (CRUD – rok, pořadí, název, stav). Na editaci ročníku (`/admin/years/[id]`): formulář ročníku včetně **programu** (nadpis, zpracování, popis, URL obrázku, URL PDF) a sekce **Výsledky soutěže** (Královna sklepa, Cena diváků, Sračka roku – po 1 řádku; Bílá a Červená vína – více řádků, přidat/smazat). Chráněné route pod `/admin` kromě `/admin/login`.
- **DB:** Obě migrace nasazené (years, upcoming, upcoming_event, rozšíření years, year_results_*, year_gallery). Hero a rozšířené ročníky teď mají plné schéma.
- **Deploy:** GitHub repo, Vercel. Env na Vercelu: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY.

## Recent changes

- **Admin + veřejný detail ročníku:** YearForm rozšířen o pole programu (program_title, program_author, program_description, program_image_url, program_pdf_url). Přidána komponenta YearResultsForm na stránce editace ročníku: manuální zadání výsledků (Královna sklepa, Cena diváků, Sračka roku, Bílá vína, Červená vína). Veřejná stránka `/archiv/[id]` načítá a zobrazuje program (včetně obrázku a PDF) a výsledky, jen když je ročník publikován.
- **Druhá migrace nasazena:** `npx supabase db push` proběhl; tabulky upcoming_event, year_results_*, year_gallery a rozšíření years jsou na remote DB. V migraci byl INSERT do upcoming_event upraven na idempotentní (vloží výchozí řádek jen pokud tabulka je prázdná), aby nevznikal konflikt s constraintem na remote.
- Založena struktura pro persistentní agenta: AGENTS.md, .cursor/rules/project.mdc, docs/working-memory.md, docs/decisions.md.

## Constraints

- Design a funkcionalita veřejného webu mají být 1:1 podle Figma exportu a zadání.
- Admin jen pro organizátory; jednoduchý, desktop-first.
- Růžová vína v zadání nejsou (pouze Bílá, Červená, Královna sklepa, Cena diváků, Sračka roku).
- figma-export/ je v tsconfig exclude (nepřekládá se); slouží jako reference.

## Open issues

- První admin uživatel se zakládá v Supabase (Authentication → Users → Add user).
- Volitelně: omezit admin jen na povolené e-maily (tabulka nebo env).
- Podle ZADANI_DOKONCENI.md zbývá: admin – paste výsledků z Excelu/CSV (volitelné rozšíření), fotogalerie (upload, pořadí); veřejný detail – galerie; Supabase Storage bucket pro galerii a program (obrázky/PDF zatím jako URL).

## Next recommended step

- Při další práci: načíst AGENTS.md, .cursor/rules/project.mdc, docs/working-memory.md, docs/decisions.md; shrnout stav; navrhnout nejmenší další krok; po dokončení aktualizovat working-memory (a decisions u arch. rozhodnutí).

## Notes for next session

- Klíčové zdroje pravdy: ZADANI_DOKONCENI.md (co je hotové / co zbývá), KROKY.md (nastavení), tento working-memory a decisions.md.
- **Poslední session:** Admin: rozšířen YearForm o program, přidán YearResultsForm (výsledky). Veřejný detail ročníku zobrazuje program a výsledky (jen při stavu publikováno). Zbývá: fotogalerie (admin upload + zobrazení na detailu), volitelně paste z Excelu/CSV pro výsledky, Supabase Storage bucket.
