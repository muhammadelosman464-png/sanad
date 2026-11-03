"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, SearchX, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import ServiceDetailsModal, {
  SERVICE_CATALOG,
  type ServiceCategory,
  type ServiceItem,
} from "@/components/modals/ServiceDetailsModal";
import { toast } from "@/components/ui/Toast";

type FilterId = "all" | ServiceCategory;

const FILTERS: { id: FilterId; en: string; ar: string; tr: string }[] = [
  { id: "all", en: "All", ar: "الجميع", tr: "Tümü" },
  { id: "food", en: "Food", ar: "مواد غذائية", tr: "Gıda" },
  { id: "health", en: "Health", ar: "صحة", tr: "Sağlık" },
  { id: "energy", en: "Energy", ar: "طاقة", tr: "Enerji" },
  { id: "gifts", en: "Gifts", ar: "هدايا", tr: "Hediyeler" },
  { id: "support", en: "Direct support", ar: "دعم مباشر", tr: "Doğrudan destek" },
];

const LOADING_DURATION_MS = 700;
const SKELETON_COUNT = 6;

export default function ServicesGrid({ searchTerm }: { searchTerm: string }) {
  const { language } = useLanguage();
  const { addItem } = useCart();
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const [selected, setSelected] = useState<ServiceItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), LOADING_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  const services = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return Object.values(SERVICE_CATALOG).filter((service) => {
      const matchesFilter = activeFilter === "all" || service.category === activeFilter;
      if (!matchesFilter) return false;
      if (!query) return true;
      const haystack = [service.titleEn, service.titleAr, service.titleTr, service.descEn, service.descAr, service.descTr]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [searchTerm, activeFilter]);

  const text = {
    heading: language === "ar" ? "خدماتنا" : language === "tr" ? "Hizmetlerimiz" : "Our services",
    emptyTitle:
      language === "ar"
        ? "عذراً، لم نجد الخدمة المطلوبة"
        : language === "tr"
        ? "Üzgünüz, aradığınız hizmet bulunamadı"
        : "Sorry, we couldn't find that service",
    emptyHint:
      language === "ar"
        ? "جرّب كلمة بحث أخرى أو اختر تصنيفاً مختلفاً"
        : language === "tr"
        ? "Başka bir arama deneyin veya farklı bir kategori seçin"
        : "Try another search term or pick a different category",
    reset: language === "ar" ? "عرض كل الخدمات" : language === "tr" ? "Tüm hizmetleri göster" : "Show all services",
    viewDetails: language === "ar" ? "عرض التفاصيل" : language === "tr" ? "Detayları gör" : "View details",
    addToCart: language === "ar" ? "أضف إلى السلة" : language === "tr" ? "Sepete ekle" : "Add to cart",
    requestHelp: language === "ar" ? "طلب مساعدة" : language === "tr" ? "Yardım talep et" : "Request help",
    added: language === "ar" ? "تمت الإضافة إلى السلة" : language === "tr" ? "Sepete eklendi" : "Added to cart",
    from: language === "ar" ? "يبدأ من" : language === "tr" ? "Başlangıç" : "From",
    free: language === "ar" ? "مجاناً" : language === "tr" ? "Ücretsiz" : "Free",
  };

  const titleFor = (service: ServiceItem) =>
    language === "ar" ? service.titleAr : language === "tr" ? service.titleTr : service.titleEn;
  const descFor = (service: ServiceItem) =>
    language === "ar" ? service.descAr : language === "tr" ? service.descTr : service.descEn;
  const labelFor = (filter: (typeof FILTERS)[number]) =>
    language === "ar" ? filter.ar : language === "tr" ? filter.tr : filter.en;

  const handleAdd = (event: React.MouseEvent, service: ServiceItem) => {
    event.stopPropagation();
    addItem(service);
    toast.success(text.added);
  };

  return (
    <section id="services" className="scroll-mt-28 px-4 sm:px-6 lg:px-8 pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="sticky top-16 z-20 -mx-4 sm:-mx-6 lg:-mx-8 mb-6 bg-[#f6faf7]/90 dark:bg-[#07110d]/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4 mb-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{text.heading}</h2>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 tabular-nums">{services.length}</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {FILTERS.map((filter) => {
              const active = activeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  aria-pressed={active}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    active
                      ? "bg-brand-700 text-white shadow-md shadow-brand-700/25"
                      : "bg-white text-slate-700 border border-slate-200 hover:border-brand-400 hover:text-brand-700 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700"
                  }`}
                >
                  {labelFor(filter)}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true">
            {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
              <div
                key={index}
                className="rounded-3xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 overflow-hidden shadow-xl shadow-slate-900/5 animate-pulse"
              >
                <div className="h-44 bg-slate-200 dark:bg-slate-800" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-3 w-4/5 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-10 w-full rounded-xl bg-slate-200 dark:bg-slate-800 mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center text-center py-16 px-6 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/50 backdrop-blur-sm"
          >
            <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-900/40 flex items-center justify-center mb-5">
              <SearchX className="w-8 h-8 text-brand-600 dark:text-brand-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{text.emptyTitle}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm">{text.emptyHint}</p>
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className="rounded-full bg-brand-700 hover:bg-brand-800 text-white text-sm font-semibold px-6 py-2.5 transition"
            >
              {text.reset}
            </button>
          </motion.div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {services.map((service) => {
                const isFree = service.price === 0;
                return (
                  <motion.div
                    key={service.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -8 }}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelected(service)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelected(service);
                      }
                    }}
                    className="group cursor-pointer rounded-3xl overflow-hidden bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl border border-white/70 dark:border-white/10 shadow-xl shadow-slate-900/10 hover:shadow-2xl hover:shadow-brand-900/15 transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <Image
                        src={service.imageUrl}
                        alt={titleFor(service)}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      <span className="absolute top-3 end-3 rounded-full bg-white/90 dark:bg-slate-900/90 px-3 py-1 text-xs font-bold text-brand-800 dark:text-brand-300 shadow">
                        {isFree ? text.free : `${text.from} $${service.price.toFixed(0)}`}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">{titleFor(service)}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 mb-4">
                        {descFor(service)}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="flex-1 text-sm font-semibold text-brand-700 dark:text-brand-300 group-hover:underline underline-offset-4">
                          {text.viewDetails}
                        </span>
                        {!isFree && (
                          <button
                            type="button"
                            onClick={(event) => handleAdd(event, service)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-sm font-semibold px-4 py-2.5 shadow-md shadow-brand-700/25 transition-all hover:scale-[1.03] active:scale-[0.98]"
                          >
                            <Plus className="w-4 h-4" />
                            <span>{text.addToCart}</span>
                          </button>
                        )}
                        {isFree && (
                          <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold px-4 py-2.5">
                            <ShoppingBag className="w-4 h-4" />
                            {text.requestHelp}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <ServiceDetailsModal
        service={selected}
        isOpen={selected !== null}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}
