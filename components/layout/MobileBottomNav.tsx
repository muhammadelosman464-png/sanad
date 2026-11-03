"use client";

import Link from "next/link";
import { Home, LayoutGrid, ClipboardList, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";

export default function MobileBottomNav() {
  const { language } = useLanguage();
  const { totalItems, openCart } = useCart();

  const labels = language === "ar"
    ? { home: "الرئيسية", services: "الخدمات", cart: "السلة", orders: "طلباتي", cartAria: "فتح السلة" }
    : language === "tr"
    ? { home: "Ana sayfa", services: "Hizmetler", cart: "Sepet", orders: "Siparişler", cartAria: "Sepeti aç" }
    : { home: "Home", services: "Services", cart: "Cart", orders: "Orders", cartAria: "Open cart" };

  const itemClass =
    "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-semibold text-slate-600 dark:text-slate-300 transition active:scale-95";

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#07110d]/95 backdrop-blur-xl sm:hidden pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-stretch">
        <Link href="/" className={itemClass}>
          <Home className="w-5 h-5" />
          <span>{labels.home}</span>
        </Link>
        <Link href="/#services" className={itemClass}>
          <LayoutGrid className="w-5 h-5" />
          <span>{labels.services}</span>
        </Link>
        <button type="button" onClick={openCart} className={itemClass} aria-label={labels.cartAria}>
          <span className="relative">
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -end-2 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </span>
          <span>{labels.cart}</span>
        </button>
        <Link href="/my-orders" className={itemClass}>
          <ClipboardList className="w-5 h-5" />
          <span>{labels.orders}</span>
        </Link>
      </div>
    </nav>
  );
}
