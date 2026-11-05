"use client";

import { FormEvent, useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  PackagePlus,
  Trash2,
  X,
  Upload,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCatalog } from "@/context/CatalogContext";
import { toast } from "@/components/ui/Toast";
import NumberInput from "@/components/ui/NumberInput";
import type { ServiceCategory } from "@/components/modals/ServiceDetailsModal";
import { supabase } from "@/lib/supabase/client";

export interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: ServiceCategory[] = ["food", "health", "energy", "gifts", "support"];

export default function AdminDashboardModal({ isOpen, onClose }: AdminDashboardProps) {
  const { language } = useLanguage();
  const { services, addService, updatePrice, removeService } = useCatalog();

  const [titleEn, setTitleEn] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [newPrice, setNewPrice] = useState(50);
  const [newCategory, setNewCategory] = useState<ServiceCategory>("support");

  // Image Upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<"services" | "requests">("services");
  const [helpRequests, setHelpRequests] = useState<
    Array<{
      id: string;
      user_name?: string;
      user_phone?: string;
      user_email?: string;
      message: string;
      amount_usd: number;
      created_at?: string;
      status: "pending" | "accepted" | "deleted";
    }>
  >([]);

  // Fetch help requests from Supabase
  useEffect(() => {
    if (!isOpen || !supabase) return;
    supabase
      .from("help_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (data) {
          setHelpRequests(data.map((r) => ({ ...r, status: r.status ?? "pending" })));
        }
      });
  }, [isOpen]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error(language === "ar" ? "\u064a\u0631\u062c\u0649 \u0627\u062e\u062a\u064a\u0627\u0631 \u0645\u0644\u0641 \u0635\u0648\u0631\u0629 \u0635\u0627\u0644\u062d" : "Please select a valid image file");
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview((event.target?.result as string) || "");
    };
    reader.readAsDataURL(file);
  };

  const acceptRequest = (req: typeof helpRequests[0]) => {
    // Dismiss instantly from UI
    setHelpRequests((prev) => prev.filter((r) => r.id !== req.id));

    // Update in Supabase
    if (supabase) {
      supabase.from("help_requests").update({ status: "accepted" }).eq("id", req.id).then();
    }

    // Open WhatsApp directly with phone number
    if (req.user_phone) {
      const cleanPhone = req.user_phone.replace(/\D/g, "");
      const msg = encodeURIComponent(
        `\u0645\u0631\u062d\u0628\u0627\u064b ${req.user_name || ""}\u060c \u062a\u0645 \u0642\u0628\u0648\u0644 \u0637\u0644\u0628\u0643 \u0628\u0642\u064a\u0645\u0629 $${req.amount_usd}. \u0633\u0646\u062a\u0648\u0627\u0635\u0644 \u0645\u0639\u0643 \u0627\u0644\u0622\u0646.`
      );
      window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
    }
  };

  const deleteRequest = (id: string) => {
    setHelpRequests((prev) => prev.filter((r) => r.id !== id));
    if (supabase) {
      supabase.from("help_requests").update({ status: "deleted" }).eq("id", id).then();
    }
  };

  const copy =
    language === "ar"
      ? {
          title: "\u0644\u0648\u062d\u0629 \u062a\u062d\u0643\u0645 \u0627\u0644\u0625\u062f\u0627\u0631\u0629",
          subtitle: "\u0625\u062f\u0627\u0631\u0629 \u0627\u0644\u062e\u062f\u0645\u0627\u062a \u0648\u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u0648\u0637\u0644\u0628\u0627\u062a \u0627\u0644\u0645\u0633\u0627\u0639\u062f\u0629",
          close: "\u0625\u063a\u0644\u0627\u0642",
          priceList: "\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u062e\u062f\u0645\u0627\u062a \u0627\u0644\u062d\u0627\u0644\u064a\u0629",
          priceLabel: "\u0627\u0644\u0633\u0639\u0631 (USD)",
          addTitle: "\u0625\u0636\u0627\u0641\u0629 \u0645\u0646\u062a\u062c / \u062e\u062f\u0645\u0629 \u062c\u062f\u064a\u062f\u0629",
          nameAr: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0646\u062a\u062c (\u0628\u0627\u0644\u0639\u0631\u0628\u064a\u0629)",
          nameEn: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0646\u062a\u062c (\u0628\u0627\u0644\u0625\u0646\u062c\u0644\u064a\u0632\u064a\u0629)",
          category: "\u0627\u0644\u062a\u0635\u0646\u064a\u0641",
          imageLabel: "\u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0646\u062a\u062c (\u0631\u0641\u0639 \u0645\u0628\u0627\u0634\u0631)",
          imageHint: "\u0627\u0636\u063a\u0637 \u0644\u0627\u062e\u062a\u064a\u0627\u0631 \u0635\u0648\u0631\u0629 \u0623\u0648 \u0627\u0633\u062d\u0628\u0647\u0627 \u0647\u0646\u0627",
          add: "\u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0645\u0646\u062a\u062c",
          added: "\u062a\u0645\u062a \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0645\u0646\u062a\u062c \u0628\u0646\u062c\u0627\u062d",
          deleted: "\u062a\u0645 \u062d\u0630\u0641 \u0627\u0644\u062e\u062f\u0645\u0629",
          deleteLabel: "\u062d\u0630\u0641",
          empty: "\u0644\u0627 \u062a\u0648\u062c\u062f \u062e\u062f\u0645\u0627\u062a \u0645\u0636\u0627\u0641\u0629",
          servicesTab: "\u0627\u0644\u062e\u062f\u0645\u0627\u062a \u0648\u0627\u0644\u0623\u0633\u0639\u0627\u0631",
          requestsTab: "\u0637\u0644\u0628\u0627\u062a \u0627\u0644\u0645\u0633\u0627\u0639\u062f\u0629",
          noRequests: "\u0644\u0627 \u062a\u0648\u062c\u062f \u0637\u0644\u0628\u0627\u062a \u062d\u0627\u0644\u064a\u0627\u064b",
          acceptBtn: "\u0642\u0628\u0648\u0644 + \u0648\u0627\u062a\u0633\u0622\u0628",
          categories: {
            food: "\u063a\u0630\u0627\u0621",
            health: "\u0635\u062d\u0629",
            energy: "\u0637\u0627\u0642\u0629",
            gifts: "\u0647\u062f\u0627\u064a\u0627",
            support: "\u062f\u0639\u0645",
          },
        }
      : language === "tr"
      ? {
          title: "Yonetim Paneli",
          subtitle: "Hizmet, fiyat ve destek talepleri yonetimi",
          close: "Kapat",
          priceList: "Mevcut Hizmetler ve Fiyatlar",
          priceLabel: "Fiyat (USD)",
          addTitle: "Yeni Urun / Hizmet Ekle",
          nameAr: "Urun Adi (Arapca)",
          nameEn: "Urun Adi (Ingilizce)",
          category: "Kategori",
          imageLabel: "Urun Gorseli",
          imageHint: "Gorsel secmek icin tiklayin",
          add: "Urun Ekle",
          added: "Urun basariyla eklendi",
          deleted: "Hizmet silindi",
          deleteLabel: "Sil",
          empty: "Henuz hizmet bulunmuyor",
          servicesTab: "Hizmetler",
          requestsTab: "Yardim Talepleri",
          noRequests: "Henuz talep yok",
          acceptBtn: "Kabul + WhatsApp",
          categories: {
            food: "Gida",
            health: "Saglik",
            energy: "Enerji",
            gifts: "Hediyeler",
            support: "Destek",
          },
        }
      : {
          title: "Admin Dashboard",
          subtitle: "Manage products, dynamic pricing & assistance requests",
          close: "Close",
          priceList: "Current Services & Prices",
          priceLabel: "Price (USD)",
          addTitle: "Add New Product / Service",
          nameAr: "Product Name (Arabic)",
          nameEn: "Product Name (English)",
          category: "Category",
          imageLabel: "Product Image (Direct Upload)",
          imageHint: "Click or drag image here",
          add: "Add Product",
          added: "Product added successfully",
          deleted: "Service deleted",
          deleteLabel: "Delete",
          empty: "No services found",
          servicesTab: "Services & Pricing",
          requestsTab: "Help Requests",
          noRequests: "No active requests",
          acceptBtn: "Accept + WhatsApp",
          categories: {
            food: "Food",
            health: "Health",
            energy: "Energy",
            gifts: "Gifts",
            support: "Support",
          },
        };

  const handleAddProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!titleEn.trim() || !titleAr.trim()) return;

    setUploading(true);
    let uploadedImageUrl = "";

    try {
      // 1. Upload image to Supabase Storage bucket 'products'
      if (imageFile && supabase) {
        const fileExt = imageFile.name.split(".").pop() || "jpg";
        const cleanName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const filePath = `images/${cleanName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("products")
          .upload(filePath, imageFile, {
            cacheControl: "3600",
            upsert: true,
            contentType: imageFile.type,
          });

        if (uploadError) {
          console.error("Storage upload error:", uploadError);
          toast.error("Image upload failed: " + uploadError.message);
        } else if (uploadData) {
          const { data: urlData } = supabase.storage
            .from("products")
            .getPublicUrl(filePath);
          uploadedImageUrl = urlData?.publicUrl || "";
        }
      }

      // 2. Add service to catalog context and Supabase `services` table
      await addService({
        titleEn: titleEn.trim(),
        titleAr: titleAr.trim(),
        price: newPrice,
        category: newCategory,
        imageUrl: uploadedImageUrl || undefined,
      });

      toast.success(copy.added);
      setTitleEn("");
      setTitleAr("");
      setNewPrice(50);
      setImageFile(null);
      setImagePreview("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      toast.error(err?.message || "Failed to add product");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    await removeService(id);
    toast.success(copy.deleted);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="relative z-10 w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-[32px] bg-white dark:bg-[#1a2d20] border border-[#d4af37]/35 p-6 sm:p-8 shadow-2xl my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-white transition"
              aria-label={copy.close}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#b8930a] text-white flex items-center justify-center shadow-md">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[.15em] text-[#d4af37]">
                  Sanad Admin
                </p>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  {copy.title}
                </h2>
              </div>
            </div>

            {/* Tab navigation */}
            <div className="flex gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-black/30 border border-[#d4af37]/20 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab("services")}
                className={`flex-1 py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === "services"
                    ? "bg-[#d4af37] text-[#1d3023] shadow-md"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                }`}
              >
                {copy.servicesTab}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("requests")}
                className={`flex-1 py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === "requests"
                    ? "bg-[#d4af37] text-[#1d3023] shadow-md"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                }`}
              >
                <span>{copy.requestsTab}</span>
                {helpRequests.filter((r) => r.status === "pending").length > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-black rounded-full px-2 py-0.5">
                    {helpRequests.filter((r) => r.status === "pending").length}
                  </span>
                )}
              </button>
            </div>

            {/* TAB 1: Services & Dynamic Product Add */}
            {activeTab === "services" && (
              <>
                <section className="space-y-3 mb-6">
                  <h3 className="text-sm font-black text-slate-700 dark:text-slate-200">
                    {copy.priceList}
                  </h3>
                  {services.length === 0 ? (
                    <p className="text-sm text-slate-400 py-3">{copy.empty}</p>
                  ) : (
                    <ul className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                      {services.map((service) => (
                        <li
                          key={service.id}
                          className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 dark:border-[#d4af37]/20 bg-slate-50 dark:bg-black/25 p-3.5"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {service.imageUrl && (
                              <img
                                src={service.imageUrl}
                                alt={service.titleEn}
                                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-[#d4af37]/30 shadow-sm"
                              />
                            )}
                            <div className="min-w-0">
                              <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                                {language === "ar" ? service.titleAr : service.titleEn}
                              </p>
                              <p className="text-xs text-[#d4af37]">
                                {copy.categories[service.category] || service.category}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs font-bold text-slate-500">$</span>
                            <NumberInput
                              label={`${copy.priceLabel} ${service.titleEn}`}
                              min={1}
                              value={service.price}
                              onCommit={(v) => updatePrice(service.id, v)}
                              className="w-16 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-center font-bold text-sm text-slate-900 dark:text-white"
                            />
                            <button
                              type="button"
                              onClick={() => handleDeleteService(service.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                              aria-label={copy.deleteLabel}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                {/* ADD NEW PRODUCT FORM WITH IMAGE UPLOAD */}
                <form
                  onSubmit={handleAddProduct}
                  className="rounded-2xl border border-dashed border-[#d4af37]/40 bg-slate-50 dark:bg-black/30 p-5 space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <PackagePlus className="w-5 h-5 text-[#d4af37]" />
                    <h3 className="font-black text-sm text-slate-900 dark:text-white">
                      {copy.addTitle}
                    </h3>
                  </div>

                  {/* Names */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        {copy.nameEn}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Winter Clothes"
                        value={titleEn}
                        onChange={(e) => setTitleEn(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        {copy.nameAr}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="\u0645\u062b\u0644\u0627\u064b: \u0643\u0633\u0648\u0629 \u0627\u0644\u0634\u062a\u0627\u0621"
                        dir="rtl"
                        value={titleAr}
                        onChange={(e) => setTitleAr(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                      />
                    </div>
                  </div>

                  {/* Direct Image Upload Box */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      {copy.imageLabel}
                    </label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="relative w-full h-28 rounded-2xl border-2 border-dashed border-[#d4af37]/45 hover:border-[#d4af37] bg-white dark:bg-slate-800 cursor-pointer flex flex-col items-center justify-center overflow-hidden transition-all group"
                    >
                      {imagePreview ? (
                        <>
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold">
                            <Upload className="w-4 h-4 mr-1.5" />
                            \u062a\u063a\u064a\u064a\u0631 \u0627\u0644\u0635\u0648\u0631\u0629
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-3">
                          <ImageIcon className="w-7 h-7 text-[#d4af37] mx-auto mb-1 opacity-70 group-hover:scale-110 transition-transform" />
                          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                            {copy.imageHint}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBP (Max 5MB)</p>
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </div>

                  {/* Price and Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        {copy.priceLabel}
                      </label>
                      <NumberInput
                        label={copy.priceLabel}
                        min={1}
                        value={newPrice}
                        onCommit={setNewPrice}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        {copy.category}
                      </label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as ServiceCategory)}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {copy.categories[cat]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={uploading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8930a] text-white font-bold text-sm shadow-md hover:brightness-105 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>\u062c\u0627\u0631\u064d \u0631\u0641\u0639 \u0627\u0644\u0635\u0648\u0631\u0629 \u0648\u062d\u0641\u0638 \u0627\u0644\u0645\u0646\u062a\u062c...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{copy.add}</span>
                      </>
                    )}
                  </button>
                </form>
              </>
            )}

            {/* TAB 2: Help Requests & Instant WhatsApp Redirect */}
            {activeTab === "requests" && (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {helpRequests.filter((r) => r.status !== "deleted" && r.status !== "accepted")
                  .length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-10">{copy.noRequests}</p>
                ) : (
                  helpRequests
                    .filter((r) => r.status !== "deleted" && r.status !== "accepted")
                    .map((req) => (
                      <motion.div
                        key={req.id}
                        layout
                        exit={{ opacity: 0, x: 20 }}
                        className="rounded-2xl border border-[#d4af37]/25 bg-slate-50 dark:bg-black/30 p-4"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                              {req.user_name || "Anonymous"} &bull;{" "}
                              <span className="text-[#d4af37]">
                                {req.user_phone || "No phone"}
                              </span>
                            </p>
                            <p className="text-xs text-slate-400 truncate">{req.user_email}</p>
                            <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 bg-white dark:bg-black/40 p-2.5 rounded-xl border border-slate-200 dark:border-white/5">
                              {req.message}
                            </p>
                            <p className="text-xs font-black text-[#d4af37] mt-2">
                              ${req.amount_usd}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3.5 flex gap-2">
                          <button
                            type="button"
                            onClick={() => deleteRequest(req.id)}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950/40 transition"
                          >
                            {copy.deleteLabel}
                          </button>
                          <button
                            type="button"
                            onClick={() => acceptRequest(req)}
                            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8930a] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:brightness-105 transition"
                          >
                            {copy.acceptBtn}
                          </button>
                        </div>
                      </motion.div>
                    ))
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}