"use client";

import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, HandHeart, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import NumberInput from "@/components/ui/NumberInput";

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

export default function RequestAssistanceModal({ isOpen, onClose, onSubmit }: RequestAssistanceModalProps) {
  const { language } = useLanguage();
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState(DEFAULT_AMOUNT);
  const [formKey, setFormKey] = useState(0);
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const copy = language === "ar" ? { title: "طلب مساعدة", message: "اشرح احتياجك باختصار", amount: "المبلغ المطلوب بالدولار", placeholder: "مثال: نحتاج مساعدة طبية عاجلة...", submit: "إرسال الطلب", success: "تم إرسال طلبك", successHint: "سيراجع فريق سَنَد طلبك ويتواصل معك قريباً.", another: "إرسال طلب آخر", close: "إغلاق" } : language === "tr" ? { title: "Yardım talep et", message: "İhtiyacınızı kısaca anlatın", amount: "İstenen tutar (USD)", placeholder: "Örn: Acil tıbbi desteğe ihtiyacımız var...", submit: "Talebi gönder", success: "Talebiniz gönderildi", successHint: "Sanad ekibi talebinizi inceleyip yakında iletişime geçecek.", another: "Yeni talep gönder", close: "Kapat" } : { title: "Request assistance", message: "Tell us what you need", amount: "Requested amount in USD", placeholder: "Example: We need urgent medical support...", submit: "Send request", success: "Your request was sent", successHint: "The Sanad team will review it and contact you soon.", another: "Send another request", close: "Close" };

  const resetForm = () => {
    setMessage("");
    setAmount(DEFAULT_AMOUNT);
    setFormKey((key) => key + 1);
    setSent(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    onSubmit({ id: `request-${Date.now()}`, message: message.trim(), amount });
    setMessage("");
    setAmount(DEFAULT_AMOUNT);
    setFormKey((key) => key + 1);
    setSent(true);
    setIsSubmitting(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            aria-label={copy.close}
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24 }}
            className="relative w-full max-w-lg rounded-[30px] bg-white dark:bg-[#1d3023] border border-slate-200 dark:border-[#ffd700]/25 p-6 sm:p-8 shadow-2xl"
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
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 mx-auto flex items-center justify-center mb-5">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">{copy.success}</h2>
                <p className="mt-3 text-slate-500 dark:text-slate-300">{copy.successHint}</p>
                <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                  <button type="button" onClick={() => setSent(false)} className="rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 font-bold transition">
                    {copy.another}
                  </button>
                  <button type="button" onClick={handleClose} className="rounded-xl border border-slate-200 dark:border-white/20 text-slate-700 dark:text-white px-6 py-3 font-bold transition">
                    {copy.close}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 flex items-center justify-center">
                    <HandHeart className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[.16em] text-emerald-600 dark:text-[#ffd700]">Sanad care</p>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">{copy.title}</h2>
                  </div>
                </div>
                <form onSubmit={submit} className="space-y-5">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                    {copy.message}
                    <textarea
                      required
                      minLength={10}
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      placeholder={copy.placeholder}
                      className="mt-2 w-full min-h-28 resize-none rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 font-normal text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </label>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                    {copy.amount}
                    <NumberInput
                      key={formKey}
                      label={copy.amount}
                      min={1}
                      value={amount}
                      onCommit={setAmount}
                      className="mt-2 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 font-normal text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white py-4 font-black transition"
                  >
                    {copy.submit}
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
