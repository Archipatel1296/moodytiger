"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminSignIn } from "@/lib/admin";
import { hasSupabase, ADMIN_EMAILS } from "@/lib/supabaseClient";

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ email: ADMIN_EMAILS[0] || "", password: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const res = await adminSignIn(form);
    setBusy(false);
    if (res.error) return setErr(res.error);
    router.push("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="text-4xl">🐯</div>
          <h1 className="display mt-2 text-3xl text-ink">Owner HQ</h1>
          <p className="mt-2 text-sm text-ink/55">Sign in to manage moodytiger.</p>
        </div>

        <form onSubmit={submit} className="card space-y-3 p-6">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-ink/50">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="mt-1 w-full rounded-xl border border-ink/10 bg-cloud px-4 py-3 text-ink outline-none focus:border-tiger"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-ink/50">Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required={hasSupabase}
              placeholder={hasSupabase ? "" : "(any — demo mode)"}
              className="mt-1 w-full rounded-xl border border-ink/10 bg-cloud px-4 py-3 text-ink outline-none focus:border-tiger"
            />
          </label>
          <button disabled={busy} className="pill-primary w-full !py-3 text-base disabled:opacity-60">
            {busy ? "…" : "Sign in"}
          </button>
          {err && <p className="text-center text-sm text-tiger">{err}</p>}
        </form>

        {!hasSupabase && (
          <p className="mt-4 text-center text-xs text-ink/40">
            Demo mode: sign in with <span className="text-sun">{ADMIN_EMAILS[0]}</span> and any password.
          </p>
        )}
      </div>
    </div>
  );
}
