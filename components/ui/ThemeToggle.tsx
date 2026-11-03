"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function ThemeToggle() {
  const { language } = useLanguage();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme !== "light";
  const label = language === "ar"
    ? isDark ? "التبديل إلى الوضع الفاتح" : "التبديل إلى الوضع الداكن"
    : language === "tr"
    ? isDark ? "Açık temaya geç" : "Koyu temaya geç"
    : isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      title={label}
      className="shrink-0 w-10 h-10 rounded-xl border border-slate-200 dark:border-[#ffd700]/30 flex items-center justify-center text-slate-700 dark:text-[#ffd700] hover:bg-amber-50 dark:hover:bg-white/5 transition"
    >
      {mounted && (isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />)}
    </button>
  );
}
