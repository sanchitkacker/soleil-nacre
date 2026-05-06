import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {/* HubSpot Tracking Script */}
        <Script
          id="hs-script-loader"
          src="//js.hs-scripts.com/246050824.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
