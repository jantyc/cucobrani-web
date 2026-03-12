import { MapPin, ExternalLink } from "lucide-react";

const LIGHT_BG = "#F6F4F1";
const DARK_WINE = "#3A0F16";
const WINE_RED = "#7A1E2C";
const ACID_GREEN = "#A7D129";

const IMG_LANDSCAPE =
  "https://images.unsplash.com/photo-1767045675220-a441f546a281?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWxsYWdlJTIwY291bnRyeXNpZGUlMjBib2hlbWlhJTIwbGFuZHNjYXBlJTIwd2ludGVyfGVufDF8fHx8MTc3MjY1MDI4Mnww&ixlib=rb-4.1.0&q=80&w=1400";

export function Location() {
  return (
    <section id="misto-konani" style={{ backgroundColor: DARK_WINE }} className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        {/* Label */}
        <div className="flex items-center gap-3 mb-4">
          <span style={{ width: "40px", height: "3px", backgroundColor: ACID_GREEN, display: "inline-block", borderRadius: "2px" }} />
          <span style={{ color: ACID_GREEN, fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>
            Místo konání
          </span>
        </div>
        <h2
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
            color: "#fff",
            letterSpacing: "0.03em",
            lineHeight: 1,
            marginBottom: "3rem",
          }}
        >
          Kde se Čůčobraní koná
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left – map placeholder + info */}
          <div>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "1.05rem",
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.75,
                marginBottom: "1.25rem",
              }}
            >
              Čůčobraní se každoročně koná v zimním období v oblasti{" "}
              <strong style={{ color: "#fff" }}>Machovska v okrese Náchod</strong>.
            </p>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "1.05rem",
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.75,
                marginBottom: "2rem",
              }}
            >
              Akce je historicky spojená s obcí{" "}
              <strong style={{ color: "#fff" }}>Žďár nad Metují</strong>, kde se konala řada
              ročníků a odkud pochází mnoho účastníků i organizátorů. Každý ročník probíhá ve
              vybraném místním restauračním zařízení.
            </p>

            {/* Info cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { emoji: "📍", label: "Region", value: "Machovsko" },
                { emoji: "🏘️", label: "Obec", value: "Žďár nad Metují" },
                { emoji: "🗺️", label: "Okres", value: "Náchod" },
                { emoji: "❄️", label: "Termín", value: "Zimní období" },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    borderRadius: "10px",
                    padding: "1rem 1.25rem",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <div style={{ fontSize: "1.25rem", marginBottom: "0.3rem" }}>{item.emoji}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginBottom: "0.2rem" }}>
                    {item.label}
                  </div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.95rem", color: "#fff", fontWeight: 500 }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            <a
              href="https://maps.google.com/?q=Žďár+nad+Metují"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                backgroundColor: WINE_RED,
                color: "#fff",
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "1.05rem",
                letterSpacing: "0.08em",
                padding: "0.85rem 2rem",
                borderRadius: "5px",
                textDecoration: "none",
                transition: "background-color 0.2s, transform 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "#9b2535";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = WINE_RED;
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              <MapPin size={16} />
              Otevřít mapu
              <ExternalLink size={13} style={{ opacity: 0.7 }} />
            </a>
          </div>

          {/* Right – photo */}
          <div
            style={{
              borderRadius: "14px",
              overflow: "hidden",
              aspectRatio: "4/3",
              position: "relative",
            }}
          >
            <img
              src={IMG_LANDSCAPE}
              alt="Machovsko krajina"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "1.25rem",
                left: "1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "rgba(0,0,0,0.6)",
                borderRadius: "99px",
                padding: "0.4rem 1rem",
              }}
            >
              <MapPin size={12} style={{ color: ACID_GREEN }} />
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.8rem",
                  color: "#fff",
                }}
              >
                Žďár nad Metují, Machovsko
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}