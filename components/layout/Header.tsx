"use client";

import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Bell,
  Camera,
  ChevronDown,
  Inbox,
  LayoutDashboard,
  Loader2,
  LogIn,
  LogOut,
  Menu,
  MessageCircle,
  Search,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { toast } from "@/components/ui/Toast";
import { supabase, signOutUser, syncUserProfile } from "@/lib/supabase/client";
import AuthModal from "@/components/modals/AuthModal";
import AdminDashboardModal from "@/components/modals/AdminDashboardModal";

type Panel = "inbox" | "notifications" | null;

interface HelpNotification {
  id: string;
  user_name?: string;
  user_phone?: string;
  user_email?: string;
  message: string;
  amount_usd: number;
  status: "pending" | "accepted" | "deleted";
  created_at?: string;
}

const VISUAL_SEARCH_DELAY_MS = 1500;

export default function Header() {
  const { language } = useLanguage();
  const { totalItems, openCart } = useCart();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [panel, setPanel] = useState<Panel>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [visualPreview, setVisualPreview] = useState<string | null>(null);
  const [visualLoading, setVisualLoading] = useState(false);
  const visualTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const [authUser, setAuthUser] = useState<{ email: string; name: string } | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  // Dynamic Help Requests from Supabase
  const [helpRequests, setHelpRequests] = useState<HelpNotification[]>([]);

  const fetchHelpRequests = useCallback(async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from("help_requests")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (data && !error) {
        setHelpRequests(data);
      }
    } catch (err) {
      console.warn("[Header] Could not fetch help requests:", err);
    }
  }, []);

  useEffect(() => {
    fetchHelpRequests();

    // Listen for new help requests from RequestAssistanceModal
    const handleNewRequest = () => fetchHelpRequests();
    window.addEventListener("sanad-new-help-request", handleNewRequest);

    // Periodic check every 15s
    const timer = setInterval(fetchHelpRequests, 15000);

    return () => {
      clearInterval(timer);
      window.removeEventListener("sanad-new-help-request", handleNewRequest);
    };
  }, [fetchHelpRequests]);

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
        syncUserProfile(data.user);
        setAuthUser({
          email: data.user.email ?? "",
          name: data.user.user_metadata?.full_name ?? data.user.email?.split("@")[0] ?? "User",
        });
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        syncUserProfile(session.user);
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
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setPanel(null);
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const dispatchVisualSearch = (fileName: string | null) =>
    window.dispatchEvent(new CustomEvent("sanad-visual-search", { detail: fileName }));

  const handleVisualSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    clearTimeout(visualTimerRef.current);
    const objectUrl = URL.createObjectURL(file);
    setVisualPreview(objectUrl);
    setVisualLoading(true);
    dispatchVisualSearch(file.name);
    visualTimerRef.current = setTimeout(() => {
      setVisualLoading(false);
    }, VISUAL_SEARCH_DELAY_MS);
  };

  const handleAcceptRequest = async (req: HelpNotification) => {
    // 1. Immediately remove from notification list
    setHelpRequests((prev) => prev.filter((r) => r.id !== req.id));

    // 2. Mark accepted in Supabase
    if (supabase) {
      await supabase.from("help_requests").update({ status: "accepted" }).eq("id", req.id);
    }

    // 3. Open WhatsApp chat with requester
    if (req.user_phone) {
      const cleanPhone = req.user_phone.replace(/\D/g, "");
      const msg = encodeURIComponent(
        `\u0645\u0631\u062d\u0628\u0627\u064b ${req.user_name || ""}\u060c \u062a\u0645 \u0642\u0628\u0648\u0644 \u0637\u0644\u0628 \u0627\u0644\u0645\u0633\u0627\u0639\u062f\u0629 \u0628\u0642\u064a\u0645\u0629 $${req.amount_usd}. \u0633\u0646\u062a\u0648\u0627\u0635\u0644 \u0645\u0639\u0643 \u0627\u0644\u0622\u0646 \u0644\u0625\u062a\u0645\u0627\u0645 \u0627\u0644\u062a\u0633\u0644\u064a\u0645.`
      );
      window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
    }

    toast.success(
      language === "ar"
        ? "\u062a\u0645 \u0642\u0628\u0648\u0644 \u0627\u0644\u0637\u0644\u0628 \u0648\u0641\u062a\u062d \u0627\u0644\u0648\u0627\u062a\u0633\u0622\u0628!"
        : "Request accepted & WhatsApp opened!"
    );
  };

  const handleDeleteRequest = async (id: string) => {
    setHelpRequests((prev) => prev.filter((r) => r.id !== id));
    if (supabase) {
      await supabase.from("help_requests").update({ status: "deleted" }).eq("id", id);
    }
    toast.success(language === "ar" ? "\u062a\u0645 \u062d\u0630\u0641 \u0627\u0644\u0625\u0634\u0639\u0627\u0631" : "Notification dismissed");
  };

  const copy =
    language === "ar"
      ? {
          placeholder: "\u0627\u0628\u062d\u062b \u0639\u0646 \u062e\u062f\u0645\u0629 \u0623\u0648 \u0645\u0633\u0627\u0639\u062f\u0629...",
          inbox: "\u0627\u0644\u0631\u0633\u0627\u0626\u0644",
          alerts: "\u0637\u0644\u0628\u0627\u062a \u0627\u0644\u0645\u0633\u0627\u0639\u062f\u0629 \u0627\u0644\u062c\u062f\u064a\u062f\u0629",
          menu: "\u0627\u0644\u0642\u0627\u0626\u0645\u0629",
          empty: "\u0644\u0627 \u062a\u0648\u062c\u062f \u0637\u0644\u0628\u0627\u062a \u0645\u0633\u0627\u0639\u062f\u0629 \u0645\u0639\u0644\u0642\u0629",
          contact: "\u0642\u0628\u0648\u0644 + \u0648\u0627\u062a\u0633\u0622\u0628",
          deleteLabel: "\u062d\u0630\u0641",
        }
      : language === "tr"
      ? {
          placeholder: "Hizmet veya destek ara...",
          inbox: "Mesajlar",
          alerts: "Yeni Yardim Talepleri",
          menu: "Menu",
          empty: "Bekleyen yardim talebi bulunmuyor",
          contact: "Kabul + WhatsApp",
          deleteLabel: "Sil",
        }
      : {
          placeholder: "Search services or support...",
          inbox: "Messages",
          alerts: "Incoming Help Requests",
          menu: "Menu",
          empty: "No pending assistance requests",
          contact: "Accept + WhatsApp",
          deleteLabel: "Delete",
        };

  const navLinks = [
    { href: "/#services", label: language === "ar" ? "\u0627\u0644\u062e\u062f\u0645\u0627\u062a" : "Services" },
    { href: "/#how-it-works", label: language === "ar" ? "\u0643\u064a\u0641 \u062a\u0639\u0645\u0644 \u0627\u0644\u0645\u0646\u0635\u0629" : "How it Works" },
    { href: "/#pricing", label: language === "ar" ? "\u0627\u0644\u0623\u0633\u0639\u0627\u0631" : "Pricing" },
    { href: "/impact", label: language === "ar" ? "\u0627\u0644\u0623\u062b\u0631" : "Impact" },
  ];

  const pendingRequests = helpRequests.filter((r) => r.status === "pending");
  const pendingCount = pendingRequests.length;

  const showAdminButton =
    authUser?.email?.toLowerCase() === "muhammadelosman464@gmail.com" ||
    authUser?.email?.toLowerCase() === "digty4@gmail.com" ||
    (typeof window !== "undefined" &&
      (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"));

  const iconButtonClass =
    "relative hidden sm:flex w-10 h-10 rounded-xl items-center justify-center text-slate-200 hover:bg-white/10 transition";

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/50 backdrop-blur-2xl">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-[72px] flex items-center gap-2 lg:gap-4">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition sm:hidden"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <div className="relative w-10 h-10 rounded-2xl overflow-hidden bg-white/10 shadow ring-1 ring-white/20">
                <Image src="/logo.jpeg" alt="Sanad" fill sizes="40px" className="object-cover" priority />
              </div>
              <div className="hidden sm:block">
                <span className="font-black text-xl tracking-tight text-white">
                  {language === "ar" ? "\u0633\u064e\u0646\u064e\u062f" : "Sanad"}
                </span>
                <span className="block text-[10px] text-[#d4af37] -mt-1 font-semibold">
                  {language === "ar" ? "\u0645\u0639\u0627\u064b \u0644\u0646\u064f\u0639\u064a\u0646" : "Care Across Borders"}
                </span>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="relative flex-1 max-w-2xl mx-auto">
              {visualPreview && (
                <div className="absolute start-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full overflow-hidden ring-2 ring-[#d4af37]/60 z-10">
                  <Image src={visualPreview} alt="Search" fill unoptimized className="object-cover" />
                  {visualLoading && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/60">
                      <Loader2 className="w-4 h-4 animate-spin text-[#d4af37]" />
                    </span>
                  )}
                </div>
              )}
              <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  window.dispatchEvent(new CustomEvent("sanad-search", { detail: e.target.value }));
                }}
                placeholder={copy.placeholder}
                className="w-full ps-12 pe-24 py-2.5 rounded-full bg-white/10 border border-white/15 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37]/60 transition"
              />
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleVisualSearch}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="absolute end-11 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-white/50 hover:text-[#d4af37] hover:bg-white/10 transition"
                aria-label="Image Search"
              >
                <Camera className="w-4 h-4" />
              </button>
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    window.dispatchEvent(new CustomEvent("sanad-search", { detail: "" }));
                  }}
                  className="absolute end-2 top-1.5 w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Right Action Icons */}
            <div ref={panelRef} className="relative flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Dynamic Notification Bell */}
              <button
                onClick={() => setPanel(panel === "notifications" ? null : "notifications")}
                className={iconButtonClass}
                aria-label={copy.alerts}
              >
                <Bell className="w-5 h-5" />
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -end-1 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                    {pendingCount}
                  </span>
                )}
              </button>

              {/* Admin Dashboard Button */}
              {showAdminButton && (
                <button
                  onClick={() => setAdminOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#b8930a] text-[#1d3023] font-black text-xs shadow-lg shadow-[#d4af37]/25 hover:brightness-110 active:scale-95 transition"
                  title={language === "ar" ? "\u0644\u0648\u062d\u0629 \u0627\u0644\u062a\u062d\u0643\u0645" : "Admin Dashboard"}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {language === "ar" ? "\u0644\u0648\u062d\u0629 \u0627\u0644\u062a\u062d\u0643\u0645" : "Admin"}
                  </span>
                </button>
              )}

              {/* Cart Button */}
              <button
                onClick={openCart}
                className="relative w-10 h-10 rounded-2xl bg-[#d4af37] hover:bg-[#b8930a] text-[#1d3023] flex items-center justify-center shadow-lg shadow-[#d4af37]/20 transition"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -end-2 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-black/40">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* User Authentication Status */}
              {authUser ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen((o) => !o)}
                    className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-[#d4af37]/15 hover:bg-[#d4af37]/25 border border-[#d4af37]/30 transition"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8930a] flex items-center justify-center text-[#1d3023] font-bold text-xs">
                      {authUser.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-white max-w-[90px] truncate">
                      {authUser.name}
                    </span>
                    <ChevronDown className="w-3 h-3 text-white/50" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute end-0 top-12 w-52 rounded-2xl border border-[#d4af37]/30 bg-[#0d1810]/98 backdrop-blur-2xl shadow-2xl p-2 z-50">
                      <p className="text-xs text-[#d4af37] px-3 py-1.5 truncate font-semibold">
                        {authUser.email}
                      </p>
                      <hr className="border-[#d4af37]/15 my-1" />
                      {showAdminButton && (
                        <>
                          <button
                            onClick={() => {
                              setUserMenuOpen(false);
                              setAdminOpen(true);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#d4af37] hover:bg-[#d4af37]/15 transition font-semibold"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            <span>{language === "ar" ? "\u0644\u0648\u062d\u0629 \u0627\u0644\u062a\u062d\u0643\u0645" : "Admin Dashboard"}</span>
                          </button>
                          <hr className="border-[#d4af37]/15 my-1" />
                        </>
                      )}
                      <button
                        onClick={async () => {
                          await signOutUser();
                          setUserMenuOpen(false);
                          setAuthUser(null);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-950/40 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{language === "ar" ? "\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062e\u0631\u0648\u062c" : "Sign Out"}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAuthMode("login");
                    setAuthOpen(true);
                  }}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#d4af37]/15 hover:bg-[#d4af37]/25 border border-[#d4af37]/30 text-sm font-semibold text-white transition"
                >
                  <LogIn className="w-4 h-4 text-[#d4af37]" />
                  <span>{language === "ar" ? "\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644" : "Login"}</span>
                </button>
              )}

              <ThemeToggle />
              <div className="hidden md:block">
                <LanguageSwitcher />
              </div>

              {/* Dynamic Notification Panel (Help Requests) */}
              <AnimatePresence>
                {panel === "notifications" && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.16 }}
                    className="absolute end-0 top-14 w-84 sm:w-96 rounded-2xl border border-[#d4af37]/35 bg-[#0d1810]/98 backdrop-blur-2xl shadow-2xl p-4 z-50 max-h-[80vh] overflow-y-auto"
                  >
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#d4af37]/20">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-[#d4af37]" />
                        <h3 className="font-black text-sm text-white">{copy.alerts}</h3>
                      </div>
                      <span className="text-[10px] font-black bg-[#d4af37] text-[#1d3023] px-2 py-0.5 rounded-full">
                        {pendingRequests.length}
                      </span>
                    </div>

                    {pendingRequests.length === 0 ? (
                      <p className="text-sm text-white/50 text-center py-8">{copy.empty}</p>
                    ) : (
                      <ul className="space-y-2.5">
                        {pendingRequests.map((req) => (
                          <motion.li
                            key={req.id}
                            layout
                            exit={{ opacity: 0, x: 16 }}
                            className="rounded-xl bg-white/5 border border-white/10 p-3 hover:border-[#d4af37]/40 transition"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-sm font-bold text-white">
                                  {req.user_name || "Applicant"}{" "}
                                  <span className="text-xs font-semibold text-[#d4af37]">
                                    ({req.user_phone || "No phone"})
                                  </span>
                                </p>
                                <p className="text-xs text-white/40 mt-0.5">{req.user_email}</p>
                              </div>
                              <span className="text-xs font-black text-[#d4af37] shrink-0">
                                ${req.amount_usd}
                              </span>
                            </div>

                            <p className="text-xs text-slate-300 mt-2 bg-black/40 p-2 rounded-lg border border-white/5 line-clamp-3">
                              {req.message}
                            </p>

                            <div className="mt-3 flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleDeleteRequest(req.id)}
                                className="rounded-lg border border-white/15 px-2.5 py-1 text-xs font-bold text-white/60 hover:bg-red-950/40 hover:text-red-400 hover:border-red-500/40 transition flex items-center gap-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>{copy.deleteLabel}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleAcceptRequest(req)}
                                className="rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b8930a] hover:brightness-105 text-[#1d3023] font-black px-3 py-1 text-xs transition flex items-center gap-1.5 shadow-sm"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>{copy.contact}</span>
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

          {/* Mobile nav */}
          {menuOpen && (
            <nav className="pb-4 flex flex-wrap gap-2 border-t border-white/10 pt-3">
              {showAdminButton && (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setAdminOpen(true);
                  }}
                  className="px-4 py-2 rounded-full bg-[#d4af37] text-[#1d3023] text-sm font-black flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{language === "ar" ? "\u0644\u0648\u062d\u0629 \u0627\u0644\u062a\u062d\u0643\u0645" : "Admin"}</span>
                </button>
              )}
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
      </header>

      {/* Auth Modal renders cleanly into document.body via createPortal */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} initialMode={authMode} />

      {/* Admin Dashboard Modal */}
      <AdminDashboardModal isOpen={adminOpen} onClose={() => setAdminOpen(false)} />
    </>
  );
}