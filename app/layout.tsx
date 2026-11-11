import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LanguageProvider } from "@/context/LanguageContext";
import TopMiniBar from "@/components/layout/TopMiniBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/chat/ChatWidget";
import SupportFab from "@/components/layout/SupportFab";
import { ToastContainer } from "@/components/ui/Toast";
import { CartProvider } from "@/context/CartContext";
import { CatalogProvider } from "@/context/CatalogContext";
import { NotificationProvider } from "@/context/NotificationContext";
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
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Sanad | Your Bridge of Support Abroad",
  description:
    "Sanad connects diaspora families with verified local services — food, fuel, medical, gifts and more. Every delivery guaranteed.",
  keywords: [
    "Sanad",
    "Expat services",
    "Diaspora support",
    "Family support abroad",
    "Humanitarian aid",
  ],
  authors: [{ name: "Sanad Technologies Inc." }],
  openGraph: {
    title: "Sanad — Your Pillar of Support Abroad",
    description: "Multilingual platform bridging expats and trusted local providers.",
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
      <body
        className={`${inter.variable} ${cairo.variable} min-h-screen flex flex-col antialiased`}
      >
        {/* ── Fixed full-screen background image ───────────────────────── */}
        <div
          className="fixed inset-0 z-0 pointer-events-none"
          aria-hidden="true"
        >
          {/* Background image layer */}
          <div
            className="absolute inset-0 bg-[url('/bg-ecommerce.png')] bg-fixed bg-cover bg-center bg-no-repeat"
          />
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-black/60 dark:bg-black/70" />
        </div>

        {/* ── App content (above background) ───────────────────────────── */}
        <div className="relative z-10 flex flex-col min-h-screen text-white">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <LanguageProvider>
              <CatalogProvider>
                <CartProvider>
                  <NotificationProvider>
                    <TopMiniBar />
                    <Header />
                    <main className="flex-1 flex flex-col pb-20 sm:pb-0">
                      {children}
                    </main>
                    <Footer />
                    <SupportFab />
                    <ChatWidget />
                    <MobileBottomNav />
                    <CartDrawer />
                    <ToastContainer />
                  </NotificationProvider>
                </CartProvider>
              </CatalogProvider>
            </LanguageProvider>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}