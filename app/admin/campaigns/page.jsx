"use client";

import { useEffect, useState } from "react";
import { Header } from "@/app/admin/page";
import { getCampaigns, saveCampaign } from "@/lib/analytics";
import { generatePlan, GOALS } from "@/lib/campaigngen";
import { hasSupabase } from "@/lib/supabaseClient";

const AUDIENCES = ["Bay Area parents", "All followers", "Miles members", "Lapsed shoppers", "New parents"];
const AUD_SIZE = { "Bay Area parents": 18000, "All followers": 82000, "Miles members": 2140, "Lapsed shoppers": 3200, "New parents": 5400 };

export default function CreatorStudio() {
  const [rows, setRows] = useState([]);
  const [designer, setDesigner] = useState(false);
  const [flash, setFlash] = useState("");

  async function load() { setRows(await getCampaigns()); }
  useEffect(() => { load(); }, []);

  async function schedule(plan, when) {
    for (const p of plan.posts) {
      // eslint-disable-next-line no-await-in-loop
      const saved = await saveCampaign({
        name: `${plan.title} · ${p.platform}`,
        channel: p.platform,
        audience: plan.audience.segment,
        body: p.caption,
        sent: 0, opened: 0, redeemed: 0,
        status: when === "now" ? "Posted" : "Scheduled",
        date: when === "now" ? new Date().toISOString().slice(0, 10) : "—",
      });
      setRows((r) => [saved, ...r]);
    }
    setDesigner(false);
    setFlash(when === "now" ? "✅ Posted to the connected channels." : "🗓️ Scheduled — added to the calendar.");
    setTimeout(() => setFlash(""), 4000);
  }

  return (
    <div>
      <Header
        title="Creator Studio"
        subtitle="Design social campaigns, generate creatives, and post them."
        right={<button onClick={() => setDesigner(true)} className="pill-primary text-sm">✨ Design a campaign</button>}
      />

      {flash && <div className="mb-4 rounded-xl2 border border-lime/40 bg-lime/10 px-4 py-3 text-sm text-ink">{flash}</div>}

      {/* quick templates */}
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {GOALS.map((g) => (
          <button key={g.id} onClick={() => setDesigner(true)} className="card p-4 text-left transition hover:border-tiger">
            <div className="text-2xl">{["🧥", "🎒", "📍", "🎾", "🎟️", "🎁"][GOALS.indexOf(g)]}</div>
            <div className="mt-2 text-sm font-semibold text-ink">{g.label}</div>
          </button>
        ))}
      </div>

      {/* scheduled / posted */}
      <div className="mt-6 card overflow-hidden">
        <div className="border-b border-ink/10 p-4 text-sm font-bold uppercase tracking-widest text-tiger">
          Scheduled & posted
        </div>
        <div className="scroll-thin overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-mute">
              <tr>
                <th className="p-4">Campaign</th><th className="p-4">Channel</th>
                <th className="p-4">Audience</th><th className="p-4">Reach</th>
                <th className="p-4">Engaged</th><th className="p-4">Conv.</th><th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c, i) => (
                <tr key={c.id || i} className="border-t border-ink/5">
                  <td className="p-4 font-medium text-ink">{c.name}</td>
                  <td className="p-4 text-ink/70">{c.channel}</td>
                  <td className="p-4 text-mute">{c.audience}</td>
                  <td className="p-4 text-ink/70">{c.sent ? c.sent.toLocaleString() : "—"}</td>
                  <td className="p-4 text-ink/70">{c.opened ? c.opened.toLocaleString() : "—"}</td>
                  <td className="p-4 text-tiger">{c.redeemed || "—"}</td>
                  <td className="p-4">
                    <span className={`chip ${c.status === "Posted" ? "bg-lime/20 text-ink" : c.status === "Scheduled" ? "bg-sky/20 text-ink" : "bg-ink/10 text-mute"}`}>{c.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {designer && <Designer onClose={() => setDesigner(false)} onSchedule={schedule} />}
    </div>
  );
}

function Designer({ onClose, onSchedule }) {
  const [goal, setGoal] = useState(GOALS[0].id);
  const [detail, setDetail] = useState("");
  const [channel, setChannel] = useState("Instagram");
  const [audience, setAudience] = useState("Bay Area parents");
  const [plan, setPlan] = useState(null);
  const [working, setWorking] = useState(false);
  const goalMeta = GOALS.find((g) => g.id === goal);

  function run() {
    setWorking(true); setPlan(null);
    setTimeout(() => {
      setPlan(generatePlan({ goal, detail, channel, audience, audienceSize: AUD_SIZE[audience] || 0 }));
      setWorking(false);
    }, 750);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-black/40 p-4" onClick={onClose}>
      <div className="card my-8 w-full max-w-2xl p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="display text-xl text-ink">✨ Campaign designer</h3>
            <p className="text-xs text-mute">Pick a goal — the studio designs the strategy, writes the posts, and briefs the creative.</p>
          </div>
          <button onClick={onClose} className="text-mute hover:text-ink">✕</button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Select label="Goal" value={goal} onChange={(v) => { setGoal(v); setPlan(null); }}>
            {GOALS.map((g) => <option key={g.id} value={g.id}>{g.label}</option>)}
          </Select>
          {goalMeta?.detail && <Text label={goalMeta.detail} value={detail} onChange={setDetail} />}
          <Select label="Lead platform" value={channel} onChange={setChannel}>
            <option>Instagram</option><option>TikTok</option><option>Email (Miles)</option>
          </Select>
          <Select label="Audience" value={audience} onChange={setAudience}>
            {AUDIENCES.map((a) => <option key={a}>{a}</option>)}
          </Select>
        </div>

        <button onClick={run} disabled={working} className="pill-primary mt-4 w-full !py-3 disabled:opacity-60">
          {working ? "Designing…" : plan ? "Regenerate" : "Design campaign"}
        </button>

        {plan && (
          <div className="mt-6 space-y-5">
            <Block label="Objective"><p className="text-sm text-ink/85">{plan.objective}</p></Block>
            <div className="grid gap-4 sm:grid-cols-2">
              <Block label="Audience">
                <p className="text-sm text-ink/85">{plan.audience.segment} · ~{plan.audience.size.toLocaleString()}</p>
                <p className="mt-1 text-xs text-mute">{plan.audience.why}</p>
              </Block>
              <Block label="Offer"><p className="text-sm text-ink/85">{plan.offer}</p></Block>
            </div>

            <Block label="Content calendar">
              <ol className="space-y-2">
                {plan.calendar.map((c, i) => (
                  <li key={i} className="flex flex-wrap gap-x-3 text-sm">
                    <span className="w-24 shrink-0 font-semibold text-tiger">{c.when}</span>
                    <span className="w-24 shrink-0 text-sky">{c.channel}</span>
                    <span className="text-ink/75">{c.format} — {c.idea}</span>
                  </li>
                ))}
              </ol>
            </Block>

            <Block label="Ready-to-post">
              <div className="space-y-3">
                {plan.posts.map((p, i) => (
                  <div key={i} className="panel p-4">
                    <div className="flex items-center justify-between">
                      <span className="chip bg-ink/10 text-ink">{p.platform}</span>
                      <button onClick={() => navigator.clipboard?.writeText(p.caption + "\n\n" + p.hashtags.join(" "))}
                        className="text-xs font-semibold text-tiger hover:underline">Copy</button>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-ink/85">{p.caption}</p>
                    <p className="mt-2 text-xs text-sky">{p.hashtags.join(" ")}</p>
                  </div>
                ))}
              </div>
            </Block>

            <Block label="Creative (Framia)">
              <p className="text-sm text-ink/80">{plan.creative.concept}</p>
              <div className="mt-3 rounded-xl2 border border-ink/10 bg-cloud p-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold uppercase tracking-wide text-mute">Framia prompt</div>
                  <button onClick={() => navigator.clipboard?.writeText(plan.creative.framiaPrompt)}
                    className="text-xs font-semibold text-tiger hover:underline">Copy prompt</button>
                </div>
                <p className="mt-1 text-xs text-ink/70">{plan.creative.framiaPrompt}</p>
              </div>
              <a
                href="https://framia.converge.ai/create/"
                target="_blank"
                rel="noreferrer"
                className="pill-ghost mt-3 inline-flex text-sm"
              >
                🎬 Generate with Framia ↗
              </a>
              <p className="mt-2 text-xs text-mute">Opens Framia — paste the prompt above to generate the ad video.</p>
            </Block>

            <div className="flex flex-wrap gap-2 border-t border-ink/10 pt-4">
              <button onClick={() => onSchedule(plan, "schedule")} className="pill-ghost">🗓️ Schedule</button>
              <button onClick={() => onSchedule(plan, "now")} className="pill-primary">Post now</button>
            </div>
            {!hasSupabase && <p className="text-xs text-mute">Demo mode — scheduling/posting is simulated.</p>}
          </div>
        )}
      </div>
    </div>
  );
}

function Select({ label, value, onChange, children }) {
  return (
    <label className="block">
      <span className="text-xs text-mute">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl2 border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-tiger">
        {children}
      </select>
    </label>
  );
}
function Text({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="text-xs text-mute">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl2 border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-tiger" />
    </label>
  );
}
function Block({ label, children }) {
  return (
    <div>
      <div className="mb-2 text-xs font-bold uppercase tracking-widest text-tiger">{label}</div>
      {children}
    </div>
  );
}
