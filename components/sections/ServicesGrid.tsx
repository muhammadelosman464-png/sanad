"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Heart, ShoppingCart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import ServiceDetailsModal, { SERVICE_CATALOG } from "@/components/modals/ServiceDetailsModal";

const serviceImages: Record<string, string> = {
  food: "https://images.pexels.com/photos/6994944/pexels-photo-6994944.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  fuel: "https://images.pexels.com/photos/7551587/pexels-photo-7551587.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  solar: "https://images.pexels.com/photos/20782341/pexels-photo-20782341.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  health: "https://images.pexels.com/photos/7579823/pexels-photo-7579823.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  gifts: "https://images.pexels.com/photos/30399680/pexels-photo-30399680.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  flowers: "https://images.pexels.com/photos/38132275/pexels-photo-38132275.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  meals: "https://images.pexels.com/photos/6248880/pexels-photo-6248880.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
};

interface ServicesGridProps { searchTerm?: string; }

export default function ServicesGrid({ searchTerm = "" }: ServicesGridProps) {
  const { language, direction, t } = useLanguage();
  const { addItem } = useCart();
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);
  const services = Object.values(SERVICE_CATALOG);
  const filtered = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return services;
    return services.filter((service) => [service.titleEn, service.titleAr, service.titleTr, service.descEn, service.descAr, service.descTr].some((value) => value.toLowerCase().includes(query)));
  }, [searchTerm]);
  const ArrowIcon = direction === "rtl" ? ArrowLeft : ArrowRight;

  return <section id="services" className="relative py-20 sm:py-28 bg-transparent"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"><div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10"><div><div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-[0.18em] mb-3"><Heart className="w-4 h-4 fill-current" />{language === "ar" ? "اختر طريقة دعمك" : language === "tr" ? "Destek seçiminizi yapın" : "Choose your support"}</div><h2 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">{t("servicesHeading")}</h2><p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400 leading-relaxed">{t("servicesSubheading")}</p></div><div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400"><Check className="w-4 h-4 text-emerald-500" /> {language === "ar" ? "خدمات موثّقة بالكامل" : language === "tr" ? "Tamamen doğrulanmış hizmetler" : "Fully verified services"}</div></div>{filtered.length === 0 ? <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center text-slate-500">{language === "ar" ? "لم يتم العثور على خدمة مطابقة" : language === "tr" ? "Eşleşen hizmet bulunamadı" : "No matching service found"}</div> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">{filtered.map((service, index) => { const title = language === "ar" ? service.titleAr : language === "tr" ? service.titleTr : service.titleEn; const description = language === "ar" ? service.descAr : language === "tr" ? service.descTr : service.descEn; const image = serviceImages[service.id] ?? service.imageUrl; return <motion.article key={service.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: Math.min(index * 0.04, 0.3), duration: 0.45 }} whileHover={{ y: -8 }} className="group overflow-hidden rounded-[28px] bg-white/85 dark:bg-slate-900/80 backdrop-blur-xl border border-white dark:border-slate-800 shadow-[0_14px_45px_rgba(15,23,42,0.08)] dark:shadow-black/20 hover:shadow-[0_24px_65px_rgba(15,23,42,0.16)] transition-shadow"><button onClick={() => setActiveServiceId(service.id)} className="block w-full text-start"><div className="relative h-44 overflow-hidden"><img src={image} alt={title} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent" /><span className="absolute bottom-4 start-4 text-white text-lg font-black">{title}</span><span className="absolute top-4 end-4 rounded-full bg-white/90 dark:bg-slate-950/80 px-3 py-1 text-xs font-black text-emerald-700 dark:text-emerald-300">{service.price > 0 ? `From $${service.price}` : language === "ar" ? "مجاناً" : "Free"}</span></div></button><div className="p-5"><p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 min-h-10">{description}</p><div className="flex items-center justify-between gap-3 mt-5"><button onClick={() => setActiveServiceId(service.id)} className="flex items-center gap-1.5 text-xs font-black text-slate-700 dark:text-slate-200 hover:text-emerald-600 transition">{language === "ar" ? "التفاصيل" : language === "tr" ? "Detaylar" : "View details"}<ArrowIcon className="w-3.5 h-3.5" /></button>{service.price > 0 ? <button onClick={() => addItem(service)} className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2.5 text-xs font-black transition hover:scale-[1.03] active:scale-95"><ShoppingCart className="w-3.5 h-3.5" />{language === "ar" ? "أضف للسلة" : language === "tr" ? "Sepete ekle" : "Add to basket"}</button> : <button onClick={() => setActiveServiceId(service.id)} className="rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 text-xs font-black text-slate-700 dark:text-slate-200">{language === "ar" ? "اطلب المساعدة" : language === "tr" ? "Yardım iste" : "Request help"}</button>}</div></div></motion.article>; })}</div>}</div></section>;
}
