"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/AdminUI";
import { OWNER } from "@/lib/demo";

const TITLES = {
  "/admin": { title: "Overview", subtitle: "How moodytiger turns Bay Area awareness into store sales." },
  "/admin/todo": { title: "To-do", subtitle: "Your marketing tasks and the team's workload." },
  "/admin/campaigns": { title: "Creator Studio", subtitle: "Design campaigns, generate creatives with Framia, and post." },
  "/admin/influencers": { title: "Influencer Studio", subtitle: "Find Bay Area family & kids creators, score fit, run outreach." },
  "/admin/loyalty": { title: "Miles Club", subtitle: "Members, tiers, rewards and receipt codes." },
  "/admin/reports": { title: "Campaign Reports", subtitle: "Performance across campaigns, channels and keywords." },
  "/admin/integrations": { title: "Integrations", subtitle: "Connect your Shopify store and social accounts." },
  "/admin/profile": { title: "Profile", subtitle: "Your account and brand settings." },
};

export default function AdminTopbar() {
  const path = usePathname();
  const key = Object.keys(TITLES)
    .filter((k) => (k === "/admin" ? path === "/admin" : path.startsWith(k)))
    .sort((a, b) => b.length - a.length)[0] || "/admin";
  const meta = TITLES[key];

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/80 backdrop-blur">
      <div className="flex items-center gap-4 px-5 py-3.5 sm:px-8">
        <div className="min-w-0">
          <h1 className="display truncate text-2xl text-ink">{meta.title}</h1>
          <p className="hidden truncate text-xs text-mute sm:block">{meta.subtitle}</p>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <label className="hidden items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-2 text-sm text-mute md:flex">
            <Icon name="search" size={16} />
            <input
              placeholder="Search campaigns, creators…"
              className="w-40 bg-transparent text-ink outline-none placeholder:text-mute lg:w-52"
            />
          </label>

          <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink/70 hover:text-ink" title="Notifications">
            <Icon name="bell" size={18} />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-tiger ring-2 ring-white" />
          </button>

          <Link href="/admin/profile" className="flex items-center gap-2 rounded-full border border-line bg-white py-1 pl-1 pr-3 hover:border-tiger/40">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-tiger to-sun text-xs font-bold text-white">
              {OWNER.initials}
            </span>
            <span className="hidden text-sm font-semibold text-ink sm:block">{OWNER.firstName}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
