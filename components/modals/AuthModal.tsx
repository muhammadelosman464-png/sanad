"use client";

/**
 * AuthModal
 * ---------------------------------------------------------------------------
 * Handles Login and Register flows for Sanad.
 *
 * Update 4 -- Phone Number field in Sign-Up:
 *   - Elegant input with country-code placeholder (+90)
 *   - Passed to signUpWithEmail() as options.data.phone metadata
 *     so it persists in Supabase auth.users.raw_user_meta_data
 *
 * All other auth logic unchanged (Google OAuth, email/password, error toasts).
 * ---------------------------------------------------------------------------
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
  Info,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  isSupabaseConfigured,
} from "@/lib/supabase/client";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = "login",
}: AuthModalProps) {
  const { t, language } = useLanguage();
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  /* Reset state whenever the modal opens or mode prop changes */
  useEffect(() => {
    setMode(initialMode);
    setErrorMsg(null);
    setSuccessMsg(null);
    setPhone("");
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  /* ── Google OAuth ──────────────────────────────────────────────────────── */
  const handleGoogleAuth = async () => {
    setLoading(true);
    setErrorMsg(null);
    const result = await signInWithGoogle();
    if (!result.success) {
      setErrorMsg(result.error ?? "Google sign-in failed.");
      setLoading(false);
    }
    /* On success the browser redirects automatically; keep loading spinner */
  };

  /* ── Email / Password ─────────────────────────────────────────────────── */
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    if (mode === "register") {
      /* Pass phone as metadata — stored in auth.users.raw_user_meta_data */
      const result = await signUpWithEmail(email, password, {
        full_name: fullName,
        phone: phone.trim(),
        preferred_lang: language,
      });

      if (!result.success) {
        setErrorMsg(result.error ?? "Registration failed.");
      } else {
        setSuccessMsg(
          language === "ar"
            ? "تم إنشاء الحساب! تحقق من بريدك الإلكتروني لتأكيد الحساب."
            : language === "tr"
            ? "Hesap olusturuldu! Dogrulama icin e-postanizi kontrol edin."
            : "Account created! Check your email to verify your account."
        );
      }
    } else {
      const result = await signInWithEmail(email, password);
      if (!result.success) {
        setErrorMsg(result.error ?? "Login failed.");
      } else {
        onClose();
      }
    }

    setLoading(false);
  };

  /* ── Translations ──────────────────────────────────────────────────────── */
  const T = {
    loginTitle:
      language === "ar"
        ? "مرحباً بعودتك"
        : language === "tr"
        ? "Tekrar Hosgeldiniz"
        : "Welcome back",
    registerTitle:
      language === "ar"
        ? "انضم إلى سَنَد"
        : language === "tr"
        ? "Sanad'a Katil"
        : "Join Sanad",
    loginSub:
      language === "ar"
        ? "سجّل الدخول لدعم عائلتك"
        : language === "tr"
        ? "Ailenizi desteklemek icin giris yapin"
        : "Sign in to support your family",
    registerSub:
      language === "ar"
        ? "ابدأ رحلة الدعم مجاناً"
        : language === "tr"
        ? "Ucretsiz destek yolculuguna baslayin"
        : "Start your support journey for free",
    fullName:
      language === "ar"
        ? "الاسم الكامل"
        : language === "tr"
        ? "Ad Soyad"
        : "Full Name",
    phoneLabel:
      language === "ar"
        ? "رقم الهاتف (اختياري)"
        : language === "tr"
        ? "Telefon Numarasi (Ihtiyari)"
        : "Phone Number (optional)",
    phonePlaceholder: "+90 555 123 4567",
    emailLabel:
      language === "ar"
        ? "البريد الإلكتروني"
        : language === "tr"
        ? "E-posta Adresi"
        : "Email Address",
    passwordLabel:
      language === "ar"
        ? "كلمة المرور"
        : language === "tr"
        ? "Sifre"
        : "Password",
    orContinueWith:
      language === "ar"
        ? "أو تابع بـ"
        : language === "tr"
        ? "veya ile devam et"
        : "or continue with",
    noAccount:
      language === "ar"
        ? "ليس لديك حساب؟"
        : language === "tr"
        ? "Hesabiniz yok mu?"
        : "Don't have an account?",
    hasAccount:
      language === "ar"
        ? "لديك حساب بالفعل؟"
        : language === "tr"
        ? "Zaten hesabiniz var mi?"
        : "Already have an account?",
    processing:
      language === "ar"
        ? "جارٍ المعالجة..."
        : language === "tr"
        ? "Isleniyor..."
        : "Processing...",
    configWarning:
      language === "ar"
        ? "المصادقة غير مهيأة. يُرجى إضافة بيانات Supabase إلى ملف .env.local."
        : language === "tr"
        ? "Kimlik dogrulama yapilandirilmamis. Lutfen .env.local dosyasina Supabase kimlik bilgilerini ekleyin."
        : "Authentication is not configured yet. Please add your Supabase credentials to .env.local.",
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden"
        >
          {/* Accent glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-5 end-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-rose-500 shadow-lg shadow-brand-500/30 mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              {mode === "login" ? T.loginTitle : T.registerTitle}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {mode === "login" ? T.loginSub : T.registerSub}
            </p>
          </div>

          {/* Supabase not configured warning */}
          {!isSupabaseConfigured && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 px-4 py-3">
              <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                {T.configWarning}
              </p>
            </div>
          )}

          {/* Error / Success banners */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 flex items-start gap-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 px-4 py-3"
              >
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs text-red-700 dark:text-red-300">{errorMsg}</p>
              </motion.div>
            )}
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 flex items-start gap-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 px-4 py-3"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-700 dark:text-emerald-300">{successMsg}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Google OAuth */}
          <button
            onClick={handleGoogleAuth}
            disabled={loading || !isSupabaseConfigured}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 transition disabled:opacity-50 shadow-sm mb-5"
          >
            {/* Google SVG icon */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {t("continueGoogle")}
          </button>

          {/* Divider */}
          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center text-xs text-slate-400">
              <span className="px-3 bg-white dark:bg-slate-900">{T.orContinueWith}</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">

            {/* Full Name (register only) */}
            {mode === "register" && (
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  {T.fullName}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute start-3 top-3.5" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={language === "ar" ? "محمد علي" : language === "tr" ? "Mehmet Ali" : "John Smith"}
                    className="w-full ps-10 pe-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* Phone Number (register only) */}
            {mode === "register" && (
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  {T.phoneLabel}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute start-3 top-3.5" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={T.phonePlaceholder}
                    className="w-full ps-10 pe-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
                    dir="ltr"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1 ps-1">
                  {language === "ar"
                    ? "يُستخدم لتأكيد الطلبات. يُحفظ بشكل آمن."
                    : language === "tr"
                    ? "Siparis onaylama icin kullanilir. Guvenli sekilde saklanir."
                    : "Used for order confirmation. Stored securely."}
                </p>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                {T.emailLabel}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute start-3 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full ps-10 pe-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                {T.passwordLabel}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute start-3 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full ps-10 pe-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
                  dir="ltr"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 mt-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white rounded-xl font-semibold text-sm shadow-md shadow-brand-500/25 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>
                {loading
                  ? T.processing
                  : mode === "login"
                  ? t("login")
                  : t("createAccount")}
              </span>
            </button>
          </form>

          {/* Toggle Login / Register */}
          <div className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
            {mode === "login" ? (
              <p>
                {T.noAccount}{" "}
                <button
                  type="button"
                  onClick={() => { setMode("register"); setErrorMsg(null); setSuccessMsg(null); }}
                  className="text-brand-600 dark:text-brand-400 font-semibold hover:underline"
                >
                  {t("createAccount")}
                </button>
              </p>
            ) : (
              <p>
                {T.hasAccount}{" "}
                <button
                  type="button"
                  onClick={() => { setMode("login"); setErrorMsg(null); setSuccessMsg(null); }}
                  className="text-brand-600 dark:text-brand-400 font-semibold hover:underline"
                >
                  {t("login")}
                </button>
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
