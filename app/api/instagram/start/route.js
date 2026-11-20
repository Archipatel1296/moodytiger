import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Kicks off Instagram (Meta) OAuth. Needs env: INSTAGRAM_APP_ID,
// INSTAGRAM_APP_SECRET, (optional) INSTAGRAM_SCOPES.
export async function GET(request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const appId = process.env.INSTAGRAM_APP_ID;
  const secret = process.env.INSTAGRAM_APP_SECRET;
  const scopes = process.env.INSTAGRAM_SCOPES || "instagram_business_basic,instagram_business_content_publish";

  if (!appId || !secret) {
    return NextResponse.redirect(`${origin}/admin/integrations?instagram=not_configured`);
  }

  const state = crypto.randomBytes(16).toString("hex");
  const redirectUri = `${origin}/api/instagram/callback`;
  const authUrl =
    `https://www.instagram.com/oauth/authorize` +
    `?client_id=${encodeURIComponent(appId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent(scopes)}` +
    `&state=${state}`;

  const res = NextResponse.redirect(authUrl);
  res.cookies.set("ig_state", state, { httpOnly: true, sameSite: "lax", secure: true, path: "/", maxAge: 600 });
  return res;
}
