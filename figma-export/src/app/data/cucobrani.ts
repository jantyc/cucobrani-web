export interface WineEntry {
  place: number;
  name: string;
  wine: string;
  points?: number;
}

export interface YearWinners {
  queenOfCellar?: { name: string; wine: string };
  white?: { place: number; name: string; wine: string };
  red?: { place: number; name: string; wine: string };
  audience?: { name: string; wine: string };
  worst?: { name: string; wine: string };
}

export interface YearResults {
  white: WineEntry[];
  red: WineEntry[];
  rose: WineEntry[];
}

export interface YearTheme {
  title: string;
  sceneTitle?: string;
  sceneDescription?: string;
  programPdfUrl?: string;
  programThumbnailUrl?: string;
}

export interface YearData {
  year: number;
  edition: string;
  editionNumber: number;
  description: string;
  winners: YearWinners;
  results: YearResults;
  hasGallery: boolean;
  gallery: string[];
  theme?: YearTheme;
}

export const yearsData: YearData[] = [
  {
    year: 2025,
    edition: "XXXVI",
    editionNumber: 36,
    description: "Rekordní ročník s účastí přes 40 degustátorů. Porota hodnotila celkem 23 vzorků. Vítěz byl jasný od prvního kola.",
    winners: {
      queenOfCellar: { name: "Jana Vomáčková", wine: "Jablečné Zlaté 2024" },
      white: { place: 1, name: "Tomáš Hruška", wine: "Hruškovice bílá reserva" },
      red: { place: 1, name: "Pavel Červenka", wine: "Švestkové noir 2024" },
      audience: { name: "Marie Horáčková", wine: "Bezinkové růžové" },
      worst: { name: "Franta Vopička", wine: "Bramborovo-ředkvičkové experimentální" },
    },
    results: {
      white: [
        { place: 1, name: "Tomáš Hruška", wine: "Hruškovice bílá reserva", points: 18.5 },
        { place: 2, name: "Jana Vomáčková", wine: "Jablečné Zlaté 2024", points: 17.8 },
        { place: 3, name: "Petr Novák", wine: "Rybízové bílé polosladké", points: 16.2 },
        { place: 4, name: "Alena Procházková", wine: "Angreštové suché", points: 15.7 },
        { place: 5, name: "Ondřej Malý", wine: "Malinové bílé 2024", points: 14.9 },
      ],
      red: [
        { place: 1, name: "Pavel Červenka", wine: "Švestkové noir 2024", points: 19.1 },
        { place: 2, name: "Karel Malý", wine: "Třešňové tmavé polosuché", points: 17.5 },
        { place: 3, name: "Jiří Velký", wine: "Borůvkové reserva 2023", points: 16.8 },
        { place: 4, name: "Mirka Dostálová", wine: "Černorybízové klasické", points: 15.3 },
      ],
      rose: [
        { place: 1, name: "Marie Horáčková", wine: "Bezinkové růžové", points: 17.2 },
        { place: 2, name: "Radek Fiala", wine: "Malinovo-jahodové rosé", points: 16.5 },
      ],
    },
    hasGallery: true,
    gallery: [
      "https://images.unsplash.com/photo-1611091115931-69347677e736?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1654635744301-c5dd917e254c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1706972561716-09d9cdb3aa10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1769697064243-889f2e25d44a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1762922425277-52f62cac2916?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1570288876209-5d9a0e128674?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    theme: {
      title: "Nikola Huhlaj aneb Jak to bylo doopravdy",
      sceneTitle: "Hoši Šindelářovi",
      sceneDescription: "Satirická scénka o slavném fiktivním vinaři Nikolovi Huhlajovi, jehož legenda je o něco větší než jeho skutečný talent. Pohádka pro dospělé s více než jedním překvapivým zvratem.",
      programPdfUrl: "#",
      programThumbnailUrl: "https://images.unsplash.com/photo-1738696782363-5944608b10f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    },
  },
  {
    year: 2024,
    edition: "XXXV",
    editionNumber: 35,
    description: "Jubilejní ročník spojený se vzpomínkami na zakladatele. Nová kategorie experimentálních vín přinesla zajímavé překvapení.",
    winners: {
      queenOfCellar: { name: "Karel Malý", wine: "Třešňové tmavé 2023" },
      white: { place: 1, name: "Eva Kratochvílová", wine: "Jablko-hruška premium" },
      red: { place: 1, name: "Karel Malý", wine: "Třešňové tmavé 2023" },
      audience: { name: "Radek Fiala", wine: "Rybízo-malinové rosé" },
      worst: { name: "Honza Blecha", wine: "Zelené rajčatové víno pokus č. 3" },
    },
    results: {
      white: [
        { place: 1, name: "Eva Kratochvílová", wine: "Jablko-hruška premium", points: 18.1 },
        { place: 2, name: "Tomáš Hruška", wine: "Ryzlink ovocný", points: 17.3 },
        { place: 3, name: "Jana Vomáčková", wine: "Jablečné 2023", points: 16.0 },
      ],
      red: [
        { place: 1, name: "Karel Malý", wine: "Třešňové tmavé 2023", points: 18.8 },
        { place: 2, name: "Pavel Červenka", wine: "Borůvkové suché", points: 17.2 },
        { place: 3, name: "Stanislav Veselý", wine: "Švestkové 2023", points: 16.1 },
      ],
      rose: [],
    },
    hasGallery: true,
    gallery: [
      "https://images.unsplash.com/photo-1616688921374-d941709f7263?w=400",
      "https://images.unsplash.com/photo-1682652476586-1d7dce119f3a?w=400",
      "https://images.unsplash.com/photo-1634020892994-0460bfa6534c?w=400",
    ],
    theme: {
      title: "35 let odvahy: Jubilejní retrospektiva",
      sceneTitle: "Divadelní spolek Žďárských",
      sceneDescription: "Retrospektivní pásmo k 35. výročí akce. Scénka mapuje nejslavnější momenty Čůčobraní v podobě fiktivního televizního dokumentu natočeného místní amatérskou televizí.",
      programPdfUrl: "#",
      programThumbnailUrl: "https://images.unsplash.com/photo-1567101404730-b5df4c39fe93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    },
  },
  {
    year: 2023,
    edition: "XXXIV",
    editionNumber: 34,
    description: "Po covidové pauze se akce vrátila ve velké síle. Účast překonala předchozí rekordy a nálada byla výjimečná.",
    winners: {
      queenOfCellar: { name: "Stanislav Veselý", wine: "Slivovice jemná 2022" },
      white: { place: 1, name: "Alena Procházková", wine: "Hruškovice Grand Cru" },
      red: { place: 1, name: "Stanislav Veselý", wine: "Švestkové premium" },
      audience: { name: "Eva Kratochvílová", wine: "Malinové klasické" },
      worst: { name: "Patrik Smutný", wine: "Kedlubnové víno – první a poslední" },
    },
    results: {
      white: [
        { place: 1, name: "Alena Procházková", wine: "Hruškovice Grand Cru", points: 19.0 },
        { place: 2, name: "Tomáš Hruška", wine: "Angreštové polosuché", points: 17.6 },
        { place: 3, name: "Radek Fiala", wine: "Rybízové bílé", points: 16.4 },
      ],
      red: [
        { place: 1, name: "Stanislav Veselý", wine: "Švestkové premium", points: 18.5 },
        { place: 2, name: "Karel Malý", wine: "Borůvkové 2022", points: 17.0 },
      ],
      rose: [
        { place: 1, name: "Eva Kratochvílová", wine: "Malinové klasické", points: 16.9 },
      ],
    },
    hasGallery: true,
    gallery: [
      "https://images.unsplash.com/photo-1634020892994-0460bfa6534c?w=400",
      "https://images.unsplash.com/photo-1682652476586-1d7dce119f3a?w=400",
    ],
    theme: {
      title: "Návrat z karantény aneb Tři roky žízně",
      sceneTitle: "Ochotnický soubor Nad Metují",
      sceneDescription: "Comeback po nucené covidové pauze. Scénka o skupince přátel, kteří si po třech letech bez Čůčobraní museli zvykat znovu degustovat – a zjistili, že jejich sklepa se za tu dobu velmi zajímavě změnily.",
      programPdfUrl: "#",
      programThumbnailUrl: "https://images.unsplash.com/photo-1616688921374-d941709f7263?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    },
  },
  {
    year: 2022,
    edition: "XXXIII",
    editionNumber: 33,
    description: "Ročník poznamenaný pozdní zimou. Navzdory tomu se sešel hojný počet výrobců a ochutnávání trvalo do brzkého rána.",
    winners: {
      queenOfCellar: { name: "Mirka Dostálová", wine: "Rybízové černé 2021" },
      white: { place: 1, name: "Radek Fiala", wine: "Jablečné světlé 2021" },
      red: { place: 1, name: "Mirka Dostálová", wine: "Rybízové černé 2021" },
      audience: { name: "Tomáš Hruška", wine: "Hruškovice speciál" },
      worst: { name: "Anonym", wine: "Tykev hokaido – víno pro odvážné" },
    },
    results: {
      white: [
        { place: 1, name: "Radek Fiala", wine: "Jablečné světlé 2021", points: 17.8 },
        { place: 2, name: "Alena Procházková", wine: "Angreštové 2021", points: 17.0 },
      ],
      red: [
        { place: 1, name: "Mirka Dostálová", wine: "Rybízové černé 2021", points: 18.7 },
        { place: 2, name: "Pavel Červenka", wine: "Třešňové suché", points: 17.4 },
        { place: 3, name: "Stanislav Veselý", wine: "Borůvkové sladší", points: 16.2 },
      ],
      rose: [],
    },
    hasGallery: false,
    gallery: [],
    theme: {
      title: "Zimní pohádka ve sklepě",
      sceneTitle: "Skupina Šindelář & Zocher",
      sceneDescription: "Klasická zimní pohádka, kde místo skřítků vystupují výrobci čůča a místo kouzelného lektvaru se točí hruškovice. Mrazivý venku, vřelý uvnitř.",
      programPdfUrl: "#",
      programThumbnailUrl: "https://images.unsplash.com/photo-1682652476586-1d7dce119f3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    },
  },
  {
    year: 2019,
    edition: "XXXII",
    editionNumber: 32,
    description: "Historicky největší počet přihlášených vzorků – celkem 28. Degustace trvala přes šest hodin.",
    winners: {
      queenOfCellar: { name: "Pavel Červenka", wine: "Švestkové suché 2018" },
      white: { place: 1, name: "Jana Vomáčková", wine: "Jablečné zlaté 2018" },
      red: { place: 1, name: "Pavel Červenka", wine: "Švestkové suché 2018" },
      audience: { name: "Ondřej Malý", wine: "Malinovo-třešňové" },
      worst: { name: "Petr Stránský", wine: "Okurkové víno z přebytků" },
    },
    results: {
      white: [
        { place: 1, name: "Jana Vomáčková", wine: "Jablečné zlaté 2018", points: 18.9 },
        { place: 2, name: "Tomáš Hruška", wine: "Hruškovice 2018", points: 18.1 },
        { place: 3, name: "Radek Fiala", wine: "Rybízové bílé suché", points: 16.8 },
      ],
      red: [
        { place: 1, name: "Pavel Červenka", wine: "Švestkové suché 2018", points: 19.4 },
        { place: 2, name: "Karel Malý", wine: "Borůvkové 2018", points: 17.9 },
        { place: 3, name: "Mirka Dostálová", wine: "Černorybízové classic", points: 16.5 },
      ],
      rose: [],
    },
    hasGallery: true,
    gallery: [
      "https://images.unsplash.com/photo-1567101404730-b5df4c39fe93?w=400",
      "https://images.unsplash.com/photo-1616688921374-d941709f7263?w=400",
      "https://images.unsplash.com/photo-1738696782363-5944608b10f9?w=400",
    ],
    theme: {
      title: "Rekord: 28 vzorků, jedna noc, žádné přežití",
      sceneTitle: "Tyč & Martínek Production",
      sceneDescription: "Dramatická komedie o zákulisí příprav rekordního ročníku. Co se skutečně děje v zákulisí, než se dveře restaurace otevřou a porota zasedne k prvnímu vzorku?",
      programPdfUrl: "#",
      programThumbnailUrl: "https://images.unsplash.com/photo-1567101404730-b5df4c39fe93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    },
  },
];

export const prehistoryData = [
  { year: "1989", note: "První neoficiální setkání, ještě bez názvu. Proběhlo ve sklepě u Tyčů." },
  { year: "1990", note: "Oficializace akce, název Čůčobraní poprvé použit. Účastní se 6 výrobců." },
  { year: "1992", note: "Zavedena kategorie Královna sklepa. První cenou byl malovaný džbán." },
  { year: "1995", note: "Akce se stěhuje do místní restaurace. Účast poprvé překračuje 20 lidí." },
  { year: "1998", note: "Vzniká satirická kategorie Sračka roku. Cenu získal pán se zeleninovým vínem." },
  { year: "2000", note: "Milostný ročník. Dvojité oslavy, dvojnásobná spotřeba." },
  { year: "2003", note: "Zavedena divácká hlasovací anketa. Hodnotit může každý přítomný." },
  { year: "2008", note: "20. ročník oslaven speciálním jubilejním pohárem. Legenda hovoří o 40 vzorcích." },
  { year: "2010", note: "Akce expanduje, přijíždí hosté z okolních vesnic i ze vzdáleného Polska." },
  { year: "2015", note: "Vznikají první webové stránky. Výsledky poprvé dostupné online." },
];
