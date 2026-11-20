"use client";

import { useRef, useState } from "react";

// Lightweight, dependency-free SVG charts for the light theme.
const INK = "#1B1B2F";
const MUTE = "rgba(27,27,47,0.5)";
const GRID = "rgba(27,27,47,0.07)";

export function Stat({ label, value, delta, suffix, icon, tint = "#FF6B35" }) {
  const up = delta >= 0;
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        {icon ? (
          <span
            className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
            style={{ background: `${tint}1a`, color: tint }}
          >
            {icon}
          </span>
        ) : (
          <div className="text-xs font-semibold uppercase tracking-widest text-mute">{label}</div>
        )}
        {delta !== undefined && (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-bold ${up ? "bg-lime/15 text-lime" : "bg-tiger/15 text-tiger"}`}
          >
            {up ? "▲" : "▼"} {Math.abs(delta)}%
          </span>
        )}
      </div>
      {icon && <div className="mt-3 text-xs font-semibold uppercase tracking-widest text-mute">{label}</div>}
      <div className="display mt-1 text-3xl text-ink">
        {value}
        {suffix && <span className="ml-1 text-base text-mute">{suffix}</span>}
      </div>
    </div>
  );
}

export function LineChart({
  data,
  keys = ["sales"],
  colors = ["#FF6B35", "#2DA7FF"],
  labels = {},
  height = 240,
}) {
  const w = 640;
  const pad = { l: 40, r: 14, t: 16, b: 26 };
  const [hover, setHover] = useState(null); // index
  const wrapRef = useRef(null);

  const max = Math.max(...data.flatMap((d) => keys.map((k) => d[k]))) * 1.12 || 1;
  const ix = (i) => pad.l + (i * (w - pad.l - pad.r)) / (data.length - 1);
  const iy = (v) => pad.t + (1 - v / max) * (height - pad.t - pad.b);

  function onMove(e) {
    const rect = wrapRef.current.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const x = ratio * w;
    let best = 0,
      bestD = Infinity;
    data.forEach((_, i) => {
      const d = Math.abs(ix(i) - x);
      if (d < bestD) { bestD = d; best = i; }
    });
    setHover(best);
  }

  const hp = hover != null ? data[hover] : null;
  const leftPct = hover != null ? (ix(hover) / w) * 100 : 0;

  return (
    <div ref={wrapRef} className="relative w-full" onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
      <svg viewBox={`0 0 ${w} ${height}`} className="w-full" role="img">
        {[0, 0.25, 0.5, 0.75, 1].map((g) => (
          <line
            key={g}
            x1={pad.l}
            x2={w - pad.r}
            y1={pad.t + g * (height - pad.t - pad.b)}
            y2={pad.t + g * (height - pad.t - pad.b)}
            stroke={GRID}
          />
        ))}
        {keys.map((k, ki) => {
          const d = data.map((pt, i) => `${i === 0 ? "M" : "L"} ${ix(i)} ${iy(pt[k])}`).join(" ");
          const area = `${d} L ${ix(data.length - 1)} ${height - pad.b} L ${ix(0)} ${height - pad.b} Z`;
          return (
            <g key={k}>
              <path d={area} fill={colors[ki]} opacity="0.08" />
              <path d={d} fill="none" stroke={colors[ki]} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            </g>
          );
        })}
        {hover != null && (
          <line x1={ix(hover)} x2={ix(hover)} y1={pad.t} y2={height - pad.b} stroke="rgba(27,27,47,0.18)" strokeDasharray="4 4" />
        )}
        {keys.map((k, ki) =>
          hover != null ? (
            <circle key={k} cx={ix(hover)} cy={iy(hp[k])} r="4.5" fill="#fff" stroke={colors[ki]} strokeWidth="2.5" />
          ) : null
        )}
        {data.map((pt, i) =>
          i % Math.ceil(data.length / 7) === 0 ? (
            <text key={i} x={ix(i)} y={height - 7} fill={MUTE} fontSize="10" textAnchor="middle">
              {pt.label}
            </text>
          ) : null
        )}
      </svg>

      {hp && (
        <div
          className="pointer-events-none absolute top-1 z-10 -translate-x-1/2 rounded-xl border border-line bg-white px-3 py-2 text-xs shadow-lift"
          style={{ left: `${leftPct}%` }}
        >
          <div className="mb-1 font-bold text-ink">{hp.label}</div>
          {keys.map((k, ki) => (
            <div key={k} className="flex items-center gap-2 whitespace-nowrap">
              <span className="h-2 w-2 rounded-full" style={{ background: colors[ki] }} />
              <span className="text-mute">{labels[k] || k}</span>
              <span className="ml-auto font-semibold text-ink">{(hp[k]).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function BarChart({ data, color = "#2DA7FF", height = 200 }) {
  const w = 640;
  const pad = { l: 28, r: 12, t: 12, b: 24 };
  const max = Math.max(...data.map((d) => d.v)) * 1.1;
  const bw = (w - pad.l - pad.r) / data.length;
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" role="img">
      {data.map((d, i) => {
        const h = (d.v / max) * (height - pad.t - pad.b);
        const x = pad.l + i * bw;
        const y = height - pad.b - h;
        return (
          <g key={i}>
            <rect x={x + bw * 0.18} y={y} width={bw * 0.64} height={h} rx="5" fill={color} opacity={0.55 + 0.45 * (d.v / max)} />
            <text x={x + bw / 2} y={height - 7} fill={MUTE} fontSize="9" textAnchor="middle">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function HBars({ data, color = "#FF6B35" }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="space-y-3">
      {data.map((d) => (
        <div key={d.label}>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-ink/80">{d.label}</span>
            <span className="text-mute">{d.value}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-ink/10">
            <div className="h-full rounded-full" style={{ width: `${(d.value / max) * 100}%`, background: color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Donut({ data, size = 180, centerLabel, sub = "total" }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = size / 2 - 16;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex items-center gap-5">
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="shrink-0">
        <g transform={`translate(${size / 2},${size / 2}) rotate(-90)`}>
          {data.map((d, i) => {
            const frac = d.value / total;
            const dash = `${frac * c} ${c}`;
            const el = (
              <circle key={i} r={r} fill="none" stroke={d.color} strokeWidth="18" strokeLinecap="round"
                strokeDasharray={dash} strokeDashoffset={-offset * c} />
            );
            offset += frac;
            return el;
          })}
        </g>
        <text x="50%" y="46%" textAnchor="middle" dy="0.35em" fill={INK} fontSize="22" fontWeight="700">
          {centerLabel != null ? centerLabel : total}
        </text>
        <text x="50%" y="60%" textAnchor="middle" fill={MUTE} fontSize="10">{sub}</text>
      </svg>
      <div className="space-y-1.5">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2 text-sm">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: d.color }} />
            <span className="text-ink/80">{d.label}</span>
            <span className="ml-auto text-mute">{Math.round((d.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
