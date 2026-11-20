import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Reports whether Shopify is configured (env present) and connected (token cookie).
// When connected, it calls the Admin API once to prove the token works.
export async function GET(request) {
  const configured = Boolean(process.env.SHOPIFY_API_KEY && process.env.SHOPIFY_API_SECRET);
  const token = request.cookies.get("shopify_token")?.value || null;
  const shop = request.cookies.get("shopify_shop")?.value || null;

  let shopName = null;
  if (token && shop) {
    try {
      const r = await fetch(`https://${shop}/admin/api/2024-10/shop.json`, {
        headers: { "X-Shopify-Access-Token": token, Accept: "application/json" },
      });
      if (r.ok) {
        const d = await r.json();
        shopName = d?.shop?.name || null;
      }
    } catch {}
  }

  return NextResponse.json({
    configured,
    connected: Boolean(token),
    shop,
    shopName,
  });
}
