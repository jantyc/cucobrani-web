import { createClient } from "@/lib/supabase/server";
import { fetchYearsWithData } from "@/lib/fetch-years";
import { Navbar } from "@/components/public/Navbar";
import { Hero } from "@/components/public/Hero";
import { About } from "@/components/public/About";
import { CurrentEdition } from "@/components/public/CurrentEdition";
import { Archive } from "@/components/public/Archive";
import { Location } from "@/components/public/Location";
import { Contact } from "@/components/public/Contact";
import { Footer } from "@/components/public/Footer";

export default async function HomePage() {
  let upcomingText = "XXXVIII. ROČNÍK ČŮČOBRANÍ SE KONÁ:";
  let upcomingLocation = "Žďár nad Metují";
  let upcomingDatetime = "30. ledna 2027 od 16:00";
  let yearsWithData: Awaited<ReturnType<typeof fetchYearsWithData>> = [];

  try {
    const supabase = await createClient();
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

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: "#F6F4F1", minHeight: "100vh" }}>
      <Navbar />
      <Hero
        upcomingText={upcomingText}
        upcomingLocation={upcomingLocation}
        upcomingDatetime={upcomingDatetime}
      />
      <About />
      <CurrentEdition latestYear={latestYear} />
      <Archive years={yearsWithData} />
      <Location />
      <Contact />
      <Footer />
    </div>
  );
}
