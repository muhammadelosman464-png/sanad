"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, Heart, Home, LayoutDashboard, Share2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function CheckoutSuccessClient() {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const T = {
    title:
      language === "ar"
        ? "تم إرسال دعمك بنجاح! 💚"
        : language === "tr"
        ? "Desteginiz basariyla gonderildi! 💚"
        : "Your support was sent! 💚",
    subtitle:
      language === "ar"
        ? "شكراً لك من أعماق قلوبنا. دعمك يصنع فارقاً حقيقياً في حياة عائلة تحتاجه."
        : language === "tr"
        ? "Yureklerimizin derinliklerinden tesekkur ederiz. Desteginiz ihtiyac duyan bir ailenin hayatinda gercek bir fark yaratıyor."
        : "Thank you from the bottom of our hearts. Your support makes a real difference in a family's life.",
    orderRef:
      language === "ar"
        ? "رقم الطلب"
        : language === "tr"
        ? "Siparis No"
        : "Order Reference",
    eta:
      language === "ar"
        ? "التسليم المتوقع: خلال 2–4 ساعات"
        : language === "tr"
        ? "Tahmini Teslimat: 2–4 saat icinde"
        : "Estimated delivery: within 2–4 hours",
    proofNote:
      language === "ar"
        ? "ستتلقى صورة إثبات التسليم عبر البريد الإلكتروني فور وصول الطلب."
        : language === "tr"
        ? "Siparis ulasmaz ulasir teslimat fotografi e-postayla gonderilecektir."
        : "You'll receive a delivery proof photo by email once the order arrives.",
    backHome:
      language === "ar" ? "العودة للرئيسية" : language === "tr" ? "Ana Sayfaya Don" : "Back to Home",
    myOrders:
      language === "ar" ? "طلباتي" : language === "tr" ? "Siparislerim" : "My Orders",
    shareMsg:
      language === "ar"
        ? "شارك سَنَد مع أصدقائك"
        : language === "tr"
        ? "Sanad'i arkadaslarinla paylas"
        : "Share Sanad with friends",
    impact:
      language === "ar"
        ? "منذ انضمامك — ساهمت في دعم عائلة بأكملها."
        : language === "tr"
        ? "Katildiginizdan beri — tam bir ailenin desteklenmesine katki sagladiniz."
        : "Since joining — you've contributed to supporting a full family.",
  };

  /* Generate a random order ref for demo */
  const orderRef = mounted
    ? `SND-${Date.now().toString(36).toUpperCase().slice(-6)}`
    : "SND-XXXXXX";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 py-16">
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full bg-emerald-300/20 dark:bg-emerald-500/8 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-brand-300/15 dark:bg-brand-500/8 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="relative z-10 w-full max-w-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-emerald-100 dark:border-emerald-800/30 rounded-3xl shadow-2xl shadow-emerald-500/10 overflow-hidden"
      >
        {/* Top success strip */}
        <div className="h-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-brand-500" />

        <div className="px-6 sm:px-10 py-10 flex flex-col items-center text-center gap-6">
          {/* Animated checkmark */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ delay: 0.2, type: "spring", stiffness: 260 }}
            className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center"
          >
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </motion.div>

          {/* Title */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
              {T.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
              {T.subtitle}
            </p>
          </div>

          {/* Order ref card */}
          <div className="w-full rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-5 py-4 flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">{T.orderRef}</span>
              <span className="font-black font-mono text-slate-800 dark:text-white">{orderRef}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium border-t border-slate-200 dark:border-slate-700 pt-2">
              <Heart className="w-3.5 h-3.5 fill-emerald-400 text-emerald-500" />
              <span>{T.eta}</span>
            </div>
          </div>

          {/* Proof note */}
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {T.proofNote}
          </p>

          {/* Impact stat */}
          <div className="w-full rounded-2xl bg-gradient-to-r from-brand-50 to-rose-50 dark:from-brand-900/20 dark:to-rose-900/20 border border-brand-100 dark:border-brand-800/30 px-5 py-3">
            <p className="text-xs text-brand-700 dark:text-brand-300 font-medium">{T.impact}</p>
          </div>

          {/* CTAs */}
          <div className="w-full flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              <Home className="w-4 h-4" />
              {T.backHome}
            </Link>
            <Link
              href="/dashboard"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-semibold text-sm shadow-md shadow-brand-500/20 transition"
            >
              <LayoutDashboard className="w-4 h-4" />
              {T.myOrders}
            </Link>
          </div>

          {/* Share */}
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: "Sanad", url: "https://sanad.app" });
              }
            }}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-brand-500 transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            {T.shareMsg}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
