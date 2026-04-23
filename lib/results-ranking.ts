type RankedEntry = {
  place?: number;
  position?: number;
};

/**
 * Vrátí label pořadí s podporou shodných bodů (např. "7.-8.").
 * Předpokládá, že entries jsou seřazené podle place.
 */
export function formatPlaceWithTies<T extends RankedEntry>(
  entries: T[],
  index: number,
  getComparableValue: (entry: T) => string | number | null | undefined
): string {
  const entry = entries[index];
  if (!entry) return "";
  const getRankNumber = (item: T): number => item.place ?? item.position ?? 0;

  const normalize = (value: string | number | null | undefined): string | null => {
    if (value === null || value === undefined) return null;
    if (typeof value === "number") return Number.isFinite(value) ? String(value) : null;
    const t = value.trim();
    return t.length > 0 ? t : null;
  };

  const key = normalize(getComparableValue(entry));
  if (!key) return `${getRankNumber(entry)}.`;

  let start = index;
  while (start > 0 && normalize(getComparableValue(entries[start - 1])) === key) {
    start -= 1;
  }

  let end = index;
  while (end < entries.length - 1 && normalize(getComparableValue(entries[end + 1])) === key) {
    end += 1;
  }

  if (start === end) {
    return `${getRankNumber(entry)}.`;
  }

  return `${getRankNumber(entries[start])}.-${getRankNumber(entries[end])}.`;
}
