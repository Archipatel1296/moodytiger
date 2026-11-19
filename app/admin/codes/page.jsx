"use client";

import { useEffect, useState } from "react";
import { Header } from "@/app/admin/page";
import { generateCodes, listCodes } from "@/lib/codes";
import { hasSupabase } from "@/lib/supabaseClient";

export default function AdminCodes() {
  const [codes, setCodes] = useState([]);
  const [form, setForm] = useState({ count: 10, points: 100, note: "" });
  const [fresh, setFresh] = useState([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function load() { setCodes(await listCodes()); }
  useEffect(() => { load(); }, []);

  async function generate() {
    setBusy(true);
    setErr("");
    const res = await generateCodes(form.count, form.points, form.note);
    setBusy(false);
    if (res && res.error) {
      setErr(
        /claim_codes|does not exist|relation/i.test(res.error)
          ? "The claim_codes table isn't in your database yet — run supabase/schema.sql in the Supabase SQL Editor, then try again."
          : res.error
      );
      return;
    }
    if (!Array.isArray(res) || res.length === 0) {
      setErr("No codes were returned. If you're connected to Supabase, make sure schema.sql has been run.");
      return;
    }
    setFresh(res);
    load();
  }

  const used = codes.filter((c) => c.used).length;

  return (
    <div>
      <Header
        title="Point codes"
        subtitle="Print these on receipts. Shoppers enter one on the Miles Club page to claim miles — works in store too."
      />

      {!hasSupabase && (
        <div className="mb-4 rounded-xl border border-sun/30 bg-sun/10 px-4 py-3 text-sm text-sun">
          Demo mode — generated codes won't persist. Live codes need Supabase. (Guests can try PLAY50 / WELCOME100 / TIGER25.)
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[1fr_1.3fr]">
        {/* generator */}
        <div className="card p-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-tiger">Generate codes</h3>
          <div className="mt-4 space-y-3">
            <label className="block">
              <span className="text-xs text-ink/50">How many</span>
              <input type="number" min="1" max="100" value={form.count}
                onChange={(e) => setForm({ ...form, count: e.target.value })}
                className="mt-1 w-full rounded-xl border border-tiger/20 bg-cloud px-4 py-2.5 text-ink outline-none focus:border-tiger" />
            </label>
            <label className="block">
              <span className="text-xs text-ink/50">Miles each</span>
              <input type="number" min="1" value={form.points}
                onChange={(e) => setForm({ ...form, points: e.target.value })}
                className="mt-1 w-full rounded-xl border border-tiger/20 bg-cloud px-4 py-2.5 text-ink outline-none focus:border-tiger" />
            </label>
            <label className="block">
              <span className="text-xs text-ink/50">Note (optional)</span>
              <input value={form.note} placeholder="e.g. November receipts"
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                className="mt-1 w-full rounded-xl border border-tiger/20 bg-cloud px-4 py-2.5 text-ink outline-none focus:border-tiger" />
            </label>
            <button onClick={generate} disabled={busy} className="pill-primary w-full !py-3 disabled:opacity-60">
              {busy ? "Generating…" : `Generate ${form.count} codes`}
            </button>
            {err && (
              <p className="rounded-xl border border-tiger/40 bg-tiger/10 px-4 py-3 text-sm text-tiger">{err}</p>
            )}
          </div>

          {fresh.length > 0 && (
            <div className="mt-5">
              <div className="mb-2 text-xs font-bold uppercase tracking-wide text-ink/50">
                New codes ({fresh[0].points} miles each) — copy/print these
              </div>
              <div className="grid grid-cols-2 gap-2 rounded-xl border border-tiger/20 bg-cloud p-3">
                {fresh.map((c) => (
                  <span key={c.code} className="font-mono text-sm text-sun">{c.code}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* history */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-tiger/20 p-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-tiger">Issued codes</h3>
            <span className="text-xs text-ink/50">{used}/{codes.length} used</span>
          </div>
          <div className="scroll-thin max-h-[480px] overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white text-left text-xs uppercase tracking-wide text-ink/45">
                <tr>
                  <th className="p-3">Code</th>
                  <th className="p-3">Miles</th>
                  <th className="p-3">Note</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {codes.map((c) => (
                  <tr key={c.code} className="border-t border-ink/5">
                    <td className="p-3 font-mono text-ink">{c.code}</td>
                    <td className="p-3 text-sun">{c.points}</td>
                    <td className="p-3 text-ink/50">{c.note || "—"}</td>
                    <td className="p-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${c.used ? "bg-ink/10 text-ink/50" : "bg-green-500/20 text-green-400"}`}>
                        {c.used ? "Used" : "Active"}
                      </span>
                    </td>
                  </tr>
                ))}
                {codes.length === 0 && (
                  <tr><td colSpan={4} className="p-6 text-center text-ink/40">No codes yet — generate a batch.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
