import { createClient } from "@/lib/supabase/server";
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
  let years: { id: string; year?: number | null; edition?: string | null; title?: string | null; name?: string | null; status?: string | null; program_title?: string | null; program_pdf_url?: string | null }[] = [];

  try {
    const supabase = await createClient();

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
      // Tabulka upcoming_event nemusí existovat před druhou migrací
    }

    try {
      const { data } = await supabase.from("years").select("*").order("created_at", { ascending: false });
      years = (data ?? []).filter((y: { status?: string | null }) => !y.status || y.status === "publikováno");
    } catch {
      // Tabulka years nebo sloupec status nemusí existovat
    }
  } catch {
    // Supabase nebo env nedostupné – zobrazíme výchozí obsah
  }

  const latestYear = years[0] ?? null;

  return (
    <div style={{ fontFamily: "var(--font-inter), sans-serif", minHeight: "100vh" }}>
      <Navbar />
      <Hero
        upcomingText={upcomingText}
        upcomingLocation={upcomingLocation}
        upcomingDatetime={upcomingDatetime}
      />
      <About />
      <CurrentEdition latestYear={latestYear} />
      <Archive years={years} />
      <Location />
      <Contact />
      <Footer />
    </div>
  );
}
