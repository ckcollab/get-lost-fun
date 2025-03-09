import { Card } from "@gl/types/card";

// This is your level card. It contains information about the level and credits.
export function card(): Card {
  return {
    level: {
      name: "Pokemon Battle Arena",
      version: 1.0,
    },
    source: null,
    credits: [
      {
        name: "User",
        role: "Creator",
        link: null,
      },
      {
        name: "Claude",
        role: "Assistant Developer",
        link: null,
      },
      {
        name: "Nintendo/The Pokemon Company",
        role: "Original Pokemon Concept",
        link: "https://www.pokemon.com",
      },
    ],
  };
}
