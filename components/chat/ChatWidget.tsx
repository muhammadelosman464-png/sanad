"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  ExternalLink,
  CheckCheck,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
}

/**
 * ChatWidget — Floating AI + Telegram/n8n concierge chatbot.
 *
 * To wire your real chatbot:
 *   1. Set NEXT_PUBLIC_N8N_WEBHOOK_URL in .env.local to your n8n webhook.
 *   2. Set NEXT_PUBLIC_TELEGRAM_BOT_USERNAME to your bot's username.
 *   The widget auto-detects which to use.
 */
export default function ChatWidget() {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");

  // Welcome message uses the current language from context at mount time.
  // We derive it inline to avoid the stale-closure issue with initial state.
  const makeWelcome = (): Message => ({
    id: "welcome-1",
    sender: "bot",
    text: t("chatWelcome"),
    timestamp: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Populate the welcome message after mount so translation is ready
  useEffect(() => {
    setMessages([makeWelcome()]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const telegramBotUsername =
    process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "SanadSupportBot";
  const telegramUrl = `https://t.me/${telegramBotUsername}`;

  /** Send a user message and request a bot reply */
  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = input.trim();
    if (!text) return;

    const now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Append user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: now,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const n8nWebhook = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
      let replyText = "";

      if (
        n8nWebhook &&
        !n8nWebhook.includes("your-n8n-instance")
      ) {
        // ── Real n8n webhook call ──────────────────────────────
        const res = await fetch(n8nWebhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            language,
            timestamp: new Date().toISOString(),
          }),
        });
        const data = await res.json();
        replyText =
          data.reply ?? data.output ?? data.text ?? "Thank you for reaching out!";
      } else {
        // ── Friendly fallback until webhook is configured ──────
        await new Promise((res) => setTimeout(res, 900));
        replyText =
          language === "ar"
            ? "شكراً لتواصلك معنا! تم استلام رسالتك. يمكنك أيضاً التواصل مباشرة عبر واتساب أو تيليجرام لخدمة أسرع."
            : language === "tr"
            ? "Mesajınız alındı, teşekkürler! Daha hızlı yardım için WhatsApp veya Telegram üzerinden de yazabilirsiniz."
            : "Thank you for reaching out! Your message was received. For faster support, contact us via WhatsApp or Telegram.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: "bot",
          text:
            language === "ar"
              ? `حدث خطأ في الاتصال. يمكنك التواصل مباشرة على تيليجرام: @${telegramBotUsername}`
              : language === "tr"
              ? `Bağlantı hatası oluştu. Lütfen doğrudan Telegram üzerinden yazın: @${telegramBotUsername}`
              : `Connection error. Please reach us directly on Telegram: @${telegramBotUsername}`,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 end-6 z-50">
      {/* ── Floating Action Button ── */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="relative p-4 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-2xl shadow-brand-500/40 hover:shadow-brand-500/60 transition"
          aria-label={
            language === "ar"
              ? "افتح المحادثة المباشرة"
              : language === "tr"
              ? "Canlı sohbeti aç"
              : "Open live chat"
          }
        >
          {/* Online indicator */}
          <span className="absolute -top-1 -end-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900" />
          </span>
          <MessageSquare className="w-6 h-6" />
        </motion.button>
      )}

      {/* ── Chat Window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="w-[90vw] sm:w-[380px] h-[520px] max-h-[85vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-brand-600 to-brand-500 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">
                    {t("chatTitle")}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-brand-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                    <span>{t("chatOnline")}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 transition"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Telegram quick-action ribbon */}
            <div className="px-4 py-2 bg-brand-50 dark:bg-brand-950/40 border-b border-brand-100 dark:border-brand-900/50 flex items-center justify-between text-xs shrink-0">
              <span className="text-brand-700 dark:text-brand-300 font-medium">
                ⚡{" "}
                {language === "ar"
                  ? "متاح أيضاً عبر تيليجرام"
                  : language === "tr"
                  ? "Telegram'dan da ulaşın"
                  : "Also available on Telegram"}
              </span>
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400 hover:underline font-semibold"
              >
                <span>@{telegramBotUsername}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Message Thread */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 dark:bg-slate-950/40">
              {messages.map((msg) => {
                const isBot = msg.sender === "bot";
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${isBot ? "justify-start" : "justify-end"}`}
                  >
                    {isBot && (
                      <div className="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[80%] rounded-2xl px-3.5 py-3 shadow-sm leading-relaxed text-xs sm:text-sm ${
                        isBot
                          ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-700 rounded-tl-none"
                          : "bg-brand-600 text-white rounded-tr-none"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <div
                        className={`text-[10px] mt-1.5 flex items-center gap-1 ${
                          isBot
                            ? "text-slate-400"
                            : "text-brand-200 justify-end"
                        }`}
                      >
                        <span>{msg.timestamp}</span>
                        {!isBot && <CheckCheck className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex gap-2.5 items-center">
                  <div className="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-500 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 py-2.5 px-3.5 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <form
              onSubmit={handleSend}
              className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("chatPlaceholder")}
                className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="p-2.5 rounded-xl bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                aria-label={
                  language === "ar"
                    ? "إرسال"
                    : language === "tr"
                    ? "Gönder"
                    : "Send"
                }
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
