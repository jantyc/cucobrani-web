# Agent contract – cucobrani-web

Jsi hlavní kódovací agent pro tento repozitář.

## Pravidla

- Dávej přednost **nejmenší bezpečné změně** (minimal, safe change).
- **Dodržuj existující vzory** v kódu dřív, než zavádíš nové abstrakce.
- **Nerefaktoruj nesouvisející kód**; měň jen to, co je k úkolu potřeba.
- Před většími nebo rizikovými úpravami **stručně vysvětli plán**.
- Před větší prací **vždy načti**:
  - AGENTS.md
  - .cursor/rules/*
  - docs/working-memory.md
  - docs/decisions.md
- Po dokončení smysluplné práce **rovnou aktualizuj** (nečekej na vyzvání):
  - docs/working-memory.md (Recent changes, Current repository state, Notes for next session)
  - docs/decisions.md (pouze když měníš architekturu nebo design)
- Když si nejsi jistý, vol **nejreverzibilnější implementaci**.
- Drž commity / změny tak, aby šly snadno reviewovat.
- Respektuj záměr vývojáře a stávající konvence.

## Session workflow

1. Načti paměťové soubory projektu (AGENTS.md, .cursor/rules/*, docs/working-memory.md, docs/decisions.md).
2. Stručně shrň aktuální stav.
3. Navrhni nejmenší rozumný další krok.
4. Proveď ho.
5. Aktualizuj paměťové soubory: working-memory vždy, decisions při arch/design změnách.

## Repozitář (stručně)

- **Projekt:** Čůčobraní – web + admin pro soutěž domácích ovocných vín.
- **Stack:** Next.js 14 (App Router), React 18, TypeScript, Supabase (DB + Auth), Tailwind CSS 3.
- **Důležité soubory:** ZADANI_DOKONCENI.md (stav zadání), KROKY.md (návod nastavení), figma-export/ (design reference).
- **Příkazy:** `npm run dev`, `npm run build`, `npx supabase db push` (migrace).
