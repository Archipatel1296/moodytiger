"use client";

import { useEffect, useState } from "react";
import { Stat, Donut, HBars } from "@/components/Charts";
import { Section } from "@/components/AdminUI";
import { getMembers } from "@/lib/analytics";
import { getRewards, saveReward } from "@/lib/content";
import { generateCodes, listCodes } from "@/lib/codes";
import { DEMO_TIER_SPLIT, DEMO_TOP_REWARDS } from "@/lib/demo";
import { hasSupabase } from "@/lib/supabaseClient";

const TIER_COLOR = { Cub: "#FFC53D", Explorer: "#5BC236", Adventurer: "#2DA7FF", Legend: "#FF6B35" };

export default function AdminLoyalty() {
  const [members, setMembers] = useState([]);
  const [tab, setTab] = useState("members"); // members | rewards | codes
  useEffect(() => { getMembers().then(setMembers); }, []);

  const totalPts = members.reduce((s, m) => s + (m.points || 0), 0);
  const avgVisits = members.length ? (members.reduce((s, m) => s + (m.visits || 0), 0) / members.length).toFixed(1) : 0;

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat icon="👨‍👩‍👧" tint="#5BC236" label="Total members" value={members.length} />
        <Stat icon="⭐" tint="#FFC53D" label="Miles outstanding" value={(totalPts / 1000).toFixed(1) + "k"} />
        <Stat icon="🔁" tint="#2DA7FF" label="Avg visits / member" value={avgVisits} />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Section title="Members by tier">
          <Donut data={DEMO_TIER_SPLIT} centerLabel={members.length} sub="members" />
        </Section>
        <Section title="Reward redemptions">
          <HBars data={DEMO_TOP_REWARDS} color="#FF6B35" />
        </Section>
      </div>

      {/* tabs */}
      <div className="mt-6 flex gap-1.5">
        {[["members", "Members"], ["rewards", "Rewards"], ["codes", "Miles codes"]].map(([k, l]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              tab === k ? "bg-tiger text-white" : "border border-line text-mute hover:text-ink"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {tab === "members" && <MembersTable members={members} />}
        {tab === "rewards" && <RewardsEditor />}
        {tab === "codes" && <CodesPanel />}
      </div>
    </div>
  );
}

function MembersTable({ members }) {
  return (
    <div className="card overflow-hidden p-0">
      <div className="scroll-thin overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wide text-mute">
            <tr>
              <th className="px-6 pb-2 pt-4">Member</th>
              <th className="px-4 pb-2 pt-4">Email</th>
              <th className="px-4 pb-2 pt-4">Tier</th>
              <th className="px-4 pb-2 pt-4">Visits</th>
              <th className="px-6 pb-2 pt-4 text-right">Miles</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m, i) => (
              <tr key={i} className="border-t border-line">
                <td className="px-6 py-3 font-medium text-ink">{m.name}</td>
                <td className="px-4 py-3 text-mute">{m.email}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="heat-dot" style={{ background: TIER_COLOR[m.tier] || "#FFC53D" }} />
                    <span className="text-ink/80">{m.tier}</span>
                  </span>
                </td>
                <td className="px-4 py-3 text-ink/60">{m.visits}</td>
                <td className="px-6 py-3 text-right font-bold text-tiger">{(m.points || 0).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RewardsEditor() {
  const [rewards, setRewards] = useState([]);
  const [flash, setFlash] = useState("");

  async function load() { setRewards(await getRewards({ activeOnly: false })); }
  useEffect(() => { load(); }, []);

  function update(i, patch) { setRewards((r) => r.map((x, idx) => (idx === i ? { ...x, ...patch } : x))); }
  async function save(i) {
    await saveReward(rewards[i]);
    setFlash(`Saved "${rewards[i].name}"`);
    setTimeout(() => setFlash(""), 2500);
  }

  return (
    <Section title="Reward miles costs" right={flash && <span className="text-xs font-semibold text-lime">{flash} ✓</span>}>
      <p className="-mt-2 mb-4 text-sm text-mute">Change what each reward costs, or switch one off. Updates the Miles Club page instantly.</p>
      <div className="space-y-2">
        {rewards.map((r, i) => (
          <div key={r.id} className="grid items-center gap-3 rounded-xl border border-line bg-surface p-3 md:grid-cols-[2fr_1fr_auto_auto]">
            <input value={r.name} onChange={(e) => update(i, { name: e.target.value })} className="field" />
            <label className="flex items-center gap-2 text-xs text-mute">
              miles
              <input type="number" value={r.points} onChange={(e) => update(i, { points: Number(e.target.value) })} className="field w-24 font-semibold text-tiger" />
            </label>
            <label className="flex items-center gap-2 text-xs text-ink/60">
              <input type="checkbox" checked={r.active !== false} onChange={(e) => update(i, { active: e.target.checked })} />
              Active
            </label>
            <button onClick={() => save(i)} className="pill-primary text-xs">Save</button>
          </div>
        ))}
      </div>
    </Section>
  );
}

function CodesPanel() {
  const [codes, setCodes] = useState([]);
  const [form, setForm] = useState({ count: 10, points: 100, note: "" });
  const [fresh, setFresh] = useState([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function load() { setCodes(await listCodes()); }
  useEffect(() => { load(); }, []);

  async function generate() {
    setBusy(true); setErr("");
    const res = await generateCodes(form.count, form.points, form.note);
    setBusy(false);
    if (res && res.error) {
      setErr(/claim_codes|does not exist|relation/i.test(res.error)
        ? "The claim_codes table isn't in your database yet — run supabase/schema.sql in the Supabase SQL Editor, then try again."
        : res.error);
      return;
    }
    if (!Array.isArray(res) || res.length === 0) {
      setErr("No codes were returned. If you're connected to Supabase, make sure schema.sql has been run.");
      return;
    }
    setFresh(res); load();
  }

  const used = codes.filter((c) => c.used).length;

  return (
    <div>
      {!hasSupabase && (
        <div className="mb-4 rounded-xl border border-sun/30 bg-sun/10 px-4 py-3 text-sm text-ink/80">
          Demo mode — generated codes won't persist. Live codes need Supabase. (Guests can try PLAY50 / WELCOME100 / TIGER25.)
        </div>
      )}
      <div className="grid gap-5 lg:grid-cols-[1fr_1.3fr]">
        <Section title="Generate codes">
          <p className="-mt-2 mb-4 text-sm text-mute">Print these on receipts. Shoppers enter one on the Miles Club page to claim miles — works in store too.</p>
          <div className="space-y-3">
            <label className="block">
              <span className="text-xs text-mute">How many</span>
              <input type="number" min="1" max="100" value={form.count} onChange={(e) => setForm({ ...form, count: e.target.value })} className="field mt-1" />
            </label>
            <label className="block">
              <span className="text-xs text-mute">Miles each</span>
              <input type="number" min="1" value={form.points} onChange={(e) => setForm({ ...form, points: e.target.value })} className="field mt-1" />
            </label>
            <label className="block">
              <span className="text-xs text-mute">Note (optional)</span>
              <input value={form.note} placeholder="e.g. November receipts" onChange={(e) => setForm({ ...form, note: e.target.value })} className="field mt-1" />
            </label>
            <button onClick={generate} disabled={busy} className="pill-primary w-full !py-3 disabled:opacity-60">
              {busy ? "Generating…" : `Generate ${form.count} codes`}
            </button>
            {err && <p className="rounded-xl border border-tiger/40 bg-tiger/10 px-4 py-3 text-sm text-tiger">{err}</p>}
          </div>

          {fresh.length > 0 && (
            <div className="mt-5">
              <div className="mb-2 text-xs font-bold uppercase tracking-wide text-mute">New codes ({fresh[0].points} miles each) — copy/print these</div>
              <div className="grid grid-cols-2 gap-2 rounded-xl border border-line bg-surface p-3">
                {fresh.map((c) => <span key={c.code} className="font-mono text-sm text-tiger">{c.code}</span>)}
              </div>
            </div>
          )}
        </Section>

        <Section title="Issued codes" right={<span className="text-xs text-mute">{used}/{codes.length} used</span>} pad="p-0">
          <div className="scroll-thin max-h-[460px] overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white text-left text-xs uppercase tracking-wide text-mute">
                <tr>
                  <th className="px-5 py-3">Code</th><th className="px-4 py-3">Miles</th><th className="px-4 py-3">Note</th><th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {codes.map((c) => (
                  <tr key={c.code} className="border-t border-line">
                    <td className="px-5 py-3 font-mono text-ink">{c.code}</td>
                    <td className="px-4 py-3 text-tiger">{c.points}</td>
                    <td className="px-4 py-3 text-mute">{c.note || "—"}</td>
                    <td className="px-5 py-3">
                      <span className={`chip ${c.used ? "bg-ink/10 text-mute" : "bg-lime/15 text-lime"}`}>{c.used ? "Used" : "Active"}</span>
                    </td>
                  </tr>
                ))}
                {codes.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-mute">No codes yet — generate a batch.</td></tr>}
              </tbody>
            </table>
          </div>
        </Section>
      </div>
    </div>
  );
}
