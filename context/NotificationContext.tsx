"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { toast } from "@/components/ui/Toast";

export interface ReviewNotification {
  id: string;
  type: "review_reply";
  title: string;
  serviceName: string;
  customerName: string;
  rating: number;
  reviewText: string;
  aiReply: string;
  createdAt: string;
  read: boolean;
}

interface SubmitReviewPayload {
  customer_name: string;
  rating: number;
  review_text: string;
  service_title: string;
}

interface NotificationContextType {
  notifications: ReviewNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  submitReviewAsync: (payload: SubmitReviewPayload) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

const STORAGE_KEY = "sanad_review_notifications_v1";

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<ReviewNotification[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load notifications from localStorage on client mount
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setNotifications(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to read notifications from localStorage:", e);
    }
  }, []);

  // Sync to localStorage
  const saveToStorage = (items: ReviewNotification[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Failed to save notifications to localStorage:", e);
    }
  };

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, read: true } : item
      );
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((item) => ({ ...item, read: true }));
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const clearNotification = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  /**
   * Non-blocking background submission:
   * 1. Closes the modal immediately (caller does this).
   * 2. Shows instant toast (caller does this).
   * 3. Sends POST request in background.
   * 4. When response arrives with AI reply:
   *    - Creates new unread notification.
   *    - Rings the notification bell (increments unread counter).
   *    - Fires toast and custom window event.
   */
  const submitReviewAsync = useCallback((payload: SubmitReviewPayload) => {
    // Fire and forget in the background
    (async () => {
      try {
        const response = await fetch("/api/review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const resJson = await response.json();

        if (resJson.success && resJson.data) {
          const aiReply =
            resJson.data.ai_reply ||
            "شكراً جزيلاً لتقييمك الكريم ودعمك المستمر! نسعى دائماً لتقديم أقصى درجات الرعاية والجودة لعائلتك الكريمة.";

          const newNotification: ReviewNotification = {
            id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            type: "review_reply",
            title: "يوجد رد جديد على تقييمك للخدمة",
            serviceName: payload.service_title || "خدمة سَنَد",
            customerName: payload.customer_name,
            rating: payload.rating,
            reviewText: payload.review_text,
            aiReply: aiReply,
            createdAt: new Date().toISOString(),
            read: false,
          };

          setNotifications((prev) => {
            const updated = [newNotification, ...prev];
            saveToStorage(updated);
            return updated;
          });

          // Dispatch event so any open service detail view can update its list immediately
          if (typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent("sanad-new-review-reply", {
                detail: resJson.data,
              })
            );
          }

          // Trigger a celebratory toast notifying the user that the AI responded
          toast.success(
            "🔔 رد سَنَد الذكي: وصلك رد جديد على تقييمك! انقر على الجرس للاطلاع عليه."
          );
        } else {
          console.warn("Background review submission notice:", resJson);
        }
      } catch (err) {
        console.error("Background review submission error:", err);
      }
    })();
  }, []);

  const unreadCount = mounted
    ? notifications.filter((item) => !item.read).length
    : 0;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearNotification,
        submitReviewAsync,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}
