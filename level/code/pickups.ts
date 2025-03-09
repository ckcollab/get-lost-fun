import { Pickup } from "@gl/types/pickup";

// This function returns an array of pickups that are used in your level.
export function pickups(): Pickup[] {
  return [
    {
      slug: "potion",
      name: "Healing Potion",
      text: "A magical potion that restores your Pokemon's health completely.",
      uses: 1,
    }
  ];
} 