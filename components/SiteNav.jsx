"use client";

import Link from "next/link";
import { ORDER_URL } from "@/lib/supabaseClient";

export default function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🐯</span>
          <span className="display text-xl font-600 lowercase tracking-tight text-ink">moodytiger</span>
        </Link>
        <nav className="flex items-center gap-2">
          <a href={ORDER_URL} target="_blank" rel="noreferrer" className="pill-ghost hidden sm:inline-flex">Shop</a>
          <Link href="/loyalty" className="pill-ghost">Miles Club</Link>
          <Link href="/admin" className="pill-primary">Owner login</Link>
        </nav>
      </div>
    </header>
  );
}
