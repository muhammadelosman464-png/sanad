"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Zap, ArrowRight, ArrowLeft, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { openLemonSqueezyCheckout } from "@/lib/lemonsqueezy";

/**
 * PricingSection — Subscription tiers for diaspora families & local providers.
 * Payments processed via Lemon Squeezy (escrow-compatible).
 */
export default function PricingSection() {
  const { language, direction } = useLanguage();
  const ArrowIcon = direction === "rtl" ? ArrowLeft : ArrowRight;

  const plans = [
    {
      id: "family-free",
      name:
        language === "ar"
          ? "باقة الأسرة المجانية"
          : language === "tr"
          ? "Ücretsiz Aile Paketi"
          : "Family Free",
      price: "$0",
      period:
        language === "ar"
          ? "مجاناً للأبد"
          : language === "tr"
          ? "Ömür boyu ücretsiz"
          : "Free forever",
      description:
        language === "ar"
          ? "ابدأ بدعم عائلتك فوراً مع حماية دفع قياسية."
          : language === "tr"
          ? "Standart ödeme koruması ile ailenizi desteklemeye hemen başlayın."
          : "Start supporting your family immediately with standard payment protection.",
      features: [
        language === "ar"
          ? "طلب حتى 3 خدمات شهرياً"
          : language === "tr"
          ? "Aylık 3 hizmet siparişi"
          : "Up to 3 service orders per month",
        language === "ar"
          ? "حماية الدفع بالضمان القياسي"
          : language === "tr"
          ? "Standart emanet ödeme koruması"
          : "Standard escrow payment protection",
        language === "ar"
          ? "توثيق صوري للتسليم"
          : language === "tr"
          ? "Fotoğraflı teslimat belgesi"
          : "Photo-verified delivery proof",
        language === "ar"
          ? "دعم متعدد اللغات"
          : language === "tr"
          ? "Çok dilli destek"
          : "Multilingual support (EN/AR/TR)",
      ],
      cta:
        language === "ar"
          ? "ابدأ مجاناً"
          : language === "tr"
          ? "Ücretsiz Başla"
          : "Get Started Free",
      isPopular: false,
      variantId: "free_tier",
    },
    {
      id: "family-plus",
      name:
        language === "ar"
          ? "سَنَد Plus — للأسرة"
          : language === "tr"
          ? "Sanad Plus — Aile"
          : "Sanad Plus — Family",
      price: "$19",
      period:
        language === "ar" ? "/ شهر" : language === "tr" ? "/ ay" : "/ month",
      description:
        language === "ar"
          ? "للعائلات التي ترسل دعماً منتظماً مع أولوية التوصيل ودعم مخصص."
          : language === "tr"
          ? "Öncelikli teslimat ve kişisel destek ile düzenli destek gönderen aileler için."
          : "For families sending regular support with priority delivery and dedicated assistance.",
      features: [
        language === "ar"
          ? "طلبات غير محدودة شهرياً"
          : language === "tr"
          ? "Sınırsız aylık sipariş"
          : "Unlimited monthly orders",
        language === "ar"
          ? "أولوية التوصيل (خلال 24 ساعة)"
          : language === "tr"
          ? "Öncelikli teslimat (24 saat içinde)"
          : "Priority 24-hour delivery",
        language === "ar"
          ? "مدير دعم عائلي مخصص"
          : language === "tr"
          ? "Kişisel aile destek yöneticisi"
          : "Dedicated family support manager",
        language === "ar"
          ? "0% رسوم ضمان على جميع الطلبات"
          : language === "tr"
          ? "Tüm siparişlerde %0 emanet komisyonu"
          : "0% escrow fee on all orders",
        language === "ar"
          ? "جدولة الطلبات المتكررة"
          : language === "tr"
          ? "Tekrarlayan sipariş planlaması"
          : "Recurring order scheduling",
      ],
      cta:
        language === "ar"
          ? "اشترك عبر Lemon Squeezy"
          : language === "tr"
          ? "Lemon Squeezy ile Abone Ol"
          : "Subscribe via Lemon Squeezy",
      isPopular: true,
      variantId: "sanad_family_plus",
    },
    {
      id: "provider-verified",
      name:
        language === "ar"
          ? "مزود الخدمة المعتمد"
          : language === "tr"
          ? "Onaylı Hizmet Sağlayıcı"
          : "Verified Provider",
      price: "$49",
      period:
        language === "ar" ? "/ شهر" : language === "tr" ? "/ ay" : "/ month",
      description:
        language === "ar"
          ? "للمتاجر ومقدمي الخدمات المحليين الراغبين في الوصول لعائلات المغتربين."
          : language === "tr"
          ? "Diaspora ailelerine ulaşmak isteyen yerel dükkanlar ve hizmet sağlayıcılar için."
          : "For local shops and service providers wanting to serve diaspora families.",
      features: [
        language === "ar"
          ? "شارة 'مزود موثق' الذهبية"
          : language === "tr"
          ? "'Onaylı Sağlayıcı' altın rozeti"
          : "'Verified Provider' gold badge",
        language === "ar"
          ? "ظهور أولي في قوائم الخدمات"
          : language === "tr"
          ? "Hizmet listelerinde öncelikli görünüm"
          : "Top placement in service listings",
        language === "ar"
          ? "صرف تلقائي للمستحقات فور التسليم"
          : language === "tr"
          ? "Teslimat sonrası otomatik ödeme aktarımı"
          : "Auto-payout after delivery confirmation",
        language === "ar"
          ? "لوحة تحكم إدارة الطلبات والفواتير"
          : language === "tr"
          ? "Sipariş ve fatura yönetim paneli"
          : "Order & invoice management dashboard",
      ],
      cta:
        language === "ar"
          ? "انضم كمزود معتمد"
          : language === "tr"
          ? "Onaylı Sağlayıcı Ol"
          : "Join as Verified Provider",
      isPopular: false,
      variantId: "sanad_provider_verified",
    },
  ];

  const handleCheckout = (variantId: string) => {
    openLemonSqueezyCheckout({
      variantId,
      customData: { platform: "sanad_web" },
    });
  };

  return (
    <section
      id="pricing"
      className="py-24 relative overflow-hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800"
    >
      {/* Background accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 text-xs font-semibold mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>Lemon Squeezy Secure Billing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
            {language === "ar"
              ? "خطط شفافة لكل عائلة ومزود خدمة"
              : language === "tr"
              ? "Her Aile ve Hizmet Sağlayıcı İçin Şeffaf Planlar"
              : "Transparent Plans for Every Family & Provider"}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            {language === "ar"
              ? "ابدأ مجاناً وترقَّ عندما تحتاج المزيد. لا مفاجآت في الأسعار، ضمان استرداد كامل."
              : language === "tr"
              ? "Ücretsiz başlayın, ihtiyaç duyduğunuzda yükseltin. Gizli ücret yok, tam iade garantisi."
              : "Start free, upgrade when you need more. No hidden fees, full refund guarantee."}
          </p>
        </motion.div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                plan.isPopular
                  ? "bg-slate-950 text-white border-2 border-brand-500 shadow-2xl shadow-brand-500/20 scale-[1.02]"
                  : "bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg"
              }`}
            >
              {/* Popular badge */}
              {plan.isPopular && (
                <div className="absolute -top-4 start-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 text-white text-xs font-bold uppercase tracking-wider shadow-md whitespace-nowrap">
                  {language === "ar"
                    ? "الأكثر اختياراً"
                    : language === "tr"
                    ? "En Çok Tercih Edilen"
                    : "Most Popular"}
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p
                  className={`text-xs leading-relaxed mb-6 ${
                    plan.isPopular
                      ? "text-slate-300"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {plan.description}
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl sm:text-5xl font-black">
                    {plan.price}
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      plan.isPopular
                        ? "text-slate-400"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {plan.period}
                  </span>
                </div>

                <div
                  className={`border-t mb-6 ${
                    plan.isPopular ? "border-slate-800" : "border-slate-100 dark:border-slate-800"
                  }`}
                />

                {/* Features list */}
                <ul className="space-y-3.5 mb-8 text-xs sm:text-sm">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check
                        className={`w-4 h-4 mt-0.5 shrink-0 ${
                          plan.isPopular
                            ? "text-brand-400"
                            : "text-brand-600 dark:text-brand-400"
                        }`}
                      />
                      <span
                        className={
                          plan.isPopular
                            ? "text-slate-200"
                            : "text-slate-700 dark:text-slate-300"
                        }
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA button */}
              <button
                onClick={() => handleCheckout(plan.variantId)}
                className={`w-full py-3.5 px-4 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 ${
                  plan.isPopular
                    ? "bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/30"
                    : "bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900"
                }`}
              >
                <span>{plan.cta}</span>
                <ArrowIcon className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Bottom trust row */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>
              {language === "ar"
                ? "مدفوعات آمنة عبر Lemon Squeezy"
                : language === "tr"
                ? "Lemon Squeezy ile güvenli ödeme"
                : "Secure payments via Lemon Squeezy"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-brand-500" />
            <span>
              {language === "ar"
                ? "ضمان استرداد 14 يوم بدون شروط"
                : language === "tr"
                ? "14 günlük koşulsuz iade garantisi"
                : "14-day unconditional money-back guarantee"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>
              {language === "ar"
                ? "إلغاء الاشتراك في أي وقت"
                : language === "tr"
                ? "İstediğiniz zaman iptal edin"
                : "Cancel anytime, no questions asked"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
