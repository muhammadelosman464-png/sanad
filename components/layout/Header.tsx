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
  Check,
  ChevronDown,
  Clock,
  Inbox,
  LayoutDashboard,
  Loader2,
  Lock,
  LogIn,
  LogOut,
  Menu,
  MessageCircle,
  Package,
  Phone,
  Search,
  ShoppingBag,
  Trash2,
  User,
  X,
  XCircle,
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
  id: string | number;
  client_name?: string;
  client_phone?: string;
  client_email?: string;
  requested_service?: string;
  created_at?: string;
  status?: string;
  full_name?: string;
  phone?: string;
  request_text?: string;
  user_name?: string;
  user_phone?: string;
  user_email?: string;
  message?: string;
  amount_usd?: number;
}

function formatRequestTime(dateStr?: string, isArabic = true): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diffSec < 60) return isArabic ? "الآن" : "Just now";
    if (diffSec < 3600) {
      const mins = Math.floor(diffSec / 60);
      return isArabic ? `منذ ${mins} دقيقة` : `${mins}m ago`;
    }
    if (diffSec < 86400) {
      const hours = Math.floor(diffSec / 3600);
      return isArabic ? `منذ ${hours} ساعة` : `${hours}h ago`;
    }
    return d.toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
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
  const [passcodeModalOpen, setPasscodeModalOpen] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState("");
  const [passcodeError, setPasscodeError] = useState("");

  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput === "Aboilyas7") {
      setPasscodeModalOpen(false);
      setPasscodeInput("");
      setPasscodeError("");
      setAdminOpen(true);
      toast.success(language === "ar" ? "\u062a\u0645 \u0627\u0644\u062a\u062d\u0642\u0642 \u0628\u0646\u062c\u0627\u062d!" : "Verified successfully!");
    } else {
      setPasscodeError(language === "ar" ? "\u0631\u0645\u0632 \u0627\u0644\u0645\u0631\u0648\u0631 \u063a\u064a\u0631 \u0635\u062d\u064a\u062d" : "Incorrect passcode");
    }
  };

  // Dynamic Help Requests from Supabase
  const [helpRequests, setHelpRequests] = useState<HelpNotification[]>([]);

  const fetchHelpRequests = useCallback(async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from("help_requests")
        .select("*")
        .or("status.eq.pending,status.is.null")
        .order("created_at", { ascending: false })
        .limit(50);

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

  // 1. Accept button: updates status to 'accepted' and removes from pending list immediately
  const handleAcceptRequest = async (req: HelpNotification) => {
    setHelpRequests((prev) => prev.filter((r) => String(r.id) !== String(req.id)));
    if (supabase) {
      await supabase.from("help_requests").update({ status: "accepted" }).eq("id", req.id);
    }
    toast.success(language === "ar" ? "\u062a\u0645 \u0642\u0628\u0648\u0644 \u0627\u0644\u0637\u0644\u0628 \u0628\u0646\u062c\u0627\u062d!" : "Request accepted!");
  };

  // 2. WhatsApp button: opens wa.me chat with prefilled message
  const handleWhatsAppContact = (req: HelpNotification) => {
    const rawPhone = req.client_phone || req.phone || req.user_phone || "";
    const cleanPhone = rawPhone.replace(/\D/g, "");
    if (!cleanPhone) {
      toast.error(language === "ar" ? "\u0644\u0627 \u064a\u0648\u062c\u062f \u0631\u0642\u0645 \u0647\u0627\u062a\u0641 \u0635\u0627\u0644\u062d \u0644\u0644\u0648\u0627\u062a\u0633\u0622\u0628" : "No valid phone number for WhatsApp");
      return;
    }
    const clientName = req.client_name || req.full_name || req.user_name || (language === "ar" ? "\u0639\u0632\u064a\u0632\u064a \u0627\u0644\u0639\u0645\u064a\u0644" : "Client");
    const service = req.requested_service || req.request_text || (language === "ar" ? "\u062e\u062f\u0645\u0629 \u0645\u0646\u0635\u0629 \u0633\u0646\u062f" : "Sanad Service");
    const msg = encodeURIComponent(
      `\u0645\u0631\u062d\u0628\u0627\u064b ${clientName}\u060c \u0628\u062e\u0635\u0648\u0635 \u0637\u0644\u0628\u0643 \u0644\u062e\u062f\u0645\u0629 "${service}" \u0639\u0628\u0631 \u0645\u0646\u0635\u0629 \u0633\u0646\u062f...`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
  };

  // 3. Reject button: updates status to 'rejected' and removes from pending list immediately
  const handleRejectRequest = async (req: HelpNotification) => {
    setHelpRequests((prev) => prev.filter((r) => String(r.id) !== String(req.id)));
    if (supabase) {
      await supabase.from("help_requests").update({ status: "rejected" }).eq("id", req.id);
    }
    toast.success(language === "ar" ? "\u062a\u0645 \u0631\u0641\u0636 \u0627\u0644\u0637\u0644\u0628" : "Request rejected");
  };

  // 4. Delete button: deletes the row permanently from Supabase and removes immediately
  const handleDeleteRequest = async (id: string | number) => {
    setHelpRequests((prev) => prev.filter((r) => String(r.id) !== String(id)));
    if (supabase) {
      await supabase.from("help_requests").delete().eq("id", id);
    }
    toast.success(language === "ar" ? "\u062a\u0645 \u062d\u0630\u0641 \u0627\u0644\u0637\u0644\u0628 \u0646\u0647\u0627\u0626\u064a\u0627\u064b" : "Request deleted permanently");
  };

  const copy =
    language === "ar"
      ? {
          placeholder: "\u0627\u0628\u062d\u062b \u0639\u0646 \u062e\u062f\u0645\u0629 \u0623\u0648 \u0645\u0633\u0627\u0639\u062f\u0629...",
          inbox: "\u0627\u0644\u0631\u0633\u0627\u0626\u0644",
          alerts: "\u0637\u0644\u0628\u0627\u062a \u0627\u0644\u0645\u0633\u0627\u0639\u062f\u0629 \u0627\u0644\u062c\u062f\u064a\u062f\u0629",
          menu: "\u0627\u0644\u0642\u0627\u0626\u0645\u0629",
          empty: "\u0644\u0627 \u062a\u0648\u062c\u062f \u0637\u0644\u0628\u0627\u062a \u062c\u062f\u064a\u062f\u0629",
          emptyHint: "\u0633\u064a\u062a\u0645 \u0639\u0631\u0636 \u0637\u0644\u0628\u0627\u062a \u0627\u0644\u0645\u0633\u0627\u0639\u062f\u0629 \u0627\u0644\u062c\u062f\u064a\u062f\u0629 \u0647\u0646\u0627 \u0641\u0648\u0631 \u0648\u0635\u0648\u0644\u0647\u0627",
          accept: "\u0642\u0628\u0648\u0644",
          whatsapp: "\u062a\u0648\u0627\u0635\u0644 \u0639\u0628\u0631 \u0627\u0644\u0648\u0627\u062a\u0633\u0622\u0628",
          reject: "\u0631\u0641\u0636",
          deleteLabel: "\u062d\u0630\u0641",
        }
      : language === "tr"
      ? {
          placeholder: "Hizmet veya destek ara...",
          inbox: "Mesajlar",
          alerts: "Yeni Yardim Talepleri",
          menu: "Menu",
          empty: "Yeni talep bulunmuyor",
          emptyHint: "Yeni yardim talepleri geldiginde burada gorunecektir",
          accept: "Kabul Et",
          whatsapp: "WhatsApp",
          reject: "Reddet",
          deleteLabel: "Sil",
        }
      : {
          placeholder: "Search services or support...",
          inbox: "Messages",
          alerts: "Incoming Help Requests",
          menu: "Menu",
          empty: "No new requests",
          emptyHint: "New assistance requests will appear here when submitted",
          accept: "Accept",
          whatsapp: "WhatsApp",
          reject: "Reject",
          deleteLabel: "Delete",
        };

  const navLinks = [
    { href: "/#services", label: language === "ar" ? "\u0627\u0644\u062e\u062f\u0645\u0627\u062a" : "Services" },
    { href: "/#how-it-works", label: language === "ar" ? "\u0643\u064a\u0641 \u062a\u0639\u0645\u0644 \u0627\u0644\u0645\u0646\u0635\u0629" : "How it Works" },
    { href: "/#pricing", label: language === "ar" ? "\u0627\u0644\u0623\u0633\u0639\u0627\u0631" : "Pricing" },
    { href: "/impact", label: language === "ar" ? "\u0627\u0644\u0623\u062b\u0631" : "Impact" },
  ];

  const pendingRequests = helpRequests.filter(
    (r) => r.status === "pending" || !r.status
  );
  const pendingCount = pendingRequests.length;

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

              {/* Admin Dashboard Button (Protected by Passcode) */}
              <button
                onClick={() => {
                  setPasscodeInput("");
                  setPasscodeError("");
                  setPasscodeModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#b8930a] text-[#1d3023] font-black text-xs shadow-lg shadow-[#d4af37]/25 hover:brightness-110 active:scale-95 transition"
                title={language === "ar" ? "\u0644\u0648\u062d\u0629 \u0627\u0644\u062a\u062d\u0643\u0645" : "Admin Dashboard"}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {language === "ar" ? "\u0644\u0648\u062d\u0629 \u0627\u0644\u062a\u062d\u0643\u0645" : "Admin"}
                </span>
              </button>

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
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          setPasscodeInput("");
                          setPasscodeError("");
                          setPasscodeModalOpen(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#d4af37] hover:bg-[#d4af37]/15 transition font-semibold"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>{language === "ar" ? "\u0644\u0648\u062d\u0629 \u0627\u0644\u062a\u062d\u0643\u0645" : "Admin Dashboard"}</span>
                      </button>
                      <hr className="border-[#d4af37]/15 my-1" />
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
                    className="absolute end-0 top-14 w-[92vw] sm:w-[440px] max-w-[460px] rounded-3xl border border-[#d4af37]/35 bg-[#0d1810]/98 backdrop-blur-2xl shadow-2xl p-4 sm:p-5 z-50 max-h-[85vh] overflow-y-auto"
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
                      <div className="text-center py-10 px-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center mx-auto mb-3 text-[#d4af37]">
                          <Bell className="w-6 h-6 opacity-60" />
                        </div>
                        <p className="text-sm font-bold text-white">{copy.empty}</p>
                        <p className="text-xs text-white/40 mt-1">{copy.emptyHint}</p>
                      </div>
                    ) : (
                      <ul className="space-y-3">
                        {pendingRequests.map((req) => {
                          const clientName =
                            req.client_name ||
                            req.full_name ||
                            req.user_name ||
                            (language === "ar" ? "\u0637\u0627\u0644\u0628 \u0645\u0633\u0627\u0639\u062f\u0629" : "Applicant");
                          const clientPhone =
                            req.client_phone || req.phone || req.user_phone || "";
                          const clientEmail =
                            req.client_email || req.user_email || "";
                          const serviceName =
                            req.requested_service ||
                            req.request_text ||
                            (language === "ar" ? "\u0637\u0644\u0628 \u0645\u0633\u0627\u0639\u062f\u0629" : "Help Request");
                          const timeStr = formatRequestTime(req.created_at, language === "ar");

                          return (
                            <motion.li
                              key={req.id}
                              layout
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="rounded-2xl bg-white/[0.05] border border-white/10 p-3.5 hover:border-[#d4af37]/40 transition space-y-2.5"
                            >
                              {/* Top row: Client name and timestamp */}
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] shrink-0 font-black text-xs">
                                    <User className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-bold text-white leading-tight">
                                      {clientName}
                                    </h4>
                                    {clientEmail && (
                                      <p className="text-[11px] text-white/40">{clientEmail}</p>
                                    )}
                                  </div>
                                </div>
                                {timeStr && (
                                  <span className="text-[11px] text-white/50 flex items-center gap-1 shrink-0 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                                    <Clock className="w-3 h-3 text-[#d4af37]" />
                                    <span>{timeStr}</span>
                                  </span>
                                )}
                              </div>

                              {/* Middle: Phone and Requested Service */}
                              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                                {clientPhone ? (
                                  <a
                                    href={`tel:${clientPhone}`}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-semibold hover:border-emerald-400 transition"
                                  >
                                    <Phone className="w-3 h-3 text-emerald-400" />
                                    <span dir="ltr">{clientPhone}</span>
                                  </a>
                                ) : (
                                  <span className="text-xs text-white/40 italic">
                                    {language === "ar" ? "\u0628\u062f\u0648\u0646 \u0631\u0642\u0645 \u0647\u0627\u062a\u0641" : "No phone"}
                                  </span>
                                )}

                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#d4af37] text-xs font-bold">
                                  <Package className="w-3.5 h-3.5 text-[#d4af37]" />
                                  <span>{serviceName}</span>
                                </div>

                                {req.amount_usd && req.amount_usd > 0 ? (
                                  <span className="text-xs font-black text-amber-300 bg-amber-950/40 border border-amber-500/20 px-2 py-0.5 rounded-lg">
                                    ${req.amount_usd}
                                  </span>
                                ) : null}
                              </div>

                              {/* Description / message if distinct from service name */}
                              {req.message && req.message !== serviceName && (
                                <p className="text-xs text-slate-300 bg-black/40 p-2.5 rounded-xl border border-white/5 leading-relaxed line-clamp-3">
                                  {req.message}
                                </p>
                              )}

                              {/* 4 Distinct Action Buttons */}
                              <div className="pt-1 grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                                {/* 1. Accept */}
                                <button
                                  type="button"
                                  onClick={() => handleAcceptRequest(req)}
                                  className="py-1.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 transition shadow-sm active:scale-95"
                                  title={copy.accept}
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>{copy.accept}</span>
                                </button>

                                {/* 2. WhatsApp */}
                                <button
                                  type="button"
                                  onClick={() => handleWhatsAppContact(req)}
                                  className="py-1.5 px-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center justify-center gap-1 transition shadow-sm active:scale-95"
                                  title={copy.whatsapp}
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  <span className="truncate">{language === "ar" ? "\u0648\u0627\u062a\u0633\u0622\u0628" : "WhatsApp"}</span>
                                </button>

                                {/* 3. Reject */}
                                <button
                                  type="button"
                                  onClick={() => handleRejectRequest(req)}
                                  className="py-1.5 px-2 rounded-xl bg-amber-600/20 hover:bg-amber-600/35 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center justify-center gap-1 transition active:scale-95"
                                  title={copy.reject}
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>{copy.reject}</span>
                                </button>

                                {/* 4. Delete */}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteRequest(req.id)}
                                  className="py-1.5 px-2 rounded-xl hover:bg-red-950/60 text-red-400 border border-red-500/20 font-bold text-xs flex items-center justify-center gap-1 transition active:scale-95"
                                  title={copy.deleteLabel}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>{copy.deleteLabel}</span>
                                </button>
                              </div>
                            </motion.li>
                          );
                        })}
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
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setPasscodeInput("");
                  setPasscodeError("");
                  setPasscodeModalOpen(true);
                }}
                className="px-4 py-2 rounded-full bg-[#d4af37] text-[#1d3023] text-sm font-black flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>{language === "ar" ? "\u0644\u0648\u062d\u0629 \u0627\u0644\u062a\u062d\u0643\u0645" : "Admin"}</span>
              </button>
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

      {/* Passcode Interceptor Modal for Admin Access */}
      <AnimatePresence>
        {passcodeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div
              className="fixed inset-0 bg-transparent cursor-pointer"
              onClick={() => {
                setPasscodeModalOpen(false);
                setPasscodeInput("");
                setPasscodeError("");
              }}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.18 }}
              className="relative z-10 w-full max-w-sm rounded-3xl bg-[#0f1d14] border border-[#d4af37]/40 shadow-2xl p-6 text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => {
                  setPasscodeModalOpen(false);
                  setPasscodeInput("");
                  setPasscodeError("");
                }}
                className="absolute top-4 end-4 p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-2xl bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">
                    {language === "ar" ? "\u0644\u0648\u062d\u0629 \u0627\u0644\u062a\u062d\u0643\u0645" : "Admin Dashboard"}
                  </h3>
                  <p className="text-xs text-white/50">
                    {language === "ar" ? "\u0623\u062f\u062e\u0644 \u0631\u0645\u0632 \u0627\u0644\u0645\u0631\u0648\u0631 \u0644\u0644\u0645\u062a\u0627\u0628\u0639\u0629" : "Enter passcode to continue"}
                  </p>
                </div>
              </div>

              <form onSubmit={handleVerifyPasscode} className="space-y-4">
                <div>
                  <input
                    type="password"
                    autoFocus
                    value={passcodeInput}
                    onChange={(e) => {
                      setPasscodeInput(e.target.value);
                      if (passcodeError) setPasscodeError("");
                    }}
                    placeholder={language === "ar" ? "\u0631\u0645\u0632 \u0627\u0644\u0645\u0631\u0648\u0631..." : "Enter passcode..."}
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-[#d4af37]/30 text-white placeholder-white/30 text-base focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-center tracking-widest font-mono"
                  />
                  {passcodeError && (
                    <p className="text-xs text-rose-400 font-bold mt-2 text-center">
                      {passcodeError}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setPasscodeModalOpen(false);
                      setPasscodeInput("");
                      setPasscodeError("");
                    }}
                    className="flex-1 py-2.5 rounded-xl border border-white/15 hover:bg-white/10 text-sm font-semibold text-white/70 transition"
                  >
                    {language === "ar" ? "\u0625\u0644\u063a\u0627\u0621" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#b8930a] text-[#1d3023] text-sm font-black shadow-md hover:brightness-110 active:scale-95 transition"
                  >
                    {language === "ar" ? "\u062a\u062d\u0642\u0642" : "Verify"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Dashboard Modal */}
      <AdminDashboardModal isOpen={adminOpen} onClose={() => setAdminOpen(false)} />
    </>
  );
}