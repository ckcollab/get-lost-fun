import { Card } from "@gl/types/card";

// This is your level card. It powers the `Credits` link on your level. As you
// add collaborators, include their details so they get credited for their work.
// If you use any assets that require attribution (like many Creative Commons
// licenses), include those as well.
export function card(): Card {
  return {
    level: {
      name: "Pokemon Battle Arena",
      version: 1,
    },
    source: "https://github.com/your-username/pokemon-battle-arena",
    credits: [
      {
        name: "Your name",
        role: "Developer",
        link: "https://your-website.com",
      },
      {
        name: "Game Freak",
        role: "Original Pokemon Concept",
        link: "https://www.pokemon.com",
      },
      {
        name: "GetLost Level Template",
        role: "Base Template",
        link: "https://getlost.city",
      },
    ],
  };
}
