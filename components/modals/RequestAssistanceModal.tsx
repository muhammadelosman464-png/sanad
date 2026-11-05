"use client";

import { FormEvent, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, HandHeart, X, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import NumberInput from "@/components/ui/NumberInput";
import { supabase, saveHelpRequest, saveOrder, syncUserProfile } from "@/lib/supabase/client";

export interface AssistanceRequest {
  id: string;
  message: string;
  amount: number;
}

interface RequestAssistanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: AssistanceRequest) => void;
}

const DEFAULT_AMOUNT = 100;

export default function RequestAssistanceModal({
  isOpen,
  onClose,
  onSubmit,
}: RequestAssistanceModalProps) {
  const { language } = useLanguage();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState(DEFAULT_AMOUNT);
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill user data if authenticated
  useEffect(() => {
    if (!supabase || !isOpen) return;
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        if (!name && data.user.user_metadata?.full_name) setName(data.user.user_metadata.full_name);
        if (!phone && (data.user.user_metadata?.phone || data.user.phone)) {
          setPhone(data.user.user_metadata?.phone || data.user.phone || "");
        }
      }
    });
  }, [isOpen]);

  const copy =
    language === "ar"
      ? {
          title: "\u0637\u0644\u0628 \u0645\u0633\u0627\u0639\u062f\u0629",
          nameLabel: "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0643\u0627\u0645\u0644",
          phoneLabel: "\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062a\u0641 / \u0627\u0644\u0648\u0627\u062a\u0633\u0622\u0628 (\u0644\u0644\u062a\u0648\u0627\u0635\u0644)",
          message: "\u0627\u0634\u0631\u062d \u0627\u062d\u062a\u064a\u0627\u062c\u0643 \u0628\u0627\u062e\u062a\u0635\u0627\u0631",
          amount: "\u0627\u0644\u0645\u0628\u0644\u063a \u0627\u0644\u062a\u0642\u062f\u064a\u0631\u064a (USD)",
          placeholder: "\u0645\u062b\u0644\u0627\u064b: \u0646\u062d\u062a\u0627\u062c \u0625\u0644\u0649 \u062f\u0639\u0645 \u0637\u0628\u064a \u0639\u0627\u062c\u0644 \u0644\u0644\u0639\u0627\u0626\u0644\u0629...",
          submit: "\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0637\u0644\u0628",
          success: "\u062a\u0645 \u0625\u0631\u0633\u0627\u0644 \u0637\u0644\u0628\u0643 \u0628\u0646\u062c\u0627\u062d",
          successHint: "\u0633\u064a\u0642\u0648\u0645 \u0641\u0631\u064a\u0642 \u0633\u0646\u062f \u0628\u0645\u0631\u0627\u062c\u0639\u0629 \u0627\u0644\u0637\u0644\u0628 \u0648\u0627\u0644\u062a\u0648\u0627\u0635\u0644 \u0645\u0639\u0643 \u0639\u0628\u0631 \u0627\u0644\u0648\u0627\u062a\u0633\u0622\u0628 \u0642\u0631\u064a\u0628\u0627\u064b.",
          another: "\u0625\u0631\u0633\u0627\u0644 \u0637\u0644\u0628 \u0622\u062e\u0631",
          close: "\u0625\u063a\u0644\u0627\u0642",
        }
      : language === "tr"
      ? {
          title: "Yardim talep et",
          nameLabel: "Ad Soyad",
          phoneLabel: "Telefon Numarasi (WhatsApp)",
          message: "Ihtiyacinizi kisaca anlatin",
          amount: "Istenen tutar (USD)",
          placeholder: "Orn: Acil tibbi destege ihtiyacimiz var...",
          submit: "Talebi gonder",
          success: "Talebiniz gonderildi",
          successHint: "Sanad ekibi talebinizi inceleyip yakinda iletisime gececektir.",
          another: "Yeni talep gonder",
          close: "Kapat",
        }
      : {
          title: "Request Assistance",
          nameLabel: "Full Name",
          phoneLabel: "Phone Number / WhatsApp",
          message: "Tell us what you need",
          amount: "Requested amount in USD",
          placeholder: "Example: We need urgent medical assistance for our family...",
          submit: "Send Request",
          success: "Your request was submitted",
          successHint: "The Sanad team will review your request and contact you via WhatsApp soon.",
          another: "Submit Another Request",
          close: "Close",
        };

  const resetForm = () => {
    setMessage("");
    setAmount(DEFAULT_AMOUNT);
    setSent(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const requestId = `request-${Date.now()}`;
    onSubmit({ id: requestId, message: message.trim(), amount });

    try {
      let currentUserId: string | null = null;
      let userEmail = "";

      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          currentUserId = user.id;
          userEmail = user.email || "";
          await syncUserProfile(user);
        }
      }

      // 1. Save to `help_requests` table
      await saveHelpRequest({
        user_id: currentUserId,
        user_email: userEmail,
        user_name: name.trim() || undefined,
        user_phone: phone.trim() || undefined,
        message: message.trim(),
        amount_usd: amount,
      });

      // 2. Also register in `orders` table so the admin sees it in all transaction feeds
      await saveOrder({
        user_id: currentUserId,
        user_email: userEmail || "assistance@sanad.org",
        user_name: name.trim() || "Assistance Applicant",
        user_phone: phone.trim(),
        service_title: `Assistance: ${message.slice(0, 30)}...`,
        service_category: "support",
        amount_usd: amount,
        quantity: 1,
        notes: `Help Request: ${message.trim()}`,
      });

      setSent(true);
    } catch (err) {
      console.warn("Assistance submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="relative z-10 w-full max-w-lg rounded-[30px] bg-white dark:bg-[#1d3023] border border-slate-200 dark:border-[#ffd700]/30 p-6 sm:p-8 shadow-2xl my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 end-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-300"
              aria-label={copy.close}
            >
              <X className="w-5 h-5" />
            </button>

            {sent ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  {copy.success}
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {copy.successHint}
                </p>
                <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2.5 font-bold text-sm transition"
                  >
                    {copy.another}
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-xl border border-slate-200 dark:border-white/20 text-slate-700 dark:text-white px-6 py-2.5 font-bold text-sm transition"
                  >
                    {copy.close}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                    <HandHeart className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[.16em] text-emerald-600 dark:text-[#ffd700]">
                      Sanad Care
                    </p>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                      {copy.title}
                    </h2>
                  </div>
                </div>

                <form onSubmit={submit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                      {copy.nameLabel}
                      <input
                        required
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Ahmad"
                        className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-xs sm:text-sm font-normal text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ffd700]"
                      />
                    </label>

                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                      {copy.phoneLabel}
                      <input
                        required
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+90 5xx xxx xxxx"
                        className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-xs sm:text-sm font-normal text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ffd700]"
                      />
                    </label>
                  </div>

                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                    {copy.message}
                    <textarea
                      required
                      minLength={10}
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      placeholder={copy.placeholder}
                      className="mt-1 w-full min-h-24 resize-none rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs sm:text-sm font-normal text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ffd700]"
                    />
                  </label>

                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                    {copy.amount}
                    <NumberInput
                      label={copy.amount}
                      min={1}
                      value={amount}
                      onCommit={setAmount}
                      className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-xs sm:text-sm font-normal text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ffd700]"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8930a] text-white py-3.5 font-bold text-sm transition flex items-center justify-center gap-2 shadow-md hover:brightness-105 disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      copy.submit
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}