"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Info, LayoutDashboard, Mail, MessageCircle, Instagram } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "@/components/ui/Toast";
import AboutUsModal from "@/components/modals/AboutUsModal";
import AdminDashboardModal from "@/components/modals/AdminDashboardModal";
import { supabase } from "@/lib/supabase/client";

const APP_COMING_SOON_MESSAGE = "\u0642\u0631\u064a\u0628\u0627\u064b! \u0627\u0644\u062a\u0637\u0628\u064a\u0642 \u0642\u0627\u062f\u0645 \u0639\u0644\u0649 App Store \u0648 Google Play";

export default function Footer() {
  const { t, language } = useLanguage();
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setCurrentUserEmail(data.session?.user?.email ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setCurrentUserEmail(session?.user?.email ?? null);
    }) ?? { data: { subscription: { unsubscribe: () => {} } } };
    return () => subscription.unsubscribe();
  }, []);

  const ADMIN_EMAIL = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "muhammadelosman464@gmail.com").toLowerCase();
  const isAdmin = currentUserEmail?.toLowerCase() === ADMIN_EMAIL;

  const adminLabel =
    language === "ar"
      ? "\u0644\u0648\u062d\u0629 \u0627\u0644\u062a\u062d\u0643\u0645"
      : language === "tr"
      ? "Y\u00f6netim paneli"
      : "Admin Panel";

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (typeof window !== "undefined") {
      if (window.location.pathname === "/") {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", `#${targetId}`);
        }
      }
    }
  };

  return (
    <>
      <footer className="relative z-20 w-full border-t border-[#ffd700]/25 bg-[#132a1c] text-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-5">
            {/* Logo & Tagline */}
            <div className="flex items-center gap-3">
              <Link href="/" className="shrink-0">
                <img
                  src="/logo.jpeg"
                  alt="Sanad"
                  className="h-10 w-auto rounded-xl bg-white p-1 object-contain"
                />
              </Link>
              <p className="hidden xl:block text-xs text-slate-400 max-w-xs leading-relaxed">
                {t("footerTagline")}
              </p>
            </div>

            {/* Interactive Smooth Scroll Links */}
            <nav className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm font-semibold">
              <Link
                href="/#services"
                onClick={(e) => handleSmoothScroll(e, "services")}
                className="text-slate-300 hover:text-[#ffd700] transition cursor-pointer"
              >
                {t("navServices")}
              </Link>
              <Link
                href="/#how-it-works"
                onClick={(e) => handleSmoothScroll(e, "how-it-works")}
                className="text-slate-300 hover:text-[#ffd700] transition cursor-pointer"
              >
                {t("navProviders")}
              </Link>
              <Link
                href="/#pricing"
                onClick={(e) => handleSmoothScroll(e, "pricing")}
                className="text-slate-300 hover:text-[#ffd700] transition cursor-pointer"
              >
                {t("navPricing")}
              </Link>
              <button
                type="button"
                onClick={() => setAboutModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-slate-300 hover:text-[#ffd700] transition cursor-pointer font-semibold"
              >
                <Info className="w-4 h-4 text-[#ffd700]" />
                <span>{t("navAboutUs")}</span>
              </button>
              <Link
                href="/privacy"
                className="text-slate-300 hover:text-[#ffd700] transition cursor-pointer"
              >
                {t("privacyPolicy")}
              </Link>
              <Link
                href="/terms"
                className="text-slate-300 hover:text-[#ffd700] transition cursor-pointer"
              >
                {t("termsOfService")}
              </Link>
            </nav>

            {/* Contact Icons */}
            <div className="flex items-center gap-4 text-sm">
              <a
                href="https://wa.me/905347757737"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span dir="ltr">+90 534 775 77 37</span>
              </a>
              <button
                type="button"
                onClick={async () => {
                  if (supabase) {
                    await supabase.auth.signInWithOAuth({ provider: "google" });
                  }
                }}
                aria-label="Google Sign In"
                title="Google Sign In"
                className="text-slate-300 hover:text-[#ffd700] transition flex items-center justify-center cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </button>
              <a
                href="mailto:muhammadelosman464@gmail.com"
                aria-label="Email"
                className="text-slate-300 hover:text-[#ffd700] transition"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/abo_iilyas7"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-slate-300 hover:text-[#ffd700] transition"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Bottom row: Stores, Copyright, and Admin Panel Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toast.success(APP_COMING_SOON_MESSAGE)}
                className="rounded-lg border border-white/15 px-3 py-1.5 text-white hover:border-[#ffd700] hover:text-[#ffd700] transition"
              >
                App Store
              </button>
              <button
                type="button"
                onClick={() => toast.success(APP_COMING_SOON_MESSAGE)}
                className="rounded-lg border border-white/15 px-3 py-1.5 text-white hover:border-[#ffd700] hover:text-[#ffd700] transition"
              >
                Google Play
              </button>
            </div>

            <p>&copy; {new Date().getFullYear()} Sanad (سَنَد). {t("allRightsReserved")}</p>

            {isAdmin && (
              <button
                type="button"
                onClick={() => setAdminOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-[#ffd700]/50 bg-[#ffd700]/10 px-3 py-1.5 font-bold text-[#ffd700] hover:bg-[#ffd700]/20 transition shadow-sm"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>{adminLabel}</span>
              </button>
            )}
          </div>
        </div>
      </footer>

      <AboutUsModal isOpen={aboutModalOpen} onClose={() => setAboutModalOpen(false)} />
      <AdminDashboardModal isOpen={adminOpen} onClose={() => setAdminOpen(false)} />
    </>
  );
}