import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Kicks off Shopify's OAuth authorization-code grant.
// Needs env: SHOPIFY_API_KEY, SHOPIFY_API_SECRET, (optional) SHOPIFY_SCOPES.
export async function GET(request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const apiKey = process.env.SHOPIFY_API_KEY;
  const secret = process.env.SHOPIFY_API_SECRET;
  const scopes = process.env.SHOPIFY_SCOPES || "read_products,read_orders";

  if (!apiKey || !secret) {
    return NextResponse.redirect(`${origin}/admin/integrations?shopify=not_configured`);
  }

  let shop = (url.searchParams.get("shop") || "").trim().toLowerCase();
  if (shop && !shop.includes(".")) shop = `${shop}.myshopify.com`;
  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(shop)) {
    return NextResponse.redirect(`${origin}/admin/integrations?shopify=bad_shop`);
  }

  const state = crypto.randomBytes(16).toString("hex");
  const redirectUri = `${origin}/api/shopify/callback`;
  const authUrl =
    `https://${shop}/admin/oauth/authorize` +
    `?client_id=${encodeURIComponent(apiKey)}` +
    `&scope=${encodeURIComponent(scopes)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&state=${state}`;

  const res = NextResponse.redirect(authUrl);
  const cookie = { httpOnly: true, sameSite: "lax", secure: true, path: "/", maxAge: 600 };
  res.cookies.set("shopify_state", state, cookie);
  return res;
}
