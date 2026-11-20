"use client";

import { useState } from "react";
import { Icon } from "@/components/AdminUI";
import { addTask } from "@/lib/tasks";

const COVEY_URL =
  "https://covey.converge.ai/w/b6000568-438d-4399-8274-0371d052b085/agents/17af9b99-8703-5281-b80a-6d9bd4bf4a08";
const FRAMIA_URL = "https://framia.converge.ai/create/";

const TOOLS = [
  {
    id: "covey",
    name: "Campaign Studio",
    by: "Powered by Covey",
    icon: "creator",
    tint: "#FF6B35",
    desc: "Chat with your Covey agent to brainstorm campaign ideas, build the full strategy, content calendar and ready-to-post captions.",
    cta: "Open Campaign Studio",
    url: COVEY_URL,
    points: ["Marketing campaign ideas", "End-to-end campaign strategy", "Captions + content calendar"],
  },
  {
    id: "framia",
    name: "Ad Video Studio",
    by: "Powered by Framia",
    icon: "reports",
    tint: "#2DA7FF",
    desc: "Turn your campaign into scroll-stopping reels and ad videos with Framia's AI video studio, then post them to your channels.",
    cta: "Open Ad Video Studio",
    url: FRAMIA_URL,
    points: ["Reels & short-form ads", "Product + lifestyle video", "Export and publish"],
  },
];

const STEPS = [
  { n: 1, t: "Design in Covey", d: "Ideas, strategy and copy from your agent." },
  { n: 2, t: "Capture to To-do", d: "Push action items into your To-do list." },
  { n: 3, t: "Make the video in Framia", d: "Generate the reel and publish." },
];

export default function CreatorStudio() {
  const [capText, setCapText] = useState("");
  const [saved, setSaved] = useState(false);

  function sendToTodo(e) {
    e.preventDefault();
    const t = addTask({ text: capText, tag: "Creator Studio" });
    if (t) {
      setCapText("");
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    }
  }

  return (
    <div>
      {/* launcher cards */}
      <div className="grid gap-5 lg:grid-cols-2">
        {TOOLS.map((tool) => (
          <div key={tool.id} className="card flex flex-col p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl text-ink" style={{ background: `${tool.tint}1a`, color: tool.tint }}>
                <Icon name={tool.icon} size={24} />
              </span>
              <div>
                <div className="display text-xl text-ink">{tool.name}</div>
                <div className="text-xs font-semibold uppercase tracking-widest text-mute">{tool.by}</div>
              </div>
            </div>

            <p className="mt-4 text-sm text-mute">{tool.desc}</p>

            <ul className="mt-4 space-y-1.5">
              {tool.points.map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm text-ink/80">
                  <span className="text-lime">✓</span> {p}
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-6">
              <a href={tool.url} target="_blank" rel="noreferrer" className="pill-primary inline-flex w-full items-center justify-center gap-2">
                {tool.cta} <Icon name="external" size={16} />
              </a>
              <p className="mt-2 text-center text-[11px] text-mute">Opens {tool.by.replace("Powered by ", "")} in a new tab — sign in once and you’re set.</p>
            </div>
          </div>
        ))}
      </div>

      {/* capture to to-do */}
      <div className="card mt-5 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-widest text-ink/70">Capture a to-do</h3>
          {saved && <span className="text-xs font-semibold text-lime">Added to To-do ✓</span>}
        </div>
        <p className="mt-1 text-sm text-mute">Got an action item from your campaign chat? Drop it here and it lands on your To-do list.</p>
        <form onSubmit={sendToTodo} className="mt-3 flex gap-2">
          <input
            value={capText}
            onChange={(e) => setCapText(e.target.value)}
            placeholder="e.g. Shoot UGC with @activekidssf this weekend"
            className="field flex-1"
          />
          <button type="submit" className="pill-primary">Add to To-do</button>
        </form>
      </div>

      {/* how it works */}
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {STEPS.map((s) => (
          <div key={s.n} className="panel flex items-start gap-3 p-5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-tiger text-sm font-bold text-white">{s.n}</span>
            <div>
              <div className="font-semibold text-ink">{s.t}</div>
              <div className="text-xs text-mute">{s.d}</div>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-mute">Powered by Converge.AI · Covey designs the campaign · Framia turns it into the ad video</p>
    </div>
  );
}
