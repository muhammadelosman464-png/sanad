"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { ServiceItem } from "@/components/modals/ServiceDetailsModal";

export interface CartItem {
  service: ServiceItem;
  quantity: number;
  amount: number;
}

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  isOpen: boolean;
  addItem: (service: ServiceItem, amount?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = (service: ServiceItem, amount = service.price) => {
    if (service.price === 0) return;
    setItems((current) => {
      const existing = current.find((item) => item.service.id === service.id);
      if (existing) {
        return current.map((item) =>
          item.service.id === service.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...current, { service, quantity: 1, amount }];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((current) => current.filter((item) => item.service.id !== id));
      return;
    }
    setItems((current) => current.map((item) => item.service.id === id ? { ...item, quantity } : item));
  };

  const removeItem = (id: string) => setItems((current) => current.filter((item) => item.service.id !== id));

  const value = useMemo(() => ({
    items,
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    totalAmount: items.reduce((sum, item) => sum + item.amount * item.quantity, 0),
    isOpen,
    addItem,
    updateQuantity,
    removeItem,
    clearCart: () => setItems([]),
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
  }), [items, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
