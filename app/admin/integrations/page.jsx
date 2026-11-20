"use client";

import { useEffect, useState } from "react";

const MSG = {
  "shopify=connected": { ok: true, text: "Shopify store connected ✓" },
  "shopify=not_configured": { ok: false, text: "Add SHOPIFY_API_KEY & SHOPIFY_API_SECRET in your env to go live." },
  "shopify=bad_shop": { ok: false, text: "Enter a valid your-store.myshopify.com domain." },
  "shopify=state_mismatch": { ok: false, text: "Shopify security check failed — try again." },
  "shopify=hmac_failed": { ok: false, text: "Shopify signature check failed." },
  "shopify=exchange_failed": { ok: false, text: "Couldn't retrieve a Shopify access token." },
  "shopify=exchange_error": { ok: false, text: "Shopify token exchange errored — check credentials." },
  "instagram=connected": { ok: true, text: "Instagram account connected ✓" },
  "instagram=not_configured": { ok: false, text: "Add INSTAGRAM_APP_ID & INSTAGRAM_APP_SECRET in your env to go live." },
  "instagram=denied": { ok: false, text: "Instagram authorization was declined." },
  "instagram=state_mismatch": { ok: false, text: "Instagram security check failed — try again." },
  "instagram=exchange_failed": { ok: false, text: "Couldn't retrieve an Instagram token." },
};

export default function IntegrationsPage() {
  const [shop, setShop] = useState("");
  const [sf, setSf] = useState({ configured: false, connected: false, shopName: null, shop: null });
  const [ig, setIg] = useState({ configured: false, connected: false, username: null });
  const [demo, setDemo] = useState({ tiktok: false, ga: false });
  const [flash, setFlash] = useState(null);

  useEffect(() => {
    // surface OAuth result from the querystring
    const q = window.location.search.replace(/^\?/, "");
    const hit = Object.keys(MSG).find((k) => q.includes(k));
    if (hit) {
      setFlash(MSG[hit]);
      window.history.replaceState({}, "", window.location.pathname);
    }
    fetch("/api/shopify/status").then((r) => r.json()).then(setSf).catch(() => {});
    fetch("/api/instagram/status").then((r) => r.json()).then(setIg).catch(() => {});
  }, []);

  const connectShopify = () => {
    window.location.href = "/api/shopify/start?shop=" + encodeURIComponent(shop.trim());
  };
  const connectInstagram = () => {
    window.location.href = "/api/instagram/start";
  };

  const connectedCount = (sf.connected ? 1 : 0) + (ig.connected ? 1 : 0) + (demo.tiktok ? 1 : 0) + (demo.ga ? 1 : 0);

  return (
    <div>
      {flash && (
        <div className={`mb-4 rounded-2xl border px-4 py-3 text-sm ${flash.ok ? "border-lime/40 bg-lime/10 text-ink" : "border-sun/40 bg-sun/10 text-ink/80"}`}>
          {flash.text}
        </div>
      )}

      <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-white p-4 text-sm shadow-card">
        <span className="chip bg-sky/15 text-sky">Live OAuth</span>
        <span className="text-mute">
          {connectedCount} connected. Shopify &amp; Instagram use real OAuth — once a store/account is linked, its data flows into your analytics.
        </span>
      </div>

      {/* Shopify — featured */}
      <div className="card mb-5 overflow-hidden p-0">
        <div className="grid gap-0 md:grid-cols-[1.5fr_1fr]">
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl" style={{ background: "#95BF471a" }}>🛍️</span>
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-mute">
                  Store
                  <StatusDot configured={sf.configured} connected={sf.connected} />
                </div>
                <div className="display text-2xl text-ink">Connect with the store</div>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm text-mute">
              Link your moodytiger Shopify store via OAuth. Once connected, revenue and store-visit
              analytics update automatically.
            </p>

            {sf.connected ? (
              <div className="mt-6 flex items-center gap-3">
                <span className="pill bg-lime/15 text-lime">✓ Connected{sf.shopName ? ` · ${sf.shopName}` : sf.shop ? ` · ${sf.shop}` : ""}</span>
                <a href="/api/shopify/start?shop=" className="text-sm font-semibold text-sky hover:underline" onClick={(e) => { e.preventDefault(); }}>Synced</a>
              </div>
            ) : (
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <input
                  value={shop}
                  onChange={(e) => setShop(e.target.value)}
                  placeholder="your-store.myshopify.com"
                  className="field max-w-[260px]"
                  onKeyDown={(e) => e.key === "Enter" && connectShopify()}
                />
                <button onClick={connectShopify} className="pill-dark">Connect store →</button>
              </div>
            )}
            {!sf.configured && (
              <p className="mt-3 text-xs text-mute">
                Needs <span className="font-mono">SHOPIFY_API_KEY</span> + <span className="font-mono">SHOPIFY_API_SECRET</span> in your env, and this app’s
                <span className="font-mono"> /api/shopify/callback</span> set as the redirect URL.
              </p>
            )}
          </div>
          <div className="flex items-center justify-center border-t border-line bg-surface p-6 md:border-l md:border-t-0">
            <ConnectVisual connected={sf.connected} tint="#95BF47" logo="🛍️" />
          </div>
        </div>
      </div>

      {/* others */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Instagram — real OAuth */}
        <div className="card flex flex-col p-5">
          <div className="flex items-start justify-between">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl text-xl" style={{ background: "#E1306C1a" }}>📸</span>
            <span className={`chip ${ig.connected ? "bg-lime/15 text-lime" : "bg-ink/5 text-mute"}`}>{ig.connected ? "Connected" : "Not connected"}</span>
          </div>
          <div className="mt-3 font-bold text-ink">Instagram</div>
          <div className="text-xs font-semibold uppercase tracking-wide text-mute">Social · automate posting</div>
          <p className="mt-2 flex-1 text-sm text-mute">
            Publish Creator Studio campaigns to Instagram and pull reach &amp; engagement back into reports.
          </p>
          {ig.connected ? (
            <div className="mt-4 w-full pill bg-lime/15 text-lime">✓ {ig.username ? `@${ig.username}` : "Connected"}</div>
          ) : (
            <button onClick={connectInstagram} className="pill-primary mt-4 w-full">Connect account</button>
          )}
          {!ig.configured && (
            <p className="mt-2 text-[11px] text-mute">Needs <span className="font-mono">INSTAGRAM_APP_ID</span> + <span className="font-mono">INSTAGRAM_APP_SECRET</span>.</p>
          )}
        </div>

        {/* TikTok — demo */}
        <DemoCard logo="🎵" tint="#010101" name="TikTok" tag="Social · schedule short-form"
          desc="Auto-post reels and track views, saves and shares." on={demo.tiktok} onToggle={() => setDemo({ ...demo, tiktok: !demo.tiktok })} />

        {/* Google Analytics — demo */}
        <DemoCard logo="📈" tint="#E8710A" name="Google Analytics" tag="Analytics · web & SEO"
          desc="Bring in sessions, keyword and source data for reports." on={demo.ga} onToggle={() => setDemo({ ...demo, ga: !demo.ga })} />
      </div>

      <p className="mt-6 text-center text-xs text-mute">
        Shopify &amp; Instagram run the real authorization-code OAuth flow. TikTok &amp; Google Analytics are placeholders for now.
      </p>
    </div>
  );
}

function StatusDot({ configured, connected }) {
  const c = connected ? "#5BC236" : configured ? "#FFC53D" : "#C9CCD2";
  const label = connected ? "connected" : configured ? "ready" : "needs keys";
  return (
    <span className="inline-flex items-center gap-1 normal-case tracking-normal text-[11px] text-mute">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: c }} /> {label}
    </span>
  );
}

function DemoCard({ logo, tint, name, tag, desc, on, onToggle }) {
  return (
    <div className="card flex flex-col p-5">
      <div className="flex items-start justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl text-xl" style={{ background: `${tint}1a` }}>{logo}</span>
        <span className={`chip ${on ? "bg-lime/15 text-lime" : "bg-ink/5 text-mute"}`}>{on ? "Connected" : "Not connected"}</span>
      </div>
      <div className="mt-3 font-bold text-ink">{name}</div>
      <div className="text-xs font-semibold uppercase tracking-wide text-mute">{tag}</div>
      <p className="mt-2 flex-1 text-sm text-mute">{desc}</p>
      <button onClick={onToggle} className={`mt-4 w-full ${on ? "pill-ghost" : "pill-primary"}`}>
        {on ? "Disconnect" : "Connect"}
      </button>
    </div>
  );
}

function ConnectVisual({ connected, tint, logo }) {
  return (
    <div className="flex items-center gap-4">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-card" style={{ background: `${tint}1a` }}>{logo}</span>
      <div className="flex items-center gap-1">
        <span className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-lime" : "bg-ink/20"}`} />
        <span className={`h-1.5 w-6 rounded-full ${connected ? "bg-lime" : "bg-ink/20"}`} />
        <span className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-lime" : "bg-ink/20"}`} />
      </div>
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-2xl shadow-card">🐯</span>
    </div>
  );
}
