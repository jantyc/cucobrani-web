# Jak navázat v novém chatu

Soubory paměti jsou v repozitáři (AGENTS.md, .cursor/rules/project.mdc, docs/working-memory.md, docs/decisions.md). Aby agent měl kontext, na **začátku nového chatu** napiš třeba:

- **„Pročti si AGENTS.md a docs/working-memory.md a shrň mi stav projektu.“**
- nebo: **„Načti AGENTS.md, .cursor/rules/project.mdc, docs/working-memory.md a docs/decisions.md a řekni, co je hotové a co doporučuješ jako další krok.“**

Agent pak načte paměť a může navázat. Po dokončení práce by měl sám aktualizovat docs/working-memory.md (a při arch. rozhodnutích docs/decisions.md).

## Uložení do repozitáře

Aby se nic neztratilo, **commitni a pushni** tyto soubory do GitHubu:

```bash
git add AGENTS.md .cursor/rules/project.mdc docs/
git status
git commit -m "Add agent memory: AGENTS.md, cursor rules, docs/working-memory, decisions"
git push
```

Od té chvíle jsou pravidla a paměť součástí repozitáře a platí pro každého (i pro tebe na jiném počítači nebo v novém chatu).

## Shrnutí této session (archiv & import)

Krátké shrnutí, aby další agent věděl, odkud navázat:

- **Cíl**: Naplnit archiv ročníků (všechny roky + prehistorie) z podkladů v `data/` tak, aby:
  - se fotky a programová PDF komprimovaly pro web,
  - data šla co nejvíc importovat automaticky,
  - FE měl vtipné fallback hlášky, když část dat chybí,
  - a „extra“ soubory (plakáty, hudba, reportáže) se evidovaly v reportu pro budoucí využití.
- **Dohodnutý datový a importní model**:
  - Fotky pro galerii = všechny obrázky (`*.jpg/jpeg/png`) kdekoliv pod složkou `{year}/` v ZIPu; při importu se zkomprimují (sharp, delší strana max ~1600 px, JPEG quality ~80) a uloží do bucketu `year-gallery` pod názvy `year-gallery/{year}/CUCOBRANI-{year}_{NNN}.jpg`.
  - Program ročníku = preferenčně soubor `Program {year}.pdf` (nebo jiné PDF s „Program“ v názvu); ukládá se do bucketu `year-program` jako `{year}-program.pdf` a URL se zapisuje do `years.program_pdf_url`.
  - Názvy ročníků = první ročník 1988 je 1., edice se počítá `editionNumber = year - 1988 + 1` a ukládá se jako římská číslice (např. `XXXVIII.`); `title` je standardizovaný jako `"{edition}. ročník – Čůčobraní {year}"`.
  - Prehistorie (1988–2001) = jedno PDF „Výtěž zázový starých ročníků“ se má nahrát do `year-program/prehistorie-1988-2001.pdf`, ročníky 1988–2001 se založí/doplní v `years` a základní údaje (Královna sklepa, téma) se doplní ručně pomocí jednoduchého CSV/JSON a speciálního importu.
- **Importní skript**:
  - Vytvořen `scripts/import-years-from-data.ts` + npm skript `npm run import:years`.
  - Funkce:
    - CLI argumenty: `--dry-run` (bez zápisu, jen log + report), `--years=2015,2025` (omezení na vybrané roky).
    - Pro každý ZIP v `data/` (kde název začíná rokem, např. `2015-...`):
      - rozbalí archiv do dočasného adresáře (`/tmp/.../cucobrani-import/{year}`),
      - najde kořenovou složku ročníku (`{year}/` nebo přímo kořen),
      - najde všechny fotky, programová PDF a soubory s výsledky (xls/xlsx/pdf s „vysled“ v názvu),
      - fotky zkomprimuje a nahraje do `year-gallery` jako `year-gallery/{year}/CUCOBRANI-{year}_{NNN}.jpg` a vloží odpovídající řádky do tabulky `year_gallery` (včetně `sort_order`),
      - hlavní program PDF nahraje do `year-program` jako `{year}-program.pdf`, získá public URL a uloží ho do tabulky `years` (`program_pdf_url`), současně doplní/standardizuje název ročníku,
      - načte existující `years` a pokud pro rok neexistuje záznam, založí nový ročník se správnou edicí/názvem a statusem `publikováno`.
    - Generuje report `docs/archive-import-report.md`:
      - pro každý rok: počet importovaných fotek, zda má program PDF a pod jakou cestou, seznam nalezených souborů s výsledky, seznam „extra“ souborů (PDF, audio, ostatní), které zatím nejsou automaticky použité.
  - Skript očekává env proměnné: `NEXT_PUBLIC_SUPABASE_URL` a `SUPABASE_SERVICE_ROLE_KEY` (případně `NEXT_PUBLIC_SUPABASE_ANON_KEY`); pro lokální běh je potřeba si je načíst z `.env.local` do shellu (např. `export $(grep -v '^#' .env.local | xargs)`).
- **Stav testování importu**:
  - V sandboxu byl skript otestovaný jen omezeně (síť/restikce), lokálně u uživatele už běží dry-run.
  - Při dry-run pro roky 2015 a 2025 narazil systémový `unzip` na rok 2015 na rozbitou diakritiku v názvech souborů uvnitř ZIPu (např. `čůčo 2015 výsledky.xls`) a hlásí „Illegal byte sequence“, takže rozbalení selže a skript skončí chybou.
  - Importní kód je připravený pro všechny ostatní roky; pro plný import bude potřeba buď:
    - ručně opravit ZIP pro rok 2015 (přejmenovat problematické soubory na názvy bez rozbité diakritiky a ZIP přebalit),
    - nebo upravit import skript tak, aby rok 2015 (a případné podobné roky) ošetřil – např. přes speciální JS knihovnu pro ZIP místo systémového `unzip` nebo přeskočením tohoto roku.
- **FE fallbacky a další todos**:
  - V této session jsou jen naplánované (v `docs/working-memory.md`): seznam vtipných fallback hlášek pro chybějící výsledky, program, galerii, highlight a archiv listing, a jejich zamýšlené umístění v `CurrentEdition`, `YearDetail` a `/archiv/[id]`.
  - Todo list (`.cursor` → TodoWrite) má zapsané další kroky: implementace FE fallbacků, příprava CSV/JSON a mini-importu pro prehistorii, přenesení kompresní logiky do backendu adminu tak, aby se nové fotky/PDF automaticky optimalizovaly při uploadu.

Další agent by měl začít přečtením `docs/working-memory.md` a tohoto shrnutí a podle toho rozhodnout, jestli nejdřív:
- vyřeší ZIP s rokem 2015 / úpravu importu,
- nebo se pustí do FE fallbacků, které na importu nejsou přímo blokované.
