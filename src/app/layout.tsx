import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Shriftlar loyiha ichida saqlanadi: tashqi so'rovsiz, tez yuklanadi.
const script = localFont({
  src: "./fonts/pinyon-script.woff2",
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

const serif = localFont({
  src: [
    { path: "./fonts/cormorant-garamond.woff2", weight: "300 700", style: "normal" },
    { path: "./fonts/cormorant-garamond-italic.woff2", weight: "300 700", style: "italic" },
  ],
  variable: "--font-serif",
  display: "swap",
});

const sans = localFont({
  src: "./fonts/jost.woff2",
  weight: "100 900",
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zikrullo va Baxoroy to’yi",
  description:
    "Zikrullo va Baxoroyning nikoh to’yiga taklifnoma. 27 noyabr 2026, soat 14:00.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Zikrullo va Baxoroy to’yi",
    description: "Sizni 27 noyabr kuni soat 14:00 da nikoh to’yimizga taklif etamiz.",
    type: "website",
    locale: "uz_UZ",
  },
};

export const viewport: Viewport = {
  themeColor: "#FBF9F5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="uz" className={`${script.variable} ${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
