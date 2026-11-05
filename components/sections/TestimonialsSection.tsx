"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Testimonial {
  id: string;
  nameAr: string;
  nameEn: string;
  nameTr: string;
  locationAr: string;
  locationEn: string;
  locationTr: string;
  textAr: string;
  textEn: string;
  textTr: string;
  service: string;
  rating: number;
  avatarInitial: string;
  avatarColor: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    nameAr: "أحمد الرشيد",
    nameEn: "Ahmed Al-Rashid",
    nameTr: "Ahmed Al-Rashid",
    locationAr: "إسطنبول، تركيا → دمشق، سوريا",
    locationEn: "Istanbul, Turkey → Damascus, Syria",
    locationTr: "İstanbul, Türkiye → Şam, Suriye",
    textAr:
      "أرسلت سلة غذاء لوالدتي في دمشق وتلقيت صوراً للتسليم خلال ساعتين. للمرة الأولى منذ سنوات أشعر أنني فعلاً أساعد عائلتي وليس مجرد وعود. منصة سَنَد غيّرت حياتنا.",
    textEn:
      "I sent a food basket to my mother in Damascus and received delivery photos within 2 hours. For the first time in years I truly felt I was helping my family — not just making promises. Sanad changed our lives.",
    textTr:
      "Şam'daki anneme gıda kolisi gönderdim ve 2 saat içinde teslimat fotoğraflarını aldım. Yıllardır ilk kez gerçekten ailemin yardım ettiğimi hissettim. Sanad hayatımızı değiştirdi.",
    service: "🧺 Food Basket",
    rating: 5,
    avatarInitial: "أ",
    avatarColor: "from-brand-500 to-brand-700",
  },
  {
    id: "t2",
    nameAr: "فاطمة يلدريم",
    nameEn: "Fatima Yıldırım",
    nameTr: "Fatima Yıldırım",
    locationAr: "دبي، الإمارات → حلب، سوريا",
    locationEn: "Dubai, UAE → Aleppo, Syria",
    locationTr: "Dubai, BAE → Halep, Suriye",
    textAr:
      "طلبت منظومة طاقة شمسية لبيت أهلي في حلب وهم يعانون من انقطاع الكهرباء. التركيب تم في أسبوع واحد مع صور كل مرحلة. الدعم من الفريق كان استثنائياً.",
    textEn:
      "I ordered a solar energy system for my family's home in Aleppo — they suffer constant power cuts. Installation was done in one week with photos of every stage. The team support was exceptional.",
    textTr:
      "Halep'teki aile evim için güneş enerjisi sistemi sipariş ettim — sürekli elektrik kesintisi yaşıyorlar. Kurulum bir haftada tamamlandı, her aşamanın fotoğrafı gönderildi. Ekip desteği mükemmeldi.",
    service: "☀️ Solar Energy",
    rating: 5,
    avatarInitial: "ف",
    avatarColor: "from-amber-500 to-orange-600",
  },
  {
    id: "t3",
    nameAr: "خالد المنصور",
    nameEn: "Khalid Al-Mansour",
    nameTr: "Khalid Al-Mansour",
    locationAr: "ألمانيا → غزة، فلسطين",
    locationEn: "Germany → Gaza, Palestine",
    locationTr: "Almanya → Gazze, Filistin",
    textAr:
      "ما كنت أتوقع أن أجد منصة تقدر توصّل لغزة في ظل الظروف الصعبة. المحروقات وصلت لعائلتي وتلقيت فيديو توثيقياً. هذا يستحق كل شيء.",
    textEn:
      "I didn't expect to find a platform that could deliver to Gaza under such difficult conditions. The fuel reached my family and I received a documentary video. This is worth everything.",
    textTr:
      "Bu zor koşullar altında Gazze'ye teslimat yapabilecek bir platform bulacağımı beklemiyordum. Yakıt aileme ulaştı ve belgesel video aldım. Bu her şeye değer.",
    service: "🔥 Fuel & Heating",
    rating: 5,
    avatarInitial: "خ",
    avatarColor: "from-emerald-500 to-teal-700",
  },
  {
    id: "t4",
    nameAr: "نور الشيخ",
    nameEn: "Nour Al-Sheikh",
    nameTr: "Nour Al-Sheikh",
    locationAr: "لندن، المملكة المتحدة → بيروت، لبنان",
    locationEn: "London, UK → Beirut, Lebanon",
    locationTr: "Londra, İngiltere → Beyrut, Lübnan",
    textAr:
      "أرسلت باقة ورد وهدايا لأمي في عيد ميلادها ولم أكن قادراً على الحضور. البكاء الذي سمعته بالهاتف حين وصلت الهدايا لا يوصف. شكراً سَنَد.",
    textEn:
      "I sent a flower bouquet and gifts to my mother on her birthday when I couldn't be there. The tears I heard over the phone when the gifts arrived are indescribable. Thank you Sanad.",
    textTr:
      "Orada olamadığımda annemin doğum günü için çiçek buketi ve hediyeler gönderdim. Hediyeler ulaştığında telefonda duyduğum ağlamaları anlatamam. Teşekkürler Sanad.",
    service: "💐 Flower Bouquet",
    rating: 5,
    avatarInitial: "ن",
    avatarColor: "from-pink-500 to-rose-700",
  },
];

export default function TestimonialsSection() {
  const { language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  const getName = (t: Testimonial) =>
    language === "ar" ? t.nameAr : language === "tr" ? t.nameTr : t.nameEn;
  const getLocation = (t: Testimonial) =>
    language === "ar"
      ? t.locationAr
      : language === "tr"
      ? t.locationTr
      : t.locationEn;
  const getText = (t: Testimonial) =>
    language === "ar" ? t.textAr : language === "tr" ? t.textTr : t.textEn;

  const prev = () =>
    setActiveIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () =>
    setActiveIndex((i) => (i + 1) % TESTIMONIALS.length);

  const active = TESTIMONIALS[activeIndex];

  return (
    <section className="py-6 sm:py-8 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-0 start-1/4 w-96 h-96 bg-rose-200/20 dark:bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 end-1/4 w-96 h-96 bg-brand-200/20 dark:bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Heading */}
        <div className="text-center mb-4 sm:mb-5">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1 block">
            {language === "ar"
              ? "قصص حقيقية من عائلات حقيقية"
              : language === "tr"
              ? "Gerçek Ailelerden Gerçek Hikayeler"
              : "Real Stories from Real Families"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {language === "ar"
              ? "لأن كل رسالة دعم تصنع فرقاً"
              : language === "tr"
              ? "Çünkü Her Destek Mesajı Fark Yaratır"
              : "Because Every Act of Support Makes a Difference"}
          </h2>
        </div>

        {/* Featured testimonial card */}
        <div className="max-w-3xl mx-auto mb-3 sm:mb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-md relative overflow-hidden"
            >
              {/* Decorative quote icon */}
              <div className="absolute top-6 end-8 text-slate-100 dark:text-slate-800">
                <Quote className="w-20 h-20" />
              </div>

              {/* Service badge */}
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 text-xs font-bold text-rose-700 dark:text-rose-300 mb-1.5">
                {active.service}
              </div>

              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-1.5">
                {Array.from({ length: active.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Quote text */}
              <p className="text-sm sm:text-base text-slate-800 dark:text-slate-100 leading-normal font-medium mb-2.5 relative z-10">
                &ldquo;{getText(active)}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div
                  className={`w-9 h-9 rounded-full bg-gradient-to-br ${active.avatarColor} flex items-center justify-center text-white font-bold text-sm shrink-0`}
                >
                  {active.avatarInitial}
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">
                    {getName(active)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {getLocation(active)}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation controls */}
          <div className="flex items-center justify-center gap-4 mt-2.5 sm:mt-3">
            <button
              onClick={prev}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-500 text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`rounded-full transition-all ${
                    i === activeIndex
                      ? "w-6 h-2.5 bg-rose-500"
                      : "w-2.5 h-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400"
                  }`}
                  aria-label={`View testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-500 text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mini thumbnail row — all 4 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
          {TESTIMONIALS.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setActiveIndex(i)}
              className={`p-2.5 rounded-xl text-start border transition-all ${
                i === activeIndex
                  ? "bg-white dark:bg-slate-900 border-rose-400/60 dark:border-rose-500/50 shadow-md"
                  : "bg-slate-100/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div
                  className={`w-7 h-7 rounded-full bg-gradient-to-br ${t.avatarColor} flex items-center justify-center text-white text-xs font-bold shrink-0`}
                >
                  {t.avatarInitial}
                </div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {getName(t)}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {t.service}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
