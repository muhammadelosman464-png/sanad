"use client";

/**
 * ServicesGrid — v3
 * ---------------------------------------------------------------------------
 * Update 4: 13 total service cards (7 original + 6 new humanitarian).
 * Update 1: 1-col mobile / 2-col tablet / 3 or 4-col desktop grid.
 * All cards open ServiceDetailsModal on click.
 * ---------------------------------------------------------------------------
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBasket,
  Flame,
  Sun,
  Stethoscope,
  Gift,
  Flower2,
  UtensilsCrossed,
  ArrowRight,
  ArrowLeft,
  Heart,
  Users,
  AlertTriangle,
  GraduationCap,
  HelpCircle,
  Snowflake,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import ServiceDetailsModal from "@/components/modals/ServiceDetailsModal";

interface ServicesGridProps {
  /** Live search term from HeroSection — filters visible cards instantly */
  searchTerm?: string;
}

export default function ServicesGrid({ searchTerm = "" }: ServicesGridProps) {
  const { t, language, direction } = useLanguage();
  const ArrowIcon = direction === "rtl" ? ArrowLeft : ArrowRight;
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);

  const services = [
    /* ── New 6 pinned first (Update 4) ── */
    {
      id: "direct_support",
      icon: Heart,
      titleEn: "Send Direct Support",
      titleAr: "أرسل مساعدة لداخل سوريا",
      titleTr: "Dogrudan Destek Gonder",
      descEn: "Send money directly to a verified family inside Syria.",
      descAr: "أرسل مساعدة مالية مباشرة لعائلة موثّقة داخل سوريا.",
      descTr: "Suriye'deki dogrulanmis bir aileye dogrudan para gonderin.",
      gradient: "from-rose-500/15 to-pink-400/10",
      iconBg: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
      border: "hover:border-rose-400/50 dark:hover:border-rose-500/40",
      emoji: "💸",
      priceBadge: "From $20",
    },
    {
      id: "sponsorship",
      icon: Users,
      titleEn: "Monthly Family Sponsorship",
      titleAr: "اكفل عائلة شهرياً",
      titleTr: "Aylik Aile Sponsorlugu",
      descEn: "Commit to monthly support for a family in need.",
      descAr: "تعهّد بدعم شهري مستمر لعائلة محتاجة.",
      descTr: "Ihtiyac sahibi bir aileye aylik taahhut verin.",
      gradient: "from-teal-500/15 to-cyan-400/10",
      iconBg: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
      border: "hover:border-teal-400/50 dark:hover:border-teal-500/40",
      emoji: "🤝",
      priceBadge: "From $80/mo",
    },
    {
      id: "urgent_medical",
      icon: AlertTriangle,
      titleEn: "Urgent Medical Cases",
      titleAr: "حالات إنسانية وطبية عاجلة",
      titleTr: "Acil Tibbi Vakalar",
      descEn: "Fund urgent surgeries, hospitalizations, or medications.",
      descAr: "موّل عمليات جراحية أو دخولاً للمستشفى أو أدوية حيوية.",
      descTr: "Acil ameliyat, hastaneye yatis veya ilac fonlayin.",
      gradient: "from-red-600/15 to-orange-500/10",
      iconBg: "bg-red-600/10 text-red-600 dark:text-red-400",
      border: "hover:border-red-500/50 dark:hover:border-red-600/40",
      emoji: "🚑",
      priceBadge: "Any amount",
    },
    {
      id: "student_support",
      icon: GraduationCap,
      titleEn: "University Student Support",
      titleAr: "مساعدة طالب جامعي",
      titleTr: "Universite Ogrencisi Destegi",
      descEn: "Help a student afford tuition or daily transport.",
      descAr: "ساعد طالباً على دفع قسط دراسي أو تأمين مواصلاته.",
      descTr: "Ogrencinin taksitini veya ulasimini karsilamasina yardim edin.",
      gradient: "from-indigo-500/15 to-violet-400/10",
      iconBg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
      border: "hover:border-indigo-400/50 dark:hover:border-indigo-500/40",
      emoji: "🎓",
      priceBadge: "From $40",
    },
    {
      id: "request_help",
      icon: HelpCircle,
      titleEn: "Request Help",
      titleAr: "اطلب مساعدة",
      titleTr: "Yardim Talep Et",
      descEn: "Are you in need? Submit a request — our team responds in 24 hrs.",
      descAr: "هل أنت بحاجة؟ قدّم طلباً — فريقنا يرد خلال 24 ساعة.",
      descTr: "Ihtiyaciniz mi var? Talep gonderin — 24 saat icinde yanitlanir.",
      gradient: "from-slate-500/12 to-slate-400/8",
      iconBg: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
      border: "hover:border-slate-400/50 dark:hover:border-slate-500/40",
      emoji: "🙋",
      priceBadge: "Free",
    },
    {
      id: "heating",
      icon: Snowflake,
      titleEn: "Heating & Winter Needs",
      titleAr: "كسوة وتدفئة الشتاء",
      titleTr: "Kis Giysileri ve Isitma",
      descEn: "Warm clothes, blankets, and fuel for vulnerable families.",
      descAr: "ملابس دافئة وبطانيات ووقود للعائلات الأكثر هشاشة.",
      descTr: "Savunmasiz aileler icin kiyafet, battaniye ve yakit.",
      gradient: "from-sky-500/15 to-blue-400/10",
      iconBg: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
      border: "hover:border-sky-400/50 dark:hover:border-sky-500/40",
      emoji: "❄️",
      priceBadge: "From $70",
    },
    /* ── Original 7 ── */
    {
      id: "food",
      icon: ShoppingBasket,
      titleEn: "Food Basket",
      titleAr: "سلة غذائية",
      titleTr: "Gida Kolisi",
      descEn: t("svcFoodDesc"),
      descAr: t("svcFoodDesc"),
      descTr: t("svcFoodDesc"),
      gradient: "from-amber-500/15 to-orange-400/10",
      iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      border: "hover:border-amber-400/50 dark:hover:border-amber-500/40",
      emoji: "🧺",
      priceBadge: "$45",
    },
    {
      id: "fuel",
      icon: Flame,
      titleEn: "Fuel & Heating",
      titleAr: "محروقات وتدفئة",
      titleTr: "Yakit ve Isinma",
      descEn: t("svcFuelDesc"),
      descAr: t("svcFuelDesc"),
      descTr: t("svcFuelDesc"),
      gradient: "from-red-500/12 to-orange-500/8",
      iconBg: "bg-red-500/10 text-red-600 dark:text-red-400",
      border: "hover:border-red-400/50 dark:hover:border-red-500/40",
      emoji: "🔥",
      priceBadge: "$60",
    },
    {
      id: "solar",
      icon: Sun,
      titleEn: "Solar Energy",
      titleAr: "منظومة طاقة شمسية",
      titleTr: "Gunes Enerjisi",
      descEn: t("svcSolarDesc"),
      descAr: t("svcSolarDesc"),
      descTr: t("svcSolarDesc"),
      gradient: "from-yellow-400/15 to-amber-300/10",
      iconBg: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
      border: "hover:border-yellow-400/50 dark:hover:border-yellow-500/40",
      emoji: "☀️",
      priceBadge: "$350",
    },
    {
      id: "health",
      icon: Stethoscope,
      titleEn: "Health & Medical",
      titleAr: "خدمات صحية وطبية",
      titleTr: "Saglik Hizmetleri",
      descEn: t("svcHealthDesc"),
      descAr: t("svcHealthDesc"),
      descTr: t("svcHealthDesc"),
      gradient: "from-emerald-500/12 to-teal-400/8",
      iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      border: "hover:border-emerald-400/50 dark:hover:border-emerald-500/40",
      emoji: "🏥",
      priceBadge: "$55",
    },
    {
      id: "gifts",
      icon: Gift,
      titleEn: "Gifts & Perfumes",
      titleAr: "هدايا وعطورات",
      titleTr: "Hediyeler ve Parfumler",
      descEn: t("svcGiftsDesc"),
      descAr: t("svcGiftsDesc"),
      descTr: t("svcGiftsDesc"),
      gradient: "from-purple-500/12 to-pink-400/8",
      iconBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
      border: "hover:border-purple-400/50 dark:hover:border-purple-500/40",
      emoji: "🎁",
      priceBadge: "$75",
    },
    {
      id: "flowers",
      icon: Flower2,
      titleEn: "Flower Bouquets",
      titleAr: "باقات ورد",
      titleTr: "Cicek Buketleri",
      descEn: t("svcFlowersDesc"),
      descAr: t("svcFlowersDesc"),
      descTr: t("svcFlowersDesc"),
      gradient: "from-pink-500/12 to-rose-400/8",
      iconBg: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
      border: "hover:border-pink-400/50 dark:hover:border-pink-500/40",
      emoji: "🌹",
      priceBadge: "$35",
    },
    {
      id: "meals",
      icon: UtensilsCrossed,
      titleEn: "Restaurant Meals",
      titleAr: "وجبات طعام ومطاعم",
      titleTr: "Restoran Yemekleri",
      descEn: t("svcMealsDesc"),
      descAr: t("svcMealsDesc"),
      descTr: t("svcMealsDesc"),
      gradient: "from-brand-500/12 to-sky-400/8",
      iconBg: "bg-brand-500/10 text-brand-600 dark:text-brand-400",
      border: "hover:border-brand-400/50 dark:hover:border-brand-500/40",
      emoji: "🍽️",
      priceBadge: "$28",
    },
  ];

  return (
    <>
      <section
        id="services"
        className="py-16 md:py-24 bg-transparent relative border-t border-white/5"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-96 bg-gradient-to-b from-rose-600/8 to-transparent dark:from-rose-500/6 dark:to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section heading */}
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2 block">
              {language === "ar" ? "خدماتنا الإنسانية واليومية" : language === "tr" ? "Insani Hizmetlerimiz" : "Humanitarian & Daily-Life Services"}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3 md:mb-4">
              {t("servicesHeading")}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-slate-400">
              {t("servicesSubheading")}
            </p>
            <p className="text-xs text-slate-500 mt-2">
              {language === "ar" ? "👆 اضغط على أي خدمة للتفاصيل والطلب" : language === "tr" ? "👆 Detaylar icin herhangi bir hizmete tıklayın" : "👆 Tap any card to see details & order"}
            </p>
          </div>

          {/* Filter services by searchTerm — matches EN/AR/TR title and description */}
          {(() => {
            const q = searchTerm.trim();
            const filteredServices = q
              ? services.filter((s) => {
                  const qLower = q.toLowerCase();
                  return (
                    s.titleEn.toLowerCase().includes(qLower) ||
                    s.titleAr.includes(q) ||
                    s.titleTr.toLowerCase().includes(qLower) ||
                    s.descEn.toLowerCase().includes(qLower) ||
                    s.descAr.includes(q) ||
                    s.descTr.toLowerCase().includes(qLower)
                  );
                })
              : services;

            return filteredServices.length === 0 ? (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <span className="text-5xl mb-4">🔍</span>
                <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === "ar"
                    ? "لم يتم العثور على خدمة"
                    : language === "tr"
                    ? "Hizmet bulunamadı"
                    : "No services found"}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {language === "ar"
                    ? `لا توجد نتائج لـ "${searchTerm}"`
                    : language === "tr"
                    ? `"${searchTerm}" için sonuç bulunamadı`
                    : `No results for "${searchTerm}"`}
                </p>
              </div>
            ) : (
              /* Grid: 1 col mobile → 2 col sm → 3 col lg (max) */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((svc, idx) => {
                  const Icon = svc.icon;
                  const cardTitle =
                    language === "ar" ? svc.titleAr : language === "tr" ? svc.titleTr : svc.titleEn;
                  const cardDesc =
                    language === "ar" ? svc.descAr : language === "tr" ? svc.descTr : svc.descEn;

                  return (
                    <motion.button
                      key={svc.id}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: Math.min(idx * 0.06, 0.5) }}
                      viewport={{ once: true, margin: "-40px" }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setActiveServiceId(svc.id)}
                      className={`group relative p-6 rounded-3xl bg-slate-900/80 dark:bg-slate-900/90 backdrop-blur-xl border border-white/8 hover:border-blue-500/50 transition-all duration-300 shadow-lg hover:-translate-y-3 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] cursor-pointer overflow-hidden text-start w-full flex flex-col items-center`}
                    >
                      {/* Card gradient wash on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-b ${svc.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`} />
                      {/* Glow bloom top-center */}
                      <div className={`absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-gradient-to-br ${svc.gradient} rounded-full blur-3xl opacity-0 group-hover:opacity-70 transition-opacity duration-500`} />
                      {/* Emoji watermark bottom-right */}
                      <div className="absolute end-3 bottom-3 text-5xl opacity-[0.04] select-none pointer-events-none">{svc.emoji}</div>
                      {/* Price badge */}
                      <div className="absolute top-4 end-4 bg-black/40 dark:bg-black/60 backdrop-blur rounded-full px-2.5 py-1 text-[10px] font-bold text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity border border-white/10">
                        {svc.priceBadge}
                      </div>

                      <div className="relative z-10 flex flex-col items-center text-center w-full">
                        {/* Icon — large glowing circle, centered at top of card */}
                        <div className={`relative w-20 h-20 rounded-full ${svc.iconBg} flex items-center justify-center mb-5 shadow-xl transition-all duration-300 group-hover:scale-110`}>
                          {/* Pulsing glow ring */}
                          <div className={`absolute inset-0 rounded-full ${svc.iconBg} opacity-50 blur-lg scale-110 group-hover:scale-150 group-hover:opacity-70 transition-all duration-500`} />
                          <Icon className="w-10 h-10 relative z-10" />
                        </div>
                        <h3 className="text-base md:text-lg font-bold text-white mb-2 leading-tight">
                          {cardTitle}
                        </h3>
                        <p className="text-xs md:text-sm text-slate-400 group-hover:text-slate-300 leading-relaxed mb-4 line-clamp-2 transition-colors">
                          {cardDesc}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-400 group-hover:text-brand-300 group-hover:gap-2.5 transition-all">
                          <span>{language === "ar" ? "اطلب الآن" : language === "tr" ? "Siparis Ver" : "Order Now"}</span>
                          <ArrowIcon className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </section>

      <ServiceDetailsModal
        serviceId={activeServiceId}
        onClose={() => setActiveServiceId(null)}
      />
    </>
  );
}
