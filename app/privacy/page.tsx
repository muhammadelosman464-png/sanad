"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldCheck, Lock, Eye, FileText } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function PrivacyPolicyPage() {
  const { direction, language } = useLanguage();
  const ArrowIcon = direction === "rtl" ? ArrowRight : ArrowLeft;

  return (
    <div className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline mb-8"
      >
        <ArrowIcon className="w-4 h-4" />
        <span>{language === "ar" ? "العودة للرئيسية" : language === "tr" ? "Ana Sayfaya Dön" : "Back to Home"}</span>
      </Link>

      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-2xl bg-brand-500/10 text-brand-500">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Compliance & GDPR / KVKK
        </span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-6">
        {language === "ar" ? "سياسة الخصوصية وحماية البيانات" : language === "tr" ? "Gizlilik Politikası ve KVKK" : "Privacy & Data Protection Policy"}
      </h1>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
        <p>
          {language === "ar"
            ? "في منصة سَنَد (Sanad)، نعتبر سرية معلوماتكم وحماية بياناتكم الشخصية والتعاقدية ركيزة أساسية لعملنا. تخضع جميع الإجراءات لأحدث معايير الأمان الدولية (GDPR) وقانون حماية البيانات الشخصية التركي (KVKK)."
            : language === "tr"
            ? "Sanad platformunda kişisel ve ticari verilerinizin gizliliği en temel önceliğimizdir. Süreçlerimiz 6698 sayılı KVKK ve Avrupa Birliği GDPR standartlarına tam uyumludur."
            : "At Sanad, protecting your confidential information, identity documents, and payment details is paramount. We comply fully with international GDPR directives and local KVKK regulations."}
        </p>

        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-brand-500" />
            <span>1. {language === "ar" ? "تشفير المستندات والعقود" : language === "tr" ? "Belge ve Sözleşme Şifreleme" : "Document & Contract Encryption"}</span>
          </h3>
          <p className="text-sm">
            {language === "ar"
              ? "يتم تشفير كافة جوازات السفر، تراخيص العمل، وعقود البيع والإيجار المرفوعة عبر المنصة بتقنية AES 256-bit، ولا يمكن الاطلاع عليها إلا من قبل المحامي أو المترجم المكلف بالمعاملة."
              : language === "tr"
              ? "Platforma yüklenen tüm pasaport, tapu ve sözleşme belgeleri AES 256-bit ile şifrelenir ve yalnızca yetkilendirilmiş uzman tarafından incelenebilir."
              : "All uploaded passports, title deeds, and legal contracts are encrypted at rest with AES-256 and accessible strictly on a zero-knowledge basis."}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-brand-500" />
            <span>2. {language === "ar" ? "عدم مشاركة البيانات مع أطراف ثالثة" : language === "tr" ? "Üçüncü Taraflarla Paylaşım Yasağı" : "Zero Data Brokering"}</span>
          </h3>
          <p className="text-sm">
            {language === "ar"
              ? "لا نقوم ببيع أو تأجير أي بيانات شخصية لأي جهات تسويقية خارجية تحت أي ظرف."
              : language === "tr"
              ? "Verileriniz hiçbir koşulda pazarlama veya reklam amacıyla üçüncü taraflarla paylaşılmaz veya satılmaz."
              : "We never monetize, broker, or sell personal contact or relocation information to advertising networks."}
          </p>
        </div>

        <p className="text-xs text-slate-500 pt-4">
          {language === "ar"
            ? "لأية استفسارات تتعلق بحذف أو تصدير بياناتكم، تواصلوا مع مسؤول الامتثال: muhammadelosman464@gmail.com"
            : language === "tr"
            ? "Veri silme veya KVKK talepleriniz için: muhammadelosman464@gmail.com"
            : "For data deletion requests under GDPR/KVKK, contact compliance: muhammadelosman464@gmail.com"}
        </p>
      </div>
    </div>
  );
}
