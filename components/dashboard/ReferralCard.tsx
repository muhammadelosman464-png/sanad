"use client";

/**
 * ReferralCard
 * ─────────────────────────────────────────────────────────────────────────────
 * "Give $5, Get $5" referral widget for the Expat Dashboard.
 *
 * Features:
 *  • Copyable unique referral link (navigator.clipboard + toast)
 *  • WhatsApp share button with pre-composed multilingual message
 *  • Stats row: Friends Referred / Earned / Pending
 *  • Emotional humanitarian copy
 *  • RTL-safe logical CSS properties
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Share2, Users, Gift, Clock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "@/components/ui/Toast";

/* ─── Props ──────────────────────────────────────────────────────────────── */

interface ReferralCardProps {
  userId?: string;
  friendsReferred?: number;
  totalEarned?: number;
  pendingEarnings?: number;
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function ReferralCard({
  userId = "usr_demo_abc123",
  friendsReferred = 3,
  totalEarned = 15,
  pendingEarnings = 10,
}: ReferralCardProps) {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);

  const referralLink = `https://sanad.app/join?ref=${userId}`;

  /* ── Translations ─────────────────────────────────────────────────────── */
  const T = {
    title:
      language === "ar"
        ? "ادعُ صديقاً، ابنِ مجتمعاً 💚"
        : language === "tr"
        ? "Arkadaş Davet Et, Topluluk Kur 💚"
        : "Invite a Friend, Build a Community 💚",
    subtitle:
      language === "ar"
        ? "لكل صديق تدعوه، تحصل كلاكما على 5 دولارات. وكل مستخدم جديد يعني عائلة جديدة تتلقى الدعم."
        : language === "tr"
        ? "Davet ettiğin her arkadaş için ikiniz de $5 kazanırsınız. Her yeni kullanıcı, destek alan yeni bir aile demektir."
        : "For every friend you invite, you both get $5. Every new user means another family receiving support.",
    yourLink:
      language === "ar"
        ? "رابط دعوتك الخاص"
        : language === "tr"
        ? "Kişisel Davet Bağlantınız"
        : "Your Unique Referral Link",
    copyBtn:
      language === "ar" ? "نسخ" : language === "tr" ? "Kopyala" : "Copy",
    copiedBtn:
      language === "ar" ? "تم النسخ!" : language === "tr" ? "Kopyalandı!" : "Copied!",
    shareWhatsApp:
      language === "ar"
        ? "شارك عبر واتساب"
        : language === "tr"
        ? "WhatsApp'ta Paylaş"
        : "Share via WhatsApp",
    friendsReferred:
      language === "ar"
        ? "أصدقاء دعوتهم"
        : language === "tr"
        ? "Davet Edilen"
        : "Friends Referred",
    totalEarned:
      language === "ar"
        ? "ما تم كسبه"
        : language === "tr"
        ? "Kazanılan"
        : "Total Earned",
    pending:
      language === "ar"
        ? "قيد المعالجة"
        : language === "tr"
        ? "Bekleyen"
        : "Pending",
    impactNote:
      language === "ar"
        ? "🤝 كل صديق تدعوه يساعد عائلة أخرى على تلقي الدعم."
        : language === "tr"
        ? "🤝 Davet ettiğin her arkadaş, başka bir ailenin destek almasına yardımcı oluyor."
        : "🤝 Every friend you invite helps another family receive the support they need.",
  };

  /* ── Handlers ─────────────────────────────────────────────────────────── */

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success(
        language === "ar"
          ? "تم نسخ رابط الدعوة! 🎉"
          : language === "tr"
          ? "Davet linki kopyalandı! 🎉"
          : "Referral link copied! 🎉"
      );
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error(
        language === "ar"
          ? "تعذّر النسخ. يرجى النسخ يدوياً."
          : language === "tr"
          ? "Kopyalama başarısız. Lütfen manuel kopyalayın."
          : "Copy failed. Please copy manually."
      );
    }
  };

  const whatsAppMessage =
    language === "ar"
      ? `مرحباً! اكتشفت منصة سَنَد لدعم عائلتنا في الوطن. استخدم رابطي وستحصل على 5 دولارات مجاناً: ${referralLink}`
      : language === "tr"
      ? `Merhaba! Sanad platformunu keşfettim — yurt içindeki ailemize destek için. Bağlantımı kullan ve $5 kazan: ${referralLink}`
      : `Hey! I discovered Sanad — the platform for supporting our families back home. Use my link and get $5 free: ${referralLink}`;

  const whatsAppUrl = `https://wa.me/?text=${encodeURIComponent(whatsAppMessage)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-emerald-200/60 dark:border-emerald-800/40"
    >
      {/* ── Gradient header ────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-500 to-brand-500 px-6 pt-7 pb-10">
        {/* Decorative circles */}
        <div className="absolute -top-8 -end-8 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute top-12 -start-6 w-20 h-20 rounded-full bg-white/10" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-white/70">
              {language === "ar"
                ? "برنامج إحالة الأصدقاء"
                : language === "tr"
                ? "Arkadaş Referans Programı"
                : "Friend Referral Program"}
            </span>
          </div>
          <h2 className="text-2xl font-black text-white leading-tight">{T.title}</h2>
          <p className="text-sm text-white/80 mt-2 leading-relaxed">{T.subtitle}</p>
        </div>
      </div>

      {/* ── Stats row (overlapping the header) ──────────────────────────── */}
      <div className="mx-4 -mt-6 rounded-2xl bg-white dark:bg-slate-800 shadow-lg border border-slate-100 dark:border-slate-700 grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-700 rtl:divide-x-reverse">
        {[
          {
            icon: Users,
            value: friendsReferred,
            label: T.friendsReferred,
            color: "text-brand-500",
          },
          {
            icon: Gift,
            value: `$${totalEarned}`,
            label: T.totalEarned,
            color: "text-emerald-500",
          },
          {
            icon: Clock,
            value: `$${pendingEarnings}`,
            label: T.pending,
            color: "text-amber-500",
          },
        ].map(({ icon: Icon, value, label, color }) => (
          <div key={label} className="flex flex-col items-center gap-1 py-4 px-2">
            <Icon className={`w-4 h-4 ${color}`} />
            <span className="text-xl font-black text-slate-800 dark:text-white">{value}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 text-center leading-tight">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* ── Referral link ──────────────────────────────────────────────── */}
      <div className="px-6 pt-6 pb-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
          {T.yourLink}
        </label>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-4 py-3">
          <span className="flex-1 text-sm text-slate-600 dark:text-slate-300 truncate font-mono">
            {referralLink}
          </span>
          <button
            onClick={handleCopy}
            className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span>{copied ? T.copiedBtn : T.copyBtn}</span>
          </button>
        </div>
      </div>

      {/* ── WhatsApp share ─────────────────────────────────────────────── */}
      <div className="px-6 pb-6 pt-3 flex flex-col gap-3">
        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm transition-colors shadow-md shadow-green-400/20"
        >
          <Share2 className="w-4 h-4" />
          {T.shareWhatsApp}
        </a>

        {/* Impact note */}
        <p className="text-xs text-center text-slate-500 dark:text-slate-400 leading-relaxed px-4">
          {T.impactNote}
        </p>
      </div>
    </motion.div>
  );
}
