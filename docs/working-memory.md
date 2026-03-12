# Working Memory

*Aktualizuj tento soubor po smysluplné práci. Záznamy nech konkrétní, krátké a užitečné pro další session.*

## Current goal

- Mít v repozitáři trvalou paměť agenta (AGENTS.md, .cursor/rules, docs/working-memory.md, docs/decisions.md) a po každé práci ji udržovat, aby bylo možné navázat v novém chatu.

## Current repository state

- **Stack:** Next.js 14, React 18, TypeScript, Supabase (DB + Auth), Tailwind CSS 3, lucide-react.
- **Veřejný web (1:1 dle ČŮČO.zip):** Hero – badge nadcházejícího ročníku (upcoming_event), dva CTA „Zobrazit poslední ročník“ / „Procházet archiv“. Navbar: O akci, Aktuální ročník, Archiv, Místo konání, Kontakt. O akci – bez testimoniálů; Soutěžní kategorie, Královna sklepa / Sračka roku, obrázky + 36+ ročníků. Aktuální ročník – tmavá sekce, vítězové (Královna, Bílá/Červená, Sračka, Cena diváků), karta Téma & program, Kompletní výsledky (accordion Bílá/Červená/Růžová), Fotogalerie + lightbox. Archiv – label „Archiv ročníků“, vyhledávání, přepínač Grid/Timeline, karty ročníků; klik otevře **modal** YearDetail (téma, vítězové, výsledky, galerie). Místo konání – tmavá sekce, text + 4 info karty, odkaz Otevřít mapu, foto. Kontakt – organizátoři (Petr Tyč, Libor Artur Martínek, Jiří Kača Zocher), Web a materiály (Honza Tyč, email). Footer – 3 sloupce (logo+text, Navigace, Kontakt), © 2025. Data: `fetchYearsWithData()` načte ročníky včetně výsledků a galerie ze Supabase. Stránka `/archiv/[id]` zůstává pro přímé odkazy. Barvy: DARK_WINE, WINE_RED, ACID_GREEN, LIGHT_BG.
- **Admin:** Přihlášení (Supabase Auth), dashboard, Nadcházející ročník (formulář + live preview), Archiv ročníků (CRUD). Na editaci ročníku (`/admin/years/[id]`): formulář ročníku + **program** (nadpis, autor, popis, URL obrázku/PDF), **Výsledky soutěže** (manuální zadání), **Fotogalerie** (upload do Supabase Storage bucket `year-gallery`, řazení šipkami, mazání). Chráněné route pod `/admin` kromě `/admin/login`.
- **DB:** Všechny migrace nasazené: 20250312000000 (years, upcoming), 20250312100000 (upcoming_event, year_results_*, year_gallery, rozšíření years), 20250313000000 (Storage bucket `year-gallery` + RLS).
- **Deploy:** GitHub repo, Vercel. Env na Vercelu: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY.

## Recent changes

- **Fonty 1:1 dle ČŮČO.zip:** Všechny komponenty veřejného webu používají `var(--font-bebas)` a `var(--font-inter)` místo literálů ‚Bebas Neue‘ / ‚Inter‘, aby se vždy aplikovaly fonty načtené přes next/font. V layoutu Inter s váhami 400, 500, 600, 700 (jako v zipu). Pushnuto (commit 0302ff1).
- **Úklid projektu:** Odstraněna složka `figma-export/` (reference je ČŮČO.zip). Odstraněny prázdné složky `data/`, `types/`. Z tsconfig vypuštěn exclude figma-export. Dokumentace (AGENTS.md, ZADANI_DOKONCENI.md, docs/working-memory.md, docs/decisions.md) upravena – design reference = ČŮČO.zip. V Navbar použitá konstanta ACID_GREEN místo literálu.
- **Frontend 1:1 dle ČŮČO.zip:** Veřejná homepage přepsána podle referenčního zipu. Hero – jen badge nadcházejícího ročníku a dva CTA (Zobrazit poslední ročník, Procházet archiv). Navbar – O akci, Aktuální ročník, Archiv, Místo konání, Kontakt. About – bez testimoniálů, styly dle zipu. CurrentEdition – tmavá sekce, vítězové + téma + accordion výsledků + fotogalerie s lightboxem; data z `fetchYearsWithData()`. Archive – grid/timeline, vyhledávání, po kliknutí na ročník modal YearDetail (ne odkaz na `/archiv/[id]`). Location, Contact, Footer – obsah a styly 1:1 ze zipu. Přidány `lib/year-data.ts`, `lib/fetch-years.ts`; odstraněn `ArchiveClient.tsx`. Stránka předává plná data ročníků (včetně výsledků a galerie) z DB.
- **Fotogalerie:** Migrace `20250313000000_storage_year_gallery.sql` – bucket `year-gallery`. Admin: YearGalleryForm. Veřejný detail v modalu YearDetail.
- **Vercel build:** createClient() bez throw při chybějících env (fallback ""), sitemap.ts podmíněné volání DB; build projde i bez env, pro běh je nutné nastavit NEXT_PUBLIC_SUPABASE_* na Vercelu.
- **Admin + veřejný detail ročníku:** YearForm + program, YearResultsForm, `/archiv/[id]` program a výsledky.
- **Druhá migrace nasazena:** db push, idempotentní INSERT upcoming_event.
- Založena struktura pro persistentní agenta: AGENTS.md, .cursor/rules, docs/working-memory.md, docs/decisions.md.
 - **Omezení adminu na e-maily (volitelné):** V `app/admin/(protected)/layout.tsx` se při přístupu do `/admin` kontroluje whitelist e-mailů z env proměnné `ADMIN_ALLOWED_EMAILS` (čárkou oddělené). Pokud je proměnná prázdná/není nastavena, mají přístup všichni přihlášení uživatelé; pokud je nastavená, do adminu se dostanou jen uživatelé s e-mailem v seznamu. Příklad je v `.env.example`.
 - **Paste výsledků z Excelu/CSV (admin):** V `YearResultsForm` jsou u sekcí „Bílá vína“ a „Červená vína“ textarea v collapsible blocích, kam lze vložit řádky z Excelu/CSV (oddělovač `;` nebo tab), ve formátu „jméno; víno; body“. Tlačítky lze buď přepsat celý seznam bílých/červených vín, nebo vložit nové řádky na konec.
 - **Fix nadcházejícího ročníku:** Stránka `/admin/upcoming` načítá hodnoty z `upcoming_event` a `UpcomingForm` při uložení nejdřív smaže všechny existující řádky a poté provede `upsert` jednoho řádku s fixním `id` (`00000000-0000-0000-0000-000000000001`). Tím garantuje, že je v tabulce vždy maximálně jeden řádek a nepadá chyba „duplicate key value violates unique constraint 'upcoming_event_one_row'“ ani pokud v tabulce historicky vznikly duplicity.
 - **Testovací pravidlo pro nové funkce:** V `.cursor/rules/testing-new-features.mdc` je pravidlo popisující, jak testovat novou funkcionalitu (identifikace flow, CRUD scénáře, zachytávání chyb, lint, aktualizace working-memory/decisions).

## Constraints

- Design a funkcionalita veřejného webu 1:1 podle ČŮČO.zip (referenční obsah); živý kód v components/public/ a lib/theme.ts.
- Admin jen pro organizátory; jednoduchý, desktop-first.
- Růžová vína v zadání nejsou (pouze Bílá, Červená, Královna sklepa, Cena diváků, Sračka roku).

## Open issues

- První admin uživatel se zakládá v Supabase (Authentication → Users → Add user).
- Fotogalerie a bucket `year-gallery` jsou hotové a migrace nasazené.

## Next recommended step

- Při další práci: načíst AGENTS.md, .cursor/rules/project.mdc, docs/working-memory.md, docs/decisions.md; shrnout stav; navrhnout nejmenší další krok; po dokončení aktualizovat working-memory (a decisions u arch. rozhodnutí).

## Notes for next session

- Klíčové zdroje pravdy: ZADANI_DOKONCENI.md (co je hotové / co zbývá), KROKY.md (nastavení), tento working-memory a decisions.md.
- **Poslední session:** Fonty sjednoceny na next/font (Bebas Neue, Inter 400–700) a v komponentách používány CSS proměnné pro 1:1 vzhled se zipem. Web vypadá dobře, push a docs updatnuty. V adminu je nově whitelist e-mailů přes `ADMIN_ALLOWED_EMAILS` a paste výsledků bílých i červených vín z Excelu/CSV v `YearResultsForm`.
