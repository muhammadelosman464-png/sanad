"use client";

import { useEffect, useState } from "react";

interface NumberInputProps {
  value: number;
  onCommit: (next: number) => void;
  label: string;
  min?: number;
  max?: number;
  integer?: boolean;
  className?: string;
}

export default function NumberInput({ value, onCommit, label, min = 1, max, integer = false, className }: NumberInputProps) {
  const [draft, setDraft] = useState(String(value));

  useEffect(() => {
    setDraft((current) => (Number(current) === value ? current : String(value)));
  }, [value]);

  const normalize = (parsed: number) => {
    const whole = integer ? Math.floor(parsed) : parsed;
    return Math.min(max ?? Infinity, Math.max(min, whole));
  };

  return (
    <input
      aria-label={label}
      type="number"
      inputMode={integer ? "numeric" : "decimal"}
      min={min}
      max={max}
      value={draft}
      onChange={(event) => {
        const raw = event.target.value;
        setDraft(raw);
        const parsed = Number(raw);
        if (raw !== "" && Number.isFinite(parsed) && parsed >= min) onCommit(normalize(parsed));
      }}
      onBlur={() => setDraft(String(value))}
      className={className}
    />
  );
}
