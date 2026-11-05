"use client";

import React from "react";
import {
  ShieldCheck,
  Camera,
  Coins,
  HandHeart,
  Globe2,
  HeadphonesIcon,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function FeaturesSection() {
  const { t, language } = useLanguage();

  const features = [
    {
      icon: ShieldCheck,
      title: t("feature1Title"),
      desc: t("feature1Desc"),
      tag: language === "ar" ? "تحقق رسمي" : language === "tr" ? "Resmi Denetim" : "Verified",
      gradient: "from-emerald-500/10 to-teal-500/10",
      accent: "text-emerald-500",
    },
    {
      icon: Camera,
      title: t("feature2Title"),
      desc: t("feature2Desc"),
      tag: language === "ar" ? "إثبات مصور" : language === "tr" ? "Fotoğraf Kanıtı" : "Photo Proof",
      gradient: "from-brand-500/10 to-cyan-500/10",
      accent: "text-brand-500",
    },
    {
      icon: Coins,
      title: t("feature3Title"),
      desc: t("feature3Desc"),
      tag: language === "ar" ? "ضمان مالي" : language === "tr" ? "Emanet Koruma" : "Escrow",
      gradient: "from-amber-500/10 to-orange-500/10",
      accent: "text-amber-500",
    },
  ];

  const howItWorks = [
    {
      step: "01",
      title:
        language === "ar"
          ? "اختر الخدمة والمنطقة"
          : language === "tr"
          ? "Hizmeti ve Bölgeyi Seçin"
          : "Choose Service & Region",
      desc:
        language === "ar"
          ? "حدد نوع الدعم الذي تريد إرساله (غذاء، وقود، طبي...) وعنوان عائلتك."
          : language === "tr"
          ? "Göndermek istediğiniz destek türünü (gıda, yakıt, sağlık…) ve ailenizin adresini belirleyin."
          : "Select the type of support (food, fuel, medical…) and your family's location.",
    },
    {
      step: "02",
      title:
        language === "ar"
          ? "ادفع بأمان عبر الضمان"
          : language === "tr"
          ? "Emanet ile Güvenle Ödeyin"
          : "Pay Securely via Escrow",
      desc:
        language === "ar"
          ? "أموالك تُحفظ في حساب ضمان. لا يستلمها المزود إلا بعد تأكيد التوصيل."
          : language === "tr"
          ? "Paranız emanet hesabında tutulur. Teslimat onaylanana kadar sağlayıcıya aktarılmaz."
          : "Your payment is held in escrow. The provider is only paid after delivery confirmation.",
    },
    {
      step: "03",
      title:
        language === "ar"
          ? "تابع التسليم بالصور"
          : language === "tr"
          ? "Fotoğraflı Teslimatı Takip Edin"
          : "Track Photo-Verified Delivery",
      desc:
        language === "ar"
          ? "تصلك صور ومقاطع فيديو توثق تسليم الدعم لعائلتك. راحة بال كاملة."
          : language === "tr"
          ? "Ailenize yapılan teslimatı belgeleyen fotoğraf ve videolar alırsınız. Tam gönül rahatlığı."
          : "Receive photos and videos documenting the delivery to your family. Complete peace of mind.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-10 sm:py-14 bg-white dark:bg-slate-900 relative border-t border-slate-200 dark:border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-2 block">
            {language === "ar"
              ? "لماذا سَنَد؟"
              : language === "tr"
              ? "Neden Sanad?"
              : "Why Sanad?"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
            {t("featuresHeading")}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            {t("featuresSubheading")}
          </p>
        </div>

        {/* 3 Core pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-10 sm:mb-12">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="group relative p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-brand-500/40 dark:hover:border-brand-500/40 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 overflow-hidden"
              >
                <div
                  className={`absolute -right-12 -top-12 w-36 h-36 bg-gradient-to-br ${feat.gradient} rounded-full blur-2xl group-hover:scale-125 transition-transform`}
                />

                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 ${feat.accent}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {feat.tag}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {feat.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* How It Works — 3 steps */}
        <div
          id="trust"
          className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 text-center mb-6">
            <span className="text-xs uppercase font-bold tracking-widest text-rose-400 mb-2 block">
              {language === "ar"
                ? "كيف تعمل المنصة"
                : language === "tr"
                ? "Nasıl Çalışır"
                : "How It Works"}
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold">
              {language === "ar"
                ? "3 خطوات بسيطة لدعم عائلتك"
                : language === "tr"
                ? "Ailenizi Desteklemek İçin 3 Basit Adım"
                : "3 Simple Steps to Support Your Family"}
            </h3>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {howItWorks.map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 font-black text-lg mb-4">
                  {item.step}
                </div>
                <h4 className="text-base sm:text-lg font-bold text-white mb-2">
                  {item.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
