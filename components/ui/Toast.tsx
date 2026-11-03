"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const ICONS: Record<ToastType, React.ElementType> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const STYLES: Record<ToastType, string> = {
  success:
    "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-200",
  error:
    "bg-red-50 dark:bg-red-950/80 border-red-300 dark:border-red-700/60 text-red-800 dark:text-red-200",
  warning:
    "bg-amber-50 dark:bg-amber-950/80 border-amber-300 dark:border-amber-700/60 text-amber-800 dark:text-amber-200",
  info: "bg-brand-50 dark:bg-brand-950/80 border-brand-300 dark:border-brand-700/60 text-brand-800 dark:text-brand-200",
};

const ICON_STYLES: Record<ToastType, string> = {
  success: "text-emerald-500",
  error: "text-red-500",
  warning: "text-amber-500",
  info: "text-brand-500",
};

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const Icon = ICONS[toast.type];

  useEffect(() => {
    const timer = setTimeout(
      () => onDismiss(toast.id),
      toast.duration ?? 4500
    );
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className={`flex items-start gap-3 w-full max-w-sm px-4 py-3.5 rounded-2xl border shadow-xl backdrop-blur-xl text-sm ${STYLES[toast.type]}`}
      role="alert"
      aria-live="polite"
    >
      <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${ICON_STYLES[toast.type]}`} />
      <p className="flex-1 font-medium leading-snug">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 p-0.5 rounded-full opacity-60 hover:opacity-100 transition"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}

// ── Global Toast Store (lightweight singleton) ─────────────────────────────

type ToastListener = (toasts: Toast[]) => void;

const listeners = new Set<ToastListener>();
let toastQueue: Toast[] = [];

function emit(toasts: Toast[]) {
  toastQueue = toasts;
  listeners.forEach((l) => l(toasts));
}

export const toast = {
  /** Show a success toast */
  success: (message: string, duration?: number) =>
    addToast("success", message, duration),
  /** Show an error toast */
  error: (message: string, duration?: number) =>
    addToast("error", message, duration),
  /** Show a warning toast */
  warning: (message: string, duration?: number) =>
    addToast("warning", message, duration),
  /** Show an info toast */
  info: (message: string, duration?: number) =>
    addToast("info", message, duration),
  /** Dismiss all toasts */
  dismiss: () => emit([]),
};

function addToast(type: ToastType, message: string, duration?: number) {
  const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  emit([...toastQueue, { id, type, message, duration }]);
}

// ── ToastContainer — place once in layout ─────────────────────────────────

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    // Subscribe to global toast events
    const listener: ToastListener = (t) => setToasts([...t]);
    listeners.add(listener);
    // Sync any queued toasts that fired before mount
    setToasts([...toastQueue]);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const dismiss = useCallback((id: string) => {
    emit(toastQueue.filter((t) => t.id !== id));
  }, []);

  return (
    <div
      aria-label="Notifications"
      className="fixed bottom-6 start-6 z-[60] flex flex-col gap-2.5 pointer-events-none"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onDismiss={dismiss} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
