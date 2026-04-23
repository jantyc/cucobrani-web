// Typ ročníku 1:1 podle zip (cucobrani.ts) – pro CurrentEdition a YearDetail

export interface WineEntry {
  place: number;
  name: string;
  sampleNumber?: string;
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
}

export interface YearTheme {
  title: string;
  sceneTitle?: string;
  sceneDescription?: string;
  programPdfUrl?: string;
  programThumbnailUrl?: string;
}

export interface YearData {
  id: string;
  year: number;
  edition: string;
  description: string;
  winners: YearWinners;
  results: YearResults;
  hasGallery: boolean;
  gallery: string[];
  theme?: YearTheme;
}
