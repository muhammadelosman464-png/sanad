"use client";

/**
 * Header
 * ---------------------------------------------------------------------------
 * Sticky top navigation bar for Sanad.
 *
 * Update 2 — Logo: loads from /logo.jpeg via Next.js <Image> component.
 * REMINDER: Drag your "logo.jpeg" file from the Desktop into the /public folder.
 *
 * Update 3 — Dynamic Auth State:
 *   - Checks Supabase session on mount and subscribes to auth state changes.
 *   - Guest:     shows "Log In" + "Create Account" buttons.
 *   - Logged-in: replaces auth buttons with a User Profile pill (avatar + name)
 *                and a "Logout" dropdown menu.
 * ---------------------------------------------------------------------------
 */

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  UserPlus,
  LogIn,
  Heart,
  LogOut,
  ChevronDown,
  User,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import AuthModal from "@/components/modals/AuthModal";
import { supabase, isSupabaseConfigured, signOutUser } from "@/lib/supabase/client";
import { toast } from "@/components/ui/Toast";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function Header() {
  const { t, language } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login");

  /* ── Auth state ──────────────────────────────────────────────────────── */
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    /* Fetch initial session */
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    /* Live auth state listener */
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  /* Close profile dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Helpers ──────────────────────────────────────────────────────────── */

  const openAuth = (mode: "login" | "register") => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    setProfileOpen(false);
    const result = await signOutUser();
    if (result.success) {
      toast.success(
        language === "ar"
          ? "تم تسجيل الخروج بنجاح."
          : language === "tr"
          ? "Basarıyla cikis yapildi."
          : "Successfully signed out."
      );
    } else {
      toast.error(result.error ?? "Sign out failed.");
    }
  };

  /* Display name: full_name from metadata, or email prefix, or "User" */
  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ??
    user?.email?.split("@")[0] ??
    (language === "ar" ? "المستخدم" : language === "tr" ? "Kullanici" : "User");

  /* Avatar initials (max 2 chars) */
  const initials = displayName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  /* ── Translations ─────────────────────────────────────────────────────── */
  const T = {
    myOrders:
      language === "ar" ? "طلباتي" : language === "tr" ? "Siparislerim" : "My Orders",
    settings:
      language === "ar" ? "الإعدادات" : language === "tr" ? "Ayarlar" : "Settings",
    logout:
      language === "ar" ? "تسجيل الخروج" : language === "tr" ? "Cikis Yap" : "Sign Out",
    loggedInAs:
      language === "ar"
        ? "مسجّل الدخول كـ"
        : language === "tr"
        ? "Giris yapildi:"
        : "Signed in as",
  };

  /* ── Render ───────────────────────────────────────────────────────────── */
  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* ── Logo ──────────────────────────────────────────────────── */}
            {/*
             * REMINDER: Drop your "logo.jpeg" file into the /public folder.
             * Path: sanad/public/logo.jpeg
             * The <Image> component below will then display it automatically.
             */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="relative rounded-2xl overflow-hidden shadow-md shadow-brand-500/20 transition-transform group-hover:scale-105 shrink-0 bg-brand-50 dark:bg-brand-900/20">
                <Image
                  src="/logo.jpeg"
                  alt="Sanad Logo"
                  width={150}
                  height={50}
                  className="object-contain h-12 w-auto"
                  priority
                  onError={(e) => {
                    /* Graceful fallback if logo.jpeg is not yet placed in /public */
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Sanad</span>
                  <span className="text-brand-600 dark:text-brand-400 font-arabic text-lg font-bold">
                    سَنَد
                  </span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 flex items-center gap-1">
                  <Heart className="w-2.5 h-2.5 text-rose-400" />
                  <span>
                    {language === "ar"
                      ? "سندك في الغربة"
                      : language === "tr"
                      ? "Gurbetteki Guvenceniz"
                      : "Family Support Platform"}
                  </span>
                </span>
              </div>
            </Link>

            {/* ── Desktop Navigation ────────────────────────────────────── */}
            <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
              <Link href="/#services" className="hover:text-brand-600 dark:hover:text-brand-400 transition">
                {t("navServices")}
              </Link>
              <Link href="/#how-it-works" className="hover:text-brand-600 dark:hover:text-brand-400 transition">
                {t("navProviders")}
              </Link>
              <Link href="/#pricing" className="hover:text-brand-600 dark:hover:text-brand-400 transition">
                {t("navPricing")}
              </Link>
              <Link
                href="/impact"
                className="flex items-center gap-1.5 hover:text-brand-600 dark:hover:text-brand-400 transition font-semibold text-rose-500 dark:text-rose-400"
              >
                {language === "ar" ? "الأثر الإنساني" : language === "tr" ? "Etkimiz" : "Our Impact"}
              </Link>
            </nav>

            {/* ── Desktop Controls & Auth ───────────────────────────────── */}
            <div className="hidden sm:flex items-center gap-3">
              <LanguageSwitcher />
              <ThemeToggle />

              {user ? (
                /* ── LOGGED-IN: User profile pill + dropdown ─────────── */
                <div ref={profileRef} className="relative">
                  <button
                    onClick={() => setProfileOpen((o) => !o)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition group"
                  >
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-rose-500 flex items-center justify-center text-white text-xs font-black shrink-0 shadow-sm">
                      {initials}
                    </div>
                    {/* Name */}
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 max-w-[120px] truncate">
                      {displayName}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute end-0 top-full mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-900/10 overflow-hidden z-50"
                      >
                        {/* User email label */}
                        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                          <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{T.loggedInAs}</p>
                          <p className="text-xs text-slate-700 dark:text-slate-200 truncate mt-0.5 font-medium">
                            {user.email}
                          </p>
                        </div>

                        {/* Menu items */}
                        <div className="py-1">
                          <Link
                            href="/my-orders"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                          >
                            <LayoutDashboard className="w-4 h-4 text-brand-500" />
                            {T.myOrders}
                          </Link>
                          <Link
                            href="/dashboard"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                          >
                            <Settings className="w-4 h-4 text-slate-400" />
                            {T.settings}
                          </Link>
                        </div>

                        <div className="border-t border-slate-100 dark:border-slate-800 py-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition w-full text-start"
                          >
                            <LogOut className="w-4 h-4" />
                            {T.logout}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* ── GUEST: Login + Create Account buttons ─────────── */
                <>
                  <button
                    onClick={() => openAuth("login")}
                    className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 transition flex items-center gap-1.5"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{t("login")}</span>
                  </button>
                  <button
                    onClick={() => openAuth("register")}
                    className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white text-sm font-semibold shadow-md shadow-brand-500/25 transition-all transform hover:-translate-y-0.5"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>{t("createAccount")}</span>
                  </button>
                </>
              )}
            </div>

            {/* ── Mobile controls ───────────────────────────────────────── */}
            <div className="flex items-center gap-2 sm:hidden">
              <ThemeToggle />
              {/* Show avatar on mobile when logged in */}
              {user && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-rose-500 flex items-center justify-center text-white text-xs font-black shadow-sm">
                  {initials}
                </div>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Dropdown Menu ───────────────────────────────────────── */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="sm:hidden overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-4 bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 backdrop-blur-lg">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-semibold text-slate-500">
                    {language === "ar" ? "اللغة" : language === "tr" ? "Dil" : "Language"}
                  </span>
                  <LanguageSwitcher />
                </div>

                {/* Show user info on mobile when logged in */}
                {user && (
                  <div className="flex items-center gap-3 py-2 px-3 rounded-xl bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800/40">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-rose-500 flex items-center justify-center text-white text-sm font-black shadow-sm">
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">{displayName}</p>
                      <p className="text-xs text-slate-500 truncate max-w-[180px]">{user.email}</p>
                    </div>
                  </div>
                )}

                <nav className="flex flex-col space-y-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                  <Link href="/#services" onClick={() => setMobileMenuOpen(false)} className="hover:text-brand-500 py-1">
                    {t("navServices")}
                  </Link>
                  <Link href="/#how-it-works" onClick={() => setMobileMenuOpen(false)} className="hover:text-brand-500 py-1">
                    {t("navProviders")}
                  </Link>
                  <Link href="/#pricing" onClick={() => setMobileMenuOpen(false)} className="hover:text-brand-500 py-1">
                    {t("navPricing")}
                  </Link>
                  <Link href="/impact" onClick={() => setMobileMenuOpen(false)} className="text-rose-500 font-semibold py-1">
                    {language === "ar" ? "الأثر الإنساني" : language === "tr" ? "Etkimiz" : "Our Impact"}
                  </Link>
                </nav>

                <div className="pt-2 flex flex-col gap-2.5">
                  {user ? (
                    <>
                      <Link
                        href="/my-orders"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full py-2.5 rounded-xl border border-brand-300 dark:border-brand-700 text-brand-700 dark:text-brand-300 font-semibold text-sm text-center"
                      >
                        {T.myOrders}
                      </Link>
                      <button
                        onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                        className="w-full py-2.5 rounded-xl border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 font-semibold text-sm flex items-center justify-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        {T.logout}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => openAuth("login")}
                        className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        {t("login")}
                      </button>
                      <button
                        onClick={() => openAuth("register")}
                        className="w-full py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-sm shadow-md"
                      >
                        {t("createAccount")}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </>
  );
}
