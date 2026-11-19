// Miles Club loyalty config for moodytiger.
// (Field is still called "points" internally; the UI shows "miles".)

export const REWARDS = [
  { id: "ship", name: "Free Shipping", points: 150, desc: "Free shipping on your next order." },
  { id: "socks", name: "Free Kids' Socks", points: 300, desc: "A pair of moodytiger performance socks." },
  { id: "off15", name: "15% Off Any Item", points: 500, desc: "15% off one full-price item." },
  { id: "hat", name: "Free Sun Hat", points: 750, desc: "A UV-protective play hat, on us." },
  { id: "tee", name: "Free Everyday Tee", points: 1100, desc: "A free moodytiger tee in any size." },
  { id: "vip", name: "VIP Early Access", points: 1800, desc: "Shop new drops 48 hours early." },
];

export const TIERS = [
  { name: "Cub", min: 0, perk: "Earn 1 mile per $1", color: "#FFC53D" },
  { name: "Explorer", min: 500, perk: "+ Birthday reward", color: "#5BC236" },
  { name: "Adventurer", min: 1500, perk: "+ Free shipping always", color: "#2DA7FF" },
  { name: "Legend", min: 3500, perk: "+ Early access to drops", color: "#FF6B35" },
];

export function tierForPoints(points) {
  let current = TIERS[0];
  for (const t of TIERS) if (points >= t.min) current = t;
  return current;
}
