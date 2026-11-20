"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { adminSignOut } from "@/lib/admin";
import { Icon } from "@/components/AdminUI";
import { OWNER } from "@/lib/demo";

const NAV = [
  { href: "/admin", label: "Overview", icon: "overview" },
  { href: "/admin/todo", label: "To-do", icon: "todo" },
  { href: "/admin/campaigns", label: "Creator Studio", icon: "creator" },
  { href: "/admin/influencers", label: "Influencer Studio", icon: "influencer" },
  { href: "/admin/loyalty", label: "Miles Club", icon: "miles" },
  { href: "/admin/reports", label: "Campaign Reports", icon: "reports" },
  { href: "/admin/integrations", label: "Integrations", icon: "integrations" },
];

const LS_KEY = "mt_sidebar_collapsed";

export default function AdminNav() {
  const path = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(LS_KEY) === "1");
    } catch {}
  }, []);

  function toggle() {
    setCollapsed((c) => {
      const next = !c;
      try { localStorage.setItem(LS_KEY, next ? "1" : "0"); } catch {}
      return next;
    });
  }

  const isActive = (href) => (href === "/admin" ? path === "/admin" : path.startsWith(href));
  const profileActive = path.startsWith("/admin/profile");

  return (
    <aside
      className={`sticky top-0 flex h-screen shrink-0 flex-col border-r border-line bg-white transition-[width] duration-200 ${
        collapsed ? "w-[76px]" : "w-64"
      }`}
    >
      {/* brand */}
      <div className="flex items-center gap-3 px-4 py-4">
        <Link href="/admin" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ink text-xl shadow-card">
          🐯
        </Link>
        {!collapsed && (
          <div className="min-w-0 leading-tight">
            <div className="display truncate text-lg font-600 lowercase text-ink">moodytiger</div>
            <div className="text-[10px] uppercase tracking-widest text-mute">Marketing Engine</div>
          </div>
        )}
        <button
          onClick={toggle}
          title={collapsed ? "Expand" : "Collapse"}
          className={`ml-auto flex h-7 w-7 items-center justify-center rounded-lg text-mute hover:bg-ink/5 hover:text-ink ${collapsed ? "hidden" : ""}`}
        >
          <Icon name="chevron" size={16} className="rotate-180" />
        </button>
      </div>

      {collapsed && (
        <button
          onClick={toggle}
          title="Expand"
          className="mx-auto mb-2 flex h-7 w-7 items-center justify-center rounded-lg text-mute hover:bg-ink/5 hover:text-ink"
        >
          <Icon name="chevron" size={16} />
        </button>
      )}

      {/* nav */}
      <nav className="mt-2 flex-1 space-y-1 px-3">
        {NAV.map((n) => {
          const active = isActive(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              title={collapsed ? n.label : undefined}
              className={`navitem ${active ? "navitem-active" : ""} ${collapsed ? "justify-center px-0" : ""}`}
            >
              <Icon name={n.icon} />
              {!collapsed && <span className="truncate">{n.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* footer: view site, sign out, profile */}
      <div className="space-y-1 border-t border-line px-3 py-3">
        <Link href="/" title="View site" className={`navitem ${collapsed ? "justify-center px-0" : ""}`}>
          <Icon name="external" />
          {!collapsed && <span>View site</span>}
        </Link>
        <button
          onClick={async () => { await adminSignOut(); router.push("/admin/login"); }}
          title="Sign out"
          className={`navitem w-full ${collapsed ? "justify-center px-0" : ""}`}
        >
          <Icon name="logout" />
          {!collapsed && <span>Sign out</span>}
        </button>

        <Link
          href="/admin/profile"
          title="Profile"
          className={`mt-1 flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-ink/5 ${
            profileActive ? "bg-tiger/10" : ""
          } ${collapsed ? "justify-center" : ""}`}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-tiger to-sun text-xs font-bold text-white">
            {OWNER.initials}
          </span>
          {!collapsed && (
            <div className="min-w-0 leading-tight">
              <div className="truncate text-sm font-semibold text-ink">{OWNER.name}</div>
              <div className="truncate text-[11px] text-mute">{OWNER.role}</div>
            </div>
          )}
        </Link>
      </div>
    </aside>
  );
}
