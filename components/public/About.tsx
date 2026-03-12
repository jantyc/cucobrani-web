import { LIGHT_BG, WINE_RED, DARK_WINE, ACID_GREEN } from "@/lib/theme";

const IMG_TASTING =
  "https://images.unsplash.com/photo-1616688921374-d941709f7263?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900";
const IMG_BOTTLES =
  "https://images.unsplash.com/photo-1738696782363-5944608b10f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900";

const categories = [
  { emoji: "🍷", label: "Bílá ovocná vína" },
  { emoji: "🍷", label: "Červená ovocná vína" },
];

export function About() {
  return (
    <section id="o-akci" style={{ backgroundColor: LIGHT_BG }} className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <div className="flex items-center gap-3 mb-12">
          <span className="w-10 h-0.5 rounded-sm block" style={{ backgroundColor: WINE_RED }} />
          <span
            className="uppercase text-xs font-semibold tracking-widest"
            style={{ color: WINE_RED, fontFamily: "var(--font-inter), sans-serif" }}
          >
            O akci
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <h2
              className="mb-6"
              style={{
                fontFamily: "var(--font-bebas), sans-serif",
                fontSize: "clamp(2.8rem, 5vw, 4.5rem)",
                color: DARK_WINE,
                letterSpacing: "0.03em",
                lineHeight: 1,
              }}
            >
              Co je Čůčobraní
            </h2>

            <p
              className="mb-5 text-[#333] leading-7"
              style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "1.05rem" }}
            >
              Čůčobraní je tradiční soutěž amatérských výrobců domácích ovocných a nerévových vín,
              pořádaná každou zimu na Machovsku. Výrobci zde poměřují své síly v přátelské, ale
              odborně vedené degustaci vzorků vykvašených v předchozím roce.
            </p>
            <p
              className="mb-8 text-[#333] leading-7"
              style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "1.05rem" }}
            >
              Soutěž doplňuje bohatý program: hudba kapely Domamazec, scénky baletního souboru Hochů
              Šindelářových a společná zábava. Odborná porota i diváci hodnotí kvalitu, barvu a chuť
              přihlášených „čůč“, zatímco se všichni účastníci oddávají veselému veselí.
            </p>

            <p
              className="text-[0.8rem] uppercase tracking-widest font-semibold text-[#888] mb-3"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              Soutěžní kategorie
            </p>
            <ul className="flex flex-col gap-2 mb-8">
              {categories.map((c) => (
                <li
                  key={c.label}
                  className="flex items-center gap-2 text-[#222]"
                  style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "1rem" }}
                >
                  <span>{c.emoji}</span>
                  {c.label}
                </li>
              ))}
            </ul>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                className="rounded-lg p-5 text-white"
                style={{ backgroundColor: DARK_WINE }}
              >
                <div className="text-2xl mb-2">🏆</div>
                <div
                  className="text-xl mb-1"
                  style={{
                    fontFamily: "var(--font-bebas), sans-serif",
                    letterSpacing: "0.06em",
                  }}
                >
                  Královna sklepa
                </div>
                <p
                  className="text-sm leading-relaxed text-white/65"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  Hlavní cena pro absolutně nejlepší víno celé soutěže. Vítěz získá putovní pohár
                  Královny sklepa.
                </p>
              </div>
              <div className="rounded-lg p-5 border border-black/10 bg-white">
                <div className="text-2xl mb-2">🤢</div>
                <div
                  className="text-xl mb-1"
                  style={{
                    fontFamily: "var(--font-bebas), sans-serif",
                    letterSpacing: "0.06em",
                    color: DARK_WINE,
                  }}
                >
                  Sračka roku
                </div>
                <p
                  className="text-sm leading-relaxed text-[#666]"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  Putovní anticena pro nejméně povedený mok. Vítěz musí vypít sklenici svého vzorku
                  na ex.
                </p>
              </div>
            </div>

            {/* Testimoniály dle Figmy – Jan Novák (burgundy), Anna Dvořáková (light green) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div
                className="rounded-xl p-5 text-white flex items-start gap-4"
                style={{ backgroundColor: DARK_WINE }}
              >
                <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0 text-xl">
                  👤
                </div>
                <div>
                  <p className="font-semibold" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                    Jan Novák
                  </p>
                  <div className="flex gap-0.5 my-1" aria-hidden>
                    {[1, 2, 3, 4].map((i) => (
                      <span key={i} style={{ color: ACID_GREEN }}>★</span>
                    ))}
                    <span className="text-white/50">★</span>
                    <span className="text-white/70 text-sm ml-1" style={{ fontFamily: "var(--font-inter), sans-serif" }}>4.5</span>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                    Skvělá atmosféra, výborná vína a pořádná legrace. Každý rok se těším.
                  </p>
                </div>
              </div>
              <div
                className="rounded-xl p-5 border border-black/10 flex items-start gap-4"
                style={{ backgroundColor: "#E8F0D8" }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-xl" style={{ backgroundColor: "rgba(167,209,41,0.3)" }}>
                  👤
                </div>
                <div>
                  <p className="font-semibold text-[#333]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                    Anna Dvořáková
                  </p>
                  <div className="flex gap-0.5 my-1" aria-hidden>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span key={i} style={{ color: WINE_RED }}>★</span>
                    ))}
                    <span className="text-[#666] text-sm ml-1" style={{ fontFamily: "var(--font-inter), sans-serif" }}>5</span>
                  </div>
                  <p className="text-sm text-[#555] leading-relaxed" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                    Nejlepší degustace v regionu. Organizátoři mají můj obdiv.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="rounded-lg overflow-hidden aspect-[4/3] relative">
              <img
                src={IMG_TASTING}
                alt="Degustace vín na Čůčobraní"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg overflow-hidden aspect-square">
                <img
                  src={IMG_BOTTLES}
                  alt="Domácí ovocná vína"
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className="rounded-lg flex items-center justify-center aspect-square text-center px-4"
                style={{ backgroundColor: DARK_WINE }}
              >
                <div>
                  <div
                    className="text-white"
                    style={{
                      fontFamily: "var(--font-bebas), sans-serif",
                      fontSize: "3.5rem",
                      lineHeight: 1,
                    }}
                  >
                    36+
                  </div>
                  <div
                    className="text-white/60 uppercase text-xs tracking-widest mt-1"
                    style={{ fontFamily: "var(--font-inter), sans-serif" }}
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
