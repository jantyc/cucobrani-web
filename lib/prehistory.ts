export interface PrehistoryEntry {
  year: number;
  winner: string;
  location: string;
  scene: string;
}

export const PREHISTORY_CARD_ID = "prehistorie-1988-2001";
export const PREHISTORY_LABEL = "Prehistorie";
export const PREHISTORY_TITLE = "1988-2001";
export const PREHISTORY_LIST_TITLE = "Soupis prehistorickách ročníků";

export const PREHISTORY_ENTRIES: PrehistoryEntry[] = [
  { year: 2000, winner: 'Libor "Artur" Martínek', location: "Suchý Důl", scene: "Rej květin" },
  { year: 1999, winner: "Luděk Roštlapil", location: "Suchý Důl", scene: "Blüt Show" },
  { year: 1998, winner: 'Libor "Artur" Martínek', location: "Suchý Důl", scene: "Poupata" },
  { year: 1997, winner: 'Luděk "Husák" Paprskár', location: "Bělý u Police n.M", scene: "Labutí jezero" },
  { year: 1996, winner: 'Miroslav "Sigi" Černý', location: "Bělý u Police n.M", scene: "Módní přehlídka" },
  { year: 1995, winner: 'Miloš "Zub" Nývlt', location: "Bělý u Police n.M", scene: "Sukýnky" },
  { year: 1994, winner: "Miloš Štěpař", location: "Machovská Lhota", scene: "Cikáni" },
  { year: 1993, winner: "Jiří Bauerfeind", location: "Machovská Lhota", scene: "Taneční" },
  { year: 1992, winner: 'Miroslav "Sigi" Černý', location: "Machovská Lhota", scene: "Ikaros" },
  { year: 1991, winner: "Pavel Jirásek", location: "Machovská Lhota", scene: "Aquabely" },
  { year: 1990, winner: "Pavel Jirásek", location: "Machovská Lhota", scene: "???" },
  { year: 1989, winner: "Pavel Jirásek", location: "Machovská Lhota", scene: "Zvonkýš" },
  { year: 1988, winner: "Jiří Balada", location: "Machovská Lhota", scene: "nebyla" },
];

export function isPrehistoryYear(year: number): boolean {
  return year >= 1988 && year <= 2001;
}
