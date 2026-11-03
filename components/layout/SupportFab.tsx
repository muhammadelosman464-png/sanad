"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const WHATSAPP_URL = "https://wa.me/905347757737";

export default function SupportFab() {
  const { language } = useLanguage();
  const label = language === "ar" ? "تواصل معنا عبر واتساب" : language === "tr" ? "WhatsApp ile destek" : "Chat on WhatsApp";

  return (
    <motion.a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, y: [0, -4, 0] }}
      transition={{ opacity: { duration: 0.3 }, scale: { duration: 0.3 }, y: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.92 }}
      className="fixed bottom-24 sm:bottom-6 end-6 z-50 w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-900/40 flex items-center justify-center"
    >
      <MessageCircle className="w-6 h-6" />
    </motion.a>
  );
}
