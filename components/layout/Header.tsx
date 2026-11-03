"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, Camera, Inbox, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import ThemeToggle from "@/components/ui/ThemeToggle";

type Panel = "inbox" | "notifications" | null;

export default function Header() {
  const { language } = useLanguage();
  const { totalItems, openCart } = useCart();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [panel, setPanel] = useState<Panel>(null);
  const panelRef = useRef<HTMLDivElement>(null);

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

  const updateSearch = (value: string) => {
    setQuery(value);
    window.dispatchEvent(new CustomEvent("sanad-search", { detail: value }));
  };

  const copy = language === "ar" ? { placeholder: "ابحث عن خدمة أو مساعدة...", inbox: "الرسائل", alerts: "الإشعارات", menu: "القائمة", newMessage: "رسالة جديدة من فريق سَنَد", messageHint: "يسعدنا مساعدتك في طلبك القادم.", delivery: "تم تأكيد توصيل طلب", deliveryHint: "سيصلك إثبات التسليم قريباً.", back: "رجوع" } : language === "tr" ? { placeholder: "Hizmet veya destek ara...", inbox: "Mesajlar", alerts: "Bildirimler", menu: "Menü", newMessage: "Sanad ekibinden yeni mesaj", messageHint: "Bir sonraki siparişinizde size yardımcı olmaktan mutluluk duyarız.", delivery: "Sipariş teslimatı onaylandı", deliveryHint: "Teslimat kanıtı yakında gelecek.", back: "Geri" } : { placeholder: "Search services or support...", inbox: "Inbox", alerts: "Notifications", menu: "Menu", newMessage: "New message from Sanad", messageHint: "We are here to help with your next order.", delivery: "Order delivery confirmed", deliveryHint: "Your delivery proof is on its way.", back: "Back" };

  return <header className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-emerald-950/70 bg-white/90 dark:bg-[#07110d]/90 backdrop-blur-2xl">
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="h-[78px] flex items-center gap-2 lg:gap-4">
        <button onClick={() => router.back()} className="shrink-0 w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition" aria-label={copy.back}><ArrowLeft className="w-4 h-4" /></button>
        <button onClick={() => setMenuOpen((open) => !open)} className="shrink-0 w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition" aria-label={copy.menu}>{menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
        <Link href="/" className="shrink-0 flex items-center gap-2.5 group"><div className="relative w-11 h-11 rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-emerald-100 dark:ring-emerald-900/60"><Image src="/logo.jpeg" alt="Sanad" fill sizes="44px" className="object-cover" priority /></div><div className="hidden xl:block"><p className="text-lg font-black tracking-tight text-slate-950 dark:text-white leading-none">Sanad</p><p className="text-[10px] font-bold tracking-[0.2em] text-emerald-700 dark:text-emerald-400 uppercase mt-1">Support, delivered</p></div></Link>
        <div className="relative flex-1 max-w-2xl mx-auto"><Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input value={query} onChange={(event) => updateSearch(event.target.value)} placeholder={copy.placeholder} className="w-full h-12 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100/80 dark:bg-slate-900/80 ps-12 pe-14 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition" /><button className="absolute end-2 top-2 w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-emerald-600 hover:bg-white dark:hover:bg-slate-800 transition" aria-label="Visual search"><Camera className="w-4 h-4" /></button></div>
        <div ref={panelRef} className="relative flex items-center gap-1.5 sm:gap-2 shrink-0"><button onClick={() => setPanel(panel === "inbox" ? null : "inbox")} className="relative hidden sm:flex w-10 h-10 rounded-xl items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition" aria-label={copy.inbox}><Inbox className="w-5 h-5" /><span className="absolute -top-1 -end-1 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">3</span></button><button onClick={() => setPanel(panel === "notifications" ? null : "notifications")} className="relative hidden sm:flex w-10 h-10 rounded-xl items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition" aria-label={copy.alerts}><Bell className="w-5 h-5" /><span className="absolute top-1 end-1 w-2 h-2 rounded-full bg-rose-500" /></button><button onClick={openCart} className="relative w-11 h-11 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center shadow-lg shadow-emerald-700/20 transition hover:-translate-y-0.5" aria-label="Shopping cart"><ShoppingBag className="w-5 h-5" />{totalItems > 0 && <span className="absolute -top-2 -end-2 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white dark:ring-[#07110d]">{totalItems}</span>}</button><div className="hidden md:block"><LanguageSwitcher /></div><div className="hidden md:block"><ThemeToggle /></div>{panel && <div className="absolute end-0 top-14 w-80 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl p-4 z-30"><div className="flex items-center justify-between mb-3"><h3 className="font-black text-slate-900 dark:text-white">{panel === "inbox" ? copy.inbox : copy.alerts}</h3><span className="text-[10px] font-bold text-emerald-600">{panel === "inbox" ? "3" : "2"} new</span></div><div className="space-y-2">{(panel === "inbox" ? [{ title: copy.newMessage, hint: copy.messageHint }, { title: copy.delivery, hint: copy.deliveryHint }] : [{ title: copy.delivery, hint: copy.deliveryHint }, { title: copy.newMessage, hint: copy.messageHint }]).map((item) => <button key={item.title} onClick={() => setPanel(null)} className="w-full text-start p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition"><p className="text-sm font-bold text-slate-800 dark:text-slate-100">{item.title}</p><p className="text-xs text-slate-500 mt-1">{item.hint}</p></button>)}</div></div>}</div>
      </div>
      {menuOpen && <nav className="pb-4 flex flex-wrap gap-2 border-t border-slate-100 dark:border-slate-800 pt-3"><Link onClick={() => setMenuOpen(false)} href="/#services" className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-900 text-sm font-bold text-slate-700 dark:text-slate-200">{language === "ar" ? "الخدمات" : language === "tr" ? "Hizmetler" : "Services"}</Link><Link onClick={() => setMenuOpen(false)} href="/#how-it-works" className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-900 text-sm font-bold text-slate-700 dark:text-slate-200">{language === "ar" ? "كيف تعمل" : language === "tr" ? "Nasıl çalışır" : "How it works"}</Link><Link onClick={() => setMenuOpen(false)} href="/my-orders" className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-900 text-sm font-bold text-slate-700 dark:text-slate-200">{language === "ar" ? "طلباتي" : language === "tr" ? "Siparişlerim" : "My orders"}</Link></nav>}
    </div>
  </header>;
}
