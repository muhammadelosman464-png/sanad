"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, Globe, Users, HeartHandshake, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface AboutUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutUsModal({ isOpen, onClose }: AboutUsModalProps) {
  const { t, language } = useLanguage();

  if (!isOpen) return null;

  const highlights = [
    {
      icon: ShieldCheck,
      title: language === "ar" ? "حماية مالية عبر الضمان" : language === "tr" ? "Emanet Koruma Sistemi" : "Escrow Financial Protection",
      desc: language === "ar" ? "أموالك محفوظة حتى استلام الخدمة كما تم الاتفاق عليها." : language === "tr" ? "Hizmet şartlara uygun teslim edilene dek paranız güvende." : "Your capital is held securely until deliverables match specifications.",
    },
    {
      icon: Globe,
      title: language === "ar" ? "ثلاثية لغوية حقيقية" : language === "tr" ? "3 Dilde Eşzamanlı Destek" : "True Trilingual Ecosystem",
      desc: language === "ar" ? "تواصل بالعربية، الإنجليزية، أو التركية دون حواجز لغوية." : language === "tr" ? "Arapça, İngilizce ve Türkçe olarak dil engeli olmadan iletişim." : "Converse in Arabic, English, or Turkish without translation gaps.",
    },
    {
      icon: Users,
      title: language === "ar" ? "تحقق جنائي وترخيص رسمي" : language === "tr" ? "Doğrulanmış ve Lisanslı Sağlayıcılar" : "Vetted & Licensed Network",
      desc: language === "ar" ? "فحص قانوني لجميع مقدمي الخدمات المعتمدين على المنصة." : language === "tr" ? "Platformdaki tüm onaylı uzmanlar için yasal sicil ve lisans denetimi." : "Rigorous compliance and license checks for every listed provider.",
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 30 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl z-10 my-8 overflow-hidden"
        >
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close About Us"
            className="absolute top-6 end-6 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <span className="text-xs uppercase tracking-wider font-semibold text-brand-600 dark:text-brand-400">
              {language === "ar" ? "رؤية ورسالة المنصة" : language === "tr" ? "Vizyon ve Misyonumuz" : "Our Vision & Mission"}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
            {t("aboutTitle")}
          </h2>
          <p className="text-sm sm:text-base font-medium text-brand-600 dark:text-brand-400 mb-6">
            {t("aboutSubtitle")}
          </p>

          {/* Story Paragraphs */}
          <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
            <p className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              {t("aboutParagraph1")}
            </p>
            <p className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              {t("aboutParagraph2")}
            </p>
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {highlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800"
                >
                  <Icon className="w-5 h-5 text-brand-500 mb-2" />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Action button */}
          <div className="flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-sm hover:opacity-90 transition"
            >
              {language === "ar" ? "فهمت، شكراً" : language === "tr" ? "Anladım, Teşekkürler" : "Got it, Thank You"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
