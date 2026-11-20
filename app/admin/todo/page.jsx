"use client";

import { useEffect, useMemo, useState } from "react";
import { Section } from "@/components/AdminUI";
import { DEMO_TEAM_TASKS, OWNER } from "@/lib/demo";
import { getTasks, addTask, toggleTask, removeTask, subscribe, dueLabel, todayISO } from "@/lib/tasks";

const TAGS = ["Creator Studio", "Influencer Studio", "Miles Club", "Integrations", "Campaign Reports", "General"];
const TAG_COLOR = {
  "Creator Studio": "#FF6B35",
  "Influencer Studio": "#2DA7FF",
  "Miles Club": "#5BC236",
  "Integrations": "#8B5CF6",
  "Campaign Reports": "#FFC53D",
  "General": "#6B6F76",
};

function greeting(h) {
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function TodoPage() {
  const [tasks, setTasks] = useState([]);
  const [team, setTeam] = useState(DEMO_TEAM_TASKS);
  const [selDate, setSelDate] = useState(todayISO());
  const now = useMemo(() => new Date(), []);
  const hello = greeting(now.getHours());

  useEffect(() => {
    setTasks(getTasks());
    const unsub = subscribe(() => setTasks(getTasks()));
    return unsub;
  }, []);

  const openCount = tasks.filter((t) => !t.done).length;

  function add(text) {
    const t = addTask({ text, tag: draftTag, date: selDate });
    if (t) setDraft("");
  }
  const [draft, setDraft] = useState("");
  const [draftTag, setDraftTag] = useState("General");

  function toggleTeam(id) {
    setTeam((l) => l.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  // sort: incomplete first, then by date, then newest
  const sorted = [...tasks].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    if (a.date !== b.date) return a.date < b.date ? -1 : 1;
    return b.created - a.created;
  });

  return (
    <div>
      <div className="mb-5 rounded-2xl border border-line bg-gradient-to-r from-tiger/10 via-sun/10 to-sky/10 p-6">
        <div className="display text-2xl text-ink">{hello}, {OWNER.firstName} 👋</div>
        <p className="mt-1 text-sm text-mute">
          You have <span className="font-semibold text-ink">{openCount} open task{openCount === 1 ? "" : "s"}</span>.
          Items you capture from Creator Studio land here automatically.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.3fr]">
        <Calendar now={now} tasks={tasks} selDate={selDate} onSelect={setSelDate} />

        <div className="space-y-5">
          <Section title={`My tasks · ${openCount} open`}>
            {/* add row */}
            <form
              onSubmit={(e) => { e.preventDefault(); add(draft); }}
              className="mb-4 grid gap-2 sm:grid-cols-[1fr_auto_auto]"
            >
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Add a task…"
                className="field"
              />
              <select value={draftTag} onChange={(e) => setDraftTag(e.target.value)} className="field sm:w-40">
                {TAGS.map((t) => <option key={t}>{t}</option>)}
              </select>
              <button type="submit" className="pill-primary">Add</button>
            </form>
            <div className="mb-3 text-xs text-mute">
              New tasks are dated <span className="font-semibold text-ink">{dueLabel(selDate)}</span> — tap a calendar day to change it.
            </div>

            <ul className="space-y-2">
              {sorted.map((t) => (
                <li key={t.id} className="group flex items-start gap-3 rounded-xl border border-line p-3 transition hover:border-tiger/30">
                  <button
                    onClick={() => toggleTask(t.id)}
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                      t.done ? "border-lime bg-lime text-white" : "border-ink/25 text-transparent hover:border-tiger"
                    }`}
                  >
                    ✓
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className={`text-sm ${t.done ? "text-mute line-through" : "text-ink"}`}>{t.text}</div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                        style={{ background: `${TAG_COLOR[t.tag] || "#6B6F76"}1a`, color: TAG_COLOR[t.tag] || "#6B6F76" }}>
                        {t.tag}
                      </span>
                      <span className="text-[11px] text-mute">{dueLabel(t.date)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeTask(t.id)}
                    className="shrink-0 rounded-lg px-1.5 text-mute opacity-0 transition hover:text-tiger group-hover:opacity-100"
                    title="Delete"
                  >
                    ✕
                  </button>
                </li>
              ))}
              {sorted.length === 0 && <li className="py-6 text-center text-sm text-mute">No tasks yet — add one above.</li>}
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

function Calendar({ now, tasks, selDate, onSelect }) {
  const [view, setView] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const monthName = new Date(view.y, view.m, 1).toLocaleString("en-US", { month: "long" });
  const firstDay = new Date(view.y, view.m, 1).getDay();
  const daysIn = new Date(view.y, view.m + 1, 0).getDate();
  const todayStr = todayISO();

  const taskDays = useMemo(() => {
    const s = new Set();
    tasks.forEach((t) => { if (t.date) s.add(t.date); });
    return s;
  }, [tasks]);

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysIn; d++) cells.push(d);

  function iso(d) {
    return `${view.y}-${String(view.m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }
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
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <div key={i} className="py-1">{d}</div>)}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const ds = iso(d);
          const isToday = ds === todayStr;
          const isSel = ds === selDate;
          const hasTask = taskDays.has(ds);
          return (
            <button
              key={i}
              onClick={() => onSelect(ds)}
              className={`flex aspect-square flex-col items-center justify-center rounded-xl text-sm transition ${
                isSel ? "bg-tiger font-bold text-white" : isToday ? "bg-tiger/10 font-semibold text-tiger" : "text-ink hover:bg-ink/5"
              }`}
            >
              {d}
              {hasTask && <span className={`mt-0.5 h-1 w-1 rounded-full ${isSel ? "bg-white" : "bg-tiger"}`} />}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-[11px] text-mute">Dots mark days with tasks · selected day sets the date for new tasks.</p>
    </Section>
  );
}
