"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import NumberInput from "@/components/ui/NumberInput";

export default function CartDrawer() {
  const { language } = useLanguage();
  const { items, totalAmount, updateQuantity, removeItem, isOpen, closeCart } = useCart();
  const copy = language === "ar" ? {
    title: "سلة الطلبات", empty: "سلتك فارغة", emptyHint: "أضف خدمة لتبدأ دعم عائلتك.", checkout: "متابعة الدفع", total: "الإجمالي", browse: "تصفح الخدمات",
  } : language === "tr" ? {
    title: "Sipariş Sepeti", empty: "Sepetiniz boş", emptyHint: "Ailenize destek olmak için bir hizmet ekleyin.", checkout: "Ödemeye Geç", total: "Toplam", browse: "Hizmetlere Göz At",
  } : {
    title: "Order basket", empty: "Your basket is empty", emptyHint: "Add a service to start supporting your family.", checkout: "Proceed to checkout", total: "Total", browse: "Browse services",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70]">
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeCart} className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" aria-label="Close cart" />
          <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 280 }} className="absolute end-0 top-0 h-full w-full max-w-md bg-[#f7faf8] dark:bg-slate-950 border-s border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-5 border-b border-slate-200 dark:border-slate-800">
              <div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">Sanad</p><h2 className="text-xl font-black text-slate-900 dark:text-white">{copy.title}</h2></div>
              <button onClick={closeCart} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500" aria-label="Close cart"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {items.length === 0 ? <div className="h-full flex flex-col items-center justify-center text-center"><div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center mb-5"><ShoppingBag className="w-8 h-8" /></div><h3 className="font-bold text-slate-900 dark:text-white">{copy.empty}</h3><p className="text-sm text-slate-500 mt-2 max-w-[230px]">{copy.emptyHint}</p><button onClick={closeCart} className="mt-6 text-sm font-bold text-emerald-700 dark:text-emerald-400">{copy.browse}</button></div> : <div className="space-y-3">{items.map((item) => { const title = language === "ar" ? item.service.titleAr : language === "tr" ? item.service.titleTr : item.service.titleEn; return <div key={item.service.id} className="flex gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"><img src={item.service.imageUrl} alt={title} className="w-16 h-16 rounded-xl object-cover" /><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">{title}</h3><button onClick={() => removeItem(item.service.id)} className="text-slate-400 hover:text-rose-500" aria-label={`Remove ${title}`}><Trash2 className="w-4 h-4" /></button></div><p className="text-sm font-black text-emerald-700 dark:text-emerald-400 mt-1">${(item.amount * item.quantity).toFixed(2)}</p><div className="flex items-center gap-2 mt-2"><button onClick={() => updateQuantity(item.service.id, item.quantity - 1)} className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center"><Minus className="w-3 h-3" /></button><NumberInput label={`Quantity for ${title}`} integer value={item.quantity} onCommit={(next) => updateQuantity(item.service.id, next)} className="w-12 h-7 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-center text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500" /><button onClick={() => updateQuantity(item.service.id, item.quantity + 1)} className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center"><Plus className="w-3 h-3" /></button></div></div></div>; })}</div>}
            </div>
            {items.length > 0 && <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70"><div className="flex justify-between mb-4"><span className="text-sm text-slate-500">{copy.total}</span><strong className="text-xl text-slate-900 dark:text-white">${totalAmount.toFixed(2)}</strong></div><Link href="/checkout" onClick={closeCart} className="block w-full rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white py-3.5 text-center font-bold transition-transform duration-150 active:scale-[0.97]">{copy.checkout}</Link></div>}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
