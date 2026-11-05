"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { SERVICE_CATALOG, ServiceCategory, ServiceItem } from "@/components/modals/ServiceDetailsModal";
import { supabase } from "@/lib/supabase/client";

export interface NewServiceInput {
  titleEn: string;
  titleAr: string;
  price: number;
  category: ServiceCategory;
  imageUrl?: string;
}

interface CatalogContextValue {
  services: ServiceItem[];
  loading: boolean;
  addService: (input: NewServiceInput) => Promise<ServiceItem | null>;
  updatePrice: (id: string, price: number) => Promise<void>;
  updateServiceImage: (id: string, imageUrl: string) => Promise<void>;
  removeService: (id: string) => Promise<void>;
  refreshCatalog: () => Promise<void>;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<ServiceItem[]>(() => Object.values(SERVICE_CATALOG));
  const [loading, setLoading] = useState(true);

  // Fetch live products from Supabase `services` table
  const fetchServices = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("[Sanad] Fetching services from Supabase failed, using default catalog:", error.message);
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        const mapped: ServiceItem[] = data.map((d: any) => ({
          id: String(d.id),
          titleEn: d.title_en || d.titleEn || "Service",
          titleAr: d.title_ar || d.titleAr || d.title_en || "\u062e\u062f\u0645\u0629",
          titleTr: d.title_tr || d.titleTr || d.title_en || "Hizmet",
          descEn: d.desc_en || d.descEn || d.title_en || "",
          descAr: d.desc_ar || d.descAr || d.title_ar || "",
          descTr: d.desc_tr || d.descTr || d.title_tr || "",
          price: Number(d.price) || 0,
          imageUrl:
            d.image_url ||
            d.imageUrl ||
            "https://images.pexels.com/photos/6994944/pexels-photo-6994944.jpeg?auto=compress&cs=tinysrgb&w=900",
          accentClass: d.accent_class || "bg-brand-500",
          category: (d.category as ServiceCategory) || "support",
        }));
        setServices(mapped);
      }
    } catch (err) {
      console.warn("[Sanad] Error fetching dynamic services:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const addService = useCallback(
    async (input: NewServiceInput): Promise<ServiceItem | null> => {
      const defaultImageUrl =
        "https://images.pexels.com/photos/6994944/pexels-photo-6994944.jpeg?auto=compress&cs=tinysrgb&w=900";
      const finalImageUrl =
        input.imageUrl && input.imageUrl.trim().length > 0 ? input.imageUrl : defaultImageUrl;

      let createdId = `service-${Date.now()}`;

      // Insert into Supabase table
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from("services")
            .insert([
              {
                title_en: input.titleEn,
                title_ar: input.titleAr,
                price: input.price,
                category: input.category,
                image_url: finalImageUrl,
              },
            ])
            .select()
            .single();

          if (!error && data) {
            createdId = String(data.id);
          }
        } catch (err) {
          console.warn("[Sanad] addService DB insert failed:", err);
        }
      }

      const service: ServiceItem = {
        id: createdId,
        titleEn: input.titleEn,
        titleAr: input.titleAr,
        titleTr: input.titleEn,
        descEn: input.titleEn,
        descAr: input.titleAr,
        descTr: input.titleEn,
        price: input.price,
        imageUrl: finalImageUrl,
        accentClass: "bg-brand-500",
        category: input.category,
      };

      setServices((current) => [service, ...current]);
      return service;
    },
    []
  );

  const updatePrice = useCallback(async (id: string, price: number) => {
    setServices((current) =>
      current.map((service) => (service.id === id ? { ...service, price } : service))
    );
    if (supabase) {
      try {
        await supabase.from("services").update({ price }).eq("id", id);
      } catch (err) {
        console.warn("[Sanad] updatePrice DB update failed:", err);
      }
    }
  }, []);

  const updateServiceImage = useCallback(async (id: string, imageUrl: string) => {
    setServices((current) =>
      current.map((service) => (service.id === id ? { ...service, imageUrl } : service))
    );
    if (supabase) {
      try {
        await supabase.from("services").update({ image_url: imageUrl }).eq("id", id);
      } catch (err) {
        console.warn("[Sanad] updateServiceImage DB update failed:", err);
      }
    }
  }, []);

  const removeService = useCallback(async (id: string) => {
    setServices((current) => current.filter((service) => service.id !== id));
    if (supabase) {
      try {
        await supabase.from("services").delete().eq("id", id);
      } catch (err) {
        console.warn("[Sanad] removeService DB delete failed:", err);
      }
    }
  }, []);

  const value = useMemo(
    () => ({
      services,
      loading,
      addService,
      updatePrice,
      updateServiceImage,
      removeService,
      refreshCatalog: fetchServices,
    }),
    [services, loading, addService, updatePrice, updateServiceImage, removeService, fetchServices]
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) throw new Error("useCatalog must be used inside CatalogProvider");
  return context;
}