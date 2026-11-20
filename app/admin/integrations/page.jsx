"use client";

import { useState } from "react";
import { Section } from "@/components/AdminUI";

const INITIAL = [
  {
    id: "shopify",
    name: "Shopify",
    tag: "Store",
    logo: "🛍️",
    tint: "#95BF47",
    headline: "Connect with the store",
    desc: "Sync products, orders and live sales from your moodytiger Shopify store. Once connected, revenue and store-visit analytics update automatically.",
    cta: "Connect store",
    featured: true,
  },
  {
    id: "instagram",
    name: "Instagram",
    tag: "Social",
    logo: "📸",
    tint: "#E1306C",
    headline: "Automate posting",
    desc: "Publish Creator Studio campaigns straight to Instagram and pull reach, engagement and follower growth back into your reports.",
    cta: "Connect account",
  },
  {
    id: "tiktok",
    name: "TikTok",
    tag: "Social",
    logo: "🎵",
    tint: "#010101",
    headline: "Schedule short-form",
    desc: "Auto-post reels and track views, saves and shares from TikTok inside the dashboard.",
    cta: "Connect account",
  },
  {
    id: "ga",
    name: "Google Analytics",
    tag: "Analytics",
    logo: "📈",
    tint: "#E8710A",
    headline: "Web & SEO traffic",
    desc: "Bring in sessions, keyword and source data to sharpen the Overview and Campaign Reports.",
    cta: "Connect",
  },
];

export default function IntegrationsPage() {
  const [items, setItems] = useState(INITIAL.map((x) => ({ ...x, connected: false })));

  function toggle(id) {
    setItems((l) => l.map((x) => (x.id === id ? { ...x, connected: !x.connected } : x)));
  }

  const connected = items.filter((x) => x.connected).length;
  const featured = items.find((x) => x.featured);
  const rest = items.filter((x) => !x.featured);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-white p-4 text-sm shadow-card">
        <span className="chip bg-sky/15 text-sky">Beta</span>
        <span className="text-mute">
          {connected} of {items.length} connected. Connecting a source keeps your analytics and marketing material in sync — no manual exports.
        </span>
      </div>

      {/* featured: Shopify */}
      {featured && (
        <div className="card mb-5 overflow-hidden p-0">
          <div className="grid gap-0 md:grid-cols-[1.4fr_1fr]">
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl" style={{ background: `${featured.tint}1a` }}>
                  {featured.logo}
                </span>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-mute">{featured.tag}</div>
                  <div className="display text-2xl text-ink">{featured.headline}</div>
                </div>
              </div>
              <p className="mt-4 max-w-md text-sm text-mute">{featured.desc}</p>
              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={() => toggle(featured.id)}
                  className={featured.connected ? "pill-ghost" : "pill-dark"}
                >
                  {featured.connected ? "✓ Store connected" : `${featured.cta} →`}
                </button>
                <a href="https://www.shopify.com" target="_blank" rel="noreferrer" className="text-sm font-semibold text-sky hover:underline">
                  moodytiger.com
                </a>
              </div>
            </div>
            <div className="flex items-center justify-center border-t border-line bg-surface p-6 md:border-l md:border-t-0">
              <ConnectVisual connected={featured.connected} tint={featured.tint} logo={featured.logo} />
            </div>
          </div>
        </div>
      )}

      {/* other integrations */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((x) => (
          <div key={x.id} className="card flex flex-col p-5">
            <div className="flex items-start justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl text-xl" style={{ background: `${x.tint}1a` }}>
                {x.logo}
              </span>
              <span className={`chip ${x.connected ? "bg-lime/15 text-lime" : "bg-ink/5 text-mute"}`}>
                {x.connected ? "Connected" : "Not connected"}
              </span>
            </div>
            <div className="mt-3 font-bold text-ink">{x.name}</div>
            <div className="text-xs font-semibold uppercase tracking-wide text-mute">{x.tag}</div>
            <p className="mt-2 flex-1 text-sm text-mute">{x.desc}</p>
            <button
              onClick={() => toggle(x.id)}
              className={`mt-4 w-full ${x.connected ? "pill-ghost" : "pill-primary"}`}
            >
              {x.connected ? "Disconnect" : x.cta}
            </button>
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-mute">
        Connections are set up but not yet live — wiring real Shopify / Instagram OAuth is the next step.
      </p>
    </div>
  );
}

function ConnectVisual({ connected, tint, logo }) {
  return (
    <div className="flex items-center gap-4">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-card" style={{ background: `${tint}1a` }}>
        {logo}
      </span>
      <div className="flex items-center gap-1">
        <span className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-lime" : "bg-ink/20"}`} />
        <span className={`h-1.5 w-6 rounded-full ${connected ? "bg-lime" : "bg-ink/20"}`} />
        <span className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-lime" : "bg-ink/20"}`} />
      </div>
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-2xl shadow-card">🐯</span>
    </div>
  );
}
