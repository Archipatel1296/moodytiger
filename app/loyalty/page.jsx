"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { TIERS, tierForPoints } from "@/lib/menu";
import { getRewards } from "@/lib/content";
import { hasSupabase } from "@/lib/supabaseClient";
import { loadMember, signUp, signIn, signOut, redeemReward } from "@/lib/loyalty";
import { claimCode } from "@/lib/codes";

export default function LoyaltyPage() {
  const [member, setMember] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("signup");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const [m, r] = await Promise.all([loadMember(), getRewards()]);
    setMember(m);
    setRewards(r);
    setLoading(false);
  }
  useEffect(() => { refresh(); }, []);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    const fn = mode === "signup" ? signUp : signIn;
    const res = await fn(form);
    setBusy(false);
    if (res.error) return setMsg(res.error);
    if (res.needsConfirm)
      return setMsg("Account created! Check your email to confirm, then sign in. (Tip: disable email confirmation in Supabase for instant demo access.)");
    refresh();
  }

  async function doRedeem(r) {
    setBusy(true);
    const res = await redeemReward(r);
    setBusy(false);
    setMsg(res.error ? res.error : `🎉 Redeemed: ${r.name}! Show this at checkout or in store.`);
    refresh();
  }

  async function doClaim(code) {
    const res = await claimCode(code);
    if (res.ok) setMsg(`🎉 +${res.points} miles added!`);
    else setMsg(res.error || "Couldn't claim that code");
    refresh();
    return res;
  }

  return (
    <main className="bg-play min-h-screen">
      <SiteNav />
      <section className="mx-auto max-w-5xl px-4 pb-20 pt-8">
        {!hasSupabase && (
          <div className="mb-6 rounded-xl border border-sun/30 bg-sun/10 px-4 py-3 text-center text-sm text-sun">
            Demo mode — try codes PLAY50, WELCOME100, TIGER25. Connect Supabase to go live.
          </div>
        )}

        {loading ? (
          <div className="py-24 text-center text-ink/50">Loading…</div>
        ) : member ? (
          <Dashboard
            member={member}
            rewards={rewards}
            onRedeem={doRedeem}
            onClaim={doClaim}
            onSignOut={async () => { await signOut(); refresh(); }}
            busy={busy}
            msg={msg}
          />
        ) : (
          <div className="mx-auto max-w-md">
            <div className="text-center">
              <h1 className="display text-5xl text-ink">Join the Miles Club</h1>
              <p className="mt-3 text-ink/60">
                Earn a mile for every dollar. Shopped in store? Grab your receipt code and claim
                miles right here — unlock free gear, free shipping and early access to drops.
              </p>
            </div>

            <div className="card mt-8 p-6">
              <div className="mb-5 flex rounded-full border border-tiger/20 p-1">
                {["signup", "login"].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 rounded-full py-2 text-sm font-semibold capitalize transition ${
                      mode === m ? "bg-tiger text-white" : "text-ink/60"
                    }`}
                  >
                    {m === "signup" ? "Sign up" : "Log in"}
                  </button>
                ))}
              </div>

              <form onSubmit={submit} className="space-y-3">
                {mode === "signup" && (
                  <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                )}
                <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
                <Field label="Password" type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} />
                <button disabled={busy} className="pill-primary w-full !py-3 text-base disabled:opacity-60">
                  {busy ? "…" : mode === "signup" ? "Create my account" : "Log in"}
                </button>
              </form>
              {msg && <p className="mt-3 text-center text-sm text-sun">{msg}</p>}
            </div>
          </div>
        )}
      </section>
      <SiteFooter />
    </main>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-ink/50">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="mt-1 w-full rounded-xl border border-tiger/20 bg-cloud px-4 py-3 text-ink outline-none focus:border-tiger"
      />
    </label>
  );
}

function ClaimBox({ onClaim }) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  async function go(e) {
    e.preventDefault();
    if (!code.trim()) return;
    setBusy(true);
    const res = await onClaim(code);
    setBusy(false);
    if (res?.ok) setCode("");
  }
  return (
    <div className="card p-6">
      <div className="text-xs font-bold uppercase tracking-widest text-tiger">Shopped in store? Claim your miles</div>
      <p className="mt-1 text-sm text-ink/55">Enter the code from your receipt to add miles — works for in-store buys too.</p>
      <form onSubmit={go} className="mt-4 flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="MT-XXXXXX"
          className="flex-1 rounded-xl border border-tiger/20 bg-cloud px-4 py-3 font-mono uppercase tracking-wider text-ink outline-none focus:border-tiger"
        />
        <button disabled={busy} className="pill-primary disabled:opacity-60">{busy ? "…" : "Claim"}</button>
      </form>
    </div>
  );
}

function Dashboard({ member, rewards, onRedeem, onClaim, onSignOut, busy, msg }) {
  const tier = tierForPoints(member.points);
  const idx = TIERS.findIndex((t) => t.name === tier.name);
  const next = TIERS[idx + 1];
  const pct = next
    ? Math.min(100, ((member.points - tier.min) / (next.min - tier.min)) * 100)
    : 100;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-sm text-ink/50">Welcome back</div>
          <h1 className="display text-4xl text-ink">{member.name}</h1>
        </div>
        <button onClick={onSignOut} className="pill-ghost">Sign out</button>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-[1.2fr_1fr]">
        <div className="card p-7">
          <div className="flex items-center gap-2">
            <span className="heat-dot" style={{ background: tier.color }} />
            <span className="font-bold text-ink">{tier.name} tier</span>
          </div>
          <div className="display mt-3 text-6xl text-tiger">
            {member.points.toLocaleString()}
            <span className="ml-2 text-xl text-ink/50">miles</span>
          </div>
          {next ? (
            <div className="mt-5">
              <div className="h-2 overflow-hidden rounded-full bg-ink/10">
                <div className="h-full rounded-full bg-gradient-to-r from-tiger to-sun" style={{ width: `${pct}%` }} />
              </div>
              <div className="mt-2 text-sm text-ink/60">
                {next.min - member.points} miles to <span className="text-ink">{next.name}</span>
              </div>
            </div>
          ) : (
            <div className="mt-5 text-sm text-sun">You're a Legend. Top tier unlocked! 🐯</div>
          )}
        </div>

        <ClaimBox onClaim={onClaim} />
      </div>

      {msg && <p className="mt-5 rounded-xl border border-sun/30 bg-sun/10 px-4 py-3 text-center text-sm text-sun">{msg}</p>}

      <h2 className="display mt-10 text-3xl text-ink">Rewards</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rewards.map((r) => {
          const can = member.points >= r.points;
          return (
            <div key={r.id} className="card flex flex-col p-5">
              <div className="flex items-start justify-between">
                <div className="font-bold text-ink">{r.name}</div>
                <div className="rounded-full bg-tiger/20 px-2 py-0.5 text-xs font-bold text-tiger">
                  {r.points}
                </div>
              </div>
              <p className="mt-2 flex-1 text-sm text-ink/55">{r.description || r.desc}</p>
              <button
                disabled={!can || busy}
                onClick={() => onRedeem(r)}
                className={`mt-4 rounded-full py-2.5 text-sm font-semibold transition ${
                  can ? "bg-tiger text-white hover:bg-tiger" : "cursor-not-allowed bg-ink/5 text-ink/40"
                }`}
              >
                {can ? "Redeem" : `Need ${r.points - member.points} more`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
