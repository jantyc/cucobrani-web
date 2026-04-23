/**
 * Ikona bílého vína – stejná velikost jako emoji 🍷, transparentní pozadí.
 * size="small" pro detail ročníku (karty vítězů), size="label" pro nadpisy tabulek.
 */
export function WhiteWineIcon({ size = "default" }: { size?: "default" | "small" | "label" }) {
  // label varianta je opticky větší, protože obrázek má víc transparentních okrajů než emoji 🍷
  const rem = size === "small" ? "0.65rem" : size === "label" ? "1.55rem" : "1.7rem";
  return (
    <span style={{ display: "inline-block", lineHeight: 1, background: "transparent", transform: size === "label" ? "translateY(2px)" : "none" }}>
      <img
        src="/white-wine-glass.png"
        alt=""
        role="presentation"
        style={{
          height: rem,
          width: "auto",
          maxWidth: rem,
          verticalAlign: "middle",
          display: "inline-block",
          background: "transparent",
        }}
      />
    </span>
  );
}
