"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, Bell, Camera, ChevronDown, Inbox, Loader2,
  LogIn, LogOut, Menu, Search, ShoppingBag, X,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { toast } from "@/components/ui/Toast";
import { supabase, signOutUser } from "@/lib/supabase/client";
import AuthModal from "@/components/modals/AuthModal";

type Panel = "inbox" | "notifications" | null;

interface PanelItem {
  id: string;
  kind: "inbox" | "notifications";
  topic: "message" | "delivery";
  accepted?: boolean;
}

const SEED_ITEMS: PanelItem[] = [
  { id: "msg-1", kind: "inbox", topic: "message" },
  { id: "ntf-1", kind: "notifications", topic: "delivery" },
];

// Unicode-safe Arabic string — avoids any encoding conversion issues
const CONTACT_TOAST = "\u0633\u064a\u062a\u0645 \u0627\u0644\u062a\u0648\u0627\u0635\u0644 \u0645\u0639\u0643 \u0641\u064a \u0623\u0642\u0631\u0628 \u0648\u0642\u062a";

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
  const [authUser, setAuthUser] = useState<{ email: string; name: string } | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

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

  /* Auth state subscription */
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setAuthUser({
          email: data.user.email ?? "",
          name: data.user.user_metadata?.full_name ?? data.user.email?.split("@")[0] ?? "User",
        });
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setAuthUser({
          email: session.user.email ?? "",
          name: session.user.user_metadata?.full_name ?? session.user.email?.split("@")[0] ?? "User",
        });
      } else {
        setAuthUser(null);
      }
    });
    return () => subscription.unsubscribe();
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

  /* Accept inbox/notification item — dismiss card + toast */
  const acceptItem = (id: string) => {
    // Immediately remove from list (dismiss card)
    setItems((current) => current.filter((item) => item.id !== id));
    toast.success(CONTACT_TOAST);
  };

  /* All copy strings as Unicode escapes to prevent encoding corruption */
  const copy = language === "ar"
    ? {
        placeholder: "\u0627\u0628\u062d\u062b \u0639\u0646 \u062e\u062f\u0645\u0629 \u0623\u0648 \u0645\u0633\u0627\u0639\u062f\u0629...",
        inbox: "\u0627\u0644\u0631\u0633\u0627\u0626\u0644",
        alerts: "\u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062a",
        menu: "\u0627\u0644\u0642\u0627\u0626\u0645\u0629",
        newMessage: "\u0631\u0633\u0627\u0644\u0629 \u062c\u062f\u064a\u062f\u0629 \u0645\u0646 \u0641\u0631\u064a\u0642 \u0633\u064e\u0646\u064e\u062f",
        messageHint: "\u064a\u0633\u0639\u062f\u0646\u0627 \u0645\u0633\u0627\u0639\u062f\u062a\u0643 \u0641\u064a \u0637\u0644\u0628\u0643 \u0627\u0644\u0642\u0627\u062f\u0645.",
        delivery: "\u062a\u0645 \u062a\u0623\u0643\u064a\u062f \u062a\u0648\u0635\u064a\u0644 \u0637\u0644\u0628",
        deliveryHint: "\u0633\u064a\u0635\u0644\u0643 \u0625\u062b\u0628\u0627\u062a \u0627\u0644\u062a\u0633\u0644\u064a\u0645 \u0642\u0631\u064a\u0628\u0627\u064b.",
        back: "\u0631\u062c\u0648\u0639",
        remove: "\u062d\u0630\u0641",
        contact: "\u062a\u0648\u0627\u0635\u0644 / \u0642\u0628\u0648\u0644",
        accepted: "\u062a\u0645 \u0627\u0644\u0642\u0628\u0648\u0644",
        empty: "\u0644\u0627 \u062a\u0648\u062c\u062f \u0639\u0646\u0627\u0635\u0631 \u062d\u0627\u0644\u064a\u0627\u064b",
        clearImage: "\u0625\u0632\u0627\u0644\u0629 \u0627\u0644\u0635\u0648\u0631\u0629",
      }
    : language === "tr"
    ? {
        placeholder: "Hizmet veya destek ara...",
        inbox: "Mesajlar",
        alerts: "Bildirimler",
        menu: "Men\u00fc",
        newMessage: "Sanad ekibinden yeni mesaj",
        messageHint: "Bir sonraki sipari\u015finizde size yard\u0131mc\u0131 olmaktan mutluluk duyar\u0131z.",
        delivery: "Sipari\u015f teslimat\u0131 onayland\u0131",
        deliveryHint: "Teslimat kan\u0131t\u0131 yak\u0131nda gelecek.",
        back: "Geri",
        remove: "Sil",
        contact: "\u0130leti\u015fim / Kabul",
        accepted: "Kabul edildi",
        empty: "\u015eu anda \u00f6\u011fe yok",
        clearImage: "G\u00f6rseli kald\u0131r",
      }
    : {
        placeholder: "Search services or support...",
        inbox: "Inbox",
        alerts: "Notifications",
        menu: "Menu",
        newMessage: "New message from Sanad",
        messageHint: "We are here to help with your next order.",
        delivery: "Order delivery confirmed",
        deliveryHint: "Your delivery proof is on its way.",
        back: "Back",
        remove: "Delete",
        contact: "Contact / Accept",
        accepted: "Accepted",
        empty: "Nothing here right now",
        clearImage: "Remove image",
      };

  const navLinks = [
    {
      href: "/#services",
      label: language === "ar" ? "\u0627\u0644\u062e\u062f\u0645\u0627\u062a" : language === "tr" ? "Hizmetler" : "Services",
    },
    {
      href: "/#how-it-works",
      label: language === "ar" ? "\u0643\u064a\u0641 \u062a\u0639\u0645\u0644" : language === "tr" ? "Nas\u0131l \u00e7al\u0131\u015f\u0131r" : "How it works",
    },
    {
      href: "/my-orders",
      label: language === "ar" ? "\u0637\u0644\u0628\u0627\u062a\u064a" : language === "tr" ? "Sipari\u015flerim" : "My orders",
    },
  ];

  const inboxCount = items.filter((item) => item.kind === "inbox").length;
  const alertCount = items.filter((item) => item.kind === "notifications").length;
  const visibleItems = items.filter((item) => item.kind === panel);

  const iconButtonClass =
    "relative hidden sm:flex w-10 h-10 rounded-xl items-center justify-center text-slate-200 hover:bg-white/10 transition";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-2xl">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-[72px] flex items-center gap-2 lg:gap-4">
          <button
            onClick={() => router.back()}
            className="shrink-0 w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition"
            aria-label={copy.back}
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          </button>
          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="shrink-0 w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition"
            aria-label={copy.menu}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/" className="shrink-0 flex items-center gap-2.5 group">
            <div className="relative w-10 h-10 rounded-2xl overflow-hidden bg-white/10 shadow ring-1 ring-white/20">
              <Image src="/logo.jpeg" alt="Sanad" fill sizes="40px" className="object-cover" priority />
            </div>
            <div className="hidden xl:block">
              <p className="text-lg font-black tracking-tight text-white leading-none">Sanad</p>
              <p className="text-[10px] font-bold tracking-[0.2em] text-[#d4af37] uppercase mt-0.5">Support, delivered</p>
            </div>
          </Link>

          {/* Search bar */}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleVisualSearch}
            className="hidden"
            aria-hidden="true"
            tabIndex={-1}
          />
          <div className="relative flex-1 max-w-2xl mx-auto">
            {visualPreview ? (
              <div className="absolute start-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full overflow-hidden ring-2 ring-[#d4af37]/60 z-10">
                <img src={visualPreview} alt="" className="w-full h-full object-cover" />
                {visualLoading && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  </span>
                )}
              </div>
            ) : (
              <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            )}
            <input
              value={query}
              onChange={(event) => updateSearch(event.target.value)}
              placeholder={copy.placeholder}
              aria-label={copy.placeholder}
              className={`w-full h-11 rounded-full border border-white/15 bg-white/8 backdrop-blur ps-12 ${
                visualPreview ? "pe-24" : "pe-14"
              } text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50 transition`}
            />
            {visualPreview && (
              <button
                type="button"
                onClick={clearVisualSearch}
                aria-label={copy.clearImage}
                className="absolute end-11 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-white/50 hover:text-rose-400 hover:bg-white/10 transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              className="absolute end-2 top-1.5 w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-[#d4af37] hover:bg-white/10 transition"
              aria-label="Visual search"
              onClick={() => imageInputRef.current?.click()}
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Right icons */}
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
              className="relative w-10 h-10 rounded-2xl bg-[#d4af37] hover:bg-[#b8930a] text-[#1d3023] flex items-center justify-center shadow-lg shadow-[#d4af37]/20 transition"
              aria-label="Shopping cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -end-2 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-black/40">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Auth State */}
            {authUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((o) => !o)}
                  className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-[#d4af37]/15 hover:bg-[#d4af37]/25 border border-[#d4af37]/30 transition"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8930a] flex items-center justify-center text-[#1d3023] font-bold text-xs">
                    {authUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-white max-w-[90px] truncate">{authUser.name}</span>
                  <ChevronDown className="w-3 h-3 text-white/50" />
                </button>
                {userMenuOpen && (
                  <div className="absolute end-0 top-12 w-52 rounded-2xl border border-[#d4af37]/20 bg-[#0d1810]/95 backdrop-blur-xl shadow-2xl p-2 z-50">
                    <p className="text-xs text-[#d4af37]/60 px-3 py-1.5 truncate">{authUser.email}</p>
                    <hr className="border-[#d4af37]/10 my-1" />
                    <button
                      onClick={async () => { await signOutUser(); setUserMenuOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-900/20 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      {language === "ar" ? "\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062e\u0631\u0648\u062c" : language === "tr" ? "\u00c7\u0131k\u0131\u015f Yap" : "Sign Out"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => { setAuthMode("login"); setAuthOpen(true); }}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#d4af37]/15 hover:bg-[#d4af37]/25 border border-[#d4af37]/30 text-sm font-semibold text-white transition"
              >
                <LogIn className="w-4 h-4 text-[#d4af37]" />
                <span>{language === "ar" ? "\u062f\u062e\u0648\u0644" : language === "tr" ? "Giri\u015f" : "Login"}</span>
              </button>
            )}

            <ThemeToggle />
            <div className="hidden md:block"><LanguageSwitcher /></div>

            {/* Inbox / Notifications panel */}
            <AnimatePresence>
              {panel && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.16 }}
                  className="absolute end-0 top-14 w-80 rounded-2xl border border-[#d4af37]/20 bg-[#0d1810]/95 backdrop-blur-xl shadow-2xl p-4 z-30"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-black text-white">{panel === "inbox" ? copy.inbox : copy.alerts}</h3>
                    <span className="text-[10px] font-bold text-[#d4af37]">{visibleItems.length}</span>
                  </div>
                  {visibleItems.length === 0 ? (
                    <p className="text-sm text-white/40 text-center py-6">{copy.empty}</p>
                  ) : (
                    <ul className="space-y-2">
                      {visibleItems.map((item) => (
                        <motion.li
                          key={item.id}
                          layout
                          exit={{ opacity: 0, x: 16 }}
                          className="rounded-xl bg-white/5 border border-white/8 p-3"
                        >
                          <p className="text-sm font-bold text-white">{item.topic === "message" ? copy.newMessage : copy.delivery}</p>
                          <p className="text-xs text-white/50 mt-1">{item.topic === "message" ? copy.messageHint : copy.deliveryHint}</p>
                          <div className="mt-3 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => deleteItem(item.id)}
                              className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-bold text-white/60 hover:bg-red-900/30 hover:text-red-400 hover:border-red-700/40 transition"
                            >
                              {copy.remove}
                            </button>
                            <button
                              type="button"
                              onClick={() => acceptItem(item.id)}
                              className="rounded-lg bg-[#d4af37] hover:bg-[#b8930a] text-[#1d3023] px-3 py-1.5 text-xs font-black transition"
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
          <nav className="pb-4 flex flex-wrap gap-2 border-t border-white/10 pt-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                onClick={() => setMenuOpen(false)}
                href={link.href}
                className="px-4 py-2 rounded-full bg-white/8 border border-white/10 text-sm font-bold text-white/80 hover:text-white hover:bg-white/15 transition"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} initialMode={authMode} />
    </header>
  );
}