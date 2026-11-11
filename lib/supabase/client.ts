/**
 * lib/supabase/client.ts
 */

import { createClient, SupabaseClient, User } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured: boolean =
  typeof supabaseUrl === "string" &&
  typeof supabaseAnonKey === "string" &&
  supabaseUrl.startsWith("https://") &&
  supabaseUrl.includes(".supabase.co") &&
  supabaseAnonKey.length > 20 &&
  !supabaseUrl.includes("placeholder") &&
  !supabaseAnonKey.includes("placeholder");

if (process.env.NODE_ENV === "development") {
  if (isSupabaseConfigured) {
    console.log("[Sanad] Supabase connected ->", supabaseUrl);
  } else {
    console.warn("[Sanad] Supabase NOT configured. Add keys to .env.local");
  }
}

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null;

export const supabaseAdmin: SupabaseClient | null =
  isSupabaseConfigured &&
  typeof supabaseServiceKey === "string" &&
  supabaseServiceKey.length > 20 &&
  !supabaseServiceKey.includes("placeholder")
    ? createClient(supabaseUrl!, supabaseServiceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

export interface AuthResult {
  success: boolean;
  error?: string;
}

export async function syncUserProfile(user: User): Promise<void> {
  if (!supabase || !user) return;
  try {
    let fullName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.user_metadata?.user_name ||
      "";
    if (!fullName && user.email?.toLowerCase().includes("muhammad")) {
      fullName = "Muhammad Elosman";
    }
    if (!fullName) {
      fullName = user.email?.split("@")[0] || "User";
    }
    const phone = user.user_metadata?.phone || user.phone || "";
    await supabase.from("profiles").upsert(
      {
        id: user.id,
        email: user.email ?? "",
        full_name: fullName,
        phone: phone,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[Sanad] syncUserProfile error:", err);
    }
  }
}

export async function signInWithGoogle(): Promise<AuthResult> {
  if (!supabase) return { success: false, error: "Authentication not configured." };
  try {
    const origin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "https://sanad-care-platform.netlify.app";
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });
    if (error) {
      console.error("Google Auth Error:", error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unexpected error.";
    console.error("Google Auth Error:", msg);
    return { success: false, error: msg };
  }
}

export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  if (!supabase) return { success: false, error: "Authentication unavailable." };
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) return { success: false, error: error.message };
    if (data.user) {
      syncUserProfile(data.user);
    }
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Login failed." };
  }
}

export async function signUpWithEmail(
  email: string,
  password: string,
  metadata?: Record<string, string>
): Promise<AuthResult> {
  if (!supabase) return { success: false, error: "Authentication unavailable." };
  try {
    const fullName = metadata?.full_name || metadata?.name || "";
    const rawPhone = metadata?.phone || "";
    let formattedPhone = rawPhone.replace(/[^\d+]/g, "");
    if (formattedPhone && !formattedPhone.startsWith("+")) {
      if (formattedPhone.startsWith("0")) {
        formattedPhone = "+90" + formattedPhone.slice(1);
      } else {
        formattedPhone = "+" + formattedPhone;
      }
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          full_name: fullName,
          name: fullName,
          display_name: fullName,
          phone: formattedPhone,
          phone_number: formattedPhone,
          ...metadata,
        },
        emailRedirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/auth/callback`
            : "/auth/callback",
      },
    });
    if (error) return { success: false, error: error.message };
    if (data.user) {
      syncUserProfile(data.user);
      try {
        await supabase.from("profiles").upsert(
          {
            id: data.user.id,
            email: data.user.email ?? email.trim().toLowerCase(),
            full_name: fullName,
            phone: formattedPhone,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );
      } catch (err) {
        console.warn("[Sanad] profiles upsert error:", err);
      }
    }
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Registration failed." };
  }
}

export async function signOutUser(): Promise<AuthResult> {
  if (!supabase) return { success: false, error: "No active session." };
  try {
    const { error } = await supabase.auth.signOut();
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Sign out failed." };
  }
}

export interface OrderPayload {
  user_id?: string | null;
  user_email: string;
  user_name: string;
  user_phone: string;
  service_title: string;
  service_category: string;
  amount_usd: number;
  quantity: number;
  notes?: string;
}

export async function saveOrder(payload: OrderPayload): Promise<void> {
  if (!supabase) return;
  try {
    const cleanPayload = {
      ...payload,
      user_id: payload.user_id && payload.user_id.trim().length > 10 ? payload.user_id : null,
    };
    await supabase.from("orders").insert([cleanPayload]);
  } catch {
    if (process.env.NODE_ENV === "development") console.warn("[Sanad] saveOrder failed:", payload);
  }
}

export interface HelpRequestPayload {
  user_id?: string | null;
  user_email?: string;
  user_name?: string;
  user_phone?: string;
  message: string;
  amount_usd: number;
}

export async function saveHelpRequest(payload: HelpRequestPayload): Promise<void> {
  if (!supabase) return;
  try {
    const cleanPayload = {
      ...payload,
      user_id: payload.user_id && payload.user_id.trim().length > 10 ? payload.user_id : null,
    };
    await supabase.from("help_requests").insert([cleanPayload]);
  } catch {
    if (process.env.NODE_ENV === "development") console.warn("[Sanad] saveHelpRequest failed:", payload);
  }
}

export interface ProfilePayload {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
}

export async function saveProfile(payload: ProfilePayload): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from("profiles").upsert(
      {
        ...payload,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );
  } catch {
    if (process.env.NODE_ENV === "development") console.warn("[Sanad] saveProfile failed:", payload);
  }
}

export async function uploadProductImage(
  file: File,
  fileName: string
): Promise<string | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.storage
      .from("products")
      .upload(`images/${fileName}`, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type,
      });
    if (error || !data) return null;
    const { data: urlData } = supabase.storage
      .from("products")
      .getPublicUrl(`images/${fileName}`);
    return urlData?.publicUrl ?? null;
  } catch {
    return null;
  }
}