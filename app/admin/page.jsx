"use client";

import { useEffect, useState } from "react";
import { Stat, LineChart, HBars, Donut } from "@/components/Charts";
import { DEMO_TREND, DEMO_CHANNELS, DEMO_TIER_SPLIT, DEMO_TOP_REWARDS } from "@/lib/demo";
import { getKpis } from "@/lib/analytics";
import { hasSupabase } from "@/lib/supabaseClient";

export default function AdminOverview() {
  const [k, setK] = useState(null);
  useEffect(() => { getKpis().then(setK); }, []);

  return (
    <div>
      <Header title="Overview" subtitle="How moodytiger is turning Bay Area awareness into sales." />

      {!k ? (
        <div className="py-20 text-center text-mute">Loading analytics…</div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Stat label="Revenue (30d)" value={"$" + (k.revenue / 1000).toFixed(1) + "k"} delta={k.revenueDelta} />
            <Stat label="Miles Club members" value={k.members.toLocaleString()} delta={k.membersDelta} />
            <Stat label="Web visits" value={(k.webVisits / 1000).toFixed(1) + "k"} delta={k.webVisitsDelta} />
            <Stat label="Store visits (Bay Area)" value={k.storeVisits.toLocaleString()} delta={k.storeVisitsDelta} />
            <Stat label="Campaign reach" value={(k.campaignReach / 1000).toFixed(0) + "k"} delta={k.campaignReachDelta} />
            <Stat label="Miles issued" value={(k.milesIssued / 1000).toFixed(0) + "k"} delta={k.milesDelta} />
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
            <div className="card p-6">
              <ChartHead title="Sales vs local awareness" legend={[["Sales ($)", "#FF6B35"], ["Awareness", "#2DA7FF"]]} />
              <LineChart data={DEMO_TREND} keys={["sales", "awareness"]} colors={["#FF6B35", "#2DA7FF"]} />
            </div>
            <div className="card p-6">
              <ChartHead title="Members by tier" />
              <div className="mt-3"><Donut data={DEMO_TIER_SPLIT} /></div>
            </div>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <div className="card p-6">
              <ChartHead title="Conversions by channel" />
              <div className="mt-3"><HBars data={DEMO_CHANNELS} color="#2DA7FF" /></div>
            </div>
            <div className="card p-6">
              <ChartHead title="Top reward redemptions" />
              <div className="mt-3"><HBars data={DEMO_TOP_REWARDS} color="#FF6B35" /></div>
            </div>
          </div>

          {!hasSupabase && (
            <p className="mt-6 text-center text-xs text-mute">
              Showing seeded demo analytics. Connect Supabase and live data flows in automatically.
            </p>
          )}
        </>
      )}
    </div>
  );
}

export function Header({ title, subtitle, right }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="display text-3xl text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-mute">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

function ChartHead({ title, legend }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-bold uppercase tracking-widest text-tiger">{title}</h3>
      {legend && (
        <div className="flex gap-3">
          {legend.map(([l, c]) => (
            <span key={l} className="flex items-center gap-1.5 text-xs text-mute">
              <span className="h-2 w-2 rounded-full" style={{ background: c }} /> {l}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
