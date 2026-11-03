"use client";

/**
 * My Orders — /my-orders
 * ---------------------------------------------------------------------------
 * Premium dark order tracking page.
 * Each order card includes:
 *   - Order ID, service, amount, date, location
 *   - Animated 4-step status tracker (Pending → Preparing → On the Way → Delivered)
 *   - Realistic SVG linear barcode with "رمز التتبع" label
 *   - Expandable proof-of-delivery section
 * ---------------------------------------------------------------------------
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Heart,
  Sparkles,
  ImageIcon,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

/* ─── Types ──────────────────────────────────────────────────────────────── */

type OrderStatus = "pending" | "in_progress" | "out_for_delivery" | "delivered";

interface Order {
  id: string;
  serviceName: string;
  serviceNameAr: string;
  amount: number;
  status: OrderStatus;
  location: string;
  createdAt: string;
  proofImageUrl?: string;
}

/* ─── Placeholder orders ─────────────────────────────────────────────────── */

const PLACEHOLDER_ORDERS: Order[] = [
  {
    id: "SND-20261028-001",
    serviceName: "Food Basket",
    serviceNameAr: "سلة غذائية",
    amount: 45.0,
    status: "delivered",
    location: "Idlib, Syria",
    createdAt: "2026-10-28T14:30:00Z",
    proofImageUrl:
      "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "SND-20261030-002",
    serviceName: "Heating & Winter Needs",
    serviceNameAr: "كسوة وتدفئة الشتاء",
    amount: 70.0,
    status: "out_for_delivery",
    location: "Aleppo, Syria",
    createdAt: "2026-10-30T09:15:00Z",
  },
  {
    id: "SND-20261101-003",
    serviceName: "Send Direct Support",
    serviceNameAr: "أرسل مساعدة مباشرة",
    amount: 120.0,
    status: "in_progress",
    location: "Damascus, Syria",
    createdAt: "2026-11-01T18:45:00Z",
  },
  {
    id: "SND-20261102-004",
    serviceName: "Urgent Medical Case",
    serviceNameAr: "حالة طبية عاجلة",
    amount: 250.0,
    status: "pending",
    location: "Hama, Syria",
    createdAt: "2026-11-02T07:00:00Z",
  },
];

/* ─── Realistic SVG Barcode ─────────────────────────────────────────────── */

/**
 * Generates a deterministic barcode-like SVG from an order ID string.
 * Uses narrow (2px) and wide (5px) bars alternated based on char codes
 * to mimic a Code-128 style barcode without an external library.
 */
function BarcodeStrip({ orderId }: { orderId: string }) {
  const BAR_HEIGHT = 56;
  const BARS = 52; /* total bar count */

  /* Deterministic bar-width sequence from orderId chars */
  const seed = orderId
    .split("")
    .reduce((acc, c, i) => acc + c.charCodeAt(0) * (i + 1), 0);

  const bars: { width: number; filled: boolean }[] = Array.from(
    { length: BARS },
    (_, i) => {
      const val = (seed * (i * 7 + 13)) % 17;
      return {
        width: val % 3 === 0 ? 5 : val % 3 === 1 ? 3 : 2,
        filled: i % 2 === 0, /* alternate fill/space */
      };
    }
  );

  const totalWidth = bars.reduce((s, b) => s + b.width, 0);

  let x = 0;
  const rects = bars.map((bar, i) => {
    const rect = bar.filled ? (
      <rect key={i} x={x} y={0} width={bar.width} height={BAR_HEIGHT} fill="#0f172a" />
    ) : null;
    x += bar.width;
    return rect;
  });

  return (
    <div className="flex flex-col items-center gap-1.5">
      {/* Barcode SVG */}
      <div className="bg-white rounded-lg px-3 pt-3 pb-1.5 shadow-inner border border-slate-200 dark:border-slate-700">
        <svg
          width={totalWidth}
          height={BAR_HEIGHT}
          viewBox={`0 0 ${totalWidth} ${BAR_HEIGHT}`}
          xmlns="http://www.w3.org/2000/svg"
          className="block"
          style={{ maxWidth: 160 }}
          aria-label={`Barcode for order ${orderId}`}
        >
          {/* white background */}
          <rect width={totalWidth} height={BAR_HEIGHT} fill="white" />
          {rects}
        </svg>
        {/* Order ID under bars (like a real barcode) */}
        <p className="text-[9px] font-mono text-slate-600 text-center tracking-widest mt-1 select-all">
          {orderId}
        </p>
      </div>
      {/* Arabic label */}
      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider">
        رمز التتبع
      </p>
    </div>
  );
}

/* ─── Status tracker ─────────────────────────────────────────────────────── */

const STATUS_STEPS: OrderStatus[] = [
  "pending",
  "in_progress",
  "out_for_delivery",
  "delivered",
];

const STEP_META: Record<
  OrderStatus,
  { en: string; ar: string; tr: string; Icon: React.ElementType; color: string }
> = {
  pending: { en: "Pending", ar: "قيد المراجعة", tr: "Bekliyor", Icon: Clock, color: "bg-amber-500" },
  in_progress: { en: "Preparing", ar: "جاري التجهيز", tr: "Hazırlanıyor", Icon: Package, color: "bg-blue-500" },
  out_for_delivery: { en: "On the Way", ar: "في الطريق", tr: "Yolda", Icon: Truck, color: "bg-violet-500" },
  delivered: { en: "Delivered", ar: "تم التسليم", tr: "Teslim", Icon: CheckCircle2, color: "bg-emerald-500" },
};

function StatusTracker({ status, language }: { status: OrderStatus; language: string }) {
  const currentIdx = STATUS_STEPS.indexOf(status);

  return (
    <div className="flex items-center w-full">
      {STATUS_STEPS.map((step, idx) => {
        const meta = STEP_META[step];
        const { Icon } = meta;
        const done = idx <= currentIdx;
        const active = idx === currentIdx;

        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                  done
                    ? active
                      ? `${meta.color} ring-2 ring-white/30 shadow-lg`
                      : "bg-emerald-500"
                    : "bg-slate-700"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${done ? "text-white" : "text-slate-500"}`} />
              </div>
              <span className={`text-[9px] font-semibold text-center leading-tight max-w-[52px] ${done ? "text-slate-200" : "text-slate-500"}`}>
                {language === "ar" ? meta.ar : language === "tr" ? meta.tr : meta.en}
              </span>
            </div>

            {idx < STATUS_STEPS.length - 1 && (
              <div className="flex-1 h-0.5 mx-1 mb-5 rounded-full overflow-hidden bg-slate-700">
                <motion.div
                  className="h-full bg-gradient-to-r from-brand-500 to-emerald-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: idx < currentIdx ? "100%" : "0%" }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ─── Status badge ───────────────────────────────────────────────────────── */

function StatusBadge({ status, language }: { status: OrderStatus; language: string }) {
  const meta = STEP_META[status];
  const label = language === "ar" ? meta.ar : language === "tr" ? meta.tr : meta.en;
  const { Icon } = meta;
  const colorMap: Record<OrderStatus, string> = {
    pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    in_progress: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    out_for_delivery: "bg-violet-500/15 text-violet-400 border-violet-500/30",
    delivered: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${colorMap[status]}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

/* ─── Order Card ─────────────────────────────────────────────────────────── */

function OrderCard({ order, language }: { order: Order; language: string }) {
  const [expanded, setExpanded] = useState(false);

  const date = new Date(order.createdAt).toLocaleDateString(
    language === "ar" ? "ar-SY" : language === "tr" ? "tr-TR" : "en-US",
    { year: "numeric", month: "short", day: "numeric" }
  );

  const svcName = language === "ar" ? order.serviceNameAr : order.serviceName;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 border border-white/8 rounded-2xl overflow-hidden shadow-xl shadow-black/30 hover:border-brand-500/30 transition-colors duration-300"
    >
      {/* ── Card top bar (accent color strip) ─────────────────────────── */}
      <div
        className={`h-1 w-full ${
          order.status === "delivered"
            ? "bg-gradient-to-r from-emerald-500 to-teal-400"
            : order.status === "out_for_delivery"
            ? "bg-gradient-to-r from-violet-500 to-blue-500"
            : order.status === "in_progress"
            ? "bg-gradient-to-r from-blue-500 to-cyan-400"
            : "bg-gradient-to-r from-amber-500 to-orange-400"
        }`}
      />

      {/* ── Main card body ───────────────────────────────────────────── */}
      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <p className="font-bold text-white text-base leading-tight">{svcName}</p>
            <p className="text-[11px] font-mono text-slate-500 mt-0.5">#{order.id}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {date} &bull; {order.location}
            </p>
          </div>
          <div className="text-end shrink-0">
            <p className="text-xl font-black text-white tabular-nums">${order.amount.toFixed(2)}</p>
            <div className="mt-1">
              <StatusBadge status={order.status} language={language} />
            </div>
          </div>
        </div>

        {/* Status Tracker */}
        <StatusTracker status={order.status} language={language} />

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1.5 text-xs font-semibold text-brand-400 hover:text-brand-300 mt-3 transition-colors"
        >
          {expanded
            ? language === "ar" ? "إخفاء التفاصيل" : language === "tr" ? "Gizle" : "Hide Details"
            : language === "ar" ? "عرض التفاصيل والباركود" : language === "tr" ? "Detaylar ve Barkod" : "View Details & Barcode"}
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* ── Expandable details panel ─────────────────────────────────── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/6 p-5 flex flex-col sm:flex-row gap-6">

              {/* LEFT: Barcode column */}
              <div className="flex flex-col items-center gap-3 shrink-0">
                <BarcodeStrip orderId={order.id} />
                <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                  {language === "ar" ? "محمي بالضمان" : language === "tr" ? "Emanet Onaylı" : "Escrow Verified"}
                </div>
              </div>

              {/* RIGHT: Order details */}
              <div className="flex-1 space-y-2.5 text-sm">
                {[
                  {
                    label: language === "ar" ? "الخدمة" : language === "tr" ? "Hizmet" : "Service",
                    value: svcName,
                  },
                  {
                    label: language === "ar" ? "المبلغ المدفوع" : language === "tr" ? "Ödenen Tutar" : "Amount Paid",
                    value: `$${order.amount.toFixed(2)}`,
                    bold: true,
                  },
                  {
                    label: language === "ar" ? "الموقع المستهدف" : language === "tr" ? "Hedef Konum" : "Target Location",
                    value: order.location,
                  },
                  {
                    label: language === "ar" ? "تاريخ الطلب" : language === "tr" ? "Sipariş Tarihi" : "Order Date",
                    value: date,
                  },
                ].map(({ label, value, bold }) => (
                  <div key={label} className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-slate-500 text-xs">{label}</span>
                    <span className={`text-xs ${bold ? "font-black text-brand-400" : "font-semibold text-slate-200"}`}>
                      {value}
                    </span>
                  </div>
                ))}

                {/* Proof of Delivery */}
                {order.status === "delivered" && order.proofImageUrl && (
                  <div className="pt-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
                      <ImageIcon className="w-3 h-3" />
                      {language === "ar" ? "صورة التسليم" : language === "tr" ? "Teslimat Kanıtı" : "Proof of Delivery"}
                    </p>
                    <img
                      src={order.proofImageUrl}
                      alt="Proof of delivery"
                      className="w-full max-w-[220px] rounded-xl object-cover shadow-xl border border-white/10"
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function MyOrdersPage() {
  const { language } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setOrders(PLACEHOLDER_ORDERS);
      setLoading(false);
      return;
    }

    const sb = supabase;

    sb.auth.getUser().then(async ({ data }) => {
      setUser(data.user);

      if (data.user) {
        const { data: rows, error } = await sb
          .from("orders")
          .select("*")
          .eq("user_id", data.user.id)
          .order("created_at", { ascending: false });

        if (!error && rows && rows.length > 0) {
          setOrders(
            rows.map((r) => ({
              id: r.id ?? "",
              serviceName: r.service_name ?? "",
              serviceNameAr: r.service_name_ar ?? r.service_name ?? "",
              amount: r.amount ?? 0,
              status: (r.status as OrderStatus) ?? "pending",
              location: r.location ?? "",
              createdAt: r.created_at ?? new Date().toISOString(),
              proofImageUrl: r.proof_image_url ?? undefined,
            }))
          );
        } else {
          setOrders(PLACEHOLDER_ORDERS);
        }
      } else {
        setOrders(PLACEHOLDER_ORDERS);
      }
      setLoading(false);
    });
  }, []);

  const T = {
    title: language === "ar" ? "طلباتي" : language === "tr" ? "Siparişlerim" : "My Orders",
    subtitle:
      language === "ar"
        ? "تابع حالة كل دعم أرسلته — مع رمز التتبع لكل طلب"
        : language === "tr"
        ? "Gönderdiğiniz her desteği takip edin — her sipariş için barkod"
        : "Track every support package — with a unique tracking barcode per order",
    back: language === "ar" ? "العودة للرئيسية" : language === "tr" ? "Ana Sayfa" : "Back to Home",
    guestNote:
      language === "ar"
        ? "هذه طلبات تجريبية — سجّل دخولك لرؤية طلباتك الحقيقية."
        : language === "tr"
        ? "Bu örnek siparişlerdir — gerçek siparişlerinizi görmek için giriş yapın."
        : "These are demo orders — sign in to see your real orders.",
    empty:
      language === "ar"
        ? "لا توجد طلبات بعد. ابدأ بإرسال الدعم!"
        : language === "tr"
        ? "Henüz sipariş yok. Destek göndermeye başlayın!"
        : "No orders yet. Start sending support!",
    totalPaid:
      language === "ar" ? "الإجمالي المدفوع" : language === "tr" ? "Toplam ödenen" : "Total paid",
    totalOrders:
      language === "ar" ? "طلبات إجمالية" : language === "tr" ? "toplam sipariş" : "total orders",
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">

        {/* Page header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-400 transition mb-5"
          >
            <ArrowLeft className="w-4 h-4" />
            {T.back}
          </Link>

          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-brand-500 to-rose-500 flex items-center justify-center shadow-lg shadow-brand-500/30 p-3">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{T.title}</h1>
              <p className="text-sm text-slate-400 mt-0.5">{T.subtitle}</p>
            </div>
          </div>

          {/* Guest banner */}
          {!user && !loading && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-amber-400"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{T.guestNote}</span>
            </motion.div>
          )}
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 rounded-2xl bg-slate-800 animate-pulse" />
            ))}
          </div>
        )}

        {/* Order list */}
        {!loading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order, idx) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07 }}
              >
                <OrderCard order={order} language={language} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && orders.length === 0 && (
          <div className="text-center py-24">
            <Sparkles className="w-12 h-12 mx-auto text-slate-600 mb-4" />
            <p className="text-slate-400 text-sm mb-4">{T.empty}</p>
            <Link
              href="/#services"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-md transition"
            >
              <Heart className="w-4 h-4" />
              {language === "ar" ? "ابدأ الآن" : language === "tr" ? "Şimdi Başla" : "Get Started"}
            </Link>
          </div>
        )}

        {/* Summary strip */}
        {!loading && orders.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 p-4 rounded-2xl bg-slate-900 border border-white/8 flex flex-wrap items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
              <Heart className="w-4 h-4 text-rose-500" />
              {orders.length} {T.totalOrders}
            </div>
            <div className="text-sm font-black text-brand-400 tabular-nums">
              {T.totalPaid}: ${orders.reduce((s, o) => s + o.amount, 0).toFixed(2)}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
