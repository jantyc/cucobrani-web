import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import { LIGHT_BG } from "@/lib/theme";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Čůčobraní – soutěž domácích ovocných vín | Žďár nad Metují",
  description:
    "Tradiční setkání amatérských výrobců ovocných vín. Soutěž o Královnu sklepa, odborná porota, divácká soutěž. Od roku 1988, Machovsko–Policko.",
  openGraph: {
    title: "Čůčobraní – soutěž domácích ovocných vín",
    description: "Tradiční setkání amatérských výrobců ovocných vín. Žďár nad Metují.",
    locale: "cs_CZ",
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
