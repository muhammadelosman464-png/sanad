import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(
        new URL(`/?auth_error=${encodeURIComponent(error.message)}`, requestUrl.origin)
      );
    }

    // Upsert profile into DB after successful OAuth login
    if (data?.user) {
      const { user } = data;
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { persistSession: false, autoRefreshToken: false } }
      );
      await supabaseAdmin.from("profiles").upsert({
        id: user.id,
        email: user.email ?? "",
        full_name:
          user.user_metadata?.full_name ??
          user.user_metadata?.name ??
          user.email?.split("@")[0] ??
          "Unknown",
        phone: user.user_metadata?.phone ?? user.phone ?? "",
        updated_at: new Date().toISOString(),
      }, { onConflict: "id" });
    }
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}