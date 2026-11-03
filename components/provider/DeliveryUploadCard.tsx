"use client";

/**
 * DeliveryUploadCard
 * ─────────────────────────────────────────────────────────────────────────────
 * Provider-facing component for uploading a "Proof of Delivery" photo
 * and marking an order as delivered.
 *
 * Features:
 *  • Large drag-drop / tap-to-open file upload zone
 *  • Image preview with remove button
 *  • Optional delivery note textarea
 *  • "Mark as Delivered" CTA — disabled until photo is selected
 *  • Loading state with spinner, then success animation + toast
 *  • Mobile-first large touch targets
 *  • RTL-safe logical CSS properties
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  UploadCloud,
  X,
  CheckCircle2,
  Package,
  Loader2,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "@/components/ui/Toast";

/* ─── Props ──────────────────────────────────────────────────────────────── */

interface DeliveryUploadCardProps {
  orderId: string;
  orderSummary: string;
  /** Called with the File when the provider marks as delivered */
  onDelivered?: (photo: File, note: string) => Promise<void>;
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function DeliveryUploadCard({
  orderId,
  orderSummary,
  onDelivered,
}: DeliveryUploadCardProps) {
  const { language } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  /* ── Translations ─────────────────────────────────────────────────────── */
  const T = {
    title:
      language === "ar"
        ? "رفع إثبات التسليم"
        : language === "tr"
        ? "Teslimat Kanıtı Yükle"
        : "Upload Proof of Delivery",
    orderId:
      language === "ar"
        ? "رقم الطلب"
        : language === "tr"
        ? "Sipariş No"
        : "Order ID",
    dropZone:
      language === "ar"
        ? "اضغط أو اسحب الصورة هنا"
        : language === "tr"
        ? "Fotoğraf için tıklayın veya sürükleyin"
        : "Tap or drag photo here",
    dropZoneSub:
      language === "ar"
        ? "JPG, PNG أو WEBP — حتى 10 ميجابايت"
        : language === "tr"
        ? "JPG, PNG veya WEBP — Maks. 10 MB"
        : "JPG, PNG or WEBP — up to 10 MB",
    notePlaceholder:
      language === "ar"
        ? "ملاحظة التسليم (اختيارية) — مثلاً: تم التسليم أمام الباب."
        : language === "tr"
        ? "Teslimat notu (isteğe bağlı) — Örn: Kapı önüne bırakıldı."
        : "Delivery note (optional) — e.g. Left at the front door.",
    markDelivered:
      language === "ar"
        ? "تأكيد التسليم ✓"
        : language === "tr"
        ? "Teslim Edildi Olarak İşaretle ✓"
        : "Mark as Delivered ✓",
    successMsg:
      language === "ar"
        ? "تم تأكيد التسليم بنجاح! 🎉"
        : language === "tr"
        ? "Teslimat başarıyla onaylandı! 🎉"
        : "Delivery confirmed successfully! 🎉",
    changePhoto:
      language === "ar"
        ? "تغيير الصورة"
        : language === "tr"
        ? "Fotoğrafı Değiştir"
        : "Change Photo",
  };

  /* ── File handling ─────────────────────────────────────────────────────── */

  const acceptFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error(
        language === "ar"
          ? "يُرجى اختيار ملف صورة فقط."
          : language === "tr"
          ? "Lütfen yalnızca bir resim dosyası seçin."
          : "Please select an image file."
      );
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error(
        language === "ar"
          ? "حجم الملف يتجاوز 10 ميجابايت."
          : language === "tr"
          ? "Dosya boyutu 10 MB'ı aşıyor."
          : "File size exceeds 10 MB."
      );
      return;
    }
    setPhoto(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) acceptFile(file);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) acceptFile(file);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const removePhoto = () => {
    setPhoto(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ── Submit ────────────────────────────────────────────────────────────── */

  const handleSubmit = async () => {
    if (!photo) return;
    setLoading(true);
    try {
      if (onDelivered) {
        await onDelivered(photo, note);
      } else {
        // Demo: simulate a 2-second API call
        await new Promise((r) => setTimeout(r, 2000));
      }
      setSuccess(true);
      toast.success(T.successMsg);
    } catch {
      toast.error(
        language === "ar"
          ? "حدث خطأ. يُرجى المحاولة مرة أخرى."
          : language === "tr"
          ? "Bir hata oluştu. Lütfen tekrar deneyin."
          : "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ── Success state ─────────────────────────────────────────────────────── */

  if (success) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md mx-auto rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-emerald-200 dark:border-emerald-800/40 shadow-xl flex flex-col items-center gap-4 px-8 py-12 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ delay: 0.1, type: "spring" }}
          className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center"
        >
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </motion.div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">{T.successMsg}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {language === "ar"
            ? `تم تحديث حالة الطلب #${orderId} إلى "مُسلَّم".`
            : language === "tr"
            ? `#${orderId} numaralı sipariş "Teslim Edildi" olarak güncellendi.`
            : `Order #${orderId} has been updated to "Delivered".`}
        </p>
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Delivery proof"
            className="w-full h-40 object-cover rounded-2xl border border-emerald-200 dark:border-emerald-800/40"
          />
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60"
    >
      {/* ── Card header ────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-700 dark:to-slate-600 px-6 py-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
          <Package className="w-4 h-4 text-white/80" />
        </div>
        <div>
          <p className="text-white font-bold text-sm">{T.title}</p>
          <p className="text-slate-300 text-xs font-mono">
            {T.orderId}: {orderId}
          </p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Order summary chip */}
        <div className="rounded-xl bg-slate-100 dark:bg-slate-800/60 px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
          <span className="font-semibold">
            {language === "ar"
              ? "الطلب: "
              : language === "tr"
              ? "Sipariş: "
              : "Order: "}
          </span>
          {orderSummary}
        </div>

        {/* ── Upload zone ──────────────────────────────────────────────── */}
        {!previewUrl ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 py-12 px-6 ${
              isDragging
                ? "border-brand-400 bg-brand-50 dark:bg-brand-900/20 scale-[1.02]"
                : "border-slate-300 dark:border-slate-600 bg-slate-50/60 dark:bg-slate-800/30 hover:border-brand-400 hover:bg-brand-50/30 dark:hover:bg-brand-900/10"
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
              <Camera className="w-7 h-7 text-brand-500" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-slate-700 dark:text-slate-200 text-sm">
                {T.dropZone}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                {T.dropZoneSub}
              </p>
            </div>
            <UploadCloud className="w-5 h-5 text-slate-400 animate-bounce" />
          </div>
        ) : (
          /* ── Photo preview ─────────────────────────────────────────── */
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-52 object-cover"
            />
            {/* Remove / change overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                onClick={removePhoto}
                className="flex items-center gap-1.5 text-white text-xs font-semibold bg-red-500/80 hover:bg-red-500 rounded-full px-4 py-2 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                {language === "ar" ? "حذف" : language === "tr" ? "Kaldır" : "Remove"}
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 text-white text-xs font-semibold bg-black/60 hover:bg-black/80 rounded-full px-4 py-2 transition-colors"
              >
                <Camera className="w-3.5 h-3.5" />
                {T.changePhoto}
              </button>
            </div>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* ── Delivery note ─────────────────────────────────────────── */}
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={T.notePlaceholder}
          rows={3}
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 px-4 py-3 text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none transition-colors"
        />

        {/* ── CTA button ───────────────────────────────────────────── */}
        <button
          onClick={handleSubmit}
          disabled={!photo || loading}
          className="w-full py-4 rounded-2xl font-bold text-sm text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed
            bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-[0.98]"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {language === "ar"
                ? "جارٍ الإرسال..."
                : language === "tr"
                ? "Gönderiliyor..."
                : "Uploading…"}
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              {T.markDelivered}
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
