export type Item = { id: string; name: string; price: number; filter: string };

export const WITCHES: Item[] = [
  { id: "sage", name: "Adaçayı Cadısı", price: 0, filter: "none" },
  { id: "rose", name: "Gül Cadısı", price: 3, filter: "hue-rotate(250deg) saturate(1.3)" },
  { id: "frost", name: "Ayaz Cadısı", price: 6, filter: "hue-rotate(110deg) saturate(1.2)" },
  { id: "ember", name: "Köz Cadısı", price: 10, filter: "hue-rotate(300deg) saturate(1.8) brightness(1.1)" },
  { id: "shadow", name: "Gölge Cadısı", price: 15, filter: "grayscale(0.8) brightness(0.8) contrast(1.2)" },
];

export const CAULDRONS: Item[] = [
  { id: "iron", name: "Demir Kazan", price: 0, filter: "none" },
  { id: "rose", name: "Pembe Kazan", price: 2, filter: "hue-rotate(200deg) saturate(1.4)" },
  { id: "sky", name: "Gök Kazan", price: 5, filter: "hue-rotate(90deg)" },
  { id: "gold", name: "Altın Kazan", price: 12, filter: "hue-rotate(290deg) saturate(2) brightness(1.2)" },
];

/** Reward for a focus session: full potion if finished, half if abandoned for a break. */
export function sessionReward(completed: boolean, elapsedSec: number): number {
  if (completed) return 1;
  return elapsedSec > 0 ? 0.5 : 0;
}

export function canBuy(potions: number, item: Item, owned: string[]): boolean {
  return !owned.includes(item.id) && potions >= item.price;
}
