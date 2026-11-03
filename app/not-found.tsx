"use client";

import React from "react";
import Link from "next/link";
import { Home, ArrowLeft, ArrowRight, Heart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function NotFound() {
  const { language, direction } = useLanguage();
  const ArrowIcon = direction === "rtl" ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white dark:bg-slate-950">
      <div className="text-center max-w-md">
        {/* Giant 404 */}
        <div className="text-[8rem] sm:text-[10rem] font-black leading-none bg-gradient-to-br from-rose-500 via-brand-500 to-indigo-500 bg-clip-text text-transparent mb-4 select-none">
          404
        </div>

        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-rose-500 fill-current" />
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            {language === "ar"
              ? "عذراً، هذه الصفحة غير موجودة"
              : language === "tr"
              ? "Üzgünüz, bu sayfa bulunamadı"
              : "Sorry, this page doesn't exist"}
          </h1>
          <Heart className="w-5 h-5 text-rose-500 fill-current" />
        </div>

        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
          {language === "ar"
            ? "ربما تم نقل الصفحة أو حذفها. يمكنك العودة للصفحة الرئيسية للمتابعة."
            : language === "tr"
            ? "Sayfa taşınmış veya silinmiş olabilir. Ana sayfaya dönerek devam edebilirsiniz."
            : "The page may have been moved or deleted. Head back to home to continue."}
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition"
        >
          <Home className="w-4 h-4" />
          <span>
            {language === "ar"
              ? "العودة للرئيسية"
              : language === "tr"
              ? "Ana Sayfaya Dön"
              : "Back to Home"}
          </span>
          <ArrowIcon className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
