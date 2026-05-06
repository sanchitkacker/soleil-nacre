import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Soleil Nacre — Private Luxury Travel Concierge",
  description: "Privately curated global journeys shaped by elegance, discretion, and exceptional personal attention.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <Script
          id="hs-script-loader"
          src="//js.hs-scripts.com/246050824.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
