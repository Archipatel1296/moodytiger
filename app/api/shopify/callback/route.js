import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Handles Shopify's OAuth redirect: verifies HMAC + state, exchanges the
// authorization code for a permanent access token, and stores it in a cookie.
export async function GET(request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const sp = url.searchParams;
  const secret = process.env.SHOPIFY_API_SECRET;
  const apiKey = process.env.SHOPIFY_API_KEY;

  const fail = (code) => NextResponse.redirect(`${origin}/admin/integrations?shopify=${code}`);

  if (!secret || !apiKey) return fail("not_configured");

  const shop = sp.get("shop") || "";
  const code = sp.get("code") || "";
  const state = sp.get("state") || "";
  const hmac = sp.get("hmac") || "";
  const cookieState = request.cookies.get("shopify_state")?.value;

  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(shop)) return fail("bad_shop");
  if (!state || state !== cookieState) return fail("state_mismatch");

  // Verify HMAC: sort remaining params, join as k=v&..., HMAC-SHA256 with secret.
  const pairs = [];
  sp.forEach((v, k) => { if (k !== "hmac" && k !== "signature") pairs.push([k, v]); });
  pairs.sort((a, b) => a[0].localeCompare(b[0]));
  const message = pairs.map(([k, v]) => `${k}=${v}`).join("&");
  const digest = crypto.createHmac("sha256", secret).update(message).digest("hex");
  const valid =
    digest.length === hmac.length &&
    crypto.timingSafeEqual(Buffer.from(digest, "utf8"), Buffer.from(hmac, "utf8"));
  if (!valid) return fail("hmac_failed");

  // Exchange the code for a permanent access token.
  let token, scope;
  try {
    const r = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ client_id: apiKey, client_secret: secret, code }),
    });
    const data = await r.json();
    token = data.access_token;
    scope = data.scope;
  } catch {
    return fail("exchange_error");
  }
  if (!token) return fail("exchange_failed");

  const res = NextResponse.redirect(`${origin}/admin/integrations?shopify=connected`);
  res.cookies.set("shopify_token", token, { httpOnly: true, sameSite: "lax", secure: true, path: "/", maxAge: 60 * 60 * 24 * 30 });
  res.cookies.set("shopify_shop", shop, { httpOnly: false, sameSite: "lax", secure: true, path: "/", maxAge: 60 * 60 * 24 * 30 });
  if (scope) res.cookies.set("shopify_scope", scope, { httpOnly: false, sameSite: "lax", secure: true, path: "/", maxAge: 60 * 60 * 24 * 30 });
  res.cookies.set("shopify_state", "", { path: "/", maxAge: 0 });
  return res;
}
