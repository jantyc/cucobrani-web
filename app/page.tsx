import dynamic from "next/dynamic";
import { createPublicClient } from "@/lib/supabase/public";
import { fetchYearsWithData } from "@/lib/fetch-years";
import { Navbar } from "@/components/public/Navbar";
import { Hero } from "@/components/public/Hero";
import { About } from "@/components/public/About";
import { Footer } from "@/components/public/Footer";

const CurrentEdition = dynamic(() =>
  import("@/components/public/CurrentEdition").then((m) => m.CurrentEdition)
);
const Archive = dynamic(() =>
  import("@/components/public/Archive").then((m) => m.Archive)
);
const Location = dynamic(() =>
  import("@/components/public/Location").then((m) => m.Location)
);
const Contact = dynamic(() =>
  import("@/components/public/Contact").then((m) => m.Contact)
);

export const revalidate = 300;

export default async function HomePage() {
  let upcomingText = "XXXVIII. ROČNÍK ČŮČOBRANÍ SE KONÁ:";
  let upcomingLocation = "Žďár nad Metují";
  let upcomingDatetime = "30. ledna 2027 od 16:00";
  let yearsWithData: Awaited<ReturnType<typeof fetchYearsWithData>> = [];

  try {
    const supabase = createPublicClient();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

    try {
      const { data } = await supabase
        .from("upcoming_event")
        .select("text, location, datetime")
        .limit(1)
        .maybeSingle();
      if (data?.text) upcomingText = data.text;
      if (data?.location) upcomingLocation = data.location;
      if (data?.datetime) upcomingDatetime = data.datetime;
    } catch {
      // Tabulka upcoming_event nemusí existovat
    }

    try {
      yearsWithData = await fetchYearsWithData(supabase, supabaseUrl);
    } catch {
      // Tabulka years nebo výsledky nemusí existovat
    }
  } catch {
    // Supabase nebo env nedostupné
  }

  const latestYear = yearsWithData[0] ?? null;
  const archiveYears = yearsWithData.map((y) => ({
    ...y,
    // Full detail se načítá až při otevření modalu (API), aby homepage posílala menší payload.
    results: { white: [], red: [] },
    gallery: [],
  }));

  return (
    <div style={{ fontFamily: "var(--font-inter), sans-serif", backgroundColor: "#F6F4F1", minHeight: "100vh" }}>
      <Navbar />
      <Hero
        upcomingText={upcomingText}
        upcomingLocation={upcomingLocation}
        upcomingDatetime={upcomingDatetime}
      />
      <About />
      <CurrentEdition latestYear={latestYear} />
      <Archive years={archiveYears} />
      <Location upcomingDatetime={upcomingDatetime} />
      <Contact />
      <Footer />
    </div>
  );
}
