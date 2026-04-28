import dynamic from "next/dynamic";
import { createPublicClient } from "@/lib/supabase/public";
import { fetchYearsWithData } from "@/lib/fetch-years";
import { Navbar } from "@/components/public/Navbar";
import { Hero } from "@/components/public/Hero";
import { About } from "@/components/public/About";
import { Footer } from "@/components/public/Footer";
import { getSiteUrl } from "@/lib/site-url";

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
  const siteUrl = getSiteUrl();
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
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Čůčobraní",
    url: siteUrl,
    description:
      "Tradiční setkání amatérských výrobců ovocných vín spojené se soutěží o Královnu sklepa.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Žďár nad Metují",
      addressRegion: "Náchod",
      addressCountry: "CZ",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "organizer",
        name: "Petr Tyč",
        email: "tycak2@gmail.com",
      },
      {
        "@type": "ContactPoint",
        contactType: "organizer",
        name: "Libor Artur Martínek",
        email: "libor.martinek@gmail.com",
      },
      {
        "@type": "ContactPoint",
        contactType: "media",
        name: "Jan Tyč",
        email: "honza.tyc@gmail.com",
      },
    ],
  };
  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: upcomingText,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: upcomingLocation,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Žďár nad Metují",
        addressRegion: "Náchod",
        addressCountry: "CZ",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "Čůčobraní",
      url: siteUrl,
    },
    description: "Tradiční setkání amatérských výrobců ovocných vín a soutěž o Královnu sklepa.",
    url: siteUrl,
  };
  const archiveYears = yearsWithData.map((y) => ({
    ...y,
    // Full detail se načítá až při otevření modalu (API), aby homepage posílala menší payload.
    results: { white: [], red: [] },
    gallery: [],
  }));

  return (
    <div style={{ fontFamily: "var(--font-inter), sans-serif", backgroundColor: "#F6F4F1", minHeight: "100vh" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
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
