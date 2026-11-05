"use client";

/**
 * AuthModal - Cream/Gold/White elegant design.
 * Perfectly centered: fixed inset-0 z-[100] flex items-center justify-center
 * Accepts initialMode prop to open in login or register mode.
 * AuthResult returns { success, error?: string } - no .message needed.
 * signUpWithEmail(email, password, metadata?) - metadata is Record<string,string>.
 */

import React, { useState, useEffect } from "react";
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

  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sync mode with initialMode when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setName(""); setEmail(""); setPassword(""); setPhone("");
      setErrorMsg(null); setSuccessMsg(null); setLoading(false);
    }
  }, [isOpen, initialMode]);

  useEffect(() => {
    setErrorMsg(null); setSuccessMsg(null);
  }, [mode]);

  // Translation map - all Arabic as Unicode escapes
  const translations = {
    ar: {
      title: "\u0633\u064e\u0646\u064e\u062f",
      subtitle: "\u0645\u0631\u062d\u0628\u0627\u064b \u0628\u0643",
      loginTab: "\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644",
      registerTab: "\u0625\u0646\u0634\u0627\u0621 \u062d\u0633\u0627\u0628",
      googleBtn: "\u062a\u0633\u062c\u064a\u0644 \u0628\u0648\u0627\u0633\u0637\u0629 Google",
      orContinue: "\u0623\u0648 \u062a\u0627\u0628\u0639 \u0628\u0640",
      namePlaceholder: "\u0627\u0633\u0645\u0643 \u0627\u0644\u0643\u0627\u0645\u0644",
      nameLabel: "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0643\u0627\u0645\u0644",
      emailLabel: "\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a",
      emailPlaceholder: "you@example.com",
      passwordLabel: "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631",
      passwordPlaceholder: "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 (6+ \u0623\u062d\u0631\u0641)",
      phoneLabel: "\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062a\u0641",
      phonePlaceholder: "+966 5xx xxx xxxx",
      loginBtn: "\u062f\u062e\u0648\u0644",
      registerBtn: "\u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u062d\u0633\u0627\u0628",
      noAccount: "\u0644\u064a\u0633 \u0644\u062f\u064a\u0643 \u062d\u0633\u0627\u0628\u061f",
      hasAccount: "\u0644\u062f\u064a\u0643 \u062d\u0633\u0627\u0628 \u0628\u0627\u0644\u0641\u0639\u0644\u061f",
      createAccount: "\u0625\u0646\u0634\u0627\u0621 \u062d\u0633\u0627\u0628 \u062c\u062f\u064a\u062f",
      login: "\u062f\u062e\u0648\u0644",
      notConfigured: "\u0644\u0645 \u064a\u062a\u0645 \u062a\u0643\u0648\u064a\u0646 Supabase \u0628\u0639\u062f",
      loginSuccess: "\u062a\u0645 \u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644 \u0628\u0646\u062c\u0627\u062d",
      registerSuccess: "\u062a\u0645 \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u062d\u0633\u0627\u0628! \u062a\u062d\u0642\u0642 \u0645\u0646 \u0628\u0631\u064a\u062f\u0643 \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a",
    },
    en: {
      title: "Sanad",
      subtitle: "Welcome back",
      loginTab: "Log In",
      registerTab: "Sign Up",
      googleBtn: "Continue with Google",
      orContinue: "Or continue with",
      namePlaceholder: "Your full name",
      nameLabel: "Full Name",
      emailLabel: "Email Address",
      emailPlaceholder: "you@example.com",
      passwordLabel: "Password",
      passwordPlaceholder: "Password (6+ chars)",
      phoneLabel: "Phone Number",
      phonePlaceholder: "+966 5xx xxx xxxx",
      loginBtn: "Log In",
      registerBtn: "Create Account",
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
      createAccount: "Create new account",
      login: "Log in",
      notConfigured: "Supabase is not configured yet",
      loginSuccess: "Logged in successfully!",
      registerSuccess: "Account created! Check your email to verify.",
    },
    tr: {
      title: "Sanad",
      subtitle: "Ho\u015f geldiniz",
      loginTab: "Giri\u015f",
      registerTab: "Kay\u0131t",
      googleBtn: "Google ile devam et",
      orContinue: "Veya \u015funlarla devam et",
      namePlaceholder: "Tam ad\u0131n\u0131z",
      nameLabel: "Ad Soyad",
      emailLabel: "E-posta",
      emailPlaceholder: "you@example.com",
      passwordLabel: "\u015eifre",
      passwordPlaceholder: "\u015eifre (6+ karakter)",
      phoneLabel: "Telefon Numaras\u0131",
      phonePlaceholder: "+90 5xx xxx xxxx",
      loginBtn: "Giri\u015f",
      registerBtn: "Hesap Olu\u015ftur",
      noAccount: "Hesab\u0131n\u0131z yok mu?",
      hasAccount: "Zaten hesab\u0131n\u0131z var m\u0131?",
      createAccount: "Yeni hesap olu\u015ftur",
      login: "Giri\u015f",
      notConfigured: "Supabase hen\u00fcz yap\u0131land\u0131r\u0131lmad\u0131",
      loginSuccess: "Ba\u015far\u0131yla giri\u015f yap\u0131ld\u0131!",
      registerSuccess: "Hesap olu\u015fturuldu! E-postan\u0131z\u0131 do\u011frulayun.",
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
      if (!result.success) setErrorMsg(result.error ?? "Unknown error");
      else onClose();
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : "Unknown error");
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
        if (!result.success) setErrorMsg(result.error ?? "Login failed");
        else { setSuccessMsg(t.loginSuccess); setTimeout(onClose, 1200); }
      } else {
        const result = await signUpWithEmail(email, password, {
          full_name: name,
          phone: phone,
          display_name: name,
        });
        if (!result.success) setErrorMsg(result.error ?? "Registration failed");
        else setSuccessMsg(t.registerSuccess);
      }
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
          dir={isAr ? "rtl" : "ltr"}
        >
          {/* Backdrop click to close */}
          <div className="absolute inset-0" onClick={onClose} />

          {/* Modal Card - cream/gold design */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="relative w-full max-w-md bg-[#fdfaf4] border border-[#d4af37]/40 rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gold glow decorations */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full text-[#d4af37]/70 hover:text-[#d4af37] hover:bg-[#d4af37]/10 transition-all"
            >
              <X size={18} />
            </button>

            <div className="relative p-8">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#b8930a] mb-4 shadow-lg">
                  <Sparkles className="text-white" size={26} />
                </div>
                <h2 className="text-2xl font-black text-slate-900">{t.title}</h2>
                <p className="text-[#d4af37] font-semibold text-sm mt-1">{t.subtitle}</p>
              </div>

              {/* Tabs */}
              <div className="flex rounded-2xl bg-[#f0ead6] p-1 mb-6 border border-[#d4af37]/20">
                {(["login", "register"] as Mode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`flex-1 py-2 px-3 rounded-xl text-sm font-bold transition-all ${
                      mode === m
                        ? "bg-gradient-to-r from-[#d4af37] to-[#b8930a] text-white shadow-md"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {m === "login" ? t.loginTab : t.registerTab}
                  </button>
                ))}
              </div>

              {/* Error / Success banners */}
              {errorMsg && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-4 text-sm">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 mb-4 text-sm">
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Google button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-white border border-[#d4af37]/30 text-slate-700 font-semibold hover:bg-[#fdfaf4] hover:border-[#d4af37]/60 transition-all shadow-sm mb-5 disabled:opacity-60"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {t.googleBtn}
              </button>

              {/* Divider */}
              <div className="relative mb-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#d4af37]/20" />
                </div>
                <div className="relative flex justify-center text-xs text-slate-400">
                  <span className="bg-[#fdfaf4] px-3">{t.orContinue}</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "register" && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">{t.nameLabel}</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d4af37]/60" />
                      <input
                        type="text"
                        required
                        placeholder={t.namePlaceholder}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#d4af37]/30 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50 focus:border-[#d4af37] transition-all text-sm"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t.emailLabel}</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d4af37]/60" />
                    <input
                      type="email"
                      required
                      placeholder={t.emailPlaceholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#d4af37]/30 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50 focus:border-[#d4af37] transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t.passwordLabel}</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d4af37]/60" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder={t.passwordPlaceholder}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#d4af37]/30 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50 focus:border-[#d4af37] transition-all text-sm"
                    />
                  </div>
                </div>

                {mode === "register" && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">{t.phoneLabel}</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d4af37]/60" />
                      <input
                        type="tel"
                        required
                        placeholder={t.phonePlaceholder}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#d4af37]/30 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50 focus:border-[#d4af37] transition-all text-sm"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#b8930a] text-white font-black text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    mode === "login" ? t.loginBtn : t.registerBtn
                  )}
                </button>
              </form>

              {/* Toggle mode */}
              <div className="text-center mt-5 text-xs text-slate-500">
                {mode === "login" ? (
                  <p>
                    {t.noAccount}{" "}
                    <button
                      type="button"
                      onClick={() => { setMode("register"); setErrorMsg(null); setSuccessMsg(null); }}
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
                      onClick={() => { setMode("login"); setErrorMsg(null); setSuccessMsg(null); }}
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
}