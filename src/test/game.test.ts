import { describe, it, expect } from "vitest";
import { sessionReward, canBuy, WITCHES } from "@/lib/game";

describe("potion rules", () => {
  it("full session gives 1 potion", () => expect(sessionReward(true, 1500)).toBe(1));
  it("break mid-session spills half", () => expect(sessionReward(false, 300)).toBe(0.5));
  it("cannot buy without enough potions", () => expect(canBuy(2, WITCHES[1]!, [])).toBe(false));
  it("can buy with enough potions", () => expect(canBuy(3, WITCHES[1]!, [])).toBe(true));
});
