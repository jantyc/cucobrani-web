# Kroky k nastavení projektu Cucobrani Web

Podrobný návod krok za krokem. Udělej jen to, co ještě nemáš hotové.

---

## Co je už hotové (v projektu)

- **package.json** – Next.js 14 + React + Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- **next.config.mjs**, **tsconfig.json** – konfigurace
- **app/layout.tsx**, **app/page.tsx** – základní stránka
- **lib/supabase/client.ts**, **lib/supabase/server.ts** – Supabase klienti pro prohlížeč a server
- **.env.example** – vzor proměnných
- **.gitignore** – `.env.local` se necommituje
- **KROKY.md** – tento návod
- **Next.js 14.2.35** – opravená verze (kritické CVE vyřešeny)

**npm audit:** Po `npm install` můžeš vidět varování o zranitelnostech (high). Kritické jsou opravené. Zbývající (glob, tar v závislostech ESLint/Supabase CLI) by vyžadovaly větší upgrade (Next 16, novější Supabase CLI) – pro lokální vývoj to lze zatím nechat; před nasazením do produkce zvaž `npm audit` a případné upgrady.

---

## Část 1: Node.js a závislosti

### Krok 1.1 – Ověř Node.js
1. Otevři terminál (VS Code: **Terminal → New Terminal** nebo `` Ctrl+` ``).
2. Zadej: `node -v`
3. Měl bys vidět číslo verze (např. `v20.x` nebo `v22.x`).  
   Pokud ne: nainstaluj Node.js z [nodejs.org](https://nodejs.org) (doporučená LTS verze).

### Krok 1.2 – Nainstaluj závislosti
1. V terminálu přejdi do složky projektu:  
   `cd /Users/jantyc/cucobrani-web`
2. Spusť: `npm install`
3. Po dokončení můžeš spustit dev server (až budeš mít vyplněné `.env.local`): `npm run dev`

---

## Část 2: Supabase účet a projekt

### Krok 2.1 – Účet na Supabase
1. Otevři [https://supabase.com](https://supabase.com).
2. Klikni **Start your project**.
3. Přihlas se (GitHub, Google, e-mail atd.).
4. Po přihlášení jsi na Dashboardu.

### Krok 2.2 – Nový projekt
1. Klikni **New Project**.
2. **Organization:** zvol organizaci (nebo vytvoř novou).
3. **Name:** např. `cucobrani` (nebo jak chceš).
4. **Database Password:** vymysli silné heslo a **ulož si ho** (např. do správce hesel).
5. **Region:** zvol nejbližší (např. `Frankfurt` pro ČR).
6. Klikni **Create new project**.
7. Počkej 1–2 minuty, než se projekt vytvoří (zelený „Project is ready“).

### Krok 2.3 – Získání URL a klíčů
1. V levém menu klikni **Project Settings** (ikona ozubeného kolečka).
2. V levém podmenu zvol **API**.
3. Na stránce uvidíš:
   - **Project URL** (např. `https://xxxxx.supabase.co`)  
   - **Project API keys:**
     - **anon public** – pro frontend (veřejný)
     - **service_role** – pouze pro backend/admin (nikdy nedávej do frontendu)

---

## Část 3: Nastavení `.env.local`

### Krok 3.1 – Otevři `.env.local`
1. V projektu otevři soubor `.env.local` (v kořeni `cucobrani-web`).

### Krok 3.2 – Doplň hodnoty z Supabase
1. **NEXT_PUBLIC_SUPABASE_URL**  
   - Z Supabase **Project Settings → API** zkopíruj **Project URL**.  
   - V `.env.local` nahraď `https://your-project.supabase.co` touto URL (bez mezer na začátku/konci).

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**  
   - Z téže stránky zkopíruj klíč **anon public**.  
   - V `.env.local` nahraď `your-anon-key` tímto klíčem.

3. **SUPABASE_SERVICE_ROLE_KEY** (nepovinné, pro admin/seedování)  
   - Zkopíruj **service_role** klíč z Supabase.  
   - V `.env.local` odkomentuj řádek (smaž `#` na začátku) a vlož klíč:  
     `SUPABASE_SERVICE_ROLE_KEY=eyJ...tvůj-klíč...`

### Krok 3.3 – Ulož soubor
- Ulož `.env.local` (Ctrl+S / Cmd+S).  
- **Nikdy** necommituj `.env.local` do gitu (mělo by být v `.gitignore`).

---

## Část 4: Supabase databáze (migrace / tabulky)

### Krok 4.1 – Kde jsou migrace
- Migrace jsou ve složce `supabase/migrations/`.  
- Pokud tam jsou soubory `.sql`, aplikují se na databázi (lokálně nebo na hostovaný projekt).

### Krok 4.2 – Supabase CLI (volitelné, pro `supabase db push`)
**Důležité:** Nepoužívej `npm install -g supabase` – na macOS často končí chybou oprávnění (EACCES). Místo toho:

**Varianta A – bez instalace (doporučeno)**  
Používej `npx` – CLI stáhne a spustí bez zápisu do systémových složek:
1. V projektu: `npx supabase login` (otevře prohlížeč).
2. Propoj projekt: `npx supabase link --project-ref TVŮJ_PROJECT_REF`  
   - Na dotaz **„Enter your database password“** zadej **heslo k databázi**, které jsi nastavil při vytváření projektu (Krok 2.2). Neplést s heslem k účtu Supabase.  
   - **Kde heslo najdeš / resetovat:** Supabase → **Project Settings** → **Database**. V sekci „Database password“ můžeš heslo **resetovat** („Reset database password“) – nové si ulož, pak ho zadej při `supabase link`.  
   - **Kde najdeš Project ref:** **Project Settings** → **General** → **Reference ID**.  
3. Migrace: `npx supabase db push`.

**Varianta B – CLI jen v projektu**  
V tomto projektu je Supabase CLI už v `package.json` (devDependency). Po `npm install` stačí používat `npx supabase …` jako u varianty A (např. `npx supabase login`, `npx supabase link ...`, `npx supabase db push`).

**Varianta C – opravdu globálně**  
Pouze pokud chceš mít `supabase` v PATH: `sudo npm install -g supabase` (zadáš heslo). Obvykle stačí varianta A nebo B.

### Krok 4.3 – Migrace přes SQL Editor (jednodušší)
1. V Supabase Dashboardu v levém menu klikni **SQL Editor**.
2. Pokud máš v `supabase/migrations/` soubory `.sql`, otevři je a zkopíruj jejich obsah.
3. Vlož SQL do editoru a klikni **Run**.
4. Tím vytvoříš tabulky a politiky (RLS) v cloudové databázi.

---

## Část 5: Spuštění aplikace

### Krok 5.1 – Dev server
1. V terminálu v kořeni projektu:  
   `npm run dev`
2. Otevři prohlížeč na: [http://localhost:3000](http://localhost:3000).
3. Měl bys vidět Next.js aplikaci (nebo úvodní stránku projektu).

### Krok 5.2 – Pokud něco spadne
- Chyba o „module not found“ → znovu `npm install`.
- Chyba o env proměnných → zkontroluj `.env.local` (název proměnných přesně jako v návodu).
- Chyba od Supabase (401, 403) → zkontroluj URL a anon key a že v Supabase běží projekt.

---

## Část 6: Git (doporučené)

### Krok 6.1 – Inicializace
1. V kořeni projektu: `git init`
2. Zkontroluj, že v `.gitignore` je řádek `.env.local` (a případně `.env*.local`).

### Krok 6.2 – První commit
1. `git add .`
2. `git commit -m "Initial setup with Supabase env"`

---

## Shrnutí – co udělat v jakém pořadí

| Pořadí | Úkol |
|--------|------|
| 1 | V projektu spustit `npm install` |
| 2 | Účet Supabase, vytvořený projekt, uložené heslo k DB |
| 3 | Z Supabase zkopírovat URL a anon key do `.env.local` |
| 4 | (Volitelně) service_role key do `.env.local` pro admin |
| 5 | Spustit migrace (SQL Editor nebo `supabase db push`) |
| 6 | `npm run dev` a otevřít http://localhost:3000 |
| 7 | (Volitelně) `git init` a první commit |

Když nějaký krok narazí na chybu, napiš který krok to je a jakou zprávu vidíš (v terminálu nebo v prohlížeči).

---

## Rozbité styly nebo 404 na `/_next/static/...` (layout.css, main-app.js)

Často jde o **přeplněné sledování souborů** ve vývoji: v repu je velká složka `data/` a další exporty; Watchpack pak hlásí **`EMFILE: too many open files`**, kompilace nedoběhne a prohlížeč dostane **404** na CSS/JS z `/_next/static/`.

**Co udělat:**

1. Zastav všechny běžící `next dev` (terminály).
2. Smaž cache buildu: `rm -rf .next`
3. Znovu: `npm run dev` a v prohlížeči **tvrdý refresh** (např. Cmd+Shift+R).

V `next.config.mjs` je nastavené **ignorování** `data/`, `figma-404/`, `figma-seed/` a `*.zip` při webpack watch (viz `webpack.watchOptions.ignored`).

Kdyby terminál pořád psal `EMFILE`, na macOS zkus před `npm run dev` zvýšit limit: `ulimit -n 10240`.

---

## Časté příkazy (zkopíruj z code bloku – bez „bquote“)

Příkazy níže jsou v **code bloku**. Zkopíruj je přímo z dokumentu (ne s prefixem `bquote>` nebo `>`):

```bash
cd /Users/jantyc/cucobrani-web
npm install
npm run dev
npx supabase login
npx supabase link --project-ref idyvbetwafrguneaflzw
npx supabase db push
```
