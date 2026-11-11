"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Sparkles, Send, User, MessageSquareHeart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "@/components/ui/Toast";
import { supabase } from "@/lib/supabase/client";
import { useNotifications } from "@/context/NotificationContext";

export interface ReviewItem {
  id: string;
  customer_name: string;
  rating: number;
  review_text: string;
  ai_reply?: string;
  status?: "positive" | "negative";
  created_at?: string;
  service_name?: string;
}

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle: string;
  onReviewSubmitted?: (newReview: ReviewItem) => void;
}

export default function AddReviewModal({
  isOpen,
  onClose,
  serviceTitle,
  onReviewSubmitted,
}: AddReviewModalProps) {
  const { language, direction } = useLanguage();
  const { submitReviewAsync } = useNotifications();

  const [customerName, setCustomerName] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState("");

  // Attempt to autofill customer name if logged in
  useEffect(() => {
    if (!isOpen || !supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        const name =
          data.user.user_metadata?.full_name ||
          data.user.user_metadata?.name ||
          data.user.email?.split("@")[0] ||
          "";
        if (name && !customerName) {
          setCustomerName(name);
        }
      }
    });
  }, [isOpen]);

  const ratingLabels: Record<number, { ar: string; en: string; tr: string }> = {
    1: { ar: "ضعيف جداً", en: "Very Poor", tr: "Çok Kötü" },
    2: { ar: "بحاجة لتحسين", en: "Needs Improvement", tr: "Geliştirilmeli" },
    3: { ar: "مقبول", en: "Average", tr: "Orta" },
    4: { ar: "جيد جداً", en: "Very Good", tr: "Çok İyi" },
    5: { ar: "ممتاز ومثالي ⭐", en: "Excellent & Perfect ⭐", tr: "Mükemmel ⭐" },
  };

  const currentLabel =
    ratingLabels[hoverRating || rating]?.[language as "ar" | "en" | "tr"] ||
    ratingLabels[rating]?.ar;

  /**
   * Non-blocking Submit Handler:
   * 1. Instantly shows: "تم إرسال تقييمك، سيأتيك الرد قريباً"
   * 2. Closes the modal immediately so user can continue browsing.
   * 3. Dispatches async API call to generate AI reply in the background.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const name = customerName.trim();
    const text = reviewText.trim();

    if (!name) {
      toast.error(
        language === "ar"
          ? "يرجى إدخال اسمك أولاً"
          : "Please enter your name"
      );
      return;
    }
    if (!text) {
      toast.error(
        language === "ar"
          ? "يرجى كتابة نص التقييم أو الملاحظة"
          : "Please write your review text"
      );
      return;
    }

    const payload = {
      customer_name: name,
      rating,
      review_text: text,
      service_title: serviceTitle,
    };

    // 1. Instantly show a success toast or brief message (Requirement 1)
    toast.success(
      language === "ar"
        ? "تم إرسال تقييمك، سيأتيك الرد قريباً"
        : language === "tr"
        ? "Değerlendirmeniz gönderildi, yanıt yakında gelecektir"
        : "Review submitted, a reply will arrive soon"
    );

    // 2. IMMEDIATELY close the review modal (Requirement 1)
    setReviewText("");
    setRating(5);
    onClose();

    // 3. Send the review data asynchronously in the background (Requirement 2)
    submitReviewAsync(payload);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25 }}
            dir={direction}
            className="relative w-full max-w-lg rounded-3xl bg-[#0f1b13] dark:bg-[#0c160f] border border-[#d4af37]/40 shadow-2xl overflow-hidden z-10"
          >
            {/* Ambient Gold Glows */}
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#d4af37]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="relative p-5 sm:p-6 border-b border-[#d4af37]/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#b8930a] flex items-center justify-center text-[#0f1b13] shadow-md shadow-[#d4af37]/20">
                  <MessageSquareHeart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    {language === "ar" ? "أضف تقييماً للخدمة" : language === "tr" ? "Hizmeti Değerlendir" : "Add Service Review"}
                    <span className="text-[10px] uppercase tracking-wider font-mono font-bold px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30">
                      AI Powered
                    </span>
                  </h3>
                  <p className="text-xs text-[#d4af37]/80 truncate max-w-[260px] sm:max-w-xs mt-0.5">
                    {serviceTitle}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
              {/* Star Rating Picker */}
              <div className="text-center py-2 bg-[#142319] rounded-2xl border border-[#d4af37]/20 p-3">
                <p className="text-xs font-semibold text-slate-300 mb-2">
                  {language === "ar" ? "اختر تقييمك بالنجوم:" : "Select your star rating:"}
                </p>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = (hoverRating || rating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="p-1 text-2xl sm:text-3xl transition-transform hover:scale-125 focus:outline-none"
                      >
                        <Star
                          className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                            active
                              ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                              : "text-slate-600 fill-transparent hover:text-slate-400"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs font-bold text-[#d4af37] mt-1.5 transition-all">
                  {currentLabel}
                </p>
              </div>

              {/* Customer Name */}
              <div>
                <label className="block text-xs font-semibold text-[#d4af37] mb-1.5">
                  {language === "ar" ? "اسمك الكامل أو اللقب *" : "Your Name *"}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#d4af37]/60 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={
                      language === "ar"
                        ? "مثال: م. أحمد السالم"
                        : "e.g. Ahmad Al-Salem"
                    }
                    className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-[#d4af37]/30 bg-[#142319] text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition"
                  />
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-xs font-semibold text-[#d4af37] mb-1.5">
                  {language === "ar" ? "تفاصيل المراجعة أو التجربة *" : "Your Review *" }
                </label>
                <textarea
                  required
                  rows={3}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder={
                    language === "ar"
                      ? "شاركنا رأيك في سرعة التوصيل، جودة المواد، أو تعامل الفريق..."
                      : "Share your experience about delivery, quality, or support..."
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-[#d4af37]/30 bg-[#142319] text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#d4af37] resize-none transition"
                />
              </div>

              {/* Non-blocking instant UX Hint */}
              <div className="px-3 py-2 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center gap-2 text-xs text-[#ffd700]">
                <Sparkles className="w-4 h-4 text-[#ffd700] shrink-0" />
                <span>
                  {language === "ar"
                    ? "إرسال فوري وغير معطل: سيتم إغلاق النافذة فوراً، وسيصلك إشعار الرد الذكي عبر الجرس 🔔"
                    : "Instant submission: you will receive the AI reply in the notification bell 🔔"}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-[#0f1b13] bg-gradient-to-r from-[#ffd700] via-[#d4af37] to-[#b8930a] hover:from-[#ffe57a] hover:to-[#d4af37] shadow-lg shadow-[#d4af37]/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <Send className="w-4 h-4 rtl:rotate-180" />
                  <span>{language === "ar" ? "إرسال التقييم" : "Submit Review"}</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-5 rounded-xl font-semibold text-sm text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition"
                >
                  {language === "ar" ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
