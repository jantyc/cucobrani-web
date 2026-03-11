import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cucobrani",
  description: "Cucobrani web",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}
