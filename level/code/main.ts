import * as host from "@gl/api/w2h/host";

import { Room } from "@gl/types/room";
import { Player } from "@gl/utils/player";
export { card } from "./card";
export { exits } from "./exits";
export { pickups } from "./pickups";
export { strings } from "./strings";

// Import Pokemon battle system
import { Pokemon, createStarterPokemon } from "./pokemon";
import { BattleManager, BattleState, BattleResult } from "./battle";
import { BattleUI } from "./battleUI";

const log = host.debug.log;

let tsfid!: i32;
let player!: Player;
let music!: i32;

// Pokemon battle system
let playerPokemon: Pokemon | null = null;
let battleManager: BattleManager | null = null;
let battleUI: BattleUI | null = null;
let inBattle: boolean = false;
let hasChosenStarter: boolean = false;
let battleMusic: i32 = -1;

// This function initializes your level. It's called once when the level is
// loaded. Use it to set up your level, like setting the time of day, or adding
// filters.
export function initRoom(): Room {
  player = Player.default();

  const room = new Room();
  tsfid = host.filters.addTiltShift(0.06);

  // const time = Date.UTC(2025, 1, 13, 9, 0, 0, 0);
  // host.time.setSunTime(time);

  music = host.sound.loadSound({
    name: "Musics/17 - Fight.ogg",
    loop: true,
    autoplay: true,
    volume: 0.3,
  });
  
  // Preload battle music
  battleMusic = host.sound.loadSound({
    name: "Musics/13 - Credit.ogg",
    loop: true,
    autoplay: false,
    volume: 0.5,
  });

  return room;
}

export function movePlayer(x: f32, y: f32): void {
  // Only allow movement if not in battle
  if (!inBattle) {
    player.direction.x = x;
    player.direction.y = y;
  } else if (battleUI) {
    // If in battle, handle battle UI input
    battleUI.handleInput(x, y);
  }
}

// Called when a timer event is triggered.
export function timerEvent(name: string, userData: i32): void {
  log(`Timer event: ${name}, ${userData}`);
}

// Called when an async asset has been loaded.
export function assetLoadedEvent(id: i32): void {}

// When a key is pressed, this function is called. The `slug` is the key that
// was pressed, and `down` is true if the key was pressed down, and false if it
// was released.
export function keyPressEvent(slug: string, down: bool): void {
  if (inBattle && down) {
    // Handle battle key controls
    if (slug === "e" || slug === "Enter") {
      // Confirm selection in battle
    } else if (slug === "Escape") {
      // Try to escape battle
      if (battleManager) {
        battleManager.selectOption(BattleOption.RUN);
      }
    }
  }
}

export function choiceMadeEvent(textSlug: string, choice: string): void {
  log(`Choice made for ${textSlug}: ${choice}`);
  
  // Handle Pokemon starter selection
  if (textSlug === "pokemon-select-body") {
    const starterPokemon = createStarterPokemon();
    
    if (choice === "choose-flamander") {
      playerPokemon = starterPokemon.get("flamander");
      hasChosenStarter = true;
      host.text.displaySign("starter-choice-title", "You chose Flamander!");
    } else if (choice === "choose-aquaxol") {
      playerPokemon = starterPokemon.get("aquaxol");
      hasChosenStarter = true;
      host.text.displaySign("starter-choice-title", "You chose Aquaxol!");
    } else if (choice === "choose-leafslime") {
      playerPokemon = starterPokemon.get("leafslime");
      hasChosenStarter = true;
      host.text.displaySign("starter-choice-title", "You chose Leafslime!");
    }
  }
  // Handle original well interaction
  else if (textSlug === "well-body" && choice === "jump-down") {
    host.map.exit("well", true);
  }
}

// When a tile collision event occurs, this function is called. You can use this
// similar to a sensor event, but it's triggered by the collision of a tile.
// Most times you'll probably want to respond to a sensor event instead.
export function tileCollisionEvent(
  tsTileId: i32,
  gid: i32,
  entered: bool,
  column: i32,
  row: i32
): void {
  // log(`Collision event: ${tsTileId}, ${gid}, ${entered} @ ${column}, ${row}`);
}

let sawOasisSign = false;

// Called when a sensor is triggered.
export function sensorEvent(name: string, entered: bool): void {
  log(`Sensor event: ${name}, ${entered}`);
  
  // Original sensor events 
  if (name === "oasis" && entered && !sawOasisSign) {
    host.text.displaySign("oasis-entry-title", "oasis-entry-body");
    sawOasisSign = true;
  } 
  // New Pokemon-related sensor events
  else if (name === "pokemon-center" && entered) {
    // Show Pokemon selection if player hasn't chosen a starter yet
    if (!hasChosenStarter) {
      host.text.displayInteraction("pokemon-select-title", "pokemon-select-body", [
        "choose-flamander",
        "choose-aquaxol",
        "choose-leafslime",
      ]);
    } else {
      // Heal Pokemon if player has already chosen a starter
      if (playerPokemon) {
        playerPokemon.currentHp = playerPokemon.maxHp;
        playerPokemon.status = "none";
        host.text.displaySign("heal-title", "Your Pokemon has been fully healed!");
      }
    }
  }
  // Battle arena sensor
  else if (name === "battle-arena" && entered && !inBattle) {
    if (playerPokemon && hasChosenStarter) {
      startBattle();
    } else {
      host.text.displaySign("no-pokemon-title", "You need to choose a starter Pokemon first!");
    }
  }
  // Original sensor events (continued)
  else if (name === "flame" && entered) {
    host.text.displayInteraction("flame-title", "flame-body", []);
  } else if (name === "knight" && entered) {
    host.text.displayInteraction("knight-title", "knight-body", []);
  } else if (name === "well" && entered) {
    host.text.displayInteraction("well-title", "well-body", [
      "jump-down",
      "step-back",
    ]);
  } else if (name === "exit-east" && entered) {
    host.map.exit("east", false);
  } else if (name === "exit-west" && entered) {
    host.map.exit("west", false);
  } else if (name === "exit-south" && entered) {
    host.map.exit("south", false);
  }
}

// Start a Pokemon battle
function startBattle(): void {
  if (!playerPokemon) return;
  
  // Create a random wild Pokemon for the opponent
  const starterPokemon = createStarterPokemon();
  const starters = ["flamander", "aquaxol", "leafslime"];
  const randomStarterIndex = Math.floor(Math.random() * starters.length);
  const opponentPokemon = starterPokemon.get(starters[randomStarterIndex]);
  
  if (!opponentPokemon) return;
  
  // Create battle manager
  battleManager = new BattleManager(playerPokemon, opponentPokemon);
  
  // Create battle UI
  battleUI = new BattleUI(battleManager);
  
  // Set battle state
  inBattle = true;
  
  // Stop regular music and play battle music
  host.sound.setVolume(music, 0);
  host.sound.setVolume(battleMusic, 0.5);
  host.sound.play(battleMusic);
  
  // Initialize battle UI
  battleUI.initialize();
  
  // Start battle
  battleManager.startBattle();
  
  // Display battle start message
  host.text.displaySign("battle-start-title", "battle-start-body");
}

// End a Pokemon battle
function endBattle(): void {
  if (!battleManager || !battleUI) return;
  
  // Handle battle result
  if (battleManager.battleResult === BattleResult.PLAYER_WIN) {
    host.text.displaySign("battle-win-title", "battle-win-body");
  } else if (battleManager.battleResult === BattleResult.OPPONENT_WIN) {
    host.text.displaySign("battle-lose-title", "battle-lose-body");
    
    // Heal player's Pokemon to 1 HP to prevent softlock
    if (playerPokemon) {
      playerPokemon.currentHp = 1;
    }
  }
  
  // Clean up battle UI
  battleUI.cleanUp();
  
  // Reset battle state
  inBattle = false;
  battleManager = null;
  battleUI = null;
  
  // Resume regular music and stop battle music
  host.sound.setVolume(music, 0.3);
  host.sound.setVolume(battleMusic, 0);
  host.sound.stop(battleMusic);
}

// Called when the game is paused, `tickRoom` stops ticking and this function
// starts. Use this to advance things that you want to keep moving while the
// game is paused.
export function pauseTick(timestep: f32): void {}

// Called every frame. Use this to update your level in real-time. Timestep is
// in milliseconds.
export function tickRoom(timestep: f32): void {
  if (!inBattle) {
    // Regular game update
    player.tick(timestep);
    host.player.setAction(player.action);
    host.player.setPos(player.pos.x, player.pos.y);
    host.filters.setTiltShiftY(tsfid, player.pos.y - 10);
  } else {
    // Battle system update
    if (battleManager && battleUI) {
      // Update battle state
      battleManager.update(timestep);
      
      // Update battle UI
      battleUI.update();
      
      // Check if battle is over
      if (battleManager.currentState === BattleState.BATTLE_END) {
        // End battle after a short delay to show the end message
        setTimeout(() => {
          endBattle();
        }, 3000);
      }
    }
  }

  // Uncomment this to sync the time of day with the real world.
  // host.time.setSunTime(Date.now());
}
