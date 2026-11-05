"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, ArrowRight, ArrowLeft, MessageCircle, Send } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import AuthModal from "@/components/modals/AuthModal";

/**
 * CTASection — Emotionally-driven final call-to-action before the footer.
 * Positioned after Pricing to capture undecided visitors with a human appeal.
 */
export default function CTASection() {
  const { language, direction } = useLanguage();
  const [authOpen, setAuthOpen] = useState(false);

  const ArrowIcon = direction === "rtl" ? ArrowLeft : ArrowRight;

  const copy = {
    preTitle: {
      ar: "لا تدع المسافة تكون حاجزاً",
      en: "Don't Let Distance Be a Barrier",
      tr: "Mesafeyi Engel Olmasına İzin Verme",
    },
    title: {
      ar: "عائلتك تستحق أفضل رعاية.. حتى من بعيد",
      en: "Your Family Deserves the Best Care — Even From Afar",
      tr: "Aileniz En İyi Bakımı Hak Ediyor — Uzaktan Bile Olsa",
    },
    subtitle: {
      ar: "انضم إلى أكثر من 15,000 مغترب يثقون في سَنَد لدعم أحبابهم كل يوم. ابدأ مجاناً وشاهد الأثر بأم عينيك.",
      en: "Join 15,000+ diaspora members who trust Sanad to support their loved ones every day. Start free and see the impact with your own eyes.",
      tr: "Her gün sevdiklerini desteklemek için Sanad'a güvenen 15.000+ diaspora üyesine katılın. Ücretsiz başlayın ve etkiyi kendi gözlerinizle görün.",
    },
    cta1: {
      ar: "ابدأ بدعم عائلتك الآن",
      en: "Start Supporting Your Family Now",
      tr: "Ailenizi Desteklemeye Başlayın",
    },
    cta2: {
      ar: "تحدث معنا على واتساب",
      en: "Chat with Us on WhatsApp",
      tr: "WhatsApp'tan Bize Yazın",
    },
  };

  const get = (obj: { ar: string; en: string; tr: string }) =>
    language === "ar" ? obj.ar : language === "tr" ? obj.tr : obj.en;

  return (
    <section className="py-10 sm:py-14 relative overflow-hidden bg-gradient-to-br from-slate-900 via-brand-950 to-slate-950 border-t border-slate-800">
      {/* Decorative blobs */}
      <div className="absolute top-0 start-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 end-0 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Floating hearts */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-rose-500/20 dark:text-rose-400/10 pointer-events-none select-none"
          style={{
            left: `${15 + i * 18}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{ y: [0, -15, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.8 }}
        >
          <Heart className="w-8 h-8 fill-current" />
        </motion.div>
      ))}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Pre-title badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-wider mb-3"
        >
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>{get(copy.preTitle)}</span>
        </motion.div>

        {/* Main headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-4xl font-extrabold text-white leading-tight mb-3"
        >
          {get(copy.title)}
        </motion.h2>

        {/* Supporting copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 max-w-2xl mx-auto"
        >
          {get(copy.subtitle)}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {/* Primary CTA */}
          <button
            onClick={() => setAuthOpen(true)}
            className="group w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-brand-600 hover:from-rose-700 hover:to-brand-700 text-white font-bold text-sm sm:text-base shadow-xl shadow-rose-500/25 transition-all hover:-translate-y-0.5"
          >
            <Heart className="w-5 h-5 fill-current" />
            <span>{get(copy.cta1)}</span>
            <ArrowIcon className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* WhatsApp CTA */}
          <a
            href="https://wa.me/905347757737"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/40 text-white font-semibold text-sm sm:text-base transition-all"
          >
            <MessageCircle className="w-5 h-5 text-emerald-400" />
            <span>{get(copy.cta2)}</span>
          </a>
        </motion.div>

        {/* Micro-trust indicator */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-5 text-slate-500 text-xs"
        >
          {language === "ar"
            ? "✓ مجاني للبدء · ✓ بدون بيانات بنكية · ✓ ضمان استرداد كامل عند عدم التسليم"
            : language === "tr"
            ? "✓ Başlamak ücretsiz · ✓ Banka kartı gerekmez · ✓ Teslimat yapılmazsa tam iade garantisi"
            : "✓ Free to start · ✓ No credit card required · ✓ Full refund guarantee if undelivered"}
        </motion.p>
      </div>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </section>
  );
}
