"use client";

import { supabase, hasSupabase } from "@/lib/supabaseClient";
import { REWARDS } from "@/lib/menu";

// ── Rewards (editable from the dashboard) ────────────────────
export async function getRewards({ activeOnly = true } = {}) {
  if (!hasSupabase) return REWARDS;
  let q = supabase.from("rewards").select("*").order("sort_order", { ascending: true });
  if (activeOnly) q = q.eq("active", true);
  const { data } = await q;
  if (!data || !data.length) return REWARDS;
  return data;
}

export async function saveReward(reward) {
  if (!hasSupabase) return { ...reward };
  const row = {
    id: reward.id,
    name: reward.name,
    description: reward.description,
    points: Number(reward.points) || 0,
    sort_order: reward.sort_order ?? 0,
    active: reward.active !== false,
  };
  const { data } = await supabase.from("rewards").upsert(row).select().single();
  return data;
}
