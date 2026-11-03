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

export default function RequestAssistanceModal({ isOpen, onClose, onSubmit }: RequestAssistanceModalProps) {
  const { language } = useLanguage();
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState(100);
  const [sent, setSent] = useState(false);
  const copy = language === "ar" ? { title: "طلب مساعدة", message: "اشرح احتياجك باختصار", amount: "المبلغ المطلوب بالدولار", placeholder: "مثال: نحتاج مساعدة طبية عاجلة...", submit: "إرسال الطلب", success: "تم إرسال طلبك", successHint: "سيراجع فريق سَنَد طلبك ويتواصل معك قريباً.", close: "إغلاق" } : language === "tr" ? { title: "Yardım talep et", message: "İhtiyacınızı kısaca anlatın", amount: "İstenen tutar (USD)", placeholder: "Örn: Acil tıbbi desteğe ihtiyacımız var...", submit: "Talebi gönder", success: "Talebiniz gönderildi", successHint: "Sanad ekibi talebinizi inceleyip yakında iletişime geçecek.", close: "Kapat" } : { title: "Request assistance", message: "Tell us what you need", amount: "Requested amount in USD", placeholder: "Example: We need urgent medical support...", submit: "Send request", success: "Your request was sent", successHint: "The Sanad team will review it and contact you soon.", close: "Close" };
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); onSubmit({ id: `request-${Date.now()}`, message: message.trim(), amount }); setSent(true); };

  return <AnimatePresence>{isOpen && <div className="fixed inset-0 z-[80] flex items-center justify-center p-4"><motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" aria-label={copy.close} /><motion.div initial={{ opacity: 0, y: 24, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24 }} className="relative w-full max-w-lg rounded-[30px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-2xl"><button onClick={onClose} className="absolute top-4 end-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500" aria-label={copy.close}><X className="w-5 h-5" /></button>{sent ? <div className="text-center py-8"><div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 mx-auto flex items-center justify-center mb-5"><CheckCircle2 className="w-8 h-8" /></div><h2 className="text-2xl font-black text-slate-900 dark:text-white">{copy.success}</h2><p className="mt-3 text-slate-500">{copy.successHint}</p><button onClick={onClose} className="mt-6 rounded-xl bg-emerald-700 text-white px-6 py-3 font-bold">{copy.close}</button></div> : <><div className="flex items-center gap-3 mb-7"><div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 flex items-center justify-center"><HandHeart className="w-6 h-6" /></div><div><p className="text-xs font-black uppercase tracking-[.16em] text-emerald-600">Sanad care</p><h2 className="text-2xl font-black text-slate-900 dark:text-white">{copy.title}</h2></div></div><form onSubmit={submit} className="space-y-5"><label className="block text-sm font-bold text-slate-700 dark:text-slate-200">{copy.message}<textarea required minLength={10} value={message} onChange={(event) => setMessage(event.target.value)} placeholder={copy.placeholder} className="mt-2 w-full min-h-28 resize-none rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 font-normal focus:outline-none focus:ring-2 focus:ring-emerald-500" /></label><label className="block text-sm font-bold text-slate-700 dark:text-slate-200">{copy.amount}<NumberInput label={copy.amount} min={1} value={amount} onCommit={setAmount} className="mt-2 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 font-normal focus:outline-none focus:ring-2 focus:ring-emerald-500" /></label><button className="w-full rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white py-4 font-black transition">{copy.submit}</button></form></>}</motion.div></div>}</AnimatePresence>;
}
