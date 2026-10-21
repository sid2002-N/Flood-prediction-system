import type { Metadata, Viewport } from "next";
import "./globals.css";

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

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

/*
 * All five dossier views stay mounted and toggle visibility, so their
 * imagery is preloaded once at boot — no first-visit load flash when a
 * reviewer switches views.
 */
const PRELOAD_IMAGES = [
  "/images/hero-aerial.jpg",
  "/images/paddy-dusk.jpg",
  "/images/paddy-flooded.jpg",
  "/images/flood-church.jpg",
  "/images/flood-village.jpg",
  "/images/canal-canoe.jpg",
  "/images/backwaters.jpg",
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {PRELOAD_IMAGES.map((src) => (
          <link key={src} rel="preload" as="image" href={src} />
        ))}
      </head>
      <body className="antialiased bg-background text-foreground min-h-screen">
        {children}
      </body>
    </html>
  );
}
