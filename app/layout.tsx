import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Effects from "@/components/Effects";
import "./globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap", weight: ["400", "500", "600"] });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap", weight: ["400"] });

export const metadata: Metadata = {
  title: { default: "Synapse: inference at the speed of thought", template: "%s · Synapse" },
  description: "A fast, predictable inference API. First streamed token in about 120ms, honest per-token pricing, and a first call in under three minutes.",
  metadataBase: new URL("https://synapse.example"),
  openGraph: { siteName: "Synapse", type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#07070b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning className={`${sans.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.add("js")` }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <div className="grain" aria-hidden="true" />
        <Effects />
      </body>
    </html>
  );
}
