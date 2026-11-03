import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LanguageProvider } from "@/context/LanguageContext";
import TopMiniBar from "@/components/layout/TopMiniBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/chat/ChatWidget";
import { ToastContainer } from "@/components/ui/Toast";
import LiveSocialProofFeed from "@/components/social/LiveSocialProofFeed";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sanad (سَنَد) | Expat Relocation, Legal & Local Service Ecosystem",
  description:
    "Sanad connects international residents, expats, and investors with vetted legal, real estate, and sworn translation services backed by 100% escrow milestone guarantees.",
  keywords: [
    "Sanad",
    "سند",
    "Expat services",
    "Turkey residency",
    "Istanbul legal translation",
    "Escrow service marketplace",
    "Dubai expat legal",
    "B2B service directory",
  ],
  authors: [{ name: "Sanad Technologies Inc." }],
  openGraph: {
    title: "Sanad (سَنَد) — Your Pillar of Support Abroad",
    description: "Multilingual SaaS bridging expats and premier local providers with escrow protection.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/*
       * PREMIUM DARK GLOBAL BACKGROUND
       * logo.jpeg = fixed watermark at opacity-[0.06] behind ALL pages.
       * Two-layer overlay: slate-950 base + black/85 on top = ultra-dark.
       * REMINDER: Place logo.jpeg in /public/logo.jpeg
       */}
      <body
        className={`${inter.variable} ${cairo.variable} min-h-screen flex flex-col antialiased selection:bg-brand-500 selection:text-white relative bg-slate-950`}
        style={{
          backgroundImage: "url('/logo.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Layer 1: slate-950 base — kills any light bleed from logo */}
        <div
          className="fixed inset-0 bg-slate-950/90 pointer-events-none z-0"
          aria-hidden="true"
        />
        {/* Layer 2: black overlay — logo is now a ghost-faint watermark at ~10% visibility */}
        <div
          className="fixed inset-0 bg-black/80 pointer-events-none z-[1]"
          aria-hidden="true"
        />

        {/* All page content sits above the overlay */}
        <div className="relative z-10 flex flex-col min-h-screen text-slate-100">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange={false}
          >
            <LanguageProvider>
              {/* Top Interactive Mini Bar Ribbon */}
              <TopMiniBar />

              {/* Main Sticky Header */}
              <Header />

              {/* Page Content */}
              <main className="flex-1 flex flex-col">{children}</main>

              {/* Unified Footer */}
              <Footer />

              {/* Floating Concierge Chatbot */}
              <ChatWidget />

              {/* Live Social Proof Feed — bottom-start corner */}
              <LiveSocialProofFeed />

              {/* Global Toast Notification System */}
              <ToastContainer />
            </LanguageProvider>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
