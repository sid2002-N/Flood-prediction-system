import type { Metadata } from "next";
import { Source_Serif_4, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const serifDisplay = Source_Serif_4({
  variable: "--font-serif-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Kuttanad Flood Prediction System — LSTM Early-Warning Study",
  description:
    "A research dossier and live LSTM forecasting console for flood prediction in Kuttanad, Alappuzha — the paddy lands that lie below sea level. Full data inventory, the 2018 flood event, model lab, and project status.",
  keywords: [
    "Kuttanad",
    "flood prediction",
    "LSTM",
    "deep learning",
    "Kerala floods",
    "Alappuzha",
    "hydrology",
    "early warning",
  ],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Kuttanad Flood Prediction System",
    description:
      "LSTM-based flood forecasting for the below-sea-level paddy lands of Kuttanad, Kerala.",
    siteName: "Kuttanad Flood Prediction System",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${serifDisplay.variable} ${plexSans.variable} ${plexMono.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
