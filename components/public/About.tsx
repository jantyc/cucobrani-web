import { LIGHT_BG, WINE_RED, DARK_WINE } from "@/lib/theme";
import { WhiteWineIcon } from "./WhiteWineIcon";

const IMG_TASTING =
  "https://images.unsplash.com/photo-1616688921374-d941709f7263?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900";
const IMG_BOTTLES =
  "https://images.unsplash.com/photo-1738696782363-5944608b10f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900";

const categories = [
  { label: "Bílá ovocná vína", whiteIcon: true },
  { emoji: "🍷", label: "Červená ovocná vína" },
];

export function About() {
  return (
    <section id="o-akci" style={{ backgroundColor: LIGHT_BG }} className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <div className="flex items-center gap-3 mb-12">
          <span
            style={{
              width: "40px",
              height: "3px",
              backgroundColor: WINE_RED,
              display: "inline-block",
              borderRadius: "2px",
            }}
          />
          <span
            style={{
              color: WINE_RED,
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "0.78rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            O akci
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <h2
              style={{
                fontFamily: "var(--font-bebas), sans-serif",
                fontSize: "clamp(2.8rem, 5vw, 4.5rem)",
                color: DARK_WINE,
                letterSpacing: "0.03em",
                lineHeight: 1,
                fontWeight: 700,
                marginBottom: "1.5rem",
              }}
            >
              Co je Čůčobraní
            </h2>

            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "1.05rem",
                color: "#333",
                lineHeight: 1.75,
                marginBottom: "1.25rem",
              }}
            >
              Čůčobraní je tradiční soutěž amatérských výrobců domácích ovocných a nerévových vín,
              pořádaná každou zimu na Machovsku. Výrobci zde poměřují své síly v přátelské, ale
              odborně vedené degustaci vzorků vykvašených v předchozím roce.
            </p>
            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "1.05rem",
                color: "#333",
                lineHeight: 1.75,
                marginBottom: "2rem",
              }}
            >
              Soutěž doplňuje bohatý program: hudba kapely Domamazec, scénky baletního souboru Hochů
              Šindelářových a společná zábava. Odborná porota i diváci hodnotí kvalitu, barvu a chuť
              přihlášených „čůč“, zatímco se všichni účastníci oddávají veselému veselí.
            </p>

            <div className="mb-8">
              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.8rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  color: "#888",
                  marginBottom: "0.75rem",
                }}
              >
                Soutěžní kategorie
              </p>
              <ul className="flex flex-col gap-2">
                {categories.map((c) => (
                  <li
                    key={c.label}
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "1rem",
                      color: "#222",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                    }}
                  >
                    <span style={{ width: "1.55rem", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                      {"whiteIcon" in c ? <WhiteWineIcon size="label" /> : (c as { emoji: string }).emoji}
                    </span>
                    {c.label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                style={{
                  backgroundColor: DARK_WINE,
                  borderRadius: "8px",
                  padding: "1.25rem 1.5rem",
                  color: "#fff",
                }}
              >
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🏆</div>
                <div
                  style={{
                    fontFamily: "var(--font-bebas), sans-serif",
                    fontSize: "1.3rem",
                    letterSpacing: "0.06em",
                    color: "#fff",
                    fontWeight: 700,
                    marginBottom: "0.3rem",
                  }}
                >
                  Královna sklepa
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.85rem",
                    color: "rgba(255,255,255,0.65)",
                    lineHeight: 1.5,
                  }}
                >
                  Hlavní cena pro absolutně nejlepší víno celé soutěže. Vítěz získá putovní pohár
                  Královny sklepa.
                </p>
              </div>
              <div
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: "8px",
                  padding: "1.25rem 1.5rem",
                }}
              >
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🤢</div>
                <div
                  style={{
                    fontFamily: "var(--font-bebas), sans-serif",
                    fontSize: "1.3rem",
                    letterSpacing: "0.06em",
                    color: DARK_WINE,
                    fontWeight: 700,
                    marginBottom: "0.3rem",
                  }}
                >
                  Sračka roku
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.85rem",
                    color: "#666",
                    lineHeight: 1.5,
                  }}
                >
                  Putovní anticena pro nejméně povedený mok. Vítěz musí vypít sklenici svého vzorku
                  na ex.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div
              className="rounded-lg overflow-hidden"
              style={{ aspectRatio: "4/3", position: "relative" }}
            >
              <img
                src={IMG_TASTING}
                alt="Degustace vín"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div
                className="rounded-lg overflow-hidden"
                style={{ aspectRatio: "1/1" }}
              >
                <img
                  src={IMG_BOTTLES}
                  alt="Domácí vína"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div
                className="rounded-lg flex items-center justify-center"
                style={{ backgroundColor: DARK_WINE, aspectRatio: "1/1" }}
              >
                <div className="text-center px-4">
                  <div
                    style={{
                      fontFamily: "var(--font-bebas), sans-serif",
                      fontSize: "3.5rem",
                      color: "#fff",
                      lineHeight: 1,
                    }}
                  >
                    36+
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "0.78rem",
                      color: "rgba(255,255,255,0.6)",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    ročníků tradice
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
