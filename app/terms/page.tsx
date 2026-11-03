"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, FileCheck, Scale, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function TermsOfServicePage() {
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
        <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-500">
          <Scale className="w-6 h-6" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Binding Terms & Escrow Rules
        </span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-6">
        {language === "ar" ? "الشروط والأحكام وقواعد الإيداع الضامن" : language === "tr" ? "Kullanım Koşulları ve Emanet Kuralları" : "Terms of Service & Escrow Guidelines"}
      </h1>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
        <p>
          {language === "ar"
            ? "باستخدامك لمنصة سَنَد (Sanad)، فإنك توافق على الالتزام بالقواعد المنظمة للتعامل بين المستفيدين ومزودي الخدمات المعتمدين، بما في ذلك سياسة الدفع المشروط (Escrow)."
            : language === "tr"
            ? "Sanad platformunu kullanarak, hizmet alanlar ile onaylı sağlayıcılar arasındaki emanet ödeme ve sözleşme kurallarını kabul etmiş sayılırsınız."
            : "By accessing Sanad, you agree to comply with bilateral escrow dispute resolution guidelines and multi-jurisdictional contract standards."}
        </p>

        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-brand-500" />
            <span>1. {language === "ar" ? "آلية سداد وحجز الأموال (Escrow)" : language === "tr" ? "Emanet Havuzu Çalışma Prensibi" : "Escrow Milestone Mechanics"}</span>
          </h3>
          <p className="text-sm">
            {language === "ar"
              ? "يتم إيداع مقابل الخدمة في حساب وسيط آمن. لا يتم تحرير المبلغ لمزود الخدمة إلا بعد اعتماد المستفيد لتسليم المهمة أو انتهاء مهلة الفحص المحددة في العقد دون نزاع."
              : language === "tr"
              ? "Ödemeler korumalı emanet hesabında tutulur. Hizmet alıcı onay vermedikçe veya belirlenen inceleme süresi itirazsız dolmadıkça para aktarılmaz."
              : "Payments are held in an insured custodial account. Disbursal requires client sign-off or the lapse of the inspection window without a contested milestone."}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <span>2. {language === "ar" ? "فض النزاعات والتحكيم العادل" : language === "tr" ? "Uyuşmazlık Çözümü" : "Dispute Resolution"}</span>
          </h3>
          <p className="text-sm">
            {language === "ar"
              ? "في حال عدم مطابقة الخدمة للشروط المتفق عليها في العقد الإلكتروني، تتدخل لجنة تحكيم سَنَد المحايدة لمراجعة الوثائق والبت في إعادة المبلغ أو استكمال العمل."
              : language === "tr"
              ? "Hizmetin sözleşmeye uymaması halinde, Sanad tarafsız inceleme komitesi devreye girerek iade veya tamamlama kararını bağlayıcı olarak verir."
              : "In the event of non-delivery, Sanad's arbitration council evaluates recorded communication and contracts to issue partial or full refund decisions."}
          </p>
        </div>

        <p className="text-xs text-slate-500 pt-4">
          {language === "ar"
            ? "تخضع هذه الاتفاقية لأحدث القوانين والأنظمة المعمول بها. للاستفسارات القانونية: muhammadelosman464@gmail.com"
            : language === "tr"
            ? "Yasal sorularınız ve tahkim danışması için: muhammadelosman464@gmail.com"
            : "For legal disputes or arbitration questions: muhammadelosman464@gmail.com"}
        </p>
      </div>
    </div>
  );
}
