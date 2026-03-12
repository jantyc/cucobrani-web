import { createClient } from "@/lib/supabase/server";
import { UpcomingForm } from "./UpcomingForm";
import { DARK_WINE } from "@/lib/theme";

export const metadata = {
  title: "Nadcházející ročník | Admin Čůčobraní",
  robots: "noindex, nofollow",
};

export default async function AdminUpcomingPage() {
  const supabase = await createClient();
  let initial = { text: "", location: "", datetime: "" };
  try {
    const { data } = await supabase
      .from("upcoming_event")
      .select("text, location, datetime")
      .limit(1)
      .maybeSingle();
    if (data) initial = { text: data.text ?? "", location: data.location ?? "", datetime: data.datetime ?? "" };
  } catch {
    // tabulka nemusí existovat
  }

  return (
    <div>
      <h1
        className="mb-2"
        style={{
          fontFamily: "var(--font-bebas), sans-serif",
          fontSize: "2rem",
          color: DARK_WINE,
          letterSpacing: "0.06em",
        }}
      >
        Nadcházející ročník
      </h1>
      <p className="text-[#666] text-sm mb-8" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
        Úprava hero komponenty na webu: text, místo konání, datum a čas.
      </p>

      <UpcomingForm initial={initial} />
    </div>
  );
}
