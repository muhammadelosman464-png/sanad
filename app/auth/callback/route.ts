import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * Supabase OAuth Callback Handler
 *
 * After the user authorises via Google (or any OAuth provider), Supabase
 * redirects back to this URL with a short-lived `code` param.
 * We exchange that code for a session and redirect the user to the home page.
 *
 * Route: /auth/callback
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      // Redirect to home with an error param so the UI can show a toast
      return NextResponse.redirect(
        new URL(`/?auth_error=${encodeURIComponent(error.message)}`, requestUrl.origin)
      );
    }
  }

  // Successful login — redirect to intended destination or home
  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
