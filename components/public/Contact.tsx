import { Mail, MapPin, Phone, Facebook, Instagram } from "lucide-react";
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
            Napište nám
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Levý sloupec – kontaktní údaje + organizátoři (dle Figmy) */}
          <div className="space-y-8">
            <ul className="space-y-4" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
              <li className="flex items-start gap-3">
                <MapPin size={20} className="flex-shrink-0 mt-0.5" style={{ color: WINE_RED }} />
                <span className="text-[#333]">
                  Žďár nad Metují, Machovsko – region Náchod
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="flex-shrink-0" style={{ color: WINE_RED }} />
                <a href="tel:+420777123456" className="text-[#333] hover:underline">+420 777 123 456</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="flex-shrink-0" style={{ color: WINE_RED }} />
                <a href="mailto:info@cucobrani.cz" className="text-[#7A1E2C] font-medium hover:underline">
                  info@cucobrani.cz
                </a>
              </li>
            </ul>
            <div className="flex gap-4">
              <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full border border-black/15 flex items-center justify-center text-[#555] hover:border-[#7A1E2C] hover:text-[#7A1E2C] transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full border border-black/15 flex items-center justify-center text-[#555] hover:border-[#7A1E2C] hover:text-[#7A1E2C] transition-colors">
                <Instagram size={18} />
              </a>
            </div>
            <div>
              <p className="uppercase text-xs tracking-widest font-semibold text-[#999] mb-4" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                Organizátoři
              </p>
              <ul className="space-y-4">
                {organizers.map((o) => (
                  <li key={o.name} className="flex gap-3">
                    <span className="text-xl">{o.emoji}</span>
                    <div>
                      <p className="font-semibold text-[#222]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>{o.name}</p>
                      <p className="text-sm text-[#666]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>{o.role}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Pravý sloupec – placeholder Formulář / mapa (dle Figmy) */}
          <div
            className="rounded-xl border-2 border-dashed border-black/15 flex items-center justify-center min-h-[280px] bg-white/50"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            <p className="text-[#999] text-center uppercase tracking-widest text-sm font-semibold">
              Formulář / mapa
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
