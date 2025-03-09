import { String } from "@gl/types/i18n";

// This function returns an array of strings that are used in your level. You
// don't need every translation for every string, just the ones you want to
// manually translate. The rest will be machine translated.
export function strings(): String[] {
  return [
    // Battle UI strings
    {
      key: "battle-start-title",
      description: "The title of the battle start screen.",
      values: [
        {
          text: "🔥 Pokemon Battle! 🔥",
          lang: "en",
          age: 0,
        },
      ],
    },
    {
      key: "battle-start-body",
      description: "The body of the battle start screen.",
      values: [
        {
          text: "Charizard vs. Bulbasaur!\nPrepare for battle!",
          lang: "en",
          age: 0,
        },
      ],
    },
    {
      key: "welcome-title",
      description: "The welcome title displayed when entering the game.",
      values: [
        {
          text: "Welcome to Pokemon Battle Arena!",
          lang: "en",
          age: 0,
        },
      ],
    },
    {
      key: "welcome-body",
      description: "The welcome message explaining what to do.",
      values: [
        {
          text: "Step into the battle arena to start a Pokemon battle!\nCharizard vs. Bulbasaur awaits!",
          lang: "en",
          age: 0,
        },
      ],
    },
    {
      key: "battle-arena-title",
      description: "The title displayed when entering the battle arena.",
      values: [
        {
          text: "Battle Arena",
          lang: "en",
          age: 0,
        },
      ],
    },
    {
      key: "battle-arena-body",
      description: "The message displayed when entering the battle arena.",
      values: [
        {
          text: "You've entered the Pokemon Battle Arena!\nPreparing for battle...",
          lang: "en",
          age: 0,
        },
      ],
    },
    {
      key: "battle-status",
      description: "The battle status display showing current HP.",
      values: [
        {
          text: "Battle Status",
          lang: "en",
          age: 0,
        },
      ],
    },
    {
      key: "battle-options-title",
      description: "The title of the battle options screen.",
      values: [
        {
          text: "Charizard's Turn",
          lang: "en",
          age: 0,
        },
      ],
    },
    {
      key: "battle-options-body",
      description: "The body of the battle options screen.",
      values: [
        {
          text: "Choose an attack!",
          lang: "en",
          age: 0,
        },
      ],
    },
    {
      key: "battle-win-title",
      description: "The title of the battle win screen.",
      values: [
        {
          text: "🏆 Victory! 🏆",
          lang: "en",
          age: 0,
        },
      ],
    },
    {
      key: "battle-win-body",
      description: "The body of the battle win screen.",
      values: [
        {
          text: "Charizard defeated Bulbasaur!\nBulbasaur fainted!",
          lang: "en",
          age: 0,
        },
      ],
    },
    {
      key: "battle-lose-title",
      description: "The title of the battle lose screen.",
      values: [
        {
          text: "😢 Defeat! 😢",
          lang: "en",
          age: 0,
        },
      ],
    },
    {
      key: "battle-lose-body",
      description: "The body of the battle lose screen.",
      values: [
        {
          text: "Charizard was defeated!\nCharizard fainted!",
          lang: "en",
          age: 0,
        },
      ],
    },
    {
      key: "battle-end-title",
      description: "The title of the battle end screen.",
      values: [
        {
          text: "Battle Ended",
          lang: "en",
          age: 0,
        },
      ],
    },
    {
      key: "battle-end-body",
      description: "The body of the battle end screen.",
      values: [
        {
          text: "The battle has ended.\nClick to restart.",
          lang: "en",
          age: 0,
        },
      ],
    },
    
    // Player attack names
    {
      key: "attack-flamethrower",
      description: "The name of the flamethrower attack.",
      values: [
        {
          text: "Flamethrower",
          lang: "en",
          age: 0,
        },
      ],
    },
    {
      key: "attack-dragon-claw",
      description: "The name of the dragon claw attack.",
      values: [
        {
          text: "Dragon Claw",
          lang: "en",
          age: 0,
        },
      ],
    },
    {
      key: "attack-fire-spin",
      description: "The name of the fire spin attack.",
      values: [
        {
          text: "Fire Spin",
          lang: "en",
          age: 0,
        },
      ],
    },
    
    // Player attack messages
    {
      key: "player-attack-title",
      description: "The title of the player attack message.",
      values: [
        {
          text: "Charizard attacks!",
          lang: "en",
          age: 0,
        },
      ],
    },
    {
      key: "player-attack-flamethrower",
      description: "The flamethrower attack message.",
      values: [
        {
          text: "Charizard used Flamethrower!\nIt's super effective!",
          lang: "en",
          age: 0,
        },
      ],
    },
    {
      key: "player-attack-dragon-claw",
      description: "The dragon claw attack message.",
      values: [
        {
          text: "Charizard used Dragon Claw!\nA direct hit!",
          lang: "en",
          age: 0,
        },
      ],
    },
    {
      key: "player-attack-fire-spin",
      description: "The fire spin attack message.",
      values: [
        {
          text: "Charizard used Fire Spin!\nBulbasaur is trapped in a fiery vortex!",
          lang: "en",
          age: 0,
        },
      ],
    },
    
    // Opponent attack messages
    {
      key: "opponent-attack-title",
      description: "The title of the opponent attack message.",
      values: [
        {
          text: "Bulbasaur attacks!",
          lang: "en",
          age: 0,
        },
      ],
    },
    {
      key: "opponent-attack-vine-whip",
      description: "The vine whip attack message.",
      values: [
        {
          text: "Bulbasaur used Vine Whip!\nIt's not very effective...",
          lang: "en",
          age: 0,
        },
      ],
    },
    {
      key: "opponent-attack-razor-leaf",
      description: "The razor leaf attack message.",
      values: [
        {
          text: "Bulbasaur used Razor Leaf!\nCharizard took damage!",
          lang: "en",
          age: 0,
        },
      ],
    },
    {
      key: "opponent-attack-solar-beam",
      description: "The solar beam attack message.",
      values: [
        {
          text: "Bulbasaur used Solar Beam!\nA critical hit!",
          lang: "en",
          age: 0,
        },
      ],
    },
  ];
}
