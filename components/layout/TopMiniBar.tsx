"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Camera,
  HeartHandshake,
  PhoneCall,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function TopMiniBar() {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full bg-slate-900 text-slate-100 text-xs border-b border-slate-800 relative z-30 transition-all">
      {/* Visible ribbon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
          </span>
          <span className="font-medium text-slate-300 text-xs sm:text-sm truncate">
            {t("announcementText")}
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="https://wa.me/905347757737"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 text-xs text-emerald-300 hover:text-white transition font-semibold"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{t("emergencySupport")}</span>
          </a>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 transition text-xs font-semibold"
            aria-expanded={isOpen}
            aria-label="Toggle announcement details"
          >
            <span>
              {isOpen
                ? language === "ar"
                  ? "إخفاء"
                  : language === "tr"
                  ? "Gizle"
                  : "Hide"
                : language === "ar"
                ? "تفاصيل"
                : language === "tr"
                ? "Detaylar"
                : "Details"}
            </span>
            {isOpen ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
            )}
          </button>
        </div>
      </div>

      {/* Slide-down details */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-md"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-white text-xs mb-1">
                      {language === "ar"
                        ? "دعم مباشر لعائلتك"
                        : language === "tr"
                        ? "Ailenize Doğrudan Destek"
                        : "Direct Family Support"}
                    </h5>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      {language === "ar"
                        ? "أرسل سلال غذاء، وقود تدفئة، وخدمات طبية مباشرة إلى باب عائلتك."
                        : language === "tr"
                        ? "Gıda kolileri, yakıt ve sağlık hizmetlerini doğrudan ailenizin kapısına gönderin."
                        : "Send food baskets, heating fuel, and medical services directly to your family's door."}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-brand-500/20 text-brand-400 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-white text-xs mb-1">
                      {language === "ar"
                        ? "مدفوعات محمية بالضمان"
                        : language === "tr"
                        ? "Emanet Ödeme Koruması"
                        : "Escrow-Protected Payments"}
                    </h5>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      {language === "ar"
                        ? "لا يُصرف المبلغ للمزود إلا بعد تأكيد التوصيل بالصور."
                        : language === "tr"
                        ? "Para, fotoğraflı teslim onayına kadar sağlayıcıya aktarılmaz."
                        : "Funds are only released to the provider after photo-confirmed delivery."}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-white text-xs mb-1">
                      {language === "ar"
                        ? "توثيق بالصور عند التسليم"
                        : language === "tr"
                        ? "Teslimat Fotoğraf Belgesi"
                        : "Photo-Verified Delivery"}
                    </h5>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      {language === "ar"
                        ? "تصلك صور حقيقية تثبت وصول الدعم لعائلتك. شفافية تامة."
                        : language === "tr"
                        ? "Desteğinizin ailenize ulaştığını kanıtlayan gerçek fotoğraflar alırsınız."
                        : "Receive real photos proving your support reached your family. Full transparency."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
