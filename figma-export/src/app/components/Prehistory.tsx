import { prehistoryData } from "../data/cucobrani";

const DARK_WINE = "#3A0F16";
const WINE_RED = "#7A1E2C";
const ACID_GREEN = "#A7D129";

const IMG_PUB =
  "https://images.unsplash.com/photo-1634020892994-0460bfa6534c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDemVjaCUyMHZpbGxhZ2UlMjBwdWIlMjBhdG1vc3BoZXJlJTIwZXZlbmluZ3xlbnwxfHx8fDE3NzI2NTAyNzh8MA&ixlib=rb-4.1.0&q=80&w=900";

export function Prehistory() {
  return (
    <section
      id="prehistorie"
      style={{ background: DARK_WINE }}
      className="py-24 md:py-32"
    >
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left – image */}
          <div className="order-2 lg:order-1">
            <div
              style={{
                borderRadius: "12px",
                overflow: "hidden",
                aspectRatio: "4/3",
                position: "relative",
              }}
            >
              <img
                src={IMG_PUB}
                alt="Atmosféra hospody"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(to top, ${DARK_WINE}cc 0%, transparent 50%)`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "1.5rem",
                  left: "1.5rem",
                  right: "1.5rem",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1.8rem",
                    color: "#fff",
                    letterSpacing: "0.04em",
                    lineHeight: 1.2,
                  }}
                >
                  od roku 1989
                </p>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.85rem",
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  Žďár nad Metují · Machovsko
                </p>
              </div>
            </div>
          </div>

          {/* Right – timeline */}
          <div className="order-1 lg:order-2">
            {/* Label */}
            <div className="flex items-center gap-3 mb-8">
              <span
                style={{
                  width: "40px",
                  height: "3px",
                  backgroundColor: ACID_GREEN,
                  display: "inline-block",
                  borderRadius: "2px",
                }}
              />
              <span
                style={{
                  color: ACID_GREEN,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.78rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Prehistorie
              </span>
            </div>

            <h2
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(2.5rem, 4vw, 4rem)",
                color: "#fff",
                letterSpacing: "0.03em",
                lineHeight: 1,
                marginBottom: "1rem",
              }}
            >
              Prehistorie Čůčobraní
            </h2>

            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.95rem",
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.7,
                marginBottom: "2.5rem",
              }}
            >
              První ročníky Čůčobraní se konaly už koncem osmdesátých let. Z malé recesistické
              soutěže se stalo pravidelné setkání výrobců domácích vín. Zde najdete přehled
              vítězů a milníků starších ročníků.
            </p>

            {/* Timeline list */}
            <div className="flex flex-col gap-0">
              {prehistoryData.map((item, i) => (
                <div key={item.year} className="flex gap-5">
                  {/* Line */}
                  <div className="flex flex-col items-center">
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        backgroundColor: i === 0 ? ACID_GREEN : "rgba(255,255,255,0.25)",
                        border: `2px solid ${i === 0 ? ACID_GREEN : "rgba(255,255,255,0.15)"}`,
                        flexShrink: 0,
                        marginTop: "2px",
                      }}
                    />
                    {i < prehistoryData.length - 1 && (
                      <div
                        style={{
                          width: "1px",
                          flexGrow: 1,
                          backgroundColor: "rgba(255,255,255,0.1)",
                          minHeight: "36px",
                        }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ paddingBottom: "1.25rem" }}>
                    <span
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "1.25rem",
                        color: ACID_GREEN,
                        letterSpacing: "0.06em",
                        display: "block",
                        lineHeight: 1.1,
                        marginBottom: "0.2rem",
                      }}
                    >
                      {item.year}
                    </span>
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.875rem",
                        color: "rgba(255,255,255,0.65)",
                        lineHeight: 1.6,
                      }}
                    >
                      {item.note}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
