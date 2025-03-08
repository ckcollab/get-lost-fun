import { Exit } from "@gl/types/exit";

// This function returns an array of exits that are used in your level. You can
// only exit one of the options listed here.
export function exits(): Exit[] {
  return [
    {
      name: "east",
    },
    {
      name: "west",
    },
    {
      name: "south",
    },
    {
      name: "well",
    },
    {
      name: "pokemon-center",
      description: "Go to the Pokemon Center to heal your Pokemon",
    },
    {
      name: "battle-arena",
      description: "Enter the Pokemon Battle Arena to challenge opponents",
    },
  ];
}
