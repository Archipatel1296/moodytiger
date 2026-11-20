"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Section } from "@/components/AdminUI";
import { adminSignOut } from "@/lib/admin";
import { OWNER } from "@/lib/demo";

export default function ProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: OWNER.name, email: OWNER.email, role: OWNER.role, brand: OWNER.brand });
  const [prefs, setPrefs] = useState({ campaignAlerts: true, weeklyReport: true, creatorReplies: true });
  const [flash, setFlash] = useState("");

  function save() {
    setFlash("Profile saved ✓");
    setTimeout(() => setFlash(""), 2500);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
      {/* identity card */}
      <div className="card p-6 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-tiger to-sun text-3xl font-bold text-white">
          {OWNER.initials}
        </div>
        <div className="display mt-4 text-xl text-ink">{form.name}</div>
        <div className="text-sm text-mute">{form.role} · {form.brand}</div>
        <div className="mt-1 text-xs text-mute">{form.email}</div>

        <div className="mt-6 grid grid-cols-2 gap-3 text-left">
          <div className="panel p-3">
            <div className="text-xs text-mute">Campaigns</div>
            <div className="display text-xl text-ink">24</div>
          </div>
          <div className="panel p-3">
            <div className="text-xs text-mute">Creators</div>
            <div className="display text-xl text-ink">38</div>
          </div>
        </div>

        <button
          onClick={async () => { await adminSignOut(); router.push("/admin/login"); }}
          className="pill-ghost mt-6 w-full"
        >
          Sign out
        </button>
      </div>

      {/* settings */}
      <div className="space-y-5">
        <Section
          title="Account details"
          right={flash && <span className="text-xs font-semibold text-lime">{flash}</span>}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Field label="Role" value={form.role} onChange={(v) => setForm({ ...form, role: v })} />
            <Field label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
            <Field label="Brand" value={form.brand} onChange={(v) => setForm({ ...form, brand: v })} />
          </div>
          <button onClick={save} className="pill-primary mt-5">Save changes</button>
        </Section>

        <Section title="Notifications">
          <div className="space-y-1">
            <Toggle label="Campaign performance alerts" sub="Get notified when a campaign over- or under-performs." on={prefs.campaignAlerts} onToggle={() => setPrefs({ ...prefs, campaignAlerts: !prefs.campaignAlerts })} />
            <Toggle label="Weekly report email" sub="A Monday summary of sales, members and reach." on={prefs.weeklyReport} onToggle={() => setPrefs({ ...prefs, weeklyReport: !prefs.weeklyReport })} />
            <Toggle label="Creator replies" sub="When an influencer replies to outreach." on={prefs.creatorReplies} onToggle={() => setPrefs({ ...prefs, creatorReplies: !prefs.creatorReplies })} />
          </div>
        </Section>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-mute">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="field mt-1" />
    </label>
  );
}

function Toggle({ label, sub, on, onToggle }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line py-3 last:border-0">
      <div>
        <div className="text-sm font-medium text-ink">{label}</div>
        <div className="text-xs text-mute">{sub}</div>
      </div>
      <button
        onClick={onToggle}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${on ? "bg-tiger" : "bg-ink/15"}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${on ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </div>
  );
}
