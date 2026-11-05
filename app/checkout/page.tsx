"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, LockKeyhole, ReceiptText, ShieldCheck, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { CartItem, useCart } from "@/context/CartContext";
import { supabase, saveOrder, syncUserProfile } from "@/lib/supabase/client";

export default function CheckoutPage() {
  const { language } = useLanguage();
  const { items, totalAmount, clearCart } = useCart();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [receiptItems, setReceiptItems] = useState<CartItem[]>([]);
  const [receiptNumber] = useState(() => `SND-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);

  // Auto-fill from authenticated user if signed in
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        if (!email && data.user.email) setEmail(data.user.email);
        if (!name && data.user.user_metadata?.full_name) setName(data.user.user_metadata.full_name);
        if (!phone && (data.user.user_metadata?.phone || data.user.phone)) {
          setPhone(data.user.user_metadata?.phone || data.user.phone || "");
        }
      }
    });
  }, []);

  const text =
    language === "ar"
      ? {
          back: "\u0627\u0644\u0639\u0648\u062f\u0629 \u0644\u0644\u062e\u062f\u0645\u0627\u062a",
          title: "\u062a\u0623\u0643\u064a\u062f \u0627\u0644\u0637\u0644\u0628",
          subtitle: "\u0623\u062f\u062e\u0644 \u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u062a\u0648\u0627\u0635\u0644 \u0644\u0625\u064a\u0635\u0627\u0644 \u062f\u0639\u0645\u0643 \u0628\u0623\u0645\u0627\u0646.",
          details: "\u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u0645\u0633\u062a\u0644\u0645 \u0648\u0627\u0644\u062a\u0648\u0635\u064a\u0644",
          name: "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0643\u0627\u0645\u0644",
          email: "\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a",
          phone: "\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062a\u0641 / \u0627\u0644\u0648\u0627\u062a\u0633\u0622\u0628",
          location: "\u0627\u0644\u0645\u062f\u064a\u0646\u0629 \u0623\u0648 \u0627\u0644\u0639\u0646\u0648\u0627\u0646",
          pay: "\u062a\u0623\u0643\u064a\u062f \u0648\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0637\u0644\u0628",
          secure: "\u0637\u0644\u0628 \u0622\u0645\u0646 \u0648\u0645\u0648\u062b\u0642",
          total: "\u0627\u0644\u0625\u062c\u0645\u0627\u0644\u064a",
          success: "\u062a\u0645 \u062a\u0623\u0643\u064a\u062f \u0637\u0644\u0628\u0643 \u0628\u0646\u062c\u0627\u062d!",
          successHint: "\u0647\u0630\u0627 \u0647\u0648 \u0625\u064a\u0635\u0627\u0644 \u0627\u0644\u0637\u0644\u0628. \u0627\u062d\u062a\u0641\u0638 \u0628\u0631\u0642\u0645 \u0627\u0644\u0645\u0631\u062c\u0639 \u0644\u0645\u062a\u0627\u0628\u0639\u0629 \u0627\u0644\u062a\u0633\u0644\u064a\u0645 \u0645\u0639 \u0641\u0631\u064a\u0642 \u0633\u0646\u062f.",
          home: "\u0627\u0644\u0639\u0648\u062f\u0629 \u0644\u0644\u0631\u0626\u064a\u0633\u064a\u0629",
          invoice: "\u0625\u064a\u0635\u0627\u0644 \u0627\u0644\u0637\u0644\u0628",
          reference: "\u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628",
          date: "\u0627\u0644\u062a\u0627\u0631\u064a\u062e",
          item: "\u0627\u0644\u062e\u062f\u0645\u0629",
          quantity: "\u0627\u0644\u0643\u0645\u064a\u0629",
          amount: "\u0627\u0644\u0645\u0628\u0644\u063a",
          subtotal: "\u0627\u0644\u0645\u062c\u0645\u0648\u0639",
          status: "\u0627\u0644\u062d\u0627\u0644\u0629: \u0642\u064a\u062f \u0627\u0644\u062a\u0646\u0641\u064a\u0630",
        }
      : language === "tr"
      ? {
          back: "Hizmetlere don",
          title: "Siparisi tamamla",
          subtitle: "Desteginizi guvenle teslim etmek icin iletisim bilgilerinizi girin.",
          details: "Teslimat bilgileri",
          name: "Ad soyad",
          email: "E-posta",
          phone: "Telefon",
          location: "Sehir veya adres",
          pay: "Siparisi onayla",
          secure: "Guvenli islem",
          total: "Toplam",
          success: "Siparisiniz onaylandi",
          successHint: "Siparis numaranizi Sanad ekibiyle takip icin saklayin.",
          home: "Ana sayfaya don",
          invoice: "Ayrintili makbuz",
          reference: "Siparis no",
          date: "Tarih",
          item: "Hizmet",
          quantity: "Adet",
          amount: "Tutar",
          subtotal: "Ara toplam",
          status: "Durum: Onaylandi",
        }
      : {
          back: "Back to services",
          title: "Complete your order",
          subtitle: "Add your contact details so we can deliver your support safely.",
          details: "Delivery details",
          name: "Full name",
          email: "Email address",
          phone: "Phone number",
          location: "City or address",
          pay: "Confirm order",
          secure: "Secure Order",
          total: "Total",
          success: "Your order is confirmed",
          successHint: "Keep the order reference for follow-up with the Sanad team.",
          home: "Back to home",
          invoice: "Detailed receipt",
          reference: "Order reference",
          date: "Date",
          item: "Service",
          quantity: "Quantity",
          amount: "Amount",
          subtotal: "Subtotal",
          status: "Status: Processing",
        };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      let currentUserId: string | null = null;
      if (supabase) {
        const { data } = await supabase.auth.getUser();
        if (data.user) {
          currentUserId = data.user.id;
          // Update profile with phone and name
          await syncUserProfile(data.user);
        }
      }

      // Explicitly send user phone, id, and item details to Supabase `orders` table
      for (const item of items) {
        const serviceTitle =
          language === "ar"
            ? item.service.titleAr
            : language === "tr"
            ? item.service.titleTr
            : item.service.titleEn;

        await saveOrder({
          user_id: currentUserId,
          user_email: email.trim(),
          user_name: name.trim(),
          user_phone: phone.trim(),
          service_title: serviceTitle,
          service_category: item.service.category,
          amount_usd: item.amount * item.quantity,
          quantity: item.quantity,
          notes: `${location.trim()} | Ref: ${receiptNumber}`,
        });
      }

      setReceiptItems(items);
      setSubmitted(true);
      clearCart();
    } catch (err) {
      console.error("Order submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main className="max-w-3xl mx-auto w-full px-4 py-12 sm:py-16">
        <div className="rounded-[32px] overflow-hidden bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/50 shadow-2xl">
          <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-950 text-white p-7 sm:p-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[.18em] text-emerald-200">Sanad</p>
                <h1 className="text-2xl sm:text-3xl font-black">{text.success}</h1>
              </div>
            </div>
            <p className="mt-4 text-sm text-emerald-100">{text.successHint}</p>
          </div>
          <div className="p-6 sm:p-10">
            <div className="flex items-center gap-3 mb-6">
              <ReceiptText className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-black text-slate-900 dark:text-white">{text.invoice}</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-3 mb-7">
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3">
                <p className="text-[11px] text-slate-500">{text.reference}</p>
                <p className="font-black text-slate-900 dark:text-white mt-1">{receiptNumber}</p>
              </div>
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3">
                <p className="text-[11px] text-slate-500">{text.date}</p>
                <p className="font-bold text-slate-900 dark:text-white mt-1">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 p-3">
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300">{text.status}</p>
                <p className="font-bold text-emerald-800 dark:text-emerald-200 mt-1">
                  {phone || "Direct"}
                </p>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="grid grid-cols-[1fr_70px_90px] gap-3 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-xs font-black text-slate-500">
                <span>{text.item}</span>
                <span>{text.quantity}</span>
                <span className="text-end">{text.amount}</span>
              </div>
              {receiptItems.map((item) => {
                const title =
                  language === "ar"
                    ? item.service.titleAr
                    : language === "tr"
                    ? item.service.titleTr
                    : item.service.titleEn;
                return (
                  <div
                    key={item.service.id}
                    className="grid grid-cols-[1fr_70px_90px] gap-3 px-4 py-4 border-t border-slate-200 dark:border-slate-700 text-sm"
                  >
                    <span className="font-bold text-slate-800 dark:text-white">{title}</span>
                    <span className="text-slate-500">{item.quantity}</span>
                    <span className="text-end font-black text-slate-900 dark:text-white">
                      ${(item.amount * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
              <div className="flex justify-between px-4 py-4 border-t border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-500">{text.subtotal}</span>
                <strong className="text-xl text-emerald-700 dark:text-emerald-400">
                  ${receiptItems
                    .reduce((sum, item) => sum + item.amount * item.quantity, 0)
                    .toFixed(2)}
                </strong>
              </div>
            </div>
            <button
              onClick={() => router.push("/")}
              className="mt-8 w-full rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white py-4 font-black transition"
            >
              {text.home}
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        {text.back}
      </button>

      <div className="grid lg:grid-cols-[1fr_390px] gap-8 mt-8">
        <section>
          <p className="text-xs uppercase tracking-[0.18em] text-emerald-600 dark:text-[#d4af37] font-black mb-3">
            Sanad Checkout
          </p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 dark:text-white">
            {text.title}
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm">{text.subtitle}</p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 p-5 sm:p-7 rounded-[28px] bg-white/85 dark:bg-[#1a2d20]/80 border border-slate-200 dark:border-[#d4af37]/20 shadow-xl space-y-4"
          >
            <h2 className="text-lg font-black text-slate-900 dark:text-white mb-4">
              {text.details}
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                {text.name}
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                />
              </label>

              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                {text.email}
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                />
              </label>

              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                {text.phone}
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+90 5xx xxx xxxx"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                />
              </label>

              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                {text.location}
                <input
                  required
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Istanbul, Fatih"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                />
              </label>
            </div>

            <button
              disabled={items.length === 0 || submitting}
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#b8930a] hover:brightness-105 disabled:opacity-50 text-white py-4 font-black transition flex items-center justify-center gap-2 shadow-lg"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <LockKeyhole className="w-4 h-4" />
                  <span>{text.pay}</span>
                </>
              )}
            </button>
          </form>
        </section>

        <aside className="lg:mt-16 h-fit rounded-[28px] bg-[#0d1810] text-white p-6 shadow-2xl border border-[#d4af37]/25">
          <h2 className="text-lg font-black mb-5">
            {language === "ar" ? "\u0645\u0644\u062e\u0635 \u0627\u0644\u0637\u0644\u0628" : "Order Summary"}
          </h2>
          <div className="space-y-4">
            {items.map((item) => {
              const title =
                language === "ar"
                  ? item.service.titleAr
                  : language === "tr"
                  ? item.service.titleTr
                  : item.service.titleEn;
              return (
                <div key={item.service.id} className="flex justify-between gap-3 text-sm">
                  <span className="text-slate-300">
                    {title} <span className="text-[#d4af37]">&times; {item.quantity}</span>
                  </span>
                  <span className="font-bold text-[#d4af37]">
                    ${(item.amount * item.quantity).toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="border-t border-[#d4af37]/20 mt-6 pt-5 flex justify-between items-center">
            <span className="text-slate-400">{text.total}</span>
            <strong className="text-2xl text-white">${totalAmount.toFixed(2)}</strong>
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs text-[#d4af37]">
            <ShieldCheck className="w-4 h-4" />
            {text.secure}
          </div>
        </aside>
      </div>
    </main>
  );
}