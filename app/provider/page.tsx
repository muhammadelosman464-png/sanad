"use client";

/**
 * /provider — Provider Dashboard (Demo)
 * ─────────────────────────────────────────────────────────────────────────────
 * Demonstrates Feature 6 (Proof of Delivery Upload) for the local provider.
 * Mobile-first, large touch targets, humanitarian palette.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React from "react";
import { motion } from "framer-motion";
import { Truck, Star } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import DeliveryUploadCard from "@/components/provider/DeliveryUploadCard";

const DEMO_PENDING_ORDERS = [
  {
    orderId: "SND-2026-0042",
    summaryEn: "Food Basket × 1 — Fatima Al-Hassan, Aleppo",
    summaryAr: "سلة غذائية × 1 — فاطمة الحسن، حلب",
    summaryTr: "Gıda Kolisi × 1 — Fatima Al-Hassan, Halep",
  },
  {
    orderId: "SND-2026-0043",
    summaryEn: "Flower Bouquet × 1 — Sarah Mohammed, Latakia",
    summaryAr: "باقة ورد × 1 — سارة محمد، اللاذقية",
    summaryTr: "Çiçek Buketi × 1 — Sarah Mohammed, Lazkiye",
  },
];

export default function ProviderPage() {
  const { language } = useLanguage();

  const T = {
    title:
      language === "ar"
        ? "لوحة المزود"
        : language === "tr"
        ? "Sağlayıcı Paneli"
        : "Provider Dashboard",
    pendingTitle:
      language === "ar"
        ? "الطلبات المعلّقة"
        : language === "tr"
        ? "Bekleyen Siparişler"
        : "Pending Deliveries",
    ratingLabel:
      language === "ar"
        ? "تقييمك الحالي"
        : language === "tr"
        ? "Mevcut Puanınız"
        : "Your Current Rating",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-700 dark:to-slate-600">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white">{T.title}</h1>
              <p className="text-slate-300 text-sm">
                {language === "ar"
                  ? "المزود: أبو ياسر الحلبي"
                  : language === "tr"
                  ? "Sağlayıcı: Abu Yasir el-Halabi"
                  : "Provider: Abu Yasir Al-Halabi"}
              </p>
            </div>
          </div>

          {/* Rating badge */}
          <div className="text-end">
            <p className="text-xs text-slate-400 mb-1">{T.ratingLabel}</p>
            <div className="flex items-center gap-1 justify-end">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${
                    s <= 4
                      ? "text-amber-400 fill-amber-400"
                      : "text-slate-500"
                  }`}
                />
              ))}
              <span className="text-white font-bold text-sm ms-1">4.8</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Pending deliveries ─────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg font-bold text-slate-800 dark:text-white mb-8"
        >
          {T.pendingTitle} ({DEMO_PENDING_ORDERS.length})
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {DEMO_PENDING_ORDERS.map((order, i) => (
            <motion.div
              key={order.orderId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <DeliveryUploadCard
                orderId={order.orderId}
                orderSummary={
                  language === "ar"
                    ? order.summaryAr
                    : language === "tr"
                    ? order.summaryTr
                    : order.summaryEn
                }
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
