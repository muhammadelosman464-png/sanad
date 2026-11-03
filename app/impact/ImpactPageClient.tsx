"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  Store,
  Clock,
  TrendingUp,
  Heart,
  ShieldCheck,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import StatCard from "@/components/impact/StatCard";
import AidGrowthChart from "@/components/impact/AidGrowthChart";

export default function ImpactPageClient() {
  const { language } = useLanguage();

  const T = {
    badge:
      language === "ar"
        ? "الشفافية والأثر الإنساني"
        : language === "tr"
        ? "Şeffaflık & İnsani Etki"
        : "Transparency & Humanitarian Impact",
    title:
      language === "ar"
        ? "نبني الثقة بالأرقام الحقيقية"
        : language === "tr"
        ? "Gerçek Rakamlarla Güven İnşa Ediyoruz"
        : "We Build Trust With Real Numbers",
    subtitle:
      language === "ar"
        ? "كل طلب، كل توصيلة، كل ابتسامة — نوثّقها هنا لأن الشفافية هي أساس ثقتكم بنا."
        : language === "tr"
        ? "Her sipariş, her teslimat, her gülümseme — şeffaflık güvenimizin temelidir."
        : "Every order, every delivery, every smile — documented here because transparency is the foundation of your trust.",
    chartTitle:
      language === "ar"
        ? "نمو المساعدات عبر الزمن"
        : language === "tr"
        ? "Zamanla Büyüyen Yardım"
        : "Aid Growth Over Time",
    testimonialQuote:
      language === "ar"
        ? '"كنت خائفاً أن لا يصل شيء لأمي في الشتاء. لكن الحطب وصل في نفس اليوم مع صورة إثبات. دموعي لا تصف شكري."'
        : language === "tr"
        ? '"Kışın anneme hiçbir şey ulaşmayacak diye korkuyordum. Ama odun aynı gün teslim edildi ve teslimat fotoğrafı geldi. Minnettarlığımı kelimeler ifade edemez."'
        : '"I was afraid nothing would reach my mother in winter. But the firewood arrived the same day with a proof photo. My tears cannot describe my gratitude."',
    testimonialName:
      language === "ar"
        ? "م. علي — مغترب سوري في ألمانيا"
        : language === "tr"
        ? "M. Ali — Almanya'da Yaşayan Suriyeli Göçmen"
        : "M. Ali — Syrian expat in Germany",
    commitment:
      language === "ar"
        ? "تعهدنا لكم"
        : language === "tr"
        ? "Taahhüdümüz"
        : "Our Commitment",
    commitments: [
      {
        icon: ShieldCheck,
        en: "100% of your payment goes directly to the local provider — zero hidden fees.",
        ar: "100% من مدفوعاتك تذهب مباشرة للمزود المحلي — بلا رسوم خفية.",
        tr: "Ödemenizin %100'ü doğrudan yerel sağlayıcıya gider — gizli ücret yok.",
      },
      {
        icon: Heart,
        en: "Every order includes a verified photo or receipt as proof of delivery.",
        ar: "كل طلب يتضمن صورة أو إيصالاً موثّقاً كإثبات تسليم.",
        tr: "Her sipariş, teslimat kanıtı olarak doğrulanmış fotoğraf veya makbuz içerir.",
      },
      {
        icon: TrendingUp,
        en: "Provider ratings are public and updated after each delivery.",
        ar: "تقييمات المزودين عامة ومحدّثة بعد كل توصيلة.",
        tr: "Sağlayıcı puanları herkese açık ve her teslimatın ardından güncellenir.",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* ── Hero section ─────────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 overflow-hidden">
        {/* Ambient blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 start-1/4 w-96 h-96 rounded-full bg-brand-400/8 blur-3xl" />
          <div className="absolute bottom-0 end-1/4 w-80 h-80 rounded-full bg-rose-400/8 blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 mb-6">
              <TrendingUp className="w-3.5 h-3.5" />
              {T.badge}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-5 leading-tight"
          >
            {T.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
          >
            {T.subtitle}
          </motion.p>
        </div>
      </section>

      {/* ── Stat cards ───────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard
            icon={Users}
            value={15247}
            suffix="+"
            label={
              language === "ar"
                ? "عائلة تم دعمها"
                : language === "tr"
                ? "Desteklenen Aile"
                : "Families Supported"
            }
            description={
              language === "ar"
                ? "منذ إطلاق المنصة"
                : language === "tr"
                ? "Platform lansmanından bu yana"
                : "Since platform launch"
            }
            iconGradient="from-brand-500 to-brand-600"
            delay={0}
          />
          <StatCard
            icon={Store}
            value={832}
            label={
              language === "ar"
                ? "شريك محلي نشط"
                : language === "tr"
                ? "Aktif Yerel Ortak"
                : "Active Local Partners"
            }
            description={
              language === "ar"
                ? "موزعون في 12 مدينة"
                : language === "tr"
                ? "12 şehirde dağıtıcı"
                : "Distributors across 12 cities"
            }
            iconGradient="from-rose-500 to-rose-600"
            delay={0.1}
          />
          <StatCard
            icon={Clock}
            value={2.4}
            suffix={language === "ar" ? " ساعة" : language === "tr" ? " sa." : " hrs"}
            label={
              language === "ar"
                ? "متوسط وقت التسليم"
                : language === "tr"
                ? "Ortalama Teslimat Süresi"
                : "Average Delivery Time"
            }
            description={
              language === "ar"
                ? "من تأكيد الطلب إلى التسليم"
                : language === "tr"
                ? "Siparişten teslimata"
                : "From order confirmation to delivery"
            }
            iconGradient="from-amber-500 to-orange-500"
            delay={0.2}
            decimals={1}
          />
        </div>
      </section>

      {/* ── Area chart ───────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <AidGrowthChart />
      </section>

      {/* ── Testimonial ──────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
        <motion.blockquote
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl p-8 text-center"
        >
          <div className="absolute -top-4 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-rose-400 flex items-center justify-center shadow-lg">
            <Heart className="w-4 h-4 text-white fill-white" />
          </div>
          <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed italic mb-4">
            {T.testimonialQuote}
          </p>
          <footer className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            — {T.testimonialName}
          </footer>
        </motion.blockquote>
      </section>

      {/* ── Commitments ──────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-bold text-slate-800 dark:text-white text-center mb-8"
        >
          {T.commitment}
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {T.commitments.map(({ icon: Icon, en, ar, tr: trText }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur border border-slate-200/60 dark:border-slate-700/40 px-5 py-4 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {language === "ar" ? ar : language === "tr" ? trText : en}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
