"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Sparkles, CheckCircle2, CornerDownLeft, CornerDownRight, Bot } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { ReviewItem } from "./AddReviewModal";

interface ReviewThreadItemProps {
  review: ReviewItem;
}

export default function ReviewThreadItem({ review }: ReviewThreadItemProps) {
  const { direction, language } = useLanguage();
  const isRtl = direction === "rtl";

  const getInitial = (name: string) => {
    return name?.trim()?.charAt(0)?.toUpperCase() || "U";
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return language === "ar" ? "الآن" : "Just now";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return language === "ar" ? "الآن" : "Just now";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-2.5"
    >
      {/* ── User Review Card ────────────────────────────────────── */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white/90 dark:bg-[#132318] border border-slate-200/80 dark:border-[#d4af37]/25 shadow-sm transition-all hover:border-[#d4af37]/50">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2.5">
            {/* User Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-600 to-brand-800 text-white font-bold text-xs flex items-center justify-center shadow-sm shrink-0">
              {getInitial(review.customer_name)}
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                {review.customer_name}
              </h4>
              <span className="text-[10px] text-slate-400">
                {formatDate(review.created_at)}
              </span>
            </div>
          </div>

          {/* Star Rating */}
          <div className="flex items-center gap-0.5 bg-amber-500/10 dark:bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-500/20">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < review.rating
                    ? "text-amber-400 fill-amber-400"
                    : "text-slate-300 dark:text-slate-600"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Review Text */}
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed ps-1">
          {review.review_text}
        </p>
      </div>

      {/* ── AI Reply Card (Comment Thread Style) ───────────────── */}
      {review.ai_reply && (
        <div className="flex items-start gap-2 ps-4 sm:ps-6">
          {/* Connector arrow */}
          <div className="text-[#d4af37]/60 shrink-0 mt-2">
            {isRtl ? (
              <CornerDownLeft className="w-4 h-4" />
            ) : (
              <CornerDownRight className="w-4 h-4" />
            )}
          </div>

          {/* AI Reply Bubble */}
          <div className="flex-1 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-[#16271c] to-[#0e1a12] border border-[#d4af37]/35 shadow-md relative overflow-hidden">
            {/* Subtle glow */}
            <div className="absolute top-0 end-0 w-24 h-24 bg-[#ffd700]/10 rounded-full blur-xl pointer-events-none" />

            {/* Header with AI Badge */}
            <div className="flex items-center justify-between gap-2 mb-2 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#ffd700] to-[#b8930a] text-[#0f1b13] flex items-center justify-center shrink-0 shadow-sm shadow-[#d4af37]/30">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-[#ffd700]">
                    {language === "ar" ? "رد سَنَد الذكي" : "Sanad Smart Reply"}
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 rounded-full px-1.5 py-0.2">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    {language === "ar" ? "معتمد" : "Verified"}
                  </span>
                </div>
              </div>

              <span className="text-[10px] text-[#d4af37]/70 font-mono flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#ffd700]" />
                Gemini AI
              </span>
            </div>

            {/* Reply Body */}
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed relative z-10">
              {review.ai_reply}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
