/**
 * lib/supabase/client.ts
 * ---------------------------------------------------------------------------
 * Supabase Client - Hardened initialization using real .env.local credentials.
 *
 * Architecture:
 *  - supabase        : Browser-safe singleton (anon key). Use in React
 *                      components and client-side code.
 *  - supabaseAdmin   : Server-only singleton (service role key). Use ONLY
 *                      in API routes / Server Actions, never in components.
 *  - isSupabaseConfigured : Runtime flag; checked before every auth call to
 *                      prevent "Failed to fetch" and "URL is missing" errors.
 *
 * All exported auth helpers return AuthResult instead of throwing, so the UI
 * can surface friendly toast messages instead of unhandled promise rejections.
 * ---------------------------------------------------------------------------
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Read environment variables
// ---------------------------------------------------------------------------

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Service role key is intentionally NOT prefixed with NEXT_PUBLIC_ so it is
// never bundled into the browser JavaScript.
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// ---------------------------------------------------------------------------
// Validate credentials at module load
// ---------------------------------------------------------------------------

/**
 * true when valid Supabase public credentials are present.
 * Guards every auth call so the app never attempts to fetch placeholder URLs.
 */
export const isSupabaseConfigured: boolean =
  typeof supabaseUrl === "string" &&
  typeof supabaseAnonKey === "string" &&
  supabaseUrl.startsWith("https://") &&
  supabaseUrl.includes(".supabase.co") &&
  supabaseAnonKey.length > 20 &&
  !supabaseUrl.includes("placeholder") &&
  !supabaseAnonKey.includes("placeholder");

// Dev-time console hint (stripped in production builds by Next.js)
if (process.env.NODE_ENV === "development") {
  if (isSupabaseConfigured) {
    console.log("[Sanad] Supabase connected ->", supabaseUrl);
  } else {
    console.warn(
      "[Sanad] Supabase is NOT configured. " +
        "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local"
    );
  }
}

// ---------------------------------------------------------------------------
// Browser-safe client (anon key)
// ---------------------------------------------------------------------------

/**
 * Singleton Supabase client for use in React components and client-side logic.
 * Will be null if credentials are missing - always check isSupabaseConfigured
 * or the helper functions before using this directly.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        // Persist the session in localStorage so the user stays logged in
        // across page refreshes.
        persistSession: true,
        autoRefreshToken: true,
        // Detect the OAuth callback hash fragment automatically.
        detectSessionInUrl: true,
      },
    })
  : null;

// ---------------------------------------------------------------------------
// Server-only admin client (service role key)
// ---------------------------------------------------------------------------

/**
 * Admin client with the service role key - bypasses Row Level Security.
 *
 * WARNING: SERVER SIDE ONLY.
 * Import this ONLY from:
 *   - app/api/route.ts files
 *   - Server Actions ("use server")
 *   - middleware.ts
 *
 * It will be null in environments where SUPABASE_SERVICE_ROLE_KEY is absent
 * (e.g., the browser bundle, where the env var is intentionally undefined).
 */
export const supabaseAdmin: SupabaseClient | null =
  isSupabaseConfigured &&
  typeof supabaseServiceKey === "string" &&
  supabaseServiceKey.length > 20 &&
  !supabaseServiceKey.includes("placeholder")
    ? createClient(supabaseUrl!, supabaseServiceKey, {
        auth: {
          // Admin client must never cache sessions - it acts on behalf of the
          // server, not a specific user.
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    : null;

// ---------------------------------------------------------------------------
// Shared result type
// ---------------------------------------------------------------------------

export interface AuthResult {
  success: boolean;
  /** Human-readable error message, present only when success === false */
  error?: string;
}

// ---------------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------------

/**
 * Sign in with Google OAuth (browser redirect flow).
 * After Google redirects back, app/auth/callback/route.ts exchanges the code.
 */
export async function signInWithGoogle(): Promise<AuthResult> {
  if (!supabase) {
    return {
      success: false,
      error:
        "Authentication is not configured. Please contact support or try again later.",
    };
  }

  try {
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback`
        : "/auth/callback";

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: {
          // Request the refresh token so the session can be renewed server-side.
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, error: message };
  }
}

/**
 * Sign in with email + password.
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthResult> {
  if (!supabase) {
    return {
      success: false,
      error: "Authentication service is unavailable. Please try again later.",
    };
  }

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Login failed. Please try again.";
    return { success: false, error: message };
  }
}

/**
 * Register a new account with email + password.
 * metadata is stored in auth.users.raw_user_meta_data.
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  metadata?: Record<string, string>
): Promise<AuthResult> {
  if (!supabase) {
    return {
      success: false,
      error: "Authentication service is unavailable. Please try again later.",
    };
  }

  try {
    const { error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: metadata,
        // Redirect after email verification
        emailRedirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/auth/callback`
            : "/auth/callback",
      },
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Registration failed. Please try again.";
    return { success: false, error: message };
  }
}

/**
 * Sign out the currently authenticated user.
 */
export async function signOutUser(): Promise<AuthResult> {
  if (!supabase) {
    return { success: false, error: "No active session to sign out." };
  }

  try {
    const { error } = await supabase.auth.signOut();
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Sign out failed. Please try again.";
    return { success: false, error: message };
  }
}
