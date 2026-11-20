"use client";

import { useEffect, useRef, useState } from "react";
import { PageActions } from "@/components/AdminUI";
import { getInfluencers } from "@/lib/analytics";
import { AGENT_STEPS, draftOutreachEmail } from "@/lib/demo";

const STATUS = {
  new: "bg-ink/10 text-ink/60",
  contacted: "bg-sun/20 text-sun",
  replied: "bg-sky/20 text-sky",
  partnered: "bg-green-500/20 text-green-400",
};

function fmt(n) {
  if (n == null) return "—";
  return n >= 1000 ? (n / 1000).toFixed(0) + "K" : n;
}

export default function AdminInfluencers() {
  const [list, setList] = useState([]);
  const [agentOpen, setAgentOpen] = useState(false);
  const [log, setLog] = useState([]);
  const [running, setRunning] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [platform, setPlatform] = useState("All");
  const [draft, setDraft] = useState(null); // {inf, body}
  const [source, setSource] = useState(null); // "serpapi" | "demo"
  const timers = useRef([]);

  useEffect(() => {
    getInfluencers().then((d) => setList(d.map((x) => ({ ...x, status: x.status || "new" }))));
  }, []);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function runAgent() {
    setAgentOpen(true);
    setRunning(true);
    setRevealed(false);
    setLog([]);
    setSource(null);

    // Kick off the real SerpAPI search in parallel with the step animation.
    const search = fetch("/api/discover", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ niche: "kids family mom activewear", location: "Bay Area San Francisco" }),
    }).then((r) => r.json()).catch(() => ({ ok: false, results: [] }));

    let t = 0;
    AGENT_STEPS.forEach((step) => {
      t += step.ms;
      timers.current.push(setTimeout(() => setLog((l) => [...l, step.label]), t));
    });

    timers.current.push(setTimeout(async () => {
      const res = await search;
      if (res.ok && res.results && res.results.length) {
        setList(res.results.map((x) => ({ ...x, status: x.status || "new" })));
        setSource("serpapi");
      } else {
        setSource("demo");
      }
      setRunning(false);
      setRevealed(true);
    }, t + 500));
  }

  function setStatus(handle, status) {
    setList((l) => l.map((x) => (x.handle === handle ? { ...x, status } : x)));
  }

  const shown = list.filter((x) => platform === "All" || x.platform === platform);
  const counts = {
    new: list.filter((x) => x.status === "new").length,
    contacted: list.filter((x) => x.status === "contacted").length,
    replied: list.filter((x) => x.status === "replied").length,
    partnered: list.filter((x) => x.status === "partnered").length,
  };

  return (
    <div>
      <PageActions>
        <button onClick={runAgent} className="pill-primary text-sm">
          ✨ Run discovery agent
        </button>
      </PageActions>

      {/* pipeline */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Object.entries(counts).map(([k, v]) => (
          <div key={k} className="card p-4">
            <div className="text-xs uppercase tracking-widest text-ink/45">{k}</div>
            <div className="display mt-1 text-2xl text-ink">{v}</div>
          </div>
        ))}
      </div>

      {/* agent panel */}
      {agentOpen && (
        <div className="mt-5 card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-widest text-tiger">
              Discovery agent {running ? "· working…" : "· done"}
            </h3>
            <button onClick={() => setAgentOpen(false)} className="text-sm text-ink/40 hover:text-ink">✕</button>
          </div>
          <div className="mt-4 space-y-2 font-mono text-sm">
            {log.map((line, i) => (
              <div key={i} className="flex items-start gap-2 text-ink/80">
                <span className="text-green-400">✓</span> {line}
              </div>
            ))}
            {running && (
              <div className="flex items-center gap-2 text-ink/50">
                <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-tiger border-t-transparent" />
                searching the web…
              </div>
            )}
          </div>
          {revealed && source && source !== "demo" && (
            <p className="mt-4 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm text-ink">
              🔎 Found {list.length} real creators via {source === "apollo" ? "Apollo" : source === "serpapi" ? "web search" : "Apollo + web search"}. Open a profile to verify, then draft outreach.
            </p>
          )}
          {revealed && source === "demo" && (
            <p className="mt-4 rounded-xl border border-sun/40 bg-sun/10 px-4 py-2 text-sm text-ink">
              Showing sample creators — add an <span className="font-mono">APOLLO_API_KEY</span> (and/or <span className="font-mono">SERPAPI_KEY</span>) in Vercel to pull live results.
            </p>
          )}
        </div>
      )}

      {/* filter */}
      <div className="mt-5 flex items-center gap-2">
        <span className="text-xs uppercase tracking-widest text-ink/40">Platform</span>
        {["All", "Instagram", "TikTok", "YouTube"].map((p) => (
          <button key={p} onClick={() => setPlatform(p)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${platform === p ? "bg-tiger text-white" : "border border-ink/10 text-ink/60 hover:text-ink"}`}>
            {p}
          </button>
        ))}
      </div>

      {/* table */}
      <div className="mt-3 card overflow-hidden">
        <div className="scroll-thin overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-ink/10 text-left text-xs uppercase tracking-wide text-ink/45">
              <tr>
                <th className="p-4">Creator</th>
                <th className="p-4">Platform</th>
                <th className="p-4">Followers</th>
                <th className="p-4">Engage</th>
                <th className="p-4">City</th>
                <th className="p-4">Fit</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Outreach</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((x) => (
                <tr key={x.handle} className="border-b border-ink/5 align-top">
                  <td className="p-4">
                    <div className="font-semibold text-ink">{x.name}</div>
                    <div className="text-xs text-tiger">{x.handle}</div>
                    <div className="mt-1 max-w-[260px] text-xs text-ink/45">{x.notes}</div>
                    {x.profileUrl && (
                      <a href={x.profileUrl} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs font-semibold text-sky hover:underline">
                        View profile ↗
                      </a>
                    )}
                  </td>
                  <td className="p-4 text-ink/70">{x.platform}</td>
                  <td className="p-4 text-ink/70">{fmt(x.followers)}</td>
                  <td className="p-4 text-ink/70">{x.er != null ? x.er + "%" : "—"}</td>
                  <td className="p-4 text-ink/60">{x.city}</td>
                  <td className="p-4">
                    <span className={`rounded-md px-2 py-1 text-xs font-bold ${x.fit >= 90 ? "bg-green-500/20 text-green-400" : x.fit >= 75 ? "bg-sun/20 text-sun" : "bg-ink/10 text-ink/50"}`}>
                      {x.fit}
                    </span>
                  </td>
                  <td className="p-4">
                    <select
                      value={x.status}
                      onChange={(e) => setStatus(x.handle, e.target.value)}
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize outline-none ${STATUS[x.status]}`}
                    >
                      {Object.keys(STATUS).map((s) => <option key={s} value={s} className="bg-white text-ink">{s}</option>)}
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setDraft({ inf: x, body: draftOutreachEmail(x) })}
                      className="rounded-full bg-tiger/20 px-3 py-1 text-xs font-semibold text-tiger hover:bg-tiger/30"
                    >
                      Draft email
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* draft modal */}
      {draft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setDraft(null)}>
          <div className="card w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-ink">Outreach to {draft.inf.name}</h3>
                <div className="text-xs text-tiger">{draft.inf.handle} · fit {draft.inf.fit}</div>
              </div>
              <button onClick={() => setDraft(null)} className="text-ink/40 hover:text-ink">✕</button>
            </div>
            <textarea
              rows={14}
              value={draft.body}
              onChange={(e) => setDraft({ ...draft, body: e.target.value })}
              className="mt-4 w-full rounded-xl border border-ink/10 bg-cloud p-4 font-mono text-xs text-ink/90 outline-none focus:border-tiger"
            />
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-ink/40">Agent-drafted · edit before sending</span>
              <div className="flex gap-2">
                <button onClick={() => setDraft(null)} className="pill-ghost text-sm">Cancel</button>
                <button
                  onClick={() => { setStatus(draft.inf.handle, "contacted"); setDraft(null); }}
                  className="pill-primary text-sm"
                >
                  Send outreach
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
