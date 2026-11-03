"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MessageCircle,
  Instagram,
  Facebook,
  ShieldAlert,
  ShieldCheck,
  FileText,
  Info,
  ExternalLink,
  Heart,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import AboutUsModal from "@/components/modals/AboutUsModal";

export default function Footer() {
  const { t, language } = useLanguage();
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  return (
    <>
      <footer className="w-full bg-slate-950 text-slate-300 border-t border-slate-800 relative z-20 overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-slate-800">
            {/* Column 1: Brand Info & Vision */}
            <div className="lg:col-span-2 space-y-5">
              <div className="flex items-center">
                <img
                  src="/logo.jpeg"
                  alt="Sanad"
                  className="h-16 w-auto rounded-2xl bg-white p-1.5 object-contain shadow-md"
                />
              </div>

              <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                {t("footerTagline")}
              </p>

              {/* Verified Trust Badges */}
              <div className="flex items-center gap-3 pt-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-brand-400 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{language === "ar" ? "مدفوعات آمنة 100%" : language === "tr" ? "%100 Güvenli Ödeme" : "100% Escrow Protection"}</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium">
                  <span>SSL 256-bit Encrypted</span>
                </div>
              </div>
            </div>

            {/* Column 2: Navigation Links */}
            <div>
              <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
                {t("quickLinks")}
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="#services" className="hover:text-brand-400 transition">
                    {t("navServices")}
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="hover:text-brand-400 transition">
                    {t("navProviders")}
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-brand-400 transition">
                    {t("navPricing")}
                  </Link>
                </li>
                <li>
                  {/* Trigger About Us Modal */}
                  <button
                    onClick={() => setAboutModalOpen(true)}
                    className="inline-flex items-center gap-1.5 text-brand-400 hover:text-brand-300 font-semibold transition"
                  >
                    <Info className="w-4 h-4" />
                    <span>{t("navAboutUs")}</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Legal & Compliance */}
            <div>
              <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
                {t("legalLinks")}
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-brand-400 transition flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t("privacyPolicy")}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-brand-400 transition flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t("termsOfService")}</span>
                  </Link>
                </li>
                <li>
                  <span className="text-xs text-slate-500 block pt-1">
                    {language === "ar"
                      ? "جميع المعاملات خاضعة للوائح التجارة الإلكترونية المعمول بها دولياً."
                      : language === "tr"
                      ? "Tüm işlemler uluslararası e-ticaret mevzuatına tabidir."
                      : "Regulated under international cross-border SaaS compliance."}
                  </span>
                </li>
              </ul>
            </div>

            {/* Column 4: Verified Direct Contacts */}
            <div>
              <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
                {t("contactUs")}
              </h4>
              <ul className="space-y-3 text-sm">
                {/* WhatsApp */}
                <li>
                  <a
                    href="https://wa.me/905347757737"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-emerald-400 hover:text-emerald-300 font-medium transition"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span dir="ltr">+90 534 775 77 37</span>
                  </a>
                </li>

                {/* Email */}
                <li>
                  <a
                    href="mailto:muhammadelosman464@gmail.com"
                    className="flex items-center gap-2.5 hover:text-brand-400 transition break-all text-xs sm:text-sm"
                  >
                    <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                    <span>muhammadelosman464@gmail.com</span>
                  </a>
                </li>

                {/* Instagram */}
                <li>
                  <a
                    href="https://instagram.com/abo_iilyas7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-pink-400 hover:text-pink-300 transition"
                  >
                    <Instagram className="w-4 h-4 shrink-0" />
                    <span dir="ltr">@abo_iilyas7</span>
                  </a>
                </li>

                {/* Facebook Placeholder */}
                <li>
                  <a
                    href="https://facebook.com/SanadPlatformOfficial"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-blue-400 hover:text-blue-300 transition"
                  >
                    <Facebook className="w-4 h-4 shrink-0" />
                    <span>Sanad Official Page</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <section className="border-t border-b border-slate-800 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 rounded-3xl bg-gradient-to-r from-emerald-900/60 to-slate-900 border border-emerald-700/30 p-6 sm:p-8">
              <div className="text-center md:text-start">
                <p className="text-lg font-bold text-white">حمل تطبيق سند الآن على iOS و Android لتجربة أسرع</p>
                <p className="text-sm text-slate-400 mt-1">Get the Sanad app on iOS and Android for a faster experience</p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <button type="button" className="rounded-xl bg-black border border-slate-600 px-5 py-2.5 text-start text-white hover:border-emerald-400 transition">
                  <span className="block text-[10px] text-slate-300">Download on the</span>
                  <span className="block text-sm font-bold">App Store</span>
                </button>
                <button type="button" className="rounded-xl bg-black border border-slate-600 px-5 py-2.5 text-start text-white hover:border-emerald-400 transition">
                  <span className="block text-[10px] text-slate-300">Get it on</span>
                  <span className="block text-sm font-bold">Google Play</span>
                </button>
              </div>
            </div>
          </section>
          <div className="flex justify-center py-8 border-b border-slate-800"><div className="relative w-24 h-24 rounded-[28px] overflow-hidden ring-1 ring-emerald-500/30 shadow-2xl shadow-emerald-950/40"><img src="/logo.jpeg" alt="Sanad" className="w-full h-full object-cover" /></div></div>

          {/* Bottom Bar: Copyright & Founder Signature */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} Sanad (سَنَد). {t("allRightsReserved")}</p>
            <p className="flex items-center gap-1.5">
              <span>Architected with excellence for global residents & ventures</span>
            </p>
          </div>
        </div>
      </footer>

      {/* About Us Modal Slide-over */}
      <AboutUsModal
        isOpen={aboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
      />
    </>
  );
}
