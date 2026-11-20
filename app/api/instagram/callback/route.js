import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Handles Instagram's OAuth redirect: verifies state, exchanges the code for a
// short-lived token, then upgrades it to a long-lived token, stored in a cookie.
export async function GET(request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const sp = url.searchParams;
  const appId = process.env.INSTAGRAM_APP_ID;
  const secret = process.env.INSTAGRAM_APP_SECRET;

  const fail = (code) => NextResponse.redirect(`${origin}/admin/integrations?instagram=${code}`);

  if (!appId || !secret) return fail("not_configured");
  if (sp.get("error")) return fail("denied");

  const code = (sp.get("code") || "").replace(/#_$/, "");
  const state = sp.get("state") || "";
  const cookieState = request.cookies.get("ig_state")?.value;
  if (!code) return fail("no_code");
  if (!state || state !== cookieState) return fail("state_mismatch");

  const redirectUri = `${origin}/api/instagram/callback`;

  // 1) short-lived token
  let shortTok, userId;
  try {
    const body = new URLSearchParams({
      client_id: appId,
      client_secret: secret,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
      code,
    });
    const r = await fetch("https://api.instagram.com/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const d = await r.json();
    shortTok = d.access_token;
    userId = d.user_id;
  } catch {
    return fail("exchange_error");
  }
  if (!shortTok) return fail("exchange_failed");

  // 2) upgrade to long-lived token (60 days)
  let longTok = shortTok, expiresIn = null;
  try {
    const r = await fetch(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${encodeURIComponent(secret)}&access_token=${encodeURIComponent(shortTok)}`
    );
    const d = await r.json();
    if (d.access_token) { longTok = d.access_token; expiresIn = d.expires_in; }
  } catch {}

  const res = NextResponse.redirect(`${origin}/admin/integrations?instagram=connected`);
  res.cookies.set("ig_token", longTok, { httpOnly: true, sameSite: "lax", secure: true, path: "/", maxAge: expiresIn || 60 * 60 * 24 * 60 });
  if (userId) res.cookies.set("ig_user_id", String(userId), { httpOnly: false, sameSite: "lax", secure: true, path: "/", maxAge: 60 * 60 * 24 * 60 });
  res.cookies.set("ig_state", "", { path: "/", maxAge: 0 });
  return res;
}
