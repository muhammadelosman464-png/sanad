"use client";

/**
 * OrderTrackingCard
 * ─────────────────────────────────────────────────────────────────────────────
 * UberEats-level horizontal step-tracker for a Sanad delivery order.
 *
 * Steps: Pending → Preparing → Out for Delivery → Delivered
 *
 * When status === "delivered":
 *   • A "Proof of Delivery" panel reveals with a blurred photo that unblurs on
 *     click and a download button.
 *
 * Design: glass-morphism card, soft rose/brand palette, RTL-safe logical props.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  ChefHat,
  Truck,
  CheckCircle2,
  Package,
  Eye,
  Download,
  MapPin,
  Calendar,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type OrderStatus =
  | "pending"
  | "preparing"
  | "out_for_delivery"
  | "delivered";

export interface OrderTrackingCardProps {
  orderId: string;
  service: string;
  recipientName: string;
  recipientCity: string;
  estimatedDelivery: string; // e.g. "Today, 3–5 PM"
  status: OrderStatus;
  deliveryPhotoUrl?: string; // shown only when delivered
}

/* ─── Step config ─────────────────────────────────────────────────────────── */

interface Step {
  key: OrderStatus;
  labelEn: string;
  labelAr: string;
  labelTr: string;
  icon: React.ElementType;
}

const STEPS: Step[] = [
  {
    key: "pending",
    labelEn: "Order Placed",
    labelAr: "تم الطلب",
    labelTr: "Sipariş Alındı",
    icon: Clock,
  },
  {
    key: "preparing",
    labelEn: "Preparing",
    labelAr: "جارٍ التجهيز",
    labelTr: "Hazırlanıyor",
    icon: ChefHat,
  },
  {
    key: "out_for_delivery",
    labelEn: "Out for Delivery",
    labelAr: "في طريق التسليم",
    labelTr: "Yolda",
    icon: Truck,
  },
  {
    key: "delivered",
    labelEn: "Delivered ✓",
    labelAr: "تم التسليم ✓",
    labelTr: "Teslim Edildi ✓",
    icon: CheckCircle2,
  },
];

const STATUS_INDEX: Record<OrderStatus, number> = {
  pending: 0,
  preparing: 1,
  out_for_delivery: 2,
  delivered: 3,
};

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function OrderTrackingCard({
  orderId,
  service,
  recipientName,
  recipientCity,
  estimatedDelivery,
  status,
  deliveryPhotoUrl,
}: OrderTrackingCardProps) {
  const { language } = useLanguage();
  const activeIndex = STATUS_INDEX[status];
  const [photoRevealed, setPhotoRevealed] = useState(false);
  const isDelivered = status === "delivered";

  /** Return step label in the current UI language */
  const stepLabel = (step: Step) => {
    if (language === "ar") return step.labelAr;
    if (language === "tr") return step.labelTr;
    return step.labelEn;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-brand-500/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60"
    >
      {/* ── Header strip ────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-500 px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Package className="w-5 h-5 text-white/80 shrink-0" />
          <div>
            <p className="text-xs text-brand-100 font-medium uppercase tracking-wider">
              {language === "ar"
                ? "رقم الطلب"
                : language === "tr"
                ? "Sipariş No"
                : "Order ID"}
            </p>
            <p className="text-white font-bold text-sm font-mono">{orderId}</p>
          </div>
        </div>
        <div className="text-end">
          <p className="text-xs text-brand-100 font-medium uppercase tracking-wider">
            {language === "ar"
              ? "الخدمة"
              : language === "tr"
              ? "Hizmet"
              : "Service"}
          </p>
          <p className="text-white font-semibold text-sm">{service}</p>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div className="p-6 space-y-8">
        {/* Recipient & ETA info row */}
        <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>
              {recipientName} — {recipientCity}
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-brand-400" />
            <span>{estimatedDelivery}</span>
          </span>
        </div>

        {/* ── Step Tracker ──────────────────────────────────────────────── */}
        <div className="relative">
          {/* Connecting line — sits behind the dots */}
          <div className="absolute top-5 start-[calc(12.5%)] end-[calc(12.5%)] h-0.5 bg-slate-200 dark:bg-slate-700 z-0" />

          {/* Filled progress line */}
          <motion.div
            className="absolute top-5 start-[calc(12.5%)] h-0.5 bg-gradient-to-r from-brand-500 to-rose-400 z-0 origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: activeIndex / (STEPS.length - 1) }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{ width: "75%" }}
          />

          {/* Steps row */}
          <div className="relative z-10 grid grid-cols-4 gap-2">
            {STEPS.map((step, idx) => {
              const isCompleted = idx <= activeIndex;
              const isActive = idx === activeIndex;
              const Icon = step.icon;

              return (
                <div
                  key={step.key}
                  className="flex flex-col items-center gap-2"
                >
                  {/* Dot / icon */}
                  <motion.div
                    initial={false}
                    animate={
                      isActive
                        ? { scale: [1, 1.15, 1], transition: { repeat: Infinity, duration: 2 } }
                        : { scale: 1 }
                    }
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 shadow-sm",
                      isCompleted
                        ? "bg-gradient-to-br from-brand-500 to-brand-600 border-brand-500 text-white shadow-brand-400/30 shadow-md"
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.div>

                  {/* Label */}
                  <span
                    className={cn(
                      "text-xs text-center font-medium leading-tight transition-colors",
                      isCompleted
                        ? "text-brand-600 dark:text-brand-400"
                        : "text-slate-400 dark:text-slate-600"
                    )}
                  >
                    {stepLabel(step)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Active status message ─────────────────────────────────────── */}
        <motion.div
          key={status}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800/40 px-5 py-4"
        >
          <p className="text-sm text-brand-700 dark:text-brand-300 font-medium text-center">
            {status === "pending" &&
              (language === "ar"
                ? "✅ تم استلام طلبك. سيبدأ المزود المحلي في التجهيز قريباً."
                : language === "tr"
                ? "✅ Siparişiniz alındı. Yerel sağlayıcı kısa süre içinde hazırlamaya başlayacak."
                : "✅ Order received. Your local provider will begin preparing shortly.")}
            {status === "preparing" &&
              (language === "ar"
                ? "👐 المزود يجهّز طلبك الآن بعناية واهتمام."
                : language === "tr"
                ? "👐 Sağlayıcınız siparişinizi özenle hazırlıyor."
                : "👐 Your provider is carefully preparing your order right now.")}
            {status === "out_for_delivery" &&
              (language === "ar"
                ? "🚗 طلبك في الطريق! سيصل خلال الفترة المتوقعة."
                : language === "tr"
                ? "🚗 Siparişiniz yolda! Tahmini süre içinde ulaşacak."
                : "🚗 Your order is on its way! Estimated to arrive in the given window.")}
            {status === "delivered" &&
              (language === "ar"
                ? "🎉 تم التسليم بنجاح! عائلتك الآن تستمتع بدعمك."
                : language === "tr"
                ? "🎉 Başarıyla teslim edildi! Aileniz artık desteğinizin keyfini çıkarıyor."
                : "🎉 Successfully delivered! Your family is now enjoying your support.")}
          </p>
        </motion.div>

        {/* ── Proof of Delivery (only when delivered) ───────────────────── */}
        <AnimatePresence>
          {isDelivered && (
            <motion.div
              key="pod"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/40 overflow-hidden bg-emerald-50/50 dark:bg-emerald-900/10">
                {/* Section header */}
                <div className="flex items-center justify-between px-5 py-3 bg-emerald-100/60 dark:bg-emerald-900/20 border-b border-emerald-200 dark:border-emerald-800/40">
                  <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    {language === "ar"
                      ? "إثبات التسليم"
                      : language === "tr"
                      ? "Teslimat Kanıtı"
                      : "Proof of Delivery"}
                  </span>
                  {deliveryPhotoUrl && (
                    <a
                      href={deliveryPhotoUrl}
                      download
                      className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      <Download className="w-3.5 h-3.5" />
                      {language === "ar"
                        ? "تحميل"
                        : language === "tr"
                        ? "İndir"
                        : "Download"}
                    </a>
                  )}
                </div>

                {/* Photo reveal */}
                <div className="p-4">
                  {deliveryPhotoUrl ? (
                    <div className="relative rounded-xl overflow-hidden cursor-pointer group">
                      <img
                        src={deliveryPhotoUrl}
                        alt="Proof of delivery"
                        className={cn(
                          "w-full h-48 object-cover transition-all duration-700",
                          photoRevealed ? "blur-0" : "blur-lg scale-105"
                        )}
                      />
                      {!photoRevealed && (
                        <button
                          onClick={() => setPhotoRevealed(true)}
                          className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/20 text-white hover:bg-black/30 transition-colors"
                        >
                          <Eye className="w-8 h-8" />
                          <span className="text-sm font-semibold">
                            {language === "ar"
                              ? "اضغط لعرض الصورة"
                              : language === "tr"
                              ? "Fotoğrafı Göster"
                              : "Tap to reveal photo"}
                          </span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="h-32 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-500">
                      <p className="text-sm">
                        {language === "ar"
                          ? "جارٍ رفع صورة التسليم من المزود..."
                          : language === "tr"
                          ? "Sağlayıcı teslimat fotoğrafı yüklüyor..."
                          : "Provider is uploading delivery photo…"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
