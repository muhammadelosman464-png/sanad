"use client";

/**
 * /dashboard — Expat User Dashboard (Demo)
 * ─────────────────────────────────────────────────────────────────────────────
 * Demonstrates Features 2 (Order Tracking) and 4 (Referral Card)
 * with live mock data for the professor demo.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Users,
  Heart,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import OrderTrackingCard from "@/components/dashboard/OrderTrackingCard";
import ReferralCard from "@/components/dashboard/ReferralCard";
import RoundUpDonation from "@/components/checkout/RoundUpDonation";
import type { OrderStatus } from "@/components/dashboard/OrderTrackingCard";

const DEMO_ORDERS: {
  orderId: string;
  service: string;
  recipientNameEn: string;
  recipientNameAr: string;
  recipientNameTr: string;
  recipientCityEn: string;
  recipientCityAr: string;
  recipientCityTr: string;
  etaEn: string;
  etaAr: string;
  etaTr: string;
  status: OrderStatus;
  deliveryPhotoUrl?: string;
}[] = [
  {
    orderId: "SND-2026-0041",
    service: "Food Basket / سلة غذائية",
    recipientNameEn: "Fatima Al-Hassan",
    recipientNameAr: "فاطمة الحسن",
    recipientNameTr: "Fatima Al-Hassan",
    recipientCityEn: "Aleppo, Syria",
    recipientCityAr: "حلب، سوريا",
    recipientCityTr: "Halep, Suriye",
    etaEn: "Today, 3–5 PM",
    etaAr: "اليوم، 3–5 مساءً",
    etaTr: "Bugün, 15:00–17:00",
    status: "out_for_delivery",
  },
  {
    orderId: "SND-2026-0039",
    service: "Fuel & Heating / محروقات",
    recipientNameEn: "Omar Saleh",
    recipientNameAr: "عمر صالح",
    recipientNameTr: "Omar Saleh",
    recipientCityEn: "Idlib, Syria",
    recipientCityAr: "إدلب، سوريا",
    recipientCityTr: "İdlib, Suriye",
    etaEn: "Delivered on Nov 1, 2026",
    etaAr: "تم التسليم في 1 نوفمبر 2026",
    etaTr: "1 Kasım 2026'da teslim edildi",
    status: "delivered",
    deliveryPhotoUrl:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=60",
  },
];

export default function DashboardPage() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"orders" | "referral" | "donate">("orders");

  const T = {
    title:
      language === "ar"
        ? "لوحة التحكم"
        : language === "tr"
        ? "Kontrol Paneli"
        : "Dashboard",
    welcome:
      language === "ar"
        ? "مرحباً بعودتك! 👋"
        : language === "tr"
        ? "Tekrar hoş geldiniz! 👋"
        : "Welcome back! 👋",
    tabs: {
      orders:
        language === "ar" ? "طلباتي" : language === "tr" ? "Siparişlerim" : "My Orders",
      referral:
        language === "ar" ? "ادعُ صديقاً" : language === "tr" ? "Arkadaş Davet Et" : "Refer a Friend",
      donate:
        language === "ar" ? "تبرع صغير" : language === "tr" ? "Mikro Bağış" : "Micro-Donate",
    },
  };

  const tabs = [
    { id: "orders" as const, label: T.tabs.orders, icon: Package },
    { id: "referral" as const, label: T.tabs.referral, icon: Users },
    { id: "donate" as const, label: T.tabs.donate, icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* ── Page header ────────────────────────────────────────────────── */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white">{T.title}</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">{T.welcome}</p>
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 w-fit">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === id
                    ? "bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab content ────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* ORDERS */}
        {activeTab === "orders" && (
          <motion.div
            key="orders"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {DEMO_ORDERS.map((order) => (
              <OrderTrackingCard
                key={order.orderId}
                orderId={order.orderId}
                service={order.service}
                recipientName={
                  language === "ar"
                    ? order.recipientNameAr
                    : language === "tr"
                    ? order.recipientNameTr
                    : order.recipientNameEn
                }
                recipientCity={
                  language === "ar"
                    ? order.recipientCityAr
                    : language === "tr"
                    ? order.recipientCityTr
                    : order.recipientCityEn
                }
                estimatedDelivery={
                  language === "ar"
                    ? order.etaAr
                    : language === "tr"
                    ? order.etaTr
                    : order.etaEn
                }
                status={order.status}
                deliveryPhotoUrl={order.deliveryPhotoUrl}
              />
            ))}
          </motion.div>
        )}

        {/* REFERRAL */}
        {activeTab === "referral" && (
          <motion.div
            key="referral"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <ReferralCard
              userId="usr_demo_abc123"
              friendsReferred={3}
              totalEarned={15}
              pendingEarnings={10}
            />
          </motion.div>
        )}

        {/* MICRO-DONATE */}
        {activeTab === "donate" && (
          <motion.div
            key="donate"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto space-y-6"
          >
            <div className="rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                {language === "ar"
                  ? "تفاصيل الطلب"
                  : language === "tr"
                  ? "Sipariş Detayları"
                  : "Order Summary"}
              </h2>
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                <span>
                  {language === "ar"
                    ? "سلة غذائية — عائلة صالح"
                    : language === "tr"
                    ? "Gıda Kolisi — Saleh Ailesi"
                    : "Food Basket — Saleh Family"}
                </span>
                <span className="font-semibold text-slate-800 dark:text-white">$48.50</span>
              </div>
              <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
                <RoundUpDonation
                  orderTotal={48.5}
                  onChange={(donate, amount) => {
                    console.log("Donate:", donate, "Amount:", amount);
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
