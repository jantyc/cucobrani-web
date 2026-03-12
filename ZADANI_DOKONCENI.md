# Zadání a stav dokončení Čůčobraní

## Design reference

- **Umístění:** `ČŮČO.zip` (rozbalený obsah slouží jako reference; veřejný frontend v `components/public/` je 1:1 dle zipu)
- Design: Bebas Neue (nadpisy), Inter 400/500/600/700 (text), barvy DARK_WINE `#3A0F16`, WINE_RED `#7A1E2C`, ACID_GREEN `#A7D129`, LIGHT_BG `#F6F4F1`. Fonty načteny přes next/font v app/layout.tsx, v komponentách použití `var(--font-bebas)` a `var(--font-inter)`.

## Co je hotové

- Repo na GitHubu, deploy na Vercel
- Supabase: první migrace (years, upcoming), druhá migrace připravena v `supabase/migrations/20250312100000_cucobrani_full_schema.sql` (upcoming_event, výsledky, program, galerie)
- **Veřejný web 1:1 dle ČŮČO.zip:** Hero (s daty z `upcoming_event`), Navbar, O akci, Aktuální ročník (včetně výsledků a galerie), Archiv (grid/timeline, modal YearDetail), Místo konání, Kontakt, Footer. Detail ročníku: modal na homepage nebo stránka `/archiv/[id]`. Design: Bebas Neue + Inter, barvy v `lib/theme.ts`.
- **SEO:** metadata v layoutu, `app/sitemap.ts`, `app/robots.ts` (allow /, disallow /admin).
- **Admin:** přihlášení (Supabase Auth, e-mail + heslo), dashboard (dvě karty), Nadcházející ročník (formulář text/místo/datum + live preview, ukládá do `upcoming_event`), Archiv ročníků (tabulka, přidat/upravit/smazat ročník, základní pole: rok, pořadí, název, stav). Odhlášení přes POST `/admin/logout`.

## Co zbývá (dle zadání)

1. **Spustit druhou migraci**  
   `npx supabase db push` (nebo SQL z `supabase/migrations/20250312100000_cucobrani_full_schema.sql` v Supabase SQL Editoru).

2. **Veřejný web 1:1 s Figma exportem**  
   Hero (s daty z `upcoming_event`), Navbar, O akci, Aktuální ročník, Archiv (grid/timeline), Místo konání, Kontakt, Footer. Detail ročníku: program, výsledky, galerie. Data z Supabase.

3. **SEO**  
   Metadata, sémantické HTML, `sitemap.xml`, `robots.txt`, Open Graph.

4. **Admin**  
   Přihlášení (Supabase Auth), dashboard, formulář „Nadcházející ročník“ s live preview, archiv ročníků (CRUD), výsledky (paste z Excelu, CSV, manuální tabulka), program (nadpis, zpracování, popis, obrázek, PDF), fotogalerie (upload, pořadí), stav draft/publikováno.

5. **Bezpečnost**  
   RLS hotové pro čtení všemi a zápis jen authenticated. V adminu omezit přístup jen na povolené e-maily (např. tabulka `admin_users` nebo kontrola e-mailu po přihlášení).

## Na co nezapomenout

- **Vercel:** env proměnné `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (pro veřejný web).
- **Supabase Storage:** bucket pro galerii a program (obrázky, PDF); v migraci nebo v dashboardu vytvořit a nastavit RLS.
- **Růžová vína:** v zadání nejsou; v DB a adminu pouze Bílá, Červená, Královna sklepa, Cena diváků, Sračka roku.
- **Design reference:** obsah `ČŮČO.zip` (komponenty, styly) je referenční; živý kód je v `components/public/` a `lib/theme.ts`.
- **První admin uživatel:** vytvoř v Supabase v **Authentication → Users → Add user** (e-mail + heslo). Tím se založí účet, kterým se přihlásíš na `/admin/login`. RLS umožňuje zápis všem přihlášeným; pro ostrý provoz můžeš omezit přístup (např. tabulka povolených e-mailů).
