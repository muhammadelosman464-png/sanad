"use client";

/**
 * AuthModal - Centered Full-Viewport Overlay Modal.
 * Renders via React createPortal to document.body so it NEVER gets trapped
 * inside headers, transforms, or backdrop-blur containing blocks.
 *
 * Container: fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm
 */

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  isSupabaseConfigured,
  supabase,
} from "@/lib/supabase/client";

type Mode = "login" | "register";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: Mode;
}

export default function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  const { language } = useLanguage();
  const isAr = language === "ar";

  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync mode with initialMode when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setErrorMsg(null);
      setSuccessMsg(null);
      setLoading(false);
    }
  }, [isOpen, initialMode]);

  useEffect(() => {
    setErrorMsg(null);
    setSuccessMsg(null);
  }, [mode]);

  // Translation map using Unicode escapes to guarantee zero UTF-8 corruption
  const translations = {
    ar: {
      title: "\u0633\u064e\u0646\u064e\u062f",
      subtitle: "\u0645\u0631\u062d\u0628\u0627\u064b \u0628\u0643 \u0641\u064a \u0645\u0646\u0635\u062a\u0643",
      loginTab: "\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644",
      registerTab: "\u0625\u0646\u0634\u0627\u0621 \u062d\u0633\u0627\u0628 \u062c\u062f\u064a\u062f",
      googleBtn: "\u0627\u0644\u0645\u062a\u0627\u0628\u0639\u0629 \u0628\u0627\u0633\u062a\u062e\u062f\u0627\u0645 Google",
      orContinue: "\u0623\u0648 \u0639\u0628\u0631 \u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a",
      namePlaceholder: "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0643\u0627\u0645\u0644",
      nameLabel: "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0643\u0627\u0645\u0644",
      emailLabel: "\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a",
      emailPlaceholder: "you@example.com",
      passwordLabel: "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631",
      passwordPlaceholder: "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 (6+ \u0623\u062d\u0631\u0641)",
      phoneLabel: "\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062a\u0641 / \u0627\u0644\u0648\u0627\u062a\u0633\u0622\u0628",
      phonePlaceholder: "+90 5xx xxx xxxx",
      loginBtn: "\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644",
      registerBtn: "\u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u062d\u0633\u0627\u0628",
      noAccount: "\u0644\u064a\u0633 \u0644\u062f\u064a\u0643 \u062d\u0633\u0627\u0628\u061f",
      hasAccount: "\u0644\u062f\u064a\u0643 \u062d\u0633\u0627\u0628 \u0628\u0627\u0644\u0641\u0639\u0644\u061f",
      createAccount: "\u0625\u0646\u0634\u0627\u0621 \u062d\u0633\u0627\u0628",
      login: "\u062f\u062e\u0648\u0644",
      notConfigured: "\u0644\u0645 \u064a\u062a\u0645 \u062a\u0647\u064a\u0626\u0629 Supabase \u0628\u0639\u062f",
      loginSuccess: "\u062a\u0645 \u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644 \u0628\u0646\u062c\u0627\u062d!",
      registerSuccess: "\u062a\u0645 \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u062d\u0633\u0627\u0628 \u0628\u0646\u062c\u0627\u062d!",
    },
    en: {
      title: "Sanad",
      subtitle: "Welcome to your platform",
      loginTab: "Log In",
      registerTab: "Create Account",
      googleBtn: "Continue with Google",
      orContinue: "Or continue with email",
      namePlaceholder: "Full Name",
      nameLabel: "Full Name",
      emailLabel: "Email Address",
      emailPlaceholder: "you@example.com",
      passwordLabel: "Password",
      passwordPlaceholder: "Password (6+ chars)",
      phoneLabel: "Phone Number / WhatsApp",
      phonePlaceholder: "+90 5xx xxx xxxx",
      loginBtn: "Log In",
      registerBtn: "Create Account",
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
      createAccount: "Sign Up",
      login: "Log In",
      notConfigured: "Supabase is not configured yet",
      loginSuccess: "Logged in successfully!",
      registerSuccess: "Account created successfully!",
    },
    tr: {
      title: "Sanad",
      subtitle: "Platforma hos geldiniz",
      loginTab: "Giris Yap",
      registerTab: "Kayit Ol",
      googleBtn: "Google ile Devam Et",
      orContinue: "Veya e-posta ile",
      namePlaceholder: "Ad Soyad",
      nameLabel: "Ad Soyad",
      emailLabel: "E-posta",
      emailPlaceholder: "you@example.com",
      passwordLabel: "Sifre",
      passwordPlaceholder: "Sifre (6+ karakter)",
      phoneLabel: "Telefon Numarasi",
      phonePlaceholder: "+90 5xx xxx xxxx",
      loginBtn: "Giris Yap",
      registerBtn: "Hesap Olustur",
      noAccount: "Hesabiniz yok mu?",
      hasAccount: "Zaten hesabiniz var mi?",
      createAccount: "Kayit Ol",
      login: "Giris Yap",
      notConfigured: "Supabase henuz yapilandirilmadi",
      loginSuccess: "Giris basarili!",
      registerSuccess: "Hesap basariyla olusturuldu!",
    },
  };

  const t = translations[language as keyof typeof translations] ?? translations.en;

  async function handleGoogleSignIn() {
    if (!isSupabaseConfigured) {
      setErrorMsg(t.notConfigured);
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      const result = await signInWithGoogle();
      if (!result.success) {
        setErrorMsg(result.error ?? "Google sign in failed");
      } else {
        onClose();
      }
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      setErrorMsg(t.notConfigured);
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      if (mode === "login") {
        const result = await signInWithEmail(email, password);
        if (!result.success) {
          setErrorMsg(result.error ?? "Login failed");
        } else {
          setSuccessMsg(t.loginSuccess);
          setTimeout(onClose, 900);
        }
      } else {
        const result = await signUpWithEmail(email, password, {
          full_name: name.trim(),
          phone: phone.trim(),
          display_name: name.trim(),
        });
        if (!result.success) {
          console.error("[Supabase Auth Registration Error]:", result.error);
          if (result.error?.toLowerCase().includes("rate limit")) {
            setErrorMsg(
              isAr
                ? "\u062a\u0645 \u062a\u062c\u0627\u0648\u0632 \u062d\u062f \u0625\u0631\u0633\u0627\u0644 \u0631\u0633\u0627\u0626\u0644 \u0627\u0644\u062a\u0623\u0643\u064a\u062f (Email Rate Limit). \u064a\u0631\u062c\u0649 \u0625\u064a\u0642\u0627\u0641 'Confirm email' \u0645\u0646 \u0625\u0639\u062f\u0627\u062f\u0627\u062a Supabase Auth."
                : "Email rate limit exceeded. Please disable 'Confirm email' in Supabase Auth -> Providers -> Email settings to test without rate limits."
            );
          } else {
            setErrorMsg(result.error ?? "Registration failed");
          }
        } else {
          // Explicitly save into profiles table immediately
          if (supabase) {
            try {
              const { data: authData } = await supabase.auth.getUser();
              if (authData?.user) {
                await supabase.from("profiles").upsert(
                  {
                    id: authData.user.id,
                    email: authData.user.email ?? email.trim().toLowerCase(),
                    full_name: name.trim(),
                    phone: phone.trim(),
                    updated_at: new Date().toISOString(),
                  },
                  { onConflict: "id" }
                );
              }
            } catch (err) {
              console.warn("Direct profiles insert error:", err);
            }
          }
          setSuccessMsg(t.registerSuccess);
          setTimeout(onClose, 1200);
        }
      }
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  if (!mounted || !isOpen) return null;

  const modalNode = (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
          dir={isAr ? "rtl" : "ltr"}
        >
          {/* Backdrop click to dismiss */}
          <div
            className="fixed inset-0 bg-transparent cursor-pointer"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Centered Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative z-10 w-full max-w-md bg-[#fdfaf4] dark:bg-[#1a2d20] border border-[#d4af37]/40 rounded-3xl shadow-2xl overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient decorative glow */}
            <div className="absolute -top-20 -right-20 w-44 h-44 bg-[#d4af37]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-[#d4af37]/15 rounded-full blur-3xl pointer-events-none" />

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full text-[#d4af37]/80 hover:text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="relative p-7 sm:p-8">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#b8930a] mb-3 shadow-lg shadow-[#d4af37]/25 text-white">
                  <Sparkles size={24} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {t.title}
                </h2>
                <p className="text-[#d4af37] font-semibold text-xs sm:text-sm mt-0.5">
                  {t.subtitle}
                </p>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="flex rounded-2xl bg-[#f0ead6] dark:bg-black/30 p-1 mb-5 border border-[#d4af37]/20">
                {(["login", "register"] as Mode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      mode === m
                        ? "bg-gradient-to-r from-[#d4af37] to-[#b8930a] text-white shadow-md"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {m === "login" ? t.loginTab : t.registerTab}
                  </button>
                ))}
              </div>

              {/* Feedback messages */}
              {errorMsg && (
                <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl px-3.5 py-2.5 mb-4 text-xs font-semibold">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-xl px-3.5 py-2.5 mb-4 text-xs font-semibold">
                  <CheckCircle2 size={15} className="shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-white dark:bg-slate-800 border border-[#d4af37]/40 text-slate-800 dark:text-white font-semibold text-xs sm:text-sm hover:bg-[#fbf7ed] dark:hover:bg-slate-700 hover:border-[#d4af37] transition-all shadow-sm mb-4 disabled:opacity-60"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {t.googleBtn}
              </button>

              {/* Divider */}
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#d4af37]/25" />
                </div>
                <div className="relative flex justify-center text-[11px] text-slate-400">
                  <span className="bg-[#fdfaf4] dark:bg-[#1a2d20] px-3">{t.orContinue}</span>
                </div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {mode === "register" && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t.nameLabel}
                    </label>
                    <div className="relative">
                      <User size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-[#d4af37]" />
                      <input
                        type="text"
                        required
                        placeholder={t.namePlaceholder}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full ps-9 pe-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-[#d4af37]/35 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/60 text-xs sm:text-sm"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.emailLabel}
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-[#d4af37]" />
                    <input
                      type="email"
                      required
                      placeholder={t.emailPlaceholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full ps-9 pe-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-[#d4af37]/35 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/60 text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.passwordLabel}
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-[#d4af37]" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder={t.passwordPlaceholder}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full ps-9 pe-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-[#d4af37]/35 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/60 text-xs sm:text-sm"
                    />
                  </div>
                </div>

                {mode === "register" && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t.phoneLabel}
                    </label>
                    <div className="relative">
                      <Phone size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-[#d4af37]" />
                      <input
                        type="tel"
                        required
                        placeholder={t.phonePlaceholder}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full ps-9 pe-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-[#d4af37]/35 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/60 text-xs sm:text-sm"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8930a] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg hover:brightness-105 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : mode === "login" ? (
                    t.loginBtn
                  ) : (
                    t.registerBtn
                  )}
                </button>
              </form>

              {/* Mode toggle footer */}
              <div className="text-center mt-4 text-xs text-slate-500 dark:text-slate-400">
                {mode === "login" ? (
                  <p>
                    {t.noAccount}{" "}
                    <button
                      type="button"
                      onClick={() => setMode("register")}
                      className="text-[#d4af37] font-bold hover:underline"
                    >
                      {t.createAccount}
                    </button>
                  </p>
                ) : (
                  <p>
                    {t.hasAccount}{" "}
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="text-[#d4af37] font-bold hover:underline"
                    >
                      {t.login}
                    </button>
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalNode, document.body);
}