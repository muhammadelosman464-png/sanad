"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Bell, Camera, Inbox, Loader2, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { toast } from "@/components/ui/Toast";

type Panel = "inbox" | "notifications" | null;

interface PanelItem {
  id: string;
  kind: "inbox" | "notifications";
  topic: "message" | "delivery";
}

const SEED_ITEMS: PanelItem[] = [
  { id: "msg-1", kind: "inbox", topic: "message" },
  { id: "ntf-1", kind: "notifications", topic: "delivery" },
];

const CONTACT_TOAST = "سيتم التواصل معك في أقرب وقت";

const VISUAL_SEARCH_DELAY_MS = 1500;

export default function Header() {
  const { language } = useLanguage();
  const { totalItems, openCart } = useCart();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [panel, setPanel] = useState<Panel>(null);
  const [items, setItems] = useState<PanelItem[]>(SEED_ITEMS);
  const panelRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [visualPreview, setVisualPreview] = useState<string | null>(null);
  const [visualLoading, setVisualLoading] = useState(false);
  const visualTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const handler = (event: Event) => {
      if ((event as CustomEvent<string | null>).detail !== null) return;
      clearTimeout(visualTimerRef.current);
      setVisualPreview(null);
      setVisualLoading(false);
    };
    window.addEventListener("sanad-visual-search", handler);
    return () => window.removeEventListener("sanad-visual-search", handler);
  }, []);

  useEffect(() => {
    if (!visualPreview) return;
    return () => URL.revokeObjectURL(visualPreview);
  }, [visualPreview]);

  useEffect(() => () => clearTimeout(visualTimerRef.current), []);

  useEffect(() => {
    const handler = (event: Event) => setQuery((event as CustomEvent<string>).detail);
    window.addEventListener("sanad-search", handler);
    return () => window.removeEventListener("sanad-search", handler);
  }, []);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) setPanel(null);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const dispatchVisualSearch = (fileName: string | null) =>
    window.dispatchEvent(new CustomEvent("sanad-visual-search", { detail: fileName }));

  const handleVisualSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    clearTimeout(visualTimerRef.current);
    setVisualPreview(URL.createObjectURL(file));
    setVisualLoading(true);
    visualTimerRef.current = setTimeout(() => {
      setVisualLoading(false);
      dispatchVisualSearch(file.name);
    }, VISUAL_SEARCH_DELAY_MS);
  };

  const clearVisualSearch = () => {
    clearTimeout(visualTimerRef.current);
    dispatchVisualSearch(null);
  };

  const updateSearch = (value: string) => {
    setQuery(value);
    if (visualPreview) clearVisualSearch();
    window.dispatchEvent(new CustomEvent("sanad-search", { detail: value }));
  };

  const deleteItem = (id: string) => setItems((current) => current.filter((item) => item.id !== id));

  const copy = language === "ar" ? { placeholder: "ابحث عن خدمة أو مساعدة...", inbox: "الرسائل", alerts: "الإشعارات", menu: "القائمة", newMessage: "رسالة جديدة من فريق سَنَد", messageHint: "يسعدنا مساعدتك في طلبك القادم.", delivery: "تم تأكيد توصيل طلب", deliveryHint: "سيصلك إثبات التسليم قريباً.", back: "رجوع", remove: "حذف", contact: "تواصل / قبول", empty: "لا توجد عناصر حالياً", clearImage: "إزالة الصورة" } : language === "tr" ? { placeholder: "Hizmet veya destek ara...", inbox: "Mesajlar", alerts: "Bildirimler", menu: "Menü", newMessage: "Sanad ekibinden yeni mesaj", messageHint: "Bir sonraki siparişinizde size yardımcı olmaktan mutluluk duyarız.", delivery: "Sipariş teslimatı onaylandı", deliveryHint: "Teslimat kanıtı yakında gelecek.", back: "Geri", remove: "Sil", contact: "İletişim / Kabul", empty: "Şu anda öğe yok", clearImage: "Görseli kaldır" } : { placeholder: "Search services or support...", inbox: "Inbox", alerts: "Notifications", menu: "Menu", newMessage: "New message from Sanad", messageHint: "We are here to help with your next order.", delivery: "Order delivery confirmed", deliveryHint: "Your delivery proof is on its way.", back: "Back", remove: "Delete", contact: "Contact / Accept", empty: "Nothing here right now", clearImage: "Remove image" };

  const inboxCount = items.filter((item) => item.kind === "inbox").length;
  const alertCount = items.filter((item) => item.kind === "notifications").length;
  const visibleItems = items.filter((item) => item.kind === panel);

  const navLinks = [
    { href: "/#services", label: language === "ar" ? "الخدمات" : language === "tr" ? "Hizmetler" : "Services" },
    { href: "/#how-it-works", label: language === "ar" ? "كيف تعمل" : language === "tr" ? "Nasıl çalışır" : "How it works" },
    { href: "/my-orders", label: language === "ar" ? "طلباتي" : language === "tr" ? "Siparişlerim" : "My orders" },
  ];

  const iconButtonClass =
    "relative hidden sm:flex w-10 h-10 rounded-xl items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-emerald-950/70 bg-white/90 dark:bg-[#07110d]/90 backdrop-blur-2xl">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-[78px] flex items-center gap-2 lg:gap-4">
          <button
            onClick={() => router.back()}
            className="shrink-0 w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition"
            aria-label={copy.back}
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          </button>
          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="shrink-0 w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition"
            aria-label={copy.menu}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Link href="/" className="shrink-0 flex items-center gap-2.5 group">
            <div className="relative w-11 h-11 rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-emerald-100 dark:ring-emerald-900/60">
              <Image src="/logo.jpeg" alt="Sanad" fill sizes="44px" className="object-cover" priority />
            </div>
            <div className="hidden xl:block">
              <p className="text-lg font-black tracking-tight text-slate-950 dark:text-white leading-none">Sanad</p>
              <p className="text-[10px] font-bold tracking-[0.2em] text-emerald-700 dark:text-emerald-400 uppercase mt-1">Support, delivered</p>
            </div>
          </Link>

          <input ref={imageInputRef} type="file" accept="image/*" capture="environment" onChange={handleVisualSearch} className="hidden" aria-hidden="true" tabIndex={-1} />
          <div className="relative flex-1 max-w-2xl mx-auto">
            {visualPreview ? (
              <div className="absolute start-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full overflow-hidden ring-2 ring-emerald-500/60 z-10">
                <img src={visualPreview} alt="" className="w-full h-full object-cover" />
                {visualLoading && (
                  <span className="absolute inset-0 flex items-center justify-center bg-slate-950/60">
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  </span>
                )}
              </div>
            ) : (
              <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            )}
            <input
              value={query}
              onChange={(event) => updateSearch(event.target.value)}
              placeholder={copy.placeholder}
              aria-label={copy.placeholder}
              className={`w-full h-12 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100/80 dark:bg-slate-900/80 ps-12 ${visualPreview ? "pe-24" : "pe-14"} text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition`}
            />
            {visualPreview && (
              <button
                type="button"
                onClick={clearVisualSearch}
                aria-label={copy.clearImage}
                className="absolute end-11 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-slate-500 hover:text-rose-500 hover:bg-white dark:hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              className="absolute end-2 top-2 w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-emerald-600 hover:bg-white dark:hover:bg-slate-800 transition"
              aria-label="Visual search" onClick={() => imageInputRef.current?.click()}
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div ref={panelRef} className="relative flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button onClick={() => setPanel(panel === "inbox" ? null : "inbox")} className={iconButtonClass} aria-label={copy.inbox}>
              <Inbox className="w-5 h-5" />
              {inboxCount > 0 && (
                <span className="absolute -top-1 -end-1 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                  {inboxCount}
                </span>
              )}
            </button>
            <button onClick={() => setPanel(panel === "notifications" ? null : "notifications")} className={iconButtonClass} aria-label={copy.alerts}>
              <Bell className="w-5 h-5" />
              {alertCount > 0 && (
                <span className="absolute -top-1 -end-1 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                  {alertCount}
                </span>
              )}
            </button>
            <button
              onClick={openCart}
              className="relative w-11 h-11 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center shadow-lg shadow-emerald-700/20 transition hover:-translate-y-0.5"
              aria-label="Shopping cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -end-2 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white dark:ring-[#07110d]">
                  {totalItems}
                </span>
              )}
            </button>
            <div className="hidden md:block"><LanguageSwitcher /></div>

            <AnimatePresence>
              {panel && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="absolute end-0 top-14 w-80 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl p-4 z-30"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-black text-slate-900 dark:text-white">{panel === "inbox" ? copy.inbox : copy.alerts}</h3>
                    <span className="text-[10px] font-bold text-emerald-600">{visibleItems.length}</span>
                  </div>
                  {visibleItems.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-6">{copy.empty}</p>
                  ) : (
                    <ul className="space-y-2">
                      {visibleItems.map((item) => (
                        <motion.li
                          key={item.id}
                          layout
                          exit={{ opacity: 0, x: 16 }}
                          className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3"
                        >
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{item.topic === "message" ? copy.newMessage : copy.delivery}</p>
                          <p className="text-xs text-slate-500 mt-1">{item.topic === "message" ? copy.messageHint : copy.deliveryHint}</p>
                          <div className="mt-3 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => deleteItem(item.id)}
                              className="rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 dark:hover:bg-rose-950/40 transition"
                            >
                              {copy.remove}
                            </button>
                            <button
                              type="button"
                              onClick={() => toast.success(CONTACT_TOAST)}
                              className="rounded-lg bg-emerald-700 hover:bg-emerald-800 px-3 py-1.5 text-xs font-bold text-white transition"
                            >
                              {copy.contact}
                            </button>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {menuOpen && (
          <nav className="pb-4 flex flex-wrap gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                onClick={() => setMenuOpen(false)}
                href={link.href}
                className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-900 text-sm font-bold text-slate-700 dark:text-slate-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
