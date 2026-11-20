"use client";

import { useMemo, useState } from "react";
import { Stat } from "@/components/Charts";
import { DEMO_CAMPAIGN_REPORTS } from "@/lib/demo";

const CHANNELS = ["All", "Instagram", "TikTok", "Email"];
const COLS = [
  { key: "campaign", label: "Campaign", num: false },
  { key: "channel", label: "Channel", num: false },
  { key: "visits", label: "Visits", num: true },
  { key: "avgTime", label: "Avg time", num: false },
  { key: "ctr", label: "CT rate", num: true },
  { key: "conv", label: "Conv. rate", num: true },
  { key: "seo", label: "SEO", num: true },
  { key: "date", label: "Date", num: false },
];

function seoColor(v) {
  if (v >= 90) return "bg-lime/15 text-lime";
  if (v >= 80) return "bg-sun/20 text-sun";
  return "bg-tiger/15 text-tiger";
}

export default function ReportsPage() {
  const [channel, setChannel] = useState("All");
  const [sort, setSort] = useState({ key: "visits", dir: "desc" });

  const rows = useMemo(() => {
    let r = DEMO_CAMPAIGN_REPORTS.filter((x) => channel === "All" || x.channel === channel);
    const { key, dir } = sort;
    const num = COLS.find((c) => c.key === key)?.num;
    r = [...r].sort((a, b) => {
      const av = a[key], bv = b[key];
      const cmp = num ? av - bv : String(av).localeCompare(String(bv));
      return dir === "asc" ? cmp : -cmp;
    });
    return r;
  }, [channel, sort]);

  function setSortKey(key) {
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" }));
  }

  function download() {
    const header = COLS.map((c) => c.label).join(",");
    const body = rows.map((r) => COLS.map((c) => r[c.key]).join(",")).join("\n");
    const blob = new Blob([header + "\n" + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "moodytiger-campaign-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const totalVisits = rows.reduce((s, r) => s + r.visits, 0);
  const avgConv = rows.length ? (rows.reduce((s, r) => s + r.conv, 0) / rows.length).toFixed(1) : 0;
  const avgSeo = rows.length ? Math.round(rows.reduce((s, r) => s + r.seo, 0) / rows.length) : 0;

  return (
    <div>
      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <Stat icon="👣" tint="#2DA7FF" label="Total visits" value={(totalVisits / 1000).toFixed(1) + "k"} />
        <Stat icon="🎯" tint="#FF6B35" label="Avg conversion" value={avgConv + "%"} />
        <Stat icon="🔍" tint="#5BC236" label="Avg SEO score" value={avgSeo} />
      </div>

      <div className="card overflow-hidden p-0">
        {/* toolbar */}
        <div className="flex flex-wrap items-center gap-3 border-b border-line p-4">
          <div className="flex items-center gap-1.5">
            {CHANNELS.map((c) => (
              <button
                key={c}
                onClick={() => setChannel(c)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  channel === c ? "bg-tiger text-white" : "border border-line text-mute hover:text-ink"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <button onClick={download} className="pill-ghost ml-auto text-sm">⤓ Download CSV</button>
        </div>

        {/* table */}
        <div className="scroll-thin overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-mute">
              <tr>
                {COLS.map((c) => (
                  <th
                    key={c.key}
                    onClick={() => setSortKey(c.key)}
                    className={`cursor-pointer select-none px-4 py-3 hover:text-ink ${c.num ? "text-right" : ""}`}
                  >
                    {c.label}
                    {sort.key === c.key && <span className="ml-1 text-tiger">{sort.dir === "asc" ? "▲" : "▼"}</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t border-line">
                  <td className="px-4 py-3 font-medium text-ink">{r.campaign}</td>
                  <td className="px-4 py-3 text-mute">{r.channel}</td>
                  <td className="px-4 py-3 text-right text-ink/70">{r.visits.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-ink/70">{r.avgTime}</td>
                  <td className="px-4 py-3 text-right text-ink/70">{r.ctr}%</td>
                  <td className="px-4 py-3 text-right text-ink/70">{r.conv}%</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`rounded-md px-2 py-1 text-xs font-bold ${seoColor(r.seo)}`}>{r.seo}</span>
                  </td>
                  <td className="px-4 py-3 text-mute">{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
