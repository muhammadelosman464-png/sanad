"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, ShieldCheck, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import AdminDashboardModal from "@/components/modals/AdminDashboardModal";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  const ADMIN_EMAILS = [
    (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "muhammadelosman464@gmail.com").toLowerCase(),
    "digty4@gmail.com",
    "muhammadelosman464@gmail.com",
  ];

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const checkAdmin = (userEmail: string | null) => {
      if (!userEmail) return false;
      return (
        ADMIN_EMAILS.includes(userEmail.toLowerCase()) ||
        (typeof window !== "undefined" &&
          (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"))
      );
    };

    supabase.auth.getUser().then(({ data }) => {
      const userEmail = data.user?.email?.toLowerCase() || null;
      setEmail(userEmail);
      setIsAdmin(checkAdmin(userEmail));
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      const userEmail = session?.user?.email?.toLowerCase() || null;
      setEmail(userEmail);
      setIsAdmin(checkAdmin(userEmail));
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1d3023]">
        <Loader2 className="w-8 h-8 animate-spin text-[#d4af37]" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 bg-[#1d3023] text-white">
        <div className="max-w-md w-full bg-[#132a1c] border border-red-500/30 rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-400 mx-auto flex items-center justify-center mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-white">Access Restricted</h1>
          <p className="mt-3 text-sm text-slate-300">
            {email
              ? `Signed in as ${email}. This area is restricted to authorized administrators.`
              : "You must be signed in with an administrator account to access this portal."}
          </p>
          <div className="mt-6 flex flex-col gap-2.5">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#d4af37] text-[#1d3023] font-bold text-sm hover:brightness-105 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Homepage</span>
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