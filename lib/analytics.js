"use client";

import { supabase, hasSupabase } from "@/lib/supabaseClient";
import { DEMO_KPIS, DEMO_MEMBERS, DEMO_CAMPAIGNS, DEMO_INFLUENCERS } from "@/lib/demo";
import { tierForPoints } from "@/lib/menu";

export async function getMembers() {
  if (!hasSupabase) return DEMO_MEMBERS;
  const { data } = await supabase
    .from("loyalty_members")
    .select("name,email,points,visits,created_at")
    .order("points", { ascending: false })
    .limit(100);
  if (!data || !data.length) return DEMO_MEMBERS;
  return data.map((m) => ({ ...m, tier: tierForPoints(m.points).name, joined: m.created_at }));
}

export async function getCampaigns() {
  if (!hasSupabase) return DEMO_CAMPAIGNS;
  const { data } = await supabase.from("campaigns").select("*").order("created_at", { ascending: false });
  if (!data || !data.length) return DEMO_CAMPAIGNS;
  return data;
}

export async function saveCampaign(c) {
  if (!hasSupabase) return { ...c, id: "local-" + Date.now() };
  const { data } = await supabase.from("campaigns").insert(c).select().single();
  return data;
}

export async function getInfluencers() {
  if (!hasSupabase) return DEMO_INFLUENCERS;
  const { data } = await supabase.from("influencers").select("*").order("fit", { ascending: false });
  if (!data || !data.length) return DEMO_INFLUENCERS;
  return data;
}

export async function getKpis() {
  const k = { ...DEMO_KPIS };
  if (hasSupabase) {
    const { count: members } = await supabase
      .from("loyalty_members")
      .select("*", { count: "exact", head: true });
    if (members) k.members = members;
  }
  return k;
}
