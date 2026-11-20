"use client";

// Minimal, consistent line-icon set (24x24, stroke=currentColor).
const PATHS = {
  overview: (
    <>
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.6" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.6" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.6" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.6" />
    </>
  ),
  todo: (
    <>
      <rect x="3" y="3.5" width="18" height="17" rx="3" />
      <path d="M8 11.5l2.5 2.5L16 8.5" />
    </>
  ),
  creator: (
    <>
      <path d="M12 3l1.9 4.6L18.5 9.5 13.9 11.4 12 16l-1.9-4.6L5.5 9.5 10.1 7.6z" />
      <path d="M18.5 15.5l.8 1.9 1.9.8-1.9.8-.8 1.9-.8-1.9-1.9-.8 1.9-.8z" />
    </>
  ),
  influencer: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20c0-3.2 2.6-5.3 5.5-5.3s5.5 2.1 5.5 5.3" />
      <path d="M16.5 4.6l.9 1.9 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2-1.5-1.4 2-.3z" />
    </>
  ),
  miles: (
    <>
      <rect x="3" y="8.5" width="18" height="12" rx="2.2" />
      <path d="M3 12.5h18" />
      <path d="M12 8.5v12" />
      <path d="M12 8.5c-2.4 0-3.8-1-3.8-2.4C8.2 4.8 9.2 4 10.4 4.4 11.6 4.8 12 6.6 12 8.5z" />
      <path d="M12 8.5c2.4 0 3.8-1 3.8-2.4C15.8 4.8 14.8 4 13.6 4.4 12.4 4.8 12 6.6 12 8.5z" />
    </>
  ),
  reports: (
    <>
      <path d="M4 20V11" />
      <path d="M10 20V5" />
      <path d="M16 20v-7" />
      <path d="M3 20h18" />
    </>
  ),
  integrations: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.6" />
      <rect x="14" y="14" width="7" height="7" rx="1.6" />
      <path d="M10 6.5h5.5a2 2 0 012 2V14" />
      <path d="M6.5 10v3.5a2 2 0 002 2H14" />
    </>
  ),
  profile: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20c0-3.6 3.4-5.6 7.5-5.6s7.5 2 7.5 5.6" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8.5a6 6 0 10-12 0c0 6-2.5 7.5-2.5 7.5h17S18 14.5 18 8.5z" />
      <path d="M10.3 20a2 2 0 003.4 0" />
    </>
  ),
  chevron: <path d="M9 6l6 6-6 6" />,
  logout: (
    <>
      <path d="M15 17l5-5-5-5" />
      <path d="M20 12H9" />
      <path d="M11 4H6a2 2 0 00-2 2v12a2 2 0 002 2h5" />
    </>
  ),
  external: (
    <>
      <path d="M14 4h6v6" />
      <path d="M20 4l-9 9" />
      <path d="M18 14v4a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h4" />
    </>
  ),
};

export function Icon({ name, size = 20, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {PATHS[name] || null}
    </svg>
  );
}

export function PageActions({ children }) {
  return <div className="mb-5 flex flex-wrap items-center justify-end gap-2">{children}</div>;
}

export function Section({ title, right, children, className = "", pad = "p-6" }) {
  return (
    <div className={`card ${pad} ${className}`}>
      {(title || right) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <h3 className="text-sm font-bold uppercase tracking-widest text-ink/70">{title}</h3>}
          {right}
        </div>
      )}
      {children}
    </div>
  );
}
