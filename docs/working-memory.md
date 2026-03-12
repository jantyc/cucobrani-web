# Working Memory

*Aktualizuj tento soubor po smysluplné práci. Záznamy nech konkrétní, krátké a užitečné pro další session.*

## Current goal

- Mít v repozitáři trvalou paměť agenta (AGENTS.md, .cursor/rules, docs/working-memory.md, docs/decisions.md) a po každé práci ji udržovat, aby bylo možné navázat v novém chatu.

## Current repository state

- **Stack:** Next.js 14, React 18, TypeScript, Supabase (DB + Auth), Tailwind CSS 3, lucide-react.
- **Veřejný web:** Hero (upcoming_event), Navbar, O akci, Aktuální ročník, Archiv (grid/timeline), Místo konání, Kontakt, Footer. Design 1:1 z Figmy (figma-export/). Barvy: DARK_WINE, WINE_RED, ACID_GREEN, LIGHT_BG. Fonty: Bebas Neue, Inter.
- **Admin:** Přihlášení (Supabase Auth), dashboard, Nadcházející ročník (formulář + live preview), Archiv ročníků (CRUD – rok, pořadí, název, stav). Chráněné route pod `/admin` kromě `/admin/login`.
- **DB:** První migrace nasazená (years, upcoming). Druhá migrace v souboru (upcoming_event, rozšíření years, výsledky, galerie) – je potřeba spustit `npx supabase db push` nebo SQL v Supabase.
- **Deploy:** GitHub repo, Vercel. Env na Vercelu: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY.

## Recent changes

- Založena struktura pro persistentní agenta: AGENTS.md, .cursor/rules/project.mdc, docs/working-memory.md, docs/decisions.md.
- Inicializace dokončena: agent by měl na začátku session číst tyto soubory a po práci je aktualizovat.

## Constraints

- Design a funkcionalita veřejného webu mají být 1:1 podle Figma exportu a zadání.
- Admin jen pro organizátory; jednoduchý, desktop-first.
- Růžová vína v zadání nejsou (pouze Bílá, Červená, Královna sklepa, Cena diváků, Sračka roku).
- figma-export/ je v tsconfig exclude (nepřekládá se); slouží jako reference.

## Open issues

- Druhá migrace ještě nemusí být nasazená – Hero a rozšířené ročníky závisí na tabulce `upcoming_event` a sloupcích u `years`.
- První admin uživatel se zakládá v Supabase (Authentication → Users → Add user).
- Volitelně: omezit admin jen na povolené e-maily (tabulka nebo env).

## Next recommended step

- Při další práci: načíst AGENTS.md, .cursor/rules/project.mdc, docs/working-memory.md, docs/decisions.md; shrnout stav; navrhnout nejmenší další krok; po dokončení aktualizovat working-memory (a decisions u arch. rozhodnutí).

## Notes for next session

- Klíčové zdroje pravdy: ZADANI_DOKONCENI.md (co je hotové / co zbývá), KROKY.md (nastavení), tento working-memory a decisions.md.
