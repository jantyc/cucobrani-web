import { Mail } from "lucide-react";
import { LIGHT_BG, WINE_RED, DARK_WINE } from "@/lib/theme";

const organizers = [
  { name: "Petr Tyč", role: "Samozvaný ředitel soutěže Čůčobraní", emoji: "🍷" },
  { name: "Libor Artur Martínek", role: "Technický ředitel soutěže Čůčobraní", emoji: "⚙️" },
  { name: "Jiří Kača Zocher", role: "Mistr banja a člen organizačního výboru", emoji: "🪕" },
];

export function Contact() {
  return (
    <section id="kontakt" style={{ background: LIGHT_BG }} className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-10 h-0.5 rounded-sm block" style={{ backgroundColor: WINE_RED }} />
          <span
            className="uppercase text-xs font-semibold tracking-widest"
            style={{ color: WINE_RED, fontFamily: "var(--font-inter), sans-serif" }}
          >
            Kontakt
          </span>
        </div>
        <h2
          className="mb-12"
          style={{
            fontFamily: "var(--font-bebas), sans-serif",
            fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
            color: DARK_WINE,
            letterSpacing: "0.03em",
            lineHeight: 1,
          }}
        >
          Kontakt
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <p
              className="uppercase text-xs tracking-widest font-semibold text-[#999] mb-6"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              Organizátoři
            </p>
            <ul className="space-y-6">
              {organizers.map((o) => (
                <li key={o.name} className="flex gap-4">
                  <span className="text-2xl">{o.emoji}</span>
                  <div>
                    <p
                      className="font-semibold text-[#222]"
                      style={{ fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      {o.name}
                    </p>
                    <p
                      className="text-sm text-[#666]"
                      style={{ fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      {o.role}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p
              className="uppercase text-xs tracking-widest font-semibold text-[#999] mb-4"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              Napište nám
            </p>
            <a
              href="mailto:info@cucobrani.cz"
              className="inline-flex items-center gap-2 text-[#7A1E2C] font-medium hover:underline"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              <Mail size={18} />
              info@cucobrani.cz
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
