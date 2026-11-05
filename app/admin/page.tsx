"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import AdminDashboardModal from "@/components/modals/AdminDashboardModal";

export default function AdminPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "Aboilyas7") {
      setAuthorized(true);
      setError("");
    } else {
      setError("\u0631\u0645\u0632 \u0627\u0644\u0645\u0631\u0648\u0631 \u063a\u064a\u0631 \u0635\u062d\u064a\u062d");
    }
  };

  if (!authorized) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 bg-[#1d3023] text-white">
        <div className="max-w-md w-full bg-[#132a1c] border border-[#d4af37]/30 rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#d4af37] mx-auto flex items-center justify-center mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-white">
            {"\u0644\u0648\u062d\u0629 \u0627\u0644\u062a\u062d\u0643\u0645"}
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            {"\u0623\u062f\u062e\u0644 \u0631\u0645\u0632 \u0627\u0644\u0645\u0631\u0648\u0631 \u0644\u0644\u0648\u0635\u0648\u0644 \u0625\u0644\u0649 \u0644\u0648\u062d\u0629 \u0627\u0644\u062a\u062d\u0643\u0645"}
          </p>

          <form onSubmit={handleVerify} className="mt-6 space-y-4">
            <div>
              <input
                type="password"
                autoFocus
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (error) setError("");
                }}
                placeholder={"\u0631\u0645\u0632 \u0627\u0644\u0645\u0631\u0648\u0631..."}
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-[#d4af37]/30 text-white placeholder-white/30 text-base focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-center tracking-widest font-mono"
              />
              {error && (
                <p className="text-xs text-rose-400 font-bold mt-2 text-center">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#b8930a] text-[#1d3023] font-black text-sm shadow-md hover:brightness-110 active:scale-95 transition"
            >
              {"\u062a\u062d\u0642\u0642"}
            </button>
          </form>

          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 text-xs text-white/50 hover:text-white transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{"\u0627\u0644\u0639\u0648\u062f\u0629 \u0644\u0644\u0631\u0626\u064a\u0633\u064a\u0629"}</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#1d3023] py-12 px-4">
      <AdminDashboardModal isOpen={true} onClose={() => router.push("/")} />
    </main>
  );
}