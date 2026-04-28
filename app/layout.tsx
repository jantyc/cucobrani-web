import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import { LIGHT_BG } from "@/lib/theme";
import { getSiteUrl } from "@/lib/site-url";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  title: "Čůčobraní – soutěž domácích ovocných vín | Žďár nad Metují",
  description:
    "Tradiční setkání amatérských výrobců ovocných vín. Soutěž o Královnu sklepa, odborná porota, divácká soutěž. Od roku 1988, Machovsko–Policko.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
  openGraph: {
    title: "Čůčobraní – soutěž domácích ovocných vín",
    description: "Tradiční setkání amatérských výrobců ovocných vín. Žďár nad Metují.",
    url: siteUrl,
    siteName: "Čůčobraní",
    type: "website",
    locale: "cs_CZ",
  },
  twitter: {
    card: "summary",
    title: "Čůčobraní – soutěž domácích ovocných vín",
    description: "Tradiční setkání amatérských výrobců ovocných vín. Žďár nad Metují.",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" className={`${bebas.variable} ${inter.variable}`}>
      <body
        className="min-h-screen antialiased"
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          backgroundColor: LIGHT_BG,
        }}
      >
        {children}
      </body>
    </html>
  );
}
