"use client";

import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { SERVICE_CATALOG, ServiceCategory, ServiceItem } from "@/components/modals/ServiceDetailsModal";

export interface NewServiceInput {
  titleEn: string;
  titleAr: string;
  price: number;
  category: ServiceCategory;
  imageUrl?: string;
}

interface CatalogContextValue {
  services: ServiceItem[];
  addService: (input: NewServiceInput) => void;
  updatePrice: (id: string, price: number) => void;
  removeService: (id: string) => void;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<ServiceItem[]>(() => Object.values(SERVICE_CATALOG));

  const addService = useCallback((input: NewServiceInput) => {
    const samples = Object.values(SERVICE_CATALOG);
    const sample = samples.find((item) => item.category === input.category) ?? samples[0];
    const service: ServiceItem = {
      id: `custom-${Date.now()}`,
      titleEn: input.titleEn,
      titleAr: input.titleAr,
      titleTr: input.titleEn,
      descEn: input.titleEn,
      descAr: input.titleAr,
      descTr: input.titleEn,
      price: input.price,
      imageUrl: input.imageUrl ?? sample.imageUrl,
      accentClass: "bg-brand-500",
      category: input.category,
    };
    setServices((current) => [service, ...current]);
  }, []);

  const updatePrice = useCallback((id: string, price: number) => {
    setServices((current) => current.map((service) => (service.id === id ? { ...service, price } : service)));
  }, []);

  const removeService = useCallback((id: string) => {
    setServices((current) => current.filter((service) => service.id !== id));
  }, []);

  const value = useMemo(
    () => ({ services, addService, updatePrice, removeService }),
    [services, addService, updatePrice, removeService]
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) throw new Error("useCatalog must be used inside CatalogProvider");
  return context;
}