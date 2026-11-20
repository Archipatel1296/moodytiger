import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Reports whether Instagram is configured (env present) and connected (token cookie).
// When connected, it reads the IG profile once to prove the token works.
export async function GET(request) {
  const configured = Boolean(process.env.INSTAGRAM_APP_ID && process.env.INSTAGRAM_APP_SECRET);
  const token = request.cookies.get("ig_token")?.value || null;

  let username = null;
  if (token) {
    try {
      const r = await fetch(`https://graph.instagram.com/me?fields=username&access_token=${encodeURIComponent(token)}`);
      if (r.ok) {
        const d = await r.json();
        username = d?.username || null;
      }
    } catch {}
  }

  return NextResponse.json({ configured, connected: Boolean(token), username });
}
