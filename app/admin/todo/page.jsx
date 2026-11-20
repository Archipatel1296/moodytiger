"use client";

import { useMemo, useState } from "react";
import { Section } from "@/components/AdminUI";
import { DEMO_MY_TASKS, DEMO_TEAM_TASKS, OWNER } from "@/lib/demo";

const TAG_COLOR = {
  "Creator Studio": "#FF6B35",
  "Influencer Studio": "#2DA7FF",
  "Miles Club": "#5BC236",
  "Integrations": "#8B5CF6",
};

function greeting(h) {
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function TodoPage() {
  const [mine, setMine] = useState(DEMO_MY_TASKS);
  const [team, setTeam] = useState(DEMO_TEAM_TASKS);
  const now = useMemo(() => new Date(), []);
  const hello = greeting(now.getHours());

  const openCount = mine.filter((t) => !t.done).length;

  function toggleMine(id) {
    setMine((l) => l.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }
  function toggleTeam(id) {
    setTeam((l) => l.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  return (
    <div>
      {/* greeting */}
      <div className="mb-5 rounded-2xl border border-line bg-gradient-to-r from-tiger/10 via-sun/10 to-sky/10 p-6">
        <div className="display text-2xl text-ink">
          {hello}, {OWNER.firstName} 👋
        </div>
        <p className="mt-1 text-sm text-mute">
          You have <span className="font-semibold text-ink">{openCount} task{openCount === 1 ? "" : "s"}</span> on your plate today.
          Keep the moodytiger marketing engine humming.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.25fr]">
        <Calendar now={now} />

        <div className="space-y-5">
          <Section title={`My tasks · ${openCount} open`}>
            <ul className="space-y-2">
              {mine.map((t) => (
                <li
                  key={t.id}
                  className="flex items-start gap-3 rounded-xl border border-line p-3 transition hover:border-tiger/30"
                >
                  <button
                    onClick={() => toggleMine(t.id)}
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                      t.done ? "border-lime bg-lime text-white" : "border-ink/25 text-transparent hover:border-tiger"
                    }`}
                  >
                    ✓
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className={`text-sm ${t.done ? "text-mute line-through" : "text-ink"}`}>{t.text}</div>
                    <div className="mt-1 flex items-center gap-2">
                      <span
                        className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                        style={{ background: `${TAG_COLOR[t.tag] || "#6B6F76"}1a`, color: TAG_COLOR[t.tag] || "#6B6F76" }}
                      >
                        {t.tag}
                      </span>
                      <span className="text-[11px] text-mute">{t.due}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Team tasks">
            <ul className="space-y-2">
              {team.map((t) => (
                <li key={t.id} className="flex items-center gap-3 rounded-xl border border-line p-3">
                  <button
                    onClick={() => toggleTeam(t.id)}
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                      t.done ? "border-sky bg-sky text-white" : "border-ink/25 text-transparent hover:border-sky"
                    }`}
                  >
                    ✓
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className={`text-sm ${t.done ? "text-mute line-through" : "text-ink"}`}>{t.text}</div>
                    <div className="text-[11px] text-mute">{t.owner}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Calendar({ now }) {
  const [view, setView] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const monthName = new Date(view.y, view.m, 1).toLocaleString("en-US", { month: "long" });
  const firstDay = new Date(view.y, view.m, 1).getDay();
  const daysIn = new Date(view.y, view.m + 1, 0).getDate();
  const isThisMonth = now.getFullYear() === view.y && now.getMonth() === view.m;
  const today = now.getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysIn; d++) cells.push(d);

  // demo "event" days
  const events = isThisMonth ? [today, Math.min(today + 2, daysIn), Math.min(today + 5, daysIn)] : [8, 16, 24];

  function shift(delta) {
    setView((v) => {
      let m = v.m + delta, y = v.y;
      if (m < 0) { m = 11; y--; }
      if (m > 11) { m = 0; y++; }
      return { y, m };
    });
  }

  return (
    <Section
      title={`${monthName} ${view.y}`}
      right={
        <div className="flex gap-1">
          <button onClick={() => shift(-1)} className="flex h-7 w-7 items-center justify-center rounded-lg border border-line text-mute hover:text-ink">‹</button>
          <button onClick={() => shift(1)} className="flex h-7 w-7 items-center justify-center rounded-lg border border-line text-mute hover:text-ink">›</button>
        </div>
      }
    >
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase text-mute">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="py-1">{d}</div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          const isToday = isThisMonth && d === today;
          const hasEvent = d && events.includes(d);
          return (
            <div
              key={i}
              className={`flex aspect-square flex-col items-center justify-center rounded-xl text-sm ${
                d ? "text-ink" : ""
              } ${isToday ? "bg-tiger font-bold text-white" : d ? "hover:bg-ink/5" : ""}`}
            >
              {d || ""}
              {hasEvent && !isToday && <span className="mt-0.5 h-1 w-1 rounded-full bg-tiger" />}
            </div>
          );
        })}
      </div>
    </Section>
  );
}
