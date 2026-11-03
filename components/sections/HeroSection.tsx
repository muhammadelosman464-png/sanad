"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, HandHeart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import RequestAssistanceModal, { AssistanceRequest } from "@/components/modals/RequestAssistanceModal";

const SEED_REQUESTS: AssistanceRequest[] = [
  { id: "seed-1", message: "عائلة محتاجة تطلب مساعدة طبية", amount: 100 },
  { id: "seed-2", message: "أم لثلاثة أطفال تطلب مواد غذائية", amount: 60 },
  { id: "seed-3", message: "طالب جامعي يطلب دعماً للإيجار", amount: 150 },
  { id: "seed-4", message: "أسرة نازحة تطلب تدفئة لفصل الشتاء", amount: 70 },
];

export default function HeroSection() {
  const { language } = useLanguage();
  const [requests, setRequests] = useState<AssistanceRequest[]>(SEED_REQUESTS);
  const [modalOpen, setModalOpen] = useState(false);

  const text = {
    subtitle: language === "ar" ? "سَندك في الغربة" : language === "tr" ? "Gurbetteki güvenceniz" : "Your support abroad",
    heading:
      language === "ar"
        ? "ابدأ بدعم عائلتك واطلب المساعدة"
        : language === "tr"
        ? "Ailenizi destekleyin ve yardım isteyin"
        : "Start supporting your family and ask for help",
    sendSupport: language === "ar" ? "أرسل الدعم" : language === "tr" ? "Destek gönder" : "Send support",
    requestAssistance: language === "ar" ? "طلب مساعدة" : language === "tr" ? "Yardım talep et" : "Request assistance",
    tickerLabel: language === "ar" ? "طلبات حديثة" : language === "tr" ? "Son talepler" : "Latest requests",
    supportNow: language === "ar" ? "ساهم الآن" : language === "tr" ? "Şimdi destek ol" : "Support now",
  };

  const addRequest = (request: AssistanceRequest) => {
    setRequests((current) => [request, ...current]);
  };

  return (
    <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-5">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-full [perspective:1200px]">
        <div className="absolute inset-x-6 sm:inset-x-16 top-4 h-[85%] rounded-[40px] border border-[#ffd700]/20 bg-gradient-to-br from-[#ffd700]/10 via-transparent to-transparent [transform:rotateX(10deg)_rotateY(-6deg)] [transform-origin:top_center]" />
      </div>
      <div className="pointer-events-none absolute -top-24 start-1/4 h-64 w-64 rounded-full bg-brand-400/20 blur-3xl" />
      <div className="relative max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
          <p className="text-xs sm:text-sm font-medium tracking-wide text-brand-700 dark:text-brand-300 mb-2">{text.subtitle}</p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-[1.2] text-slate-900 dark:text-white mb-4">
            {text.heading}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="#services"
              className="inline-flex items-center gap-2 rounded-full bg-brand-700 hover:bg-brand-800 text-white text-sm font-semibold px-5 py-2.5 shadow-lg shadow-brand-700/25 transition-all hover:scale-[1.03] active:scale-[0.98]"
            >
              {text.sendSupport}
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </a>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-brand-300 dark:border-brand-700 bg-white/70 dark:bg-slate-900/60 text-brand-800 dark:text-brand-200 text-sm font-semibold px-5 py-2.5 backdrop-blur hover:bg-white dark:hover:bg-slate-900 transition-all hover:scale-[1.03] active:scale-[0.98]"
            >
              <HandHeart className="w-4 h-4" />
              {text.requestAssistance}
            </button>
          </div>
        </motion.div>

        <div className="mt-5 flex items-center gap-3 overflow-hidden rounded-full border border-white/70 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-md py-2 ps-4">
          <span className="shrink-0 rounded-full bg-brand-700 px-3 py-1 text-xs font-bold text-white">{text.tickerLabel}</span>
          <div className="relative flex-1 overflow-hidden">
            <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
              {[...requests, ...requests].map((request, index) => (
                <span key={`${request.id}-${index}`} className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                  <span className="font-medium">{request.message}</span>
                  <span className="rounded-md bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 text-xs font-bold text-amber-800 dark:text-amber-300 tabular-nums">
                    ${request.amount}
                  </span>
                  <span className="text-xs font-semibold text-brand-700 dark:text-brand-300">{text.supportNow}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <RequestAssistanceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={addRequest}
      />
    </section>
  );
}
