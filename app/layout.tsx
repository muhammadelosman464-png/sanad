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
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/cart/CartDrawer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

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
      <body className={`${inter.variable} ${cairo.variable} min-h-screen flex flex-col antialiased selection:bg-brand-500 selection:text-white relative bg-[#f6faf7] dark:bg-[#07110d]`}>
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
          <div className="absolute inset-0 bg-[url('/logo.jpeg')] bg-center bg-cover bg-no-repeat opacity-[0.05] dark:opacity-[0.05] [transform:perspective(1200px)_rotateX(4deg)_rotateY(-5deg)_scale(1.12)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#f6faf7]/90 via-[#f6faf7]/95 to-[#f6faf7]/90 dark:from-[#07110d]/90 dark:via-[#07110d]/95 dark:to-[#07110d]/92" />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen text-slate-900 dark:text-slate-100">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange={false}
          >
            <LanguageProvider>
              <CartProvider>
                <TopMiniBar />
                <Header />
                <main className="flex-1 flex flex-col pb-20 sm:pb-0">{children}</main>

              {/* Unified Footer */}
              <Footer />

              {/* Floating Concierge Chatbot */}
              <ChatWidget />
              <MobileBottomNav />

              {/* Live Social Proof Feed — bottom-start corner */}
              <LiveSocialProofFeed />

                <CartDrawer />
                <ToastContainer />
              </CartProvider>
            </LanguageProvider>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
