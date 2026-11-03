"use client";

/**
 * AidGrowthChart
 * ─────────────────────────────────────────────────────────────────────────────
 * Responsive area chart built with Recharts showing growth of aid delivered
 * over the last 6 months. Two data series: "Food & Fuel" and "Medical & Solar".
 * Soft gradient fills. Dark-mode aware via Tailwind CSS variables.
 * ─────────────────────────────────────────────────────────────────────────────
 */

"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useLanguage } from "@/context/LanguageContext";

/* ─── Mock data ──────────────────────────────────────────────────────────── */

const monthsEn = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];
const monthsAr = ["مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر"];
const monthsTr = ["May", "Haz", "Tem", "Ağu", "Eyl", "Eki"];

const rawValues = [
  { foodFuel: 420, medSolar: 180 },
  { foodFuel: 680, medSolar: 290 },
  { foodFuel: 850, medSolar: 410 },
  { foodFuel: 1120, medSolar: 620 },
  { foodFuel: 1480, medSolar: 890 },
  { foodFuel: 2050, medSolar: 1320 },
];

/* ─── Custom tooltip ─────────────────────────────────────────────────────── */

interface TooltipPayload {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-xl px-4 py-3 text-sm">
      <p className="font-bold text-slate-700 dark:text-white mb-2">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: p.color }}
          />
          <span>{p.name}:</span>
          <span className="font-semibold text-slate-800 dark:text-white">
            {p.value.toLocaleString()}
          </span>
        </p>
      ))}
    </div>
  );
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function AidGrowthChart() {
  const { language } = useLanguage();

  const months =
    language === "ar" ? monthsAr : language === "tr" ? monthsTr : monthsEn;

  const data = rawValues.map((v, i) => ({
    month: months[i],
    "Food & Fuel": v.foodFuel,
    "Medical & Solar": v.medSolar,
  }));

  const seriesLabels = {
    foodFuel:
      language === "ar"
        ? "غذاء ووقود"
        : language === "tr"
        ? "Gıda & Yakıt"
        : "Food & Fuel",
    medSolar:
      language === "ar"
        ? "طبي وطاقة شمسية"
        : language === "tr"
        ? "Tıbbi & Güneş"
        : "Medical & Solar",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl p-6 md:p-8"
    >
      {/* Chart header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          {language === "ar"
            ? "نمو المساعدات المُسلَّمة خلال 6 أشهر"
            : language === "tr"
            ? "6 Aylık Yardım Büyüme Grafiği"
            : "Aid Growth Over the Last 6 Months"}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {language === "ar"
            ? "عدد عمليات التسليم المكتملة حسب الفئة"
            : language === "tr"
            ? "Kategoriye göre tamamlanan teslimat sayısı"
            : "Number of completed deliveries by category"}
        </p>
      </div>

      {/* Gradient defs injected inline via SVG */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="gradFoodFuel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e11d48" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#e11d48" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradMedSolar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
          </linearGradient>
        </defs>
      </svg>

      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(148,163,184,0.2)"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => (v >= 1000 ? `${v / 1000}k` : String(v))}
            width={36}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 13, paddingTop: 16 }}
            formatter={(value: string) => (
              <span className="text-slate-600 dark:text-slate-300">{value}</span>
            )}
          />
          <Area
            type="monotone"
            dataKey="Food & Fuel"
            name={seriesLabels.foodFuel}
            stroke="#e11d48"
            strokeWidth={2.5}
            fill="url(#gradFoodFuel)"
            dot={{ r: 4, fill: "#e11d48", strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
          <Area
            type="monotone"
            dataKey="Medical & Solar"
            name={seriesLabels.medSolar}
            stroke="#2563eb"
            strokeWidth={2.5}
            fill="url(#gradMedSolar)"
            dot={{ r: 4, fill: "#2563eb", strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
