import { DARK_WINE, ACID_GREEN } from "@/lib/theme";

const IMG_LANDSCAPE =
  "https://images.unsplash.com/photo-1767045675220-a441f546a281?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400";

export function Location() {
  return (
    <section id="misto-konani" style={{ backgroundColor: DARK_WINE }} className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-10 h-0.5 rounded-sm block" style={{ backgroundColor: ACID_GREEN }} />
          <span
            className="uppercase text-xs font-semibold tracking-widest"
            style={{ color: ACID_GREEN, fontFamily: "var(--font-inter), sans-serif" }}
          >
            Místo konání
          </span>
        </div>
        <h2
          className="mb-12 text-white"
          style={{
            fontFamily: "var(--font-bebas), sans-serif",
            fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
            letterSpacing: "0.03em",
            lineHeight: 1,
          }}
        >
          Kde se Čůčobraní koná
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <p
              className="text-white/70 leading-relaxed mb-5"
              style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "1.05rem" }}
            >
              Čůčobraní se každoročně koná v zimním období v oblasti{" "}
              <strong className="text-white">Machovska v okrese Náchod</strong>.
            </p>
            <p
              className="text-white/70 leading-relaxed"
              style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "1.05rem" }}
            >
              Konkrétní místo a datum najdete v horní sekci u nadcházejícího ročníku.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden aspect-video">
            <img
              src={IMG_LANDSCAPE}
              alt="Krajina Machovska"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
