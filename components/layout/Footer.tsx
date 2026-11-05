"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Info, LayoutDashboard, Mail, MessageCircle, Instagram } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "@/components/ui/Toast";
import AboutUsModal from "@/components/modals/AboutUsModal";
import AdminDashboardModal from "@/components/modals/AdminDashboardModal";
import { supabase } from "@/lib/supabase/client";

const APP_COMING_SOON_MESSAGE = "\u0642\u0631\u064a\u0628\u0627\u064b! \u0627\u0644\u062a\u0637\u0628\u064a\u0642 \u0642\u0627\u062f\u0645";

export default function Footer() {
  const { t, language } = useLanguage();
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase?.auth.getSession().then(({ data }) => {
      setCurrentUserEmail(data.session?.user?.email ?? null);
    });
    const { data: { subscription } } = supabase?.auth.onAuthStateChange((_, session) => {
      setCurrentUserEmail(session?.user?.email ?? null);
    }) ?? { data: { subscription: { unsubscribe: () => {} } } };
    return () => subscription.unsubscribe();
  }, []);

  const isAdmin = currentUserEmail === "muhammadelosman464@gmail.com";

  const adminLabel = language === "ar" ? "\u0644\u0648\u062d\u0629 \u0627\u0644\u062a\u062d\u0643\u0645" : language === "tr" ? "Y\u00f6netim paneli" : "Admin Panel";

  return (
    <>
      <footer className="relative z-20 w-full border-t border-[#ffd700]/25 bg-[#132a1c] text-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="/logo.jpeg" alt="Sanad" className="h-10 w-auto rounded-xl bg-white p-1 object-contain" />
              <p className="hidden xl:block text-xs text-slate-400 max-w-xs">{t("footerTagline")}</p>
            </div>

            <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-medium">
              <Link href="#services" className="hover:text-[#ffd700] transition">{t("navServices")}</Link>
              <Link href="#how-it-works" className="hover:text-[#ffd700] transition">{t("navProviders")}</Link>
              <Link href="#pricing" className="hover:text-[#ffd700] transition">{t("navPricing")}</Link>
              <button type="button" onClick={() => setAboutModalOpen(true)} className="inline-flex items-center gap-1.5 text-[#ffd700] hover:text-white transition">
                <Info className="w-4 h-4" />
                <span>{t("navAboutUs")}</span>
              </button>
              <Link href="/privacy" className="hover:text-[#ffd700] transition">{t("privacyPolicy")}</Link>
              <Link href="/terms" className="hover:text-[#ffd700] transition">{t("termsOfService")}</Link>
            </nav>

            <div className="flex items-center gap-4 text-sm">
              <a href="https://wa.me/905347757737" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition">
                <MessageCircle className="w-4 h-4" />
                <span dir="ltr">+90 534 775 77 37</span>
              </a>
              <a href="mailto:muhammadelosman464@gmail.com" aria-label="Email" className="text-slate-300 hover:text-[#ffd700] transition">
                <Mail className="w-4 h-4" />
              </a>
              <a href="https://instagram.com/abo_iilyas7" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-slate-300 hover:text-[#ffd700] transition">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => toast.success(APP_COMING_SOON_MESSAGE)} className="rounded-lg border border-white/15 px-3 py-1.5 text-white hover:border-[#ffd700] transition">App Store</button>
              <button type="button" onClick={() => toast.success(APP_COMING_SOON_MESSAGE)} className="rounded-lg border border-white/15 px-3 py-1.5 text-white hover:border-[#ffd700] transition">Google Play</button>
            </div>
            <p>&copy; {new Date().getFullYear()} Sanad. {t("allRightsReserved")}</p>
            {isAdmin && (
              <button
                type="button"
                onClick={() => setAdminOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-[#ffd700]/40 px-3 py-1.5 font-bold text-[#ffd700] hover:bg-[#ffd700]/10 transition"
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