"use client";

import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, PackagePlus, Trash2, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCatalog } from "@/context/CatalogContext";
import { toast } from "@/components/ui/Toast";
import NumberInput from "@/components/ui/NumberInput";
import type { ServiceCategory } from "@/components/modals/ServiceDetailsModal";

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: ServiceCategory[] = ["food", "health", "energy", "gifts", "support"];

export default function AdminDashboardModal({ isOpen, onClose }: AdminDashboardModalProps) {
  const { language } = useLanguage();
  const { services, addService, updatePrice, removeService } = useCatalog();
  const [titleEn, setTitleEn] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [newPrice, setNewPrice] = useState(50);
  const [newCategory, setNewCategory] = useState<ServiceCategory>("support");

  const copy = language === "ar"
    ? { title: "لوحة التحكم", subtitle: "إدارة الخدمات والأسعار", close: "إغلاق", priceList: "الخدمات والأسعار", priceLabel: "السعر بالدولار", addTitle: "إضافة منتج جديد", nameAr: "اسم المنتج بالعربية", nameEn: "اسم المنتج بالإنجليزية", category: "التصنيف", add: "إضافة المنتج", added: "تمت إضافة المنتج", deleted: "تم حذف الخدمة", deleteLabel: "حذف", empty: "لا توجد خدمات حالياً", categories: { food: "طعام", health: "صحة", energy: "طاقة", gifts: "هدايا", support: "دعم" } }
    : language === "tr"
    ? { title: "Yönetim paneli", subtitle: "Hizmet ve fiyat yönetimi", close: "Kapat", priceList: "Hizmetler ve fiyatlar", priceLabel: "Fiyat (USD)", addTitle: "Yeni ürün ekle", nameAr: "Ürün adı (Arapça)", nameEn: "Ürün adı (İngilizce)", category: "Kategori", add: "Ürünü ekle", added: "Ürün eklendi", deleted: "Hizmet silindi", deleteLabel: "Sil", empty: "Henüz hizmet yok", categories: { food: "Gıda", health: "Sağlık", energy: "Enerji", gifts: "Hediyeler", support: "Destek" } }
    : { title: "Admin panel", subtitle: "Manage services and prices", close: "Close", priceList: "Services and prices", priceLabel: "Price (USD)", addTitle: "Add a new product", nameAr: "Product name (Arabic)", nameEn: "Product name (English)", category: "Category", add: "Add product", added: "Product added", deleted: "Service deleted", deleteLabel: "Delete", empty: "No services yet", categories: { food: "Food", health: "Health", energy: "Energy", gifts: "Gifts", support: "Support" } };

  const addProduct = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!titleEn.trim() || !titleAr.trim()) return;
    addService({ titleEn: titleEn.trim(), titleAr: titleAr.trim(), price: newPrice, category: newCategory });
    setTitleEn("");
    setTitleAr("");
    setNewPrice(50);
    toast.success(copy.added);
  };

  const deleteService = (id: string) => {
    removeService(id);
    toast.success(copy.deleted);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            aria-label={copy.close}
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[30px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 end-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              aria-label={copy.close}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-7">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[.16em] text-emerald-600">{copy.subtitle}</p>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">{copy.title}</h2>
              </div>
            </div>

            <section className="space-y-3">
              <h3 className="text-sm font-black text-slate-700 dark:text-slate-200">{copy.priceList}</h3>
              {services.length === 0 && <p className="text-sm text-slate-500">{copy.empty}</p>}
              <ul className="space-y-2">
                {services.map((service) => (
                  <li
                    key={service.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{language === "ar" ? service.titleAr : service.titleEn}</p>
                      <p className="text-xs text-slate-500">{copy.categories[service.category]}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                        {copy.priceLabel}
                        <NumberInput
                          label={`${copy.priceLabel} ${service.titleEn}`}
                          min={0}
                          value={service.price}
                          onCommit={(next) => updatePrice(service.id, next)}
                          className="w-28 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => deleteService(service.id)}
                        aria-label={`${copy.deleteLabel} ${service.titleEn}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-3 py-2 text-sm font-bold shadow-md shadow-rose-900/20 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                        {copy.deleteLabel}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <form onSubmit={addProduct} className="mt-8 space-y-4 rounded-2xl border border-dashed border-emerald-500/50 p-5">
              <h3 className="flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-200">
                <PackagePlus className="w-4 h-4 text-emerald-600" />
                {copy.addTitle}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  required
                  value={titleAr}
                  onChange={(event) => setTitleAr(event.target.value)}
                  placeholder={copy.nameAr}
                  aria-label={copy.nameAr}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  required
                  value={titleEn}
                  onChange={(event) => setTitleEn(event.target.value)}
                  placeholder={copy.nameEn}
                  aria-label={copy.nameEn}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <NumberInput
                  label={copy.priceLabel}
                  min={0}
                  value={newPrice}
                  onCommit={setNewPrice}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <select
                  value={newCategory}
                  onChange={(event) => setNewCategory(event.target.value as ServiceCategory)}
                  aria-label={copy.category}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {copy.categories[category]}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="w-full rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white py-3 font-bold transition">
                {copy.add}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
