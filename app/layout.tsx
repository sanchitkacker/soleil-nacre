import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Soleil Nacre — Private Luxury Travel Concierge",
  description: "Privately curated global journeys shaped by elegance, discretion, and exceptional personal attention.",
  metadataBase: new URL("https://soleilnacre.com"),
  openGraph: {
    title: "Soleil Nacre — Private Luxury Travel Concierge",
    description: "Privately curated global journeys shaped by elegance, discretion, and exceptional personal attention.",
    url: "https://soleilnacre.com",
    siteName: "Soleil Nacre",
    images: [{ url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=85", width: 1200, height: 630, alt: "Soleil Nacre — Private Luxury Travel" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Soleil Nacre — Private Luxury Travel Concierge",
    description: "Privately curated global journeys shaped by elegance, discretion, and exceptional personal attention.",
    images: ["https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=85"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <Script id="hs-script-loader" src="//js.hs-scripts.com/246050824.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
