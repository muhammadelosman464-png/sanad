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

export interface AppNotification {
  id: string;
  message: string;
  aiReply?: string;
  serviceName?: string;
  customerName?: string;
  rating?: number;
  reviewText?: string;
  isRead: boolean;
  read?: boolean;
  timestamp: string;
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (
    item: string | Partial<AppNotification>
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

const STORAGE_KEY = "sanad_review_notifications_v2";

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load notifications from localStorage on client mount
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Normalize isRead / read
          setNotifications(
            parsed.map((n) => ({
              ...n,
              isRead: n.isRead ?? n.read ?? false,
              read: n.isRead ?? n.read ?? false,
            }))
          );
        }
      }
    } catch (e) {
      console.warn("Failed to read notifications from localStorage:", e);
    }
  }, []);

  const saveToStorage = (items: AppNotification[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Failed to save notifications to localStorage:", e);
    }
  };

  /**
   * Adds a new notification to the global state.
   * Can accept either a simple string or a detailed AppNotification object.
   */
  const addNotification = useCallback(
    (item: string | Partial<AppNotification>) => {
      const notifId =
        typeof item === "object" && item.id
          ? item.id
          : `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

      const messageText =
        typeof item === "string" ? item : item.message || item.aiReply || "إشعار جديد";

      const aiReply =
        typeof item === "object" ? item.aiReply || item.message || "" : item;

      const newNotif: AppNotification = {
        id: notifId,
        message: messageText,
        aiReply: aiReply,
        serviceName: (typeof item === "object" ? item.serviceName : "") || "خدمة سَنَد",
        customerName: typeof item === "object" ? item.customerName : undefined,
        rating: typeof item === "object" ? item.rating : 5,
        reviewText: typeof item === "object" ? item.reviewText : undefined,
        isRead: false,
        read: false,
        timestamp:
          (typeof item === "object" ? item.timestamp : "") || new Date().toISOString(),
      };

      setNotifications((prev) => {
        const updated = [newNotif, ...prev];
        saveToStorage(updated);
        return updated;
      });

      // Show toast alert
      toast.success(
        "🔔 رد سَنَد الذكي: وصلك رد جديد على تقييمك! تفقد جرس الإشعارات بأعلى الصفحة."
      );

      // Dispatch window event so any open modal updates immediately
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("sanad-new-review-reply", {
            detail: {
              id: notifId,
              customer_name: newNotif.customerName,
              rating: newNotif.rating,
              review_text: newNotif.reviewText,
              ai_reply: newNotif.aiReply,
              service_name: newNotif.serviceName,
              created_at: newNotif.timestamp,
            },
          })
        );
      }
    },
    []
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, isRead: true, read: true } : item
      );
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((item) => ({ ...item, isRead: true, read: true }));
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

  const unreadCount = mounted
    ? notifications.filter((item) => !item.isRead && !item.read).length
    : 0;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
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
