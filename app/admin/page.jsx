"use client";

import { useEffect, useState } from "react";
import { Stat, LineChart, Donut } from "@/components/Charts";
import { Section } from "@/components/AdminUI";
import { DEMO_TREND, DEMO_SOURCES, DEMO_CAMPAIGNS, DEMO_KEYWORDS } from "@/lib/demo";
import { getKpis } from "@/lib/analytics";
import { hasSupabase } from "@/lib/supabaseClient";

export default function AdminOverview() {
  const [k, setK] = useState(null);
  useEffect(() => { getKpis().then(setK); }, []);

  if (!k) return <div className="py-24 text-center text-mute">Loading analytics…</div>;

  return (
    <div>
      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon="💰" tint="#FF6B35" label="Revenue (30d)" value={"$" + (k.revenue / 1000).toFixed(1) + "k"} delta={k.revenueDelta} />
        <Stat icon="🎟️" tint="#5BC236" label="Miles members" value={k.members.toLocaleString()} delta={k.membersDelta} />
        <Stat icon="🌐" tint="#2DA7FF" label="Web visits" value={(k.webVisits / 1000).toFixed(1) + "k"} delta={k.webVisitsDelta} />
        <Stat icon="📍" tint="#8B5CF6" label="Store visits" value={k.storeVisits.toLocaleString()} delta={k.storeVisitsDelta} />
      </div>

      {/* trend + source distribution */}
      <div className="mt-5 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <Section
          title="Sales vs local awareness"
          right={
            <div className="flex gap-3">
              {[["Sales ($)", "#FF6B35"], ["Awareness", "#2DA7FF"]].map(([l, c]) => (
                <span key={l} className="flex items-center gap-1.5 text-xs text-mute">
                  <span className="h-2 w-2 rounded-full" style={{ background: c }} /> {l}
                </span>
              ))}
            </div>
          }
        >
          <LineChart
            data={DEMO_TREND}
            keys={["sales", "awareness"]}
            colors={["#FF6B35", "#2DA7FF"]}
            labels={{ sales: "Sales ($)", awareness: "Awareness" }}
          />
        </Section>

        <Section title="Source distribution">
          <div className="mt-2"><Donut data={DEMO_SOURCES} centerLabel={DEMO_SOURCES.length} sub="sources" /></div>
        </Section>
      </div>

      {/* tables */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Section title="Top campaigns" pad="p-0">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-mute">
              <tr>
                <th className="px-6 pb-2 pt-5">Campaign</th>
                <th className="px-4 pb-2 pt-5">Channel</th>
                <th className="px-4 pb-2 pt-5 text-right">Reach</th>
                <th className="px-6 pb-2 pt-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_CAMPAIGNS.map((c) => (
                <tr key={c.id} className="border-t border-line">
                  <td className="px-6 py-3 font-medium text-ink">{c.name}</td>
                  <td className="px-4 py-3 text-mute">{c.channel}</td>
                  <td className="px-4 py-3 text-right text-ink/70">{c.sent ? (c.sent / 1000).toFixed(0) + "k" : "—"}</td>
                  <td className="px-6 py-3 text-right">
                    <span className={`chip ${c.status === "Posted" ? "bg-lime/15 text-lime" : "bg-ink/10 text-mute"}`}>{c.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <Section title="Top keywords" pad="p-0">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-mute">
              <tr>
                <th className="px-6 pb-2 pt-5">Keyword</th>
                <th className="px-4 pb-2 pt-5 text-right">Visits</th>
                <th className="px-6 pb-2 pt-5 text-right">Trend</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_KEYWORDS.map((kw) => (
                <tr key={kw.keyword} className="border-t border-line">
                  <td className="px-6 py-3 font-medium text-ink">{kw.keyword}</td>
                  <td className="px-4 py-3 text-right text-ink/70">{kw.visits.toLocaleString()}</td>
                  <td className="px-6 py-3 text-right">
                    <span className={`font-semibold ${kw.trend >= 0 ? "text-lime" : "text-tiger"}`}>
                      {kw.trend >= 0 ? "▲" : "▼"} {Math.abs(kw.trend)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      </div>

      {!hasSupabase && (
        <p className="mt-6 text-center text-xs text-mute">
          Showing seeded demo analytics. Connect Shopify &amp; Supabase on the Integrations page and live data flows in automatically.
        </p>
      )}
    </div>
  );
}
