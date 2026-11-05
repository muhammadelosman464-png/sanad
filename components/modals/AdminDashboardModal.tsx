"use client";

import { FormEvent, useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, PackagePlus, Trash2, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCatalog } from "@/context/CatalogContext";
import { toast } from "@/components/ui/Toast";
import NumberInput from "@/components/ui/NumberInput";
import type { ServiceCategory } from "@/components/modals/ServiceDetailsModal";
import { uploadProductImage, supabase } from "@/lib/supabase/client";

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: ServiceCategory[] = ["food", "health", "energy", "gifts", "support"];

export default function AdminDashboardModal({ isOpen, onClose }: AdminDashboardModalProps) {
  const { language } = useLanguage();
  const { services, addService, updatePrice, removeService } = useCatalog();
  const [titleEn, setTitleEn] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [newPrice, setNewPrice] = useState(50);
  const [newCategory, setNewCategory] = useState<ServiceCategory>("support");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"services" | "requests">("services");
  const [helpRequests, setHelpRequests] = useState<Array<{
    id: string;
    user_name?: string;
    user_phone?: string;
    user_email?: string;
    message: string;
    amount_usd: number;
    created_at?: string;
    status: "pending" | "accepted" | "deleted";
  }>>([]);

  useEffect(() => {
    if (!isOpen) return;
    import("@/lib/supabase/client").then(({ supabase: sb }) => {
      if (!sb) return;
      sb.from("help_requests")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50)
        .then(({ data }) => {
          if (data) {
            setHelpRequests(data.map(r => ({ ...r, status: r.status ?? "pending" })));
          }
        });
    });
  }, [isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const acceptRequest = (req: typeof helpRequests[0]) => {
    setHelpRequests(prev => prev.filter(r => r.id !== req.id));
    import("@/lib/supabase/client").then(({ supabase: sb }) => {
      if (!sb) return;
      sb.from("help_requests").update({ status: "accepted" }).eq("id", req.id);
    });
    if (req.user_phone) {
      const phone = req.user_phone.replace(/\D/g, "");
      const msg = encodeURIComponent(
        `\u0645\u0631\u062d\u0628\u0627\u064b ${req.user_name ?? ""}\u060c \u062a\u0645 \u0642\u0628\u0648\u0644 \u0637\u0644\u0628\u0643 \u0628\u0642\u064a\u0645\u0629 $${req.amount_usd}. \u0633\u064a\u062a\u0645 \u0627\u0644\u062a\u0648\u0627\u0635\u0644 \u0645\u0639\u0643 \u0642\u0631\u064a\u0628\u0627\u064b.`
      );
      window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
    }
  };

  const deleteRequest = (id: string) => {
    setHelpRequests(prev => prev.filter(r => r.id !== id));
    import("@/lib/supabase/client").then(({ supabase: sb }) => {
      if (!sb) return;
      sb.from("help_requests").update({ status: "deleted" }).eq("id", id);
    });
  };

  const copy = language === "ar"
    ? {
        title: "\u0644\u0648\u062d\u0629 \u0627\u0644\u062a\u062d\u0643\u0645",
        subtitle: "\u0625\u062f\u0627\u0631\u0629 \u0627\u0644\u062e\u062f\u0645\u0627\u062a \u0648\u0627\u0644\u0623\u0633\u0639\u0627\u0631",
        close: "\u0625\u063a\u0644\u0627\u0642",
        priceList: "\u0627\u0644\u062e\u062f\u0645\u0627\u062a \u0648\u0627\u0644\u0623\u0633\u0639\u0627\u0631",
        priceLabel: "\u0627\u0644\u0633\u0639\u0631 (USD)",
        addTitle: "\u0625\u0636\u0627\u0641\u0629 \u0645\u0646\u062a\u062c \u062c\u062f\u064a\u062f",
        nameAr: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0646\u062a\u062c (\u0639\u0631\u0628\u064a)",
        nameEn: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0646\u062a\u062c (\u0625\u0646\u062c\u0644\u064a\u0632\u064a)",
        category: "\u0627\u0644\u0641\u0626\u0629",
        add: "\u0625\u0636\u0627\u0641\u0629 \u0645\u0646\u062a\u062c",
        added: "\u062a\u0645 \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0645\u0646\u062a\u062c",
        deleted: "\u062a\u0645 \u062d\u0630\u0641 \u0627\u0644\u062e\u062f\u0645\u0629",
        deleteLabel: "\u062d\u0630\u0641",
        empty: "\u0644\u0627 \u062a\u0648\u062c\u062f \u062e\u062f\u0645\u0627\u062a \u0628\u0639\u062f",
        uploadImage: "\u0631\u0641\u0639 \u0635\u0648\u0631\u0629",
        servicesTab: "\u0627\u0644\u062e\u062f\u0645\u0627\u062a",
        requestsTab: "\u0637\u0644\u0628\u0627\u062a \u0627\u0644\u0645\u0633\u0627\u0639\u062f\u0629",
        noRequests: "\u0644\u0627 \u062a\u0648\u062c\u062f \u0637\u0644\u0628\u0627\u062a \u0628\u0639\u062f",
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
        title: "Y\u00f6netim paneli",
        subtitle: "Hizmet ve fiyat y\u00f6netimi",
        close: "Kapat",
        priceList: "Hizmetler ve fiyatlar",
        priceLabel: "Fiyat (USD)",
        addTitle: "Yeni \u00fcr\u00fcn ekle",
        nameAr: "\u00dcr\u00fcn ad\u0131 (Arap\u00e7a)",
        nameEn: "\u00dcr\u00fcn ad\u0131 (\u0130ngilizce)",
        category: "Kategori",
        add: "\u00dcr\u00fcn\u00fc ekle",
        added: "\u00dcr\u00fcn eklendi",
        deleted: "Hizmet silindi",
        deleteLabel: "Sil",
        empty: "Hen\u00fcz hizmet yok",
        uploadImage: "G\u00f6rsel y\u00fckle",
        servicesTab: "Hizmetler",
        requestsTab: "Yard\u0131m Talepleri",
        noRequests: "Hen\u00fcz talep yok",
        acceptBtn: "Kabul + WhatsApp",
        categories: {
          food: "G\u0131da",
          health: "Sa\u011fl\u0131k",
          energy: "Enerji",
          gifts: "Hediyeler",
          support: "Destek",
        },
      }
    : {
        title: "Admin Panel",
        subtitle: "Manage services and prices",
        close: "Close",
        priceList: "Services and prices",
        priceLabel: "Price (USD)",
        addTitle: "Add a new product",
        nameAr: "Product name (Arabic)",
        nameEn: "Product name (English)",
        category: "Category",
        add: "Add product",
        added: "Product added!",
        deleted: "Service deleted",
        deleteLabel: "Delete",
        empty: "No services yet",
        uploadImage: "Upload image",
        servicesTab: "Services",
        requestsTab: "Help Requests",
        noRequests: "No requests yet",
        acceptBtn: "Accept + WhatsApp",
        categories: {
          food: "Food",
          health: "Health",
          energy: "Energy",
          gifts: "Gifts",
          support: "Support",
        },
      };

  const addProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!titleEn.trim() || !titleAr.trim()) return;
    setUploadingImage(true);
    let imageUrl = "";
    if (imageFile) {
      const fileName = `${Date.now()}-${imageFile.name.replace(/\s/g, "-")}`;
      const url = await uploadProductImage(imageFile, fileName);
      imageUrl = url ?? "";
    }
    addService({
      titleEn: titleEn.trim(),
      titleAr: titleAr.trim(),
      price: newPrice,
      category: newCategory,
      imageUrl: imageUrl || undefined,
    });
    // Persist to Supabase services table
    if (supabase && (titleEn.trim() || titleAr.trim())) {
      supabase.from("services").insert([{
        title_en: titleEn.trim(),
        title_ar: titleAr.trim(),
        price: newPrice,
        category: newCategory,
        image_url: imageUrl,
      }]).then(() => {});
    }
    setTitleEn("");
    setTitleAr("");
    setNewPrice(50);
    setImageFile(null);
    setImagePreview("");
    setUploadingImage(false);
    toast.success(copy.added);
  };

  const deleteService = (id: string) => {
    removeService(id);
    toast.success(copy.deleted);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            aria-label={copy.close}
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[30px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 end-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              aria-label={copy.close}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-7">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[.16em] text-emerald-600">{copy.subtitle}</p>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">{copy.title}</h2>
              </div>
            </div>

            {/* Tab switcher */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setActiveTab("services")}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition ${activeTab === "services" ? "bg-[#d4af37] text-[#1d3023]" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"}`}
              >
                {copy.servicesTab}
              </button>
              <button
                onClick={() => setActiveTab("requests")}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition ${activeTab === "requests" ? "bg-[#d4af37] text-[#1d3023]" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"}`}
              >
                {copy.requestsTab}
                {helpRequests.filter(r => r.status === "pending").length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-[9px] font-black rounded-full px-1.5 py-0.5">
                    {helpRequests.filter(r => r.status === "pending").length}
                  </span>
                )}
              </button>
            </div>

            {activeTab === "services" && (
              <>
                <section className="space-y-3">
                  <h3 className="text-sm font-black text-slate-700 dark:text-slate-200">{copy.priceList}</h3>
                  {services.length === 0 && <p className="text-sm text-slate-500">{copy.empty}</p>}
                  <ul className="space-y-2">
                    {services.map((service) => (
                      <li
                        key={service.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {service.imageUrl && (
                            <img
                              src={service.imageUrl}
                              alt={service.titleEn}
                              className="w-12 h-12 rounded-xl object-cover shrink-0 ring-1 ring-[#d4af37]/30"
                            />
                          )}
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 dark:text-white truncate">{language === "ar" ? service.titleAr : service.titleEn}</p>
                            <p className="text-xs text-slate-500">{copy.categories[service.category]}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <label className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                            {copy.priceLabel}
                            <NumberInput
                              label={`${copy.priceLabel} ${service.titleEn}`}
                              min={0}
                              value={service.price}
                              onCommit={(v) => updatePrice(service.id, v)}
                              className="w-20 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => deleteService(service.id)}
                            className="rounded-xl p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40 transition"
                            aria-label={copy.deleteLabel}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>

                <form
                  onSubmit={addProduct}
                  className="mt-6 rounded-2xl border border-dashed border-[#d4af37]/30 bg-slate-50 dark:bg-slate-800/50 p-5 space-y-4"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <PackagePlus className="w-5 h-5 text-[#d4af37]" />
                    <h3 className="font-black text-slate-800 dark:text-white">{copy.addTitle}</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder={copy.nameEn}
                      value={titleEn}
                      onChange={(e) => setTitleEn(e.target.value)}
                      className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    />
                    <input
                      type="text"
                      required
                      placeholder={copy.nameAr}
                      value={titleAr}
                      onChange={(e) => setTitleAr(e.target.value)}
                      dir="rtl"
                      className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                      {copy.uploadImage}
                    </label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="relative flex flex-col items-center justify-center w-full h-28 rounded-xl border-2 border-dashed border-[#d4af37]/40 hover:border-[#d4af37] bg-white dark:bg-slate-800 cursor-pointer transition overflow-hidden"
                    >
                      {imagePreview ? (
                        <img src={imagePreview} alt="preview" className="absolute inset-0 w-full h-full object-cover rounded-xl" />
                      ) : (
                        <>
                          <ImageIcon className="w-7 h-7 text-[#d4af37]/50 mb-1" />
                          <span className="text-xs text-slate-400">{copy.uploadImage}</span>
                        </>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <NumberInput
                      label={copy.priceLabel}
                      min={0}
                      value={newPrice}
                      onCommit={setNewPrice}
                      className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as ServiceCategory)}
                      aria-label={copy.category}
                      className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {copy.categories[cat]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={uploadingImage}
                    className="w-full rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white py-3 font-bold transition flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {uploadingImage ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                    ) : (
                      copy.add
                    )}
                  </button>
                </form>
              </>
            )}

            {activeTab === "requests" && (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {helpRequests.filter(r => r.status !== "deleted" && r.status !== "accepted").length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-8">{copy.noRequests}</p>
                ) : (
                  helpRequests
                    .filter(r => r.status !== "deleted" && r.status !== "accepted")
                    .map(req => (
                      <motion.div
                        key={req.id}
                        layout
                        exit={{ opacity: 0, x: 20 }}
                        className="rounded-2xl border border-[#d4af37]/20 bg-[#1d3023]/30 dark:bg-[#1d3023]/60 p-4"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                              {req.user_name ?? "Anonymous"} &bull; {req.user_phone ?? "No phone"}
                            </p>
                            <p className="text-xs text-slate-500 truncate">{req.user_email}</p>
                            <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 line-clamp-2">{req.message}</p>
                            <p className="text-xs font-bold text-[#d4af37] mt-1">${req.amount_usd}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => deleteRequest(req.id)}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950/40 transition"
                          >
                            {copy.deleteLabel}
                          </button>
                          <button
                            onClick={() => acceptRequest(req)}
                            className="px-3 py-1.5 rounded-lg bg-[#d4af37] hover:bg-[#b8930a] text-[#1d3023] text-xs font-bold flex items-center gap-1.5 transition"
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