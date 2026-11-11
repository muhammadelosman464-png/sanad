"use client";

/**
 * ServiceDetailsModal — v3
 * ---------------------------------------------------------------------------
 * Update 2: "Donation" -> "Family Support" everywhere (legal compliance).
 *           Custom amount input field + corrected close logic (no redirect).
 * Update 3: "Order Now" -> router.push('/checkout-success') real redirect.
 * Update 1: Fully mobile-responsive, sheet slides up from bottom on mobile.
 * ---------------------------------------------------------------------------
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  Shield,
  Clock,
  CheckCircle2,
  LogIn,
  DollarSign,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import AuthModal from "@/components/modals/AuthModal";
import AddReviewModal, { ReviewItem } from "@/components/reviews/AddReviewModal";
import ReviewThreadItem from "@/components/reviews/ReviewThreadItem";
import { useCart } from "@/context/CartContext";
import NumberInput from "@/components/ui/NumberInput";
import { useCatalog } from "@/context/CatalogContext";

/* ─── Service catalog ────────────────────────────────────────────────────── */

export type ServiceCategory = "food" | "health" | "energy" | "gifts" | "support";

export interface ServiceItem {
  id: string;
  titleEn: string;
  titleAr: string;
  titleTr: string;
  descEn: string;
  descAr: string;
  descTr: string;
  price: number;
  imageUrl: string;
  accentClass: string;
  /** When true, show a custom amount input instead of quantity stepper */
  customAmount?: boolean;
  category: ServiceCategory;
}

export const SERVICE_CATALOG: Record<string, ServiceItem> = {
  /* ── Original 7 ── */
  food: {
    id: "food",
    titleEn: "Food Basket",
    titleAr: "سلة غذائية",
    titleTr: "Gida Kolisi",
    descEn: "A curated basket with essential staples — rice, legumes, oil, sugar, and canned goods. Enough for a family of 4 for one week. Same-day delivery by a verified local provider.",
    descAr: "سلة متكاملة تحتوي على المواد الغذائية الأساسية: أرز وبقوليات وزيت وسكر ومعلبات. تكفي عائلة مكونة من 4 أفراد لمدة أسبوع. توصيل في نفس اليوم بواسطة مزود محلي معتمد.",
    descTr: "Pirinc, baklagiller, yag, seker ve konserve iceren curated sepet. 4 kisilik aile icin bir hafta yeterli. Onaylanmis yerel saglayici ile ayni gun teslimat.",
    price: 45.0,
    imageUrl: "https://images.pexels.com/photos/6994944/pexels-photo-6994944.jpeg?auto=compress&cs=tinysrgb&w=900",
    accentClass: "bg-amber-500",
    category: "food",
  },
  fuel: {
    id: "fuel",
    titleEn: "Fuel & Heating",
    titleAr: "محروقات وتدفئة",
    titleTr: "Yakit ve Isinma",
    descEn: "Heating fuel (diesel or firewood) for the winter months. Enough to heat a medium home for 2 weeks. Provided by certified local distributors.",
    descAr: "وقود للتدفئة (ديزل أو حطب) لأشهر الشتاء. يكفي لتدفئة منزل متوسط لأسبوعين. يوفره موزعون محليون معتمدون.",
    descTr: "Kis aylari icin isitma yakiti (mazot veya odun). Orta buyuklukte bir evi 2 hafta ısıtmaya yeter.",
    price: 60.0,
    imageUrl: "https://images.pexels.com/photos/39144594/pexels-photo-39144594.jpeg?auto=compress&cs=tinysrgb&w=900",
    accentClass: "bg-red-500",
    category: "energy",
  },
  solar: {
    id: "solar",
    titleEn: "Solar Energy Solution",
    titleAr: "منظومة طاقة شمسية",
    titleTr: "Gunes Enerjisi Sistemi",
    descEn: "A starter solar kit: 200W panel, charge controller, and 100Ah battery. Powers lights, phone charging, and small appliances. Installation by a certified technician included.",
    descAr: "مجموعة طاقة شمسية أولية: لوحة 200 واط ووحدة تحكم وبطارية 100 أمبير. تكفي للإضاءة وشحن الهواتف. يشمل التركيب من قِبل فني معتمد.",
    descTr: "Baslangic gunes enerjisi kiti: 200W panel, sarj kontrolloru, 100Ah batarya. Aydinlatma ve telefon sarji icin. Teknisyen kurulumu dahil.",
    price: 350.0,
    imageUrl: "https://images.pexels.com/photos/20782341/pexels-photo-20782341.jpeg?auto=compress&cs=tinysrgb&w=900",
    accentClass: "bg-yellow-500",
    category: "energy",
  },
  health: {
    id: "health",
    titleEn: "Health & Medical Services",
    titleAr: "خدمات صحية وطبية",
    titleTr: "Saglik ve Tibbi Hizmetler",
    descEn: "A licensed doctor home visit including examination, diagnostics, and prescription. Or a pharmacy package with essential medications. Available within 3 hours.",
    descAr: "زيارة منزلية من طبيب مرخص تشمل الكشف والتشخيص وصرف الوصفات الطبية. أو حزمة أدوية أساسية. متاحة خلال 3 ساعات.",
    descTr: "Lisansli doktor ev ziyareti: muayene, teshis ve recete. Veya temel ilac paketi. 3 saat icinde mevcut.",
    price: 55.0,
    imageUrl: "https://images.pexels.com/photos/7579823/pexels-photo-7579823.jpeg?auto=compress&cs=tinysrgb&w=900",
    accentClass: "bg-emerald-500",
    category: "health",
  },
  gifts: {
    id: "gifts",
    titleEn: "Gifts & Perfumes",
    titleAr: "هدايا وعطورات",
    titleTr: "Hediyeler ve Parfumler",
    descEn: "A curated luxury gift set — premium perfumes, gourmet sweets, or an elegant accessory box. Beautifully wrapped with a handwritten card from you.",
    descAr: "مجموعة هدايا فاخرة — عطورات راقية أو حلويات فاخرة أو صندوق هدايا أنيق. تُلفّف بشكل جميل مع بطاقة مكتوبة بخط يدك.",
    descTr: "Luxe hediye seti — premium parfumler, gurme tatlilar veya sik aksesuar kutusu. El yazisi kartla guzelce sarılır.",
    price: 75.0,
    imageUrl: "https://images.pexels.com/photos/30399680/pexels-photo-30399680.jpeg?auto=compress&cs=tinysrgb&w=900",
    accentClass: "bg-purple-500",
    category: "gifts",
  },
  flowers: {
    id: "flowers",
    titleEn: "Flower Bouquets",
    titleAr: "باقات ورد",
    titleTr: "Cicek Buketleri",
    descEn: "Fresh, hand-arranged seasonal bouquets delivered to your family's door. Perfect for birthdays, Eid, or simply to say 'I love you' from afar.",
    descAr: "باقات ورود طازجة منسّقة يدوياً توصّل إلى باب منزل عائلتك. مثالية للأعياد والمناسبات.",
    descTr: "Taze, el duzenlenmis mevsimlik buketler, ailenizin kapısına teslim. Dogum gunleri veya Bayram icin.",
    price: 35.0,
    imageUrl: "https://images.pexels.com/photos/38132275/pexels-photo-38132275.jpeg?auto=compress&cs=tinysrgb&w=900",
    accentClass: "bg-pink-500",
    category: "gifts",
  },
  meals: {
    id: "meals",
    titleEn: "Restaurant Meals & Delivery",
    titleAr: "وجبات طعام ومطاعم",
    titleTr: "Restoran Yemekleri",
    descEn: "Hot restaurant-quality meals from a local partner, delivered fresh to your family's home. Traditional dishes, grills, or full family spreads.",
    descAr: "وجبات ساخنة بجودة المطعم من مطعم محلي شريك، توصّل طازجة إلى منزل عائلتك.",
    descTr: "Yerel ortak restoranlardan sicak yemekler, ailenizin evine taze teslim.",
    price: 28.0,
    imageUrl: "https://images.pexels.com/photos/1327393/pexels-photo-1327393.jpeg?auto=compress&cs=tinysrgb&w=900",
    accentClass: "bg-brand-500",
    category: "food",
  },
  /* ── New 6 (Update 4) ── */
  direct_support: {
    id: "direct_support",
    titleEn: "Send Direct Support",
    titleAr: "أرسل مساعدة لداخل سوريا",
    titleTr: "Dogrudan Destek Gonder",
    descEn: "Send direct financial family support straight to a verified recipient inside Syria. Choose your amount — 100% reaches the family, guaranteed by escrow.",
    descAr: "أرسل دعماً مالياً مباشراً إلى مستفيد موثّق داخل سوريا. اختر المبلغ — 100% يصل للعائلة، مضمون بالضمان.",
    descTr: "Suriye'deki dogrulanmis bir aliciya dogrudan finansal aile destegi gonderin. %100 aileye ulasmasi garanti.",
    price: 50.0,
    imageUrl: "https://images.pexels.com/photos/7951671/pexels-photo-7951671.jpeg?auto=compress&cs=tinysrgb&w=900",
    accentClass: "bg-rose-500",
    category: "support",
    customAmount: true,
  },
  sponsorship: {
    id: "sponsorship",
    titleEn: "Monthly Family Sponsorship",
    titleAr: "اكفل عائلة شهرياً",
    titleTr: "Aylik Aile Sponsorlugu",
    descEn: "Commit to sponsoring a family in need on a monthly basis. Your recurring support covers food, fuel, and basic essentials. Cancel anytime.",
    descAr: "تعهّد برعاية عائلة محتاجة بشكل شهري. يغطي دعمك المتكرر الغذاء والوقود والاحتياجات الأساسية. ألغِ في أي وقت.",
    descTr: "Ihtiyac sahibi bir aileyi aylik olarak sponsorlamaya taahhut edin. Gida, yakit ve temel ihtiyaclari karsilar. Istediginizde iptal edin.",
    price: 80.0,
    imageUrl: "https://images.pexels.com/photos/3912425/pexels-photo-3912425.jpeg?auto=compress&cs=tinysrgb&w=900",
    accentClass: "bg-teal-500",
    category: "support",
    customAmount: true,
  },
  urgent_medical: {
    id: "urgent_medical",
    titleEn: "Urgent Medical Cases",
    titleAr: "حالات إنسانية وطبية عاجلة",
    titleTr: "Acil Tibbi Vakalar",
    descEn: "Fund urgent medical treatment for a specific case — surgery, hospitalization, or critical medication. Verified by a partner medical team. Every dollar tracked.",
    descAr: "موّل علاجاً طبياً عاجلاً لحالة محددة — عملية جراحية أو دخول مستشفى أو أدوية حيوية. موثّق من فريق طبي شريك. كل دولار مُتابَع.",
    descTr: "Belirli bir vaka icin acil tibbi tedaviyi finanse edin — ameliyat, hastaneye yatis veya kritik ilac. Ortak tibbi ekip tarafindan dogrulanmis.",
    price: 100.0,
    imageUrl: "https://images.pexels.com/photos/6129870/pexels-photo-6129870.jpeg?auto=compress&cs=tinysrgb&w=900",
    accentClass: "bg-red-600",
    category: "health",
    customAmount: true,
  },
  student_support: {
    id: "student_support",
    titleEn: "University Student Support",
    titleAr: "مساعدة طالب جامعي — أقساط ومواصلات",
    titleTr: "Universite Ogrencisi Destegi",
    descEn: "Help a university student afford their tuition instalment or daily transport. A little goes a long way — your support keeps them in education.",
    descAr: "ساعد طالباً جامعياً على دفع قسط دراسي أو تأمين مواصلاته اليومية. القليل يُحدث فارقاً — دعمك يُبقيه في التعليم.",
    descTr: "Universite ogrencisinin egitim taksitini veya ulasimini karsilayabilmesine yardim edin. Kucuk bir katki buyuk fark yaratir.",
    price: 40.0,
    imageUrl: "https://images.pexels.com/photos/8199557/pexels-photo-8199557.jpeg?auto=compress&cs=tinysrgb&w=900",
    accentClass: "bg-indigo-500",
    category: "support",
    customAmount: true,
  },
  request_help: {
    id: "request_help",
    titleEn: "Request Help",
    titleAr: "اطلب مساعدة",
    titleTr: "Yardim Talep Et",
    descEn: "Are you or your family in need? Submit a request for aid — food, medicine, or emergency support. Our local team will review and respond within 24 hours.",
    descAr: "هل أنت أو عائلتك بحاجة إلى مساعدة؟ قدّم طلب دعم — غذاء أو دواء أو إغاثة طارئة. فريقنا المحلي سيراجع ويرد خلال 24 ساعة.",
    descTr: "Siz veya aileniz yardima mi ihtiyac duyuyor? Yardim talebi gonderin — gida, ilac veya acil destek. Yerel ekibimiz 24 saat icinde yanit verir.",
    price: 0.0,
    imageUrl: "https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=900",
    accentClass: "bg-slate-500",
    category: "support",
  },
  heating: {
    id: "heating",
    titleEn: "Heating & Winter Needs",
    titleAr: "كسوة وتدفئة الشتاء",
    titleTr: "Kis Giysileri ve Isitma",
    descEn: "A complete winter package: warm clothing (adults & children), blankets, and heating fuel. Delivered before the cold season hits. Prioritized for vulnerable families.",
    descAr: "حزمة شتاء متكاملة: ملابس دافئة (بالغون وأطفال) وبطانيات ووقود للتدفئة. توصّل قبل حلول موسم البرد. أولوية للعائلات الأكثر هشاشة.",
    descTr: "Komple kis paketi: sicak giysiler (yetiskin ve cocuklar), battaniyeler ve isitma yakiti. Soguk mevsim gelmeden teslim. Savunmasiz aileler onceliklidir.",
    price: 70.0,
    imageUrl: "https://images.pexels.com/photos/6617753/pexels-photo-6617753.jpeg?auto=compress&cs=tinysrgb&w=900",
    accentClass: "bg-sky-500",
    category: "energy",
  },
};

/* ─── Props ──────────────────────────────────────────────────────────────── */

interface ServiceDetailsModalProps {
  serviceId: string | null;
  onClose: () => void;
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function ServiceDetailsModal({
  serviceId,
  onClose,
}: ServiceDetailsModalProps) {
  const { language } = useLanguage();
  const { addItem } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [customAmount, setCustomAmountState] = useState<string>("");
  const [locationNote, setLocationNote] = useState<string>("");
  const [authOpen, setAuthOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const { services } = useCatalog();
  const service = serviceId ? services.find((item) => item.id === serviceId) ?? null : null;

  /* Reset on service change */
  useEffect(() => {
    setQuantity(1);
    setCustomAmountState("");
    setLocationNote("");
  }, [serviceId]);

  /* Fetch reviews when service opens */
  useEffect(() => {
    if (!service) return;
    setLoadingReviews(true);
    fetch("/api/review?limit=10")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.reviews)) {
          setReviews(res.reviews);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingReviews(false));
  }, [service?.id]);

  /* Close on Escape key */
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  /* ── Computed total ──────────────────────────────────────────────────── */
  const parsedCustom = parseFloat(customAmount) || 0;
  const unitAmount = parsedCustom > 0 ? parsedCustom : service?.price ?? 0;
  const effectiveQuantity = service?.customAmount ? 1 : quantity;
  const total = (unitAmount * effectiveQuantity).toFixed(2);

  /* ── Translations ─────────────────────────────────────────────────────── */
  const T = {
    orderNow:
      language === "ar" ? "أرسل الدعم الآن" : language === "tr" ? "Simdi Destek Gonder" : "Send Support Now",
    loginToOrder:
      language === "ar" ? "سجّل الدخول للمتابعة" : language === "tr" ? "Devam Icin Giris Yap" : "Log in to Continue",
    qty: language === "ar" ? "الكمية" : language === "tr" ? "Miktar" : "Quantity",
    total: language === "ar" ? "الإجمالي" : language === "tr" ? "Toplam" : "Total",
    perUnit: language === "ar" ? "/ وحدة" : language === "tr" ? "/ adet" : "/ unit",
    eta: language === "ar" ? "التسليم خلال 2–4 ساعات • مضمون 100%" : language === "tr" ? "2–4 saat icinde teslimat • %100 garantili" : "Delivered within 2–4 hrs • 100% guaranteed",
    processing: language === "ar" ? "جارٍ المعالجة..." : language === "tr" ? "Isleniyor..." : "Processing...",
    customAmountLabel: language === "ar" ? "مبلغ الدعم (دولار)" : language === "tr" ? "Destek Tutari ($)" : "Support Amount ($)",
    customAmountPlaceholder: language === "ar" ? "أدخل مبلغاً مخصصاً..." : language === "tr" ? "Ozel tutar girin..." : "Enter a custom amount...",
    free: language === "ar" ? "مجاناً" : language === "tr" ? "Ucretsiz" : "Free",
    reviews: language === "ar" ? "تقييم" : language === "tr" ? "degerlendirme" : "reviews",
    startingFrom: language === "ar" ? "يبدأ من" : language === "tr" ? "Baslayan fiyat" : "Starting from",
    guestHint: language === "ar" ? "تصفح مجاني — الدفع فقط يتطلب حساباً" : language === "tr" ? "Ucretsiz gozatma — sadece odeme hesap gerektirir" : "Free to browse — only payment requires an account",
    requestTitle: language === "ar" ? "اطلب مساعدة" : language === "tr" ? "Yardim Talep Et" : "Request Aid",
    requestNote: language === "ar" ? "سيتواصل معك فريقنا المحلي خلال 24 ساعة." : language === "tr" ? "Yerel ekibimiz 24 saat icinde sizinle iletisime gececektir." : "Our local team will contact you within 24 hours.",
    locationLabel:
      language === "ar"
        ? "المكان أو تفاصيل إضافية (اختياري)"
        : language === "tr"
        ? "Hedef Konum / Ek Detaylar (Opsiyonel)"
        : "Target Location / Details (Optional)",
    locationPlaceholder:
      language === "ar"
        ? "مثال: إدلب، حلب، دمشق..."
        : language === "tr"
        ? "Orn: Idlib, Halep, Sam..."
        : "e.g. Idlib, Aleppo, Damascus...",
  };

  const title = service
    ? language === "ar" ? service.titleAr : language === "tr" ? service.titleTr : service.titleEn
    : "";
  const desc = service
    ? language === "ar" ? service.descAr : language === "tr" ? service.descTr : service.descEn
    : "";

  /* ── Order handler ────────────────────────────────────────────────────── */
  const handleOrder = () => {
    if (!service || service.price === 0) {
      setAuthOpen(true);
      return;
    }
    addItem(service, unitAmount, effectiveQuantity);
    onClose();
  };

  return (
    <>
      <AnimatePresence>
        {service && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              /* Update 2: clean close, no redirect */
              onClick={onClose}
              className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            />

            {/* Panel — bottom sheet on mobile, centred card on sm+ */}
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 80 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              className="relative z-10 w-full sm:max-w-lg mx-0 sm:mx-4 rounded-t-3xl sm:rounded-3xl bg-white dark:bg-slate-900 border-0 sm:border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
            >
              {/* ── Image ──────────────────────────────────────────────── */}
              <div className="relative h-44 sm:h-56 shrink-0">
                <img
                  src={service.imageUrl}
                  alt={title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                {/* Drag handle on mobile */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/40 sm:hidden" />
                {/* Close */}
                <button
                  onClick={onClose}
                  className="absolute top-3 end-3 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
                {/* Price on image */}
                <div className="absolute bottom-3 start-4">
                  <p className="text-white/70 text-xs">{T.startingFrom}</p>
                  <p className="text-white text-2xl font-black">
                    {service.price > 0 ? `$${service.price.toFixed(2)}` : T.free}
                  </p>
                </div>
                {/* Rating */}
                <div className="absolute bottom-3 end-4 flex items-center gap-1 bg-black/40 backdrop-blur rounded-full px-2.5 py-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-white text-xs font-semibold">4.9</span>
                  <span className="text-white/60 text-[10px]">(127 {T.reviews})</span>
                </div>
              </div>

              {/* ── Scrollable body ────────────────────────────────────── */}
              <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-4">
                {/* Title */}
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">{title}</h2>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span>{T.eta}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>

                {/* Trust chips */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { icon: Shield, en: "Escrow Protected", ar: "محمي بالضمان", tr: "Emanet Korumalı" },
                    { icon: CheckCircle2, en: "Verified Provider", ar: "مزود معتمد", tr: "Onaylı Sağlayıcı" },
                  ].map(({ icon: Icon, en, ar, tr }) => (
                    <span key={en} className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-full px-3 py-1">
                      <Icon className="w-3 h-3 text-brand-500" />
                      {language === "ar" ? ar : language === "tr" ? tr : en}
                    </span>
                  ))}
                </div>

                {/* ── Amount selector — works for every service ──────── */}
                {service.price > 0 && (
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-4 space-y-4">

                    {/* Custom amount input — always shown for full flexibility */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                        {T.customAmountLabel}
                      </label>
                      <div className="relative">
                        <DollarSign className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="number"
                          min={1}
                          step={1}
                          value={customAmount}
                          onChange={(e) => setCustomAmountState(e.target.value)}
                          placeholder={
                            service.customAmount
                              ? T.customAmountPlaceholder
                              : `${service.price}`
                          }
                          className="w-full ps-9 pe-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1.5">
                        {language === "ar"
                          ? `السعر الأساسي: $${service.price} — يمكنك تغييره`
                          : language === "tr"
                          ? `Temel fiyat: $${service.price} — degistirebilirsiniz`
                          : `Base price: $${service.price} — you may enter a custom amount`}
                      </p>
                    </div>

                    {/* Quantity stepper — only for non-custom services */}
                    {!service.customAmount && (
                      <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-3">
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{T.qty}</p>
                          <div className="flex items-center gap-3">
                            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-600 transition shadow-sm">
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <NumberInput integer max={99} value={quantity} label={T.qty} onCommit={setQuantity} className="w-16 h-10 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-center text-lg font-black text-slate-900 dark:text-white tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500" />
                            <button onClick={() => setQuantity((q) => Math.min(99, q + 1))} className="w-8 h-8 rounded-full bg-brand-600 hover:bg-brand-700 flex items-center justify-center text-white transition shadow-md shadow-brand-500/30">
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="text-end">
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">{T.total}</p>
                          <p className="text-xs text-slate-400">${service.price.toFixed(2)} {T.perUnit}</p>
                        </div>
                      </div>
                    )}

                    {/* Total row */}
                    <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-3">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{T.total}</span>
                      <span className="text-2xl font-black text-brand-600 dark:text-brand-400 tabular-nums">
                        ${total}
                      </span>
                    </div>
                  </div>
                )}

                {/* Special UI for "Request Help" (free, no payment) */}
                {service.price === 0 && (
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 px-4 py-4 text-sm text-slate-600 dark:text-slate-400">
                    <p className="font-semibold text-slate-800 dark:text-white mb-1">{T.requestTitle}</p>
                    <p>{T.requestNote}</p>
                  </div>
                )}

                {/* Target Location / Details — shown on all services */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    {T.locationLabel}
                  </label>
                  <input
                    type="text"
                    value={locationNote}
                    onChange={(e) => setLocationNote(e.target.value)}
                    placeholder={T.locationPlaceholder}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                  />
                </div>

                {/* CTA */}
                <button
                  onClick={handleOrder}
                  className="w-full py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] shadow-xl disabled:opacity-60
                    bg-gradient-to-r from-rose-600 via-brand-600 to-brand-500 hover:from-rose-700 hover:to-brand-600 shadow-brand-500/20"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {service.price > 0 ? (language === "ar" ? "أضف إلى السلة" : language === "tr" ? "Sepete ekle" : "Add to basket") : T.requestTitle}
                </button>

                <p className="text-center text-xs text-slate-400 dark:text-slate-500 -mt-2 pb-1">
                  {language === "ar" ? "يمكنك التصفح والإضافة للسلة دون تسجيل الدخول." : language === "tr" ? "Giriş yapmadan hizmetleri inceleyip sepete ekleyebilirsiniz." : "Browse and add services to your basket without signing in."}
                </p>

                {/* ── Reviews & Smart AI Responder Section ──────────────── */}
                <div className="pt-4 border-t border-slate-200 dark:border-[#d4af37]/20 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-500 flex items-center justify-center">
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {language === "ar" ? "التقييمات والرد الذكي" : language === "tr" ? "Değerlendirmeler ve Akıllı Yanıt" : "Reviews and Smart AI Replies"}
                      </h3>
                      {reviews.length > 0 && (
                        <span className="text-[11px] font-semibold text-slate-400">
                          ({reviews.length})
                        </span>
                      )}
                    </div>

                    {/* Requirement 1: Add Review Button */}
                    <button
                      type="button"
                      onClick={() => setReviewModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#ffd700]/15 to-[#d4af37]/20 hover:from-[#ffd700]/30 hover:to-[#d4af37]/35 border border-[#d4af37]/50 text-xs font-bold text-[#b8930a] dark:text-[#ffd700] transition active:scale-95 shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>{language === "ar" ? "أضف تقييماً" : language === "tr" ? "Değerlendirme Ekle" : "Add Review"}</span>
                    </button>
                  </div>

                  {/* Reviews Thread List */}
                  {loadingReviews ? (
                    <div className="flex items-center justify-center py-5 text-xs text-slate-400 gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-[#d4af37]" />
                      <span>{language === "ar" ? "جاري تحميل التقييمات..." : "Loading reviews..."}</span>
                    </div>
                  ) : reviews.length === 0 ? (
                    <div className="text-center py-5 px-4 rounded-2xl bg-slate-50 dark:bg-[#142319] border border-dashed border-slate-200 dark:border-[#d4af37]/25">
                      <p className="text-xs text-slate-500 dark:text-slate-300">
                        {language === "ar"
                          ? "لا توجد تقييمات مسجلة بعد. كن أول من يقيّم الخدمة واحصل على رد ذكي فوري!"
                          : "No reviews yet. Be the first to add a review and get an instant AI reply!"}
                      </p>
                      <button
                        type="button"
                        onClick={() => setReviewModalOpen(true)}
                        className="mt-3 inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#ffd700] via-[#d4af37] to-[#b8930a] text-[#0f1b13] text-sm font-bold shadow-lg shadow-[#d4af37]/20 hover:brightness-105 transition"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>{language === "ar" ? "⭐ أضف تقييماً لهذه الخدمة" : "⭐ Add Review for this Service"}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="space-y-3 max-h-80 overflow-y-auto pe-1 [scrollbar-width:thin]">
                        {reviews.map((rev) => (
                          <ReviewThreadItem key={rev.id} review={rev} />
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => setReviewModalOpen(true)}
                        className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-[#d4af37]/25 to-amber-500/15 hover:from-[#ffd700]/30 hover:to-[#d4af37]/45 border border-[#d4af37]/60 text-slate-900 dark:text-[#ffd700] text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.01] active:scale-[0.98]"
                      >
                        <Sparkles className="w-4 h-4 text-[#d4af37]" />
                        <span>{language === "ar" ? "⭐ أضف تقييماً آخر لهذه الخدمة" : "⭐ Add another review"}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Auth modal — only when guest taps "Log in to Continue" */}
      {/* Add Review Modal */}
      <AddReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        serviceTitle={title}
        onReviewSubmitted={(newReview) => {
          setReviews((prev) => [newReview, ...prev]);
        }}
      />

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode="login"
      />
    </>
  );
}
