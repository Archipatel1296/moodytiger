"use client";

// Shared, persistent task store (localStorage) used by both the To-do page
// and the Creator Studio "capture to To-do" action. Same-tab updates notify
// live subscribers; cross-tab updates arrive via the storage event.

const KEY = "mt_tasks_v1";

function iso(d) {
  return new Date(d).toISOString().slice(0, 10);
}
function todayISO() {
  return iso(new Date());
}
function addDaysISO(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return iso(d);
}

function seed() {
  return [
    { id: "s1", text: "Approve the Holiday Gift Guide creative in Framia", tag: "Creator Studio", date: todayISO(), done: false, created: Date.now() },
    { id: "s2", text: "Review 8 new Bay Area creators from the discovery agent", tag: "Influencer Studio", date: todayISO(), done: false, created: Date.now() - 1 },
    { id: "s3", text: "Generate November receipt codes for in-store", tag: "Miles Club", date: addDaysISO(1), done: false, created: Date.now() - 2 },
    { id: "s4", text: "Connect the Shopify store to sync live sales", tag: "Integrations", date: addDaysISO(2), done: false, created: Date.now() - 3 },
    { id: "s5", text: "Post the Rainy-Day Layers reel to Instagram", tag: "Creator Studio", date: addDaysISO(-1), done: true, created: Date.now() - 4 },
  ];
}

const listeners = new Set();
function emit() {
  listeners.forEach((f) => {
    try { f(); } catch {}
  });
}

function read() {
  try {
    const s = localStorage.getItem(KEY);
    if (s) return JSON.parse(s);
  } catch {}
  return null;
}
function write(list) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
  emit();
}

export function getTasks() {
  let l = read();
  if (!l) { l = seed(); write(l); }
  return l;
}

export function addTask({ text, tag = "General", date }) {
  const t = {
    id: "t" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    text: String(text || "").trim(),
    tag,
    date: date || todayISO(),
    done: false,
    created: Date.now(),
  };
  if (!t.text) return null;
  write([t, ...getTasks()]);
  return t;
}

export function toggleTask(id) {
  write(getTasks().map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
}

export function removeTask(id) {
  write(getTasks().filter((t) => t.id !== id));
}

export function subscribe(cb) {
  listeners.add(cb);
  const onStorage = (e) => { if (e.key === KEY) cb(); };
  if (typeof window !== "undefined") window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    if (typeof window !== "undefined") window.removeEventListener("storage", onStorage);
  };
}

export function dueLabel(dateISO) {
  if (!dateISO) return "";
  const t = todayISO();
  if (dateISO === t) return "Today";
  if (dateISO === addDaysISO(1)) return "Tomorrow";
  if (dateISO === addDaysISO(-1)) return "Yesterday";
  const d = new Date(dateISO + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export { todayISO };
