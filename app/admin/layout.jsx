"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminNav from "@/components/AdminNav";
import AdminTopbar from "@/components/AdminTopbar";
import { adminUser } from "@/lib/admin";

export default function AdminLayout({ children }) {
  const path = usePathname();
  const router = useRouter();
  const [state, setState] = useState("checking"); // checking | ok | denied
  const isLogin = path === "/admin/login";

  useEffect(() => {
    let active = true;
    adminUser().then((u) => {
      if (!active) return;
      if (u) setState("ok");
      else {
        setState("denied");
        if (!isLogin) router.replace("/admin/login");
      }
    });
    return () => { active = false; };
  }, [path, isLogin, router]);

  if (isLogin) return <div className="bg-play min-h-screen">{children}</div>;

  if (state !== "ok") {
    return (
      <div className="bg-app flex min-h-screen items-center justify-center text-mute">
        {state === "checking" ? "Checking access…" : "Redirecting to sign in…"}
      </div>
    );
  }

  return (
    <div className="bg-app flex min-h-screen">
      <AdminNav />
      <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
        <AdminTopbar />
        <main className="mx-auto w-full max-w-6xl px-5 py-6 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
