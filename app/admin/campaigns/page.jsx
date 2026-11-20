"use client";

import { useState } from "react";
import { Icon } from "@/components/AdminUI";
import { addTask } from "@/lib/tasks";

const COVEY_URL =
  "https://covey.converge.ai/w/b6000568-438d-4399-8274-0371d052b085/agents/17af9b99-8703-5281-b80a-6d9bd4bf4a08";
const FRAMIA_URL = "https://framia.converge.ai/create/";

const TABS = [
  { id: "covey", label: "Campaign Studio", sub: "Design campaigns with Covey", icon: "creator", url: COVEY_URL, title: "Covey by Converge.AI" },
  { id: "framia", label: "Ad Video", sub: "Turn it into a reel with Framia", icon: "reports", url: FRAMIA_URL, title: "Framia by Converge.AI" },
];

export default function CreatorStudio() {
  const [tab, setTab] = useState("covey");
  const [capture, setCapture] = useState(false);
  const [capText, setCapText] = useState("");
  const [saved, setSaved] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const active = TABS.find((t) => t.id === tab);
  const svc = tab === "covey" ? "Covey" : "Framia";

  function signIn() {
    // Sign in to the service in a first-party popup (its login page can't be iframed),
    // then reload the panel to pick up the session.
    window.open(active.url, "converge_signin", "width=480,height=760,noopener=no");
  }

  function sendToTodo(e) {
    e.preventDefault();
    const t = addTask({ text: capText, tag: "Creator Studio" });
    if (t) {
      setCapText("");
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
      setCapture(false);
    }
  }

  return (
    <div>
      {/* toolbar: tabs + actions, styled to read as one workspace */}
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div className="flex rounded-full border border-line bg-white p-1 shadow-card">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                tab === t.id ? "bg-tiger text-white" : "text-mute hover:text-ink"
              }`}
            >
              <Icon name={t.icon} size={16} />
              {t.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          {saved && <span className="text-xs font-semibold text-lime">Added to To-do ✓</span>}
          <button onClick={() => setCapture((v) => !v)} className="pill-ghost text-sm">＋ To-do</button>
          <button onClick={signIn} className="pill-ghost text-sm">Sign in to {svc} ↗</button>
          <button onClick={() => setReloadKey((k) => k + 1)} title="Reload panel" className="pill-ghost text-sm">⟳</button>
          <a href={active.url} target="_blank" rel="noreferrer" className="pill-ghost text-sm inline-flex items-center gap-1">
            Open in new tab <Icon name="external" size={14} />
          </a>
        </div>
      </div>

      {/* capture-to-todo */}
      {capture && (
        <form onSubmit={sendToTodo} className="mb-3 flex gap-2 rounded-2xl border border-line bg-white p-3 shadow-card">
          <input
            autoFocus
            value={capText}
            onChange={(e) => setCapText(e.target.value)}
            placeholder="Capture an action item from the chat → send it to To-do…"
            className="field flex-1"
          />
          <button type="submit" className="pill-primary">Add to To-do</button>
        </form>
      )}

      {/* sign-in hint */}
      <div className="mb-2 text-center text-xs text-mute">
        First time? Hit <span className="font-semibold text-ink">Sign in to {svc}</span> (opens a quick popup), then <span className="font-semibold text-ink">⟳</span>. If your browser blocks embedded sessions, use “Open in new tab”.
      </div>

      {/* seamless embed — both mounted so switching keeps your session.
          sandbox withholds allow-top-navigation so neither app can hijack the page. */}
      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-line" style={{ height: "calc(100vh - 210px)", minHeight: 520 }}>
        {TABS.map((t) => (
          <iframe
            key={`${t.id}-${reloadKey}`}
            src={t.url}
            title={t.title}
            className={`h-full w-full border-0 ${tab === t.id ? "block" : "hidden"}`}
            allow="clipboard-write; fullscreen; microphone; camera"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-downloads"
          />
        ))}
      </div>

      <div className="mt-2 text-center text-[11px] text-mute">
        Powered by Converge.AI · {active.sub}
      </div>
    </div>
  );
}
