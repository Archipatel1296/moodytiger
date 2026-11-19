"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { adminSignOut } from "@/lib/admin";

const NAV = [
  { href: "/admin", label: "Overview", icon: "📊" },
  { href: "/admin/campaigns", label: "Creator Studio", icon: "🎨" },
  { href: "/admin/influencers", label: "Local Creators", icon: "⭐" },
  { href: "/admin/loyalty", label: "Miles Club", icon: "🎁" },
  { href: "/admin/codes", label: "Miles Codes", icon: "🎟️" },
];

export default function AdminNav() {
  const path = usePathname();
  const router = useRouter();
  return (
    <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-ink/10 bg-white p-4">
      <Link href="/admin" className="flex items-center gap-2 px-2 py-2">
        <span className="text-2xl">🐯</span>
        <div className="leading-tight">
          <div className="display font-600 lowercase text-ink">moodytiger</div>
          <div className="text-[10px] uppercase tracking-widest text-mute">Marketing Engine</div>
        </div>
      </Link>

      <nav className="mt-6 space-y-1">
        {NAV.map((n) => {
          const active = path === n.href;
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`flex items-center gap-3 rounded-xl2 px-3 py-2.5 text-sm transition ${
                active ? "bg-tiger text-white" : "text-ink/70 hover:bg-ink/5 hover:text-ink"
              }`}
            >
              <span>{n.icon}</span>
              {n.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-1">
        <Link href="/" className="flex items-center gap-3 rounded-xl2 px-3 py-2.5 text-sm text-mute hover:bg-ink/5">
          ↗ View site
        </Link>
        <button
          onClick={async () => { await adminSignOut(); router.push("/admin/login"); }}
          className="flex w-full items-center gap-3 rounded-xl2 px-3 py-2.5 text-sm text-mute hover:bg-ink/5"
        >
          ⎋ Sign out
        </button>
      </div>
    </aside>
  );
}
