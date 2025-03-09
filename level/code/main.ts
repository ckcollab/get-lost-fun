import * as host from "@gl/api/w2h/host";

import { Room } from "@gl/types/room";
import { Player } from "@gl/utils/player";
export { card } from "./card";
export { exits } from "./exits";
export { pickups } from "./pickups";
export { strings } from "./strings";

const log = host.debug.log;

// Game state variables
let tsfid!: i32;
let player!: Player;
let music!: i32;
let battleMusic!: i32;
let hasPotion: i32 = 1; // Healing potion counter

// Pokemon battle variables
let battleActive: boolean = false;
let playerTurn: boolean = true;
let attackInProgress: boolean = false;

// Pokemon stats
let charizardHP: i32 = 100;
let charizardMaxHP: i32 = 100;
let bulbasaurHP: i32 = 100;
let bulbasaurMaxHP: i32 = 100;

// Pokemon sprite identifiers
let charizardSprite: i32 = -1;
let bulbasaurSprite: i32 = -1;
let healthBarPlayer: i32 = -1;
let healthBarOpponent: i32 = -1;

// Attack timers
let attackAnimationTimer: string = "attack-animation";
let battleEndTimer: string = "battle-end";
let charizardX: f32 = 5.0;
let charizardY: f32 = 8.0;
let bulbasaurX: f32 = 12.0;
let bulbasaurY: f32 = 8.0;

// This function initializes your level. It's called once when the level is
// loaded. Use it to set up your level, like setting the time of day, or adding
// filters.
export function initRoom(): Room {
  player = Player.default();
  
  // Create room
  const room = new Room();
  charizardHP = 100;
  bulbasaurHP = 100;
  
  tsfid = host.filters.addTiltShift(0.06);
  
  // Show an immediate welcome message
  host.text.displaySign("welcome-title", "welcome-body");
  
  // Log the initialization for debugging
  log("Pokemon Battle Arena initialized. Enter the arena to start a battle!");
  
  return room;
}

// No need for a separate function, we'll use simple signs

export function setupBattleArena(): void {
  log("Setting up battle arena...");
  
  // Load the sprites for the Pokemon
  // Note: In this API we can only load sprites, but we can't manipulate them directly
  
  // Create Charizard sprite (player's Pokemon)
  charizardSprite = host.sprite.loadSpriteSheet("Actor/Monsters/Dragon/SpriteSheet.png");
  
  // Create Bulbasaur sprite (opponent)
  bulbasaurSprite = host.sprite.loadSpriteSheet("Actor/Monsters/KappaGreen/SpriteSheet.png");
  
  // Create visual representations using simple signs
  host.text.displaySign("charizard-visual", "🔥 CHARIZARD 🔥");
  host.text.displaySign("bulbasaur-visual", "🌿 BULBASAUR 🌿");
  
  // Load battle music
  battleMusic = host.sound.loadSound({
    name: "Musics/17 - Fight.ogg",
    loop: true,
    autoplay: true,
    volume: 0.5,
  });
  
  // Set battle state
  battleActive = true;
  playerTurn = true;
  
  // Hide the player character during battle
  host.player.setPos(-100, -100); // Move player off-screen
  
  // Show battle intro
  host.text.displaySign("battle-start-title", "battle-start-body");
  
  // Start the battle sequence after intro
  host.timer.start("battle-intro", 3, false, 0);
}

// Simplified function for Pokemon visuals - we'll just use displaySign
function createPokemonVisuals(): void {
  // We'll use text.displaySign for simplicity
  host.text.displaySign("charizard-visual", "🔥 CHARIZARD 🔥");
  host.text.displaySign("bulbasaur-visual", "🌿 BULBASAUR 🌿");
  
  // Update health bars
  updateHealthBars();
}

// Hide Pokemon visuals when battle ends - not needed anymore since each displaySign auto-hides

export function movePlayer(x: f32, y: f32): void {
  player.direction.x = x;
  player.direction.y = y;
}

// Called when a timer event is triggered.
export function timerEvent(name: string, userData: i32): void {
  log(`Timer event: ${name}, ${userData}`);
  
  if (name === "battle-intro") {
    // Show battle options after intro
    showBattleOptions();
  } else if (name === "show-attack-options") {
    // Show the attack options after displaying status
    if (battleActive && playerTurn && !attackInProgress) {
      host.text.displayInteraction("battle-options-title", "battle-options-body", [
        "attack-flamethrower",
        "attack-dragon-claw",
        "attack-fire-spin"
      ]);
    }
  } else if (name === attackAnimationTimer) {
    // Attack animation finished
    attackInProgress = false;
    
    // Check if battle should continue
    if (charizardHP <= 0 || bulbasaurHP <= 0) {
      // Battle ended
      host.timer.start(battleEndTimer, 1, false, 0);
    } else if (!playerTurn) {
      // AI turn
      aiAttack();
    } else {
      // Back to player's turn
      showBattleOptions();
    }
  } else if (name === battleEndTimer) {
    // Show battle results
    if (charizardHP <= 0) {
      host.text.displaySign("battle-lose-title", "battle-lose-body");
    } else {
      host.text.displaySign("battle-win-title", "battle-win-body");
    }
    
    // Return player to normal position after battle
    host.timer.start("return-player", 3, false, 0);
  } else if (name === "return-player") {
    // End battle mode and return player to arena entrance
    battleActive = false;
    host.player.setPos(100, 150);
  } else if (name === "start-battle") {
    // Start the actual battle
    setupBattleArena();
  } else if (name === "flash-charizard") {
    // Flash effect for Charizard by displaying sign again
    host.text.displaySign("charizard-visual", "🔥 CHARIZARD 🔥");
  } else if (name === "flash-bulbasaur") {
    // Flash effect for Bulbasaur by displaying sign again
    host.text.displaySign("bulbasaur-visual", "🌿 BULBASAUR 🌿");
    
    // Update health information
    updateHealthBars();
  }
}

function showBattleOptions(): void {
  if (battleActive && playerTurn && !attackInProgress) {
    // Create a custom battle status message to show before options
    const battleStatus = `Charizard HP: ${charizardHP}/${charizardMaxHP} | Bulbasaur HP: ${bulbasaurHP}/${bulbasaurMaxHP}`;
    
    // Display the battle status first
    host.text.displaySign("battle-status", battleStatus);
    
    // After a short delay, show the attack options
    host.timer.start("show-attack-options", 2, false, 0);
  }
}

// Called when an async asset has been loaded.
export function assetLoadedEvent(id: i32): void {}

export function pickupEvent(slug: string, took: bool): void {
  log(`Pickup event: ${slug}, ${took}`);
  
  if (slug === "potion" && took) {
    // Heal Charizard
    charizardHP = charizardMaxHP;
    updateHealthBars();
  }
}

// When a key is pressed, this function is called.
export function keyPressEvent(slug: string, down: bool): void {}

export function choiceMadeEvent(textSlug: string, choice: string): void {
  log(`Choice made for ${textSlug}: ${choice}`);
  
  if (textSlug === "battle-options-body") {
    // Player attack chosen
    if (choice === "attack-flamethrower") {
      playerAttack("flamethrower", 20);
    } else if (choice === "attack-dragon-claw") {
      playerAttack("dragon-claw", 15);
    } else if (choice === "attack-fire-spin") {
      playerAttack("fire-spin", 25);
    }
  } else if (textSlug === "battle-end-body" || 
             textSlug === "battle-win-body" || 
             textSlug === "battle-lose-body") {
    // End battle dialogue
    // Will return player via timer
  }
}

// Update playerAttack function
function playerAttack(attackName: string, damage: i32): void {
  // Set attack in progress
  attackInProgress = true;
  
  // Display attack message
  let attackMessage = "";
  if (attackName === "attack-flamethrower") {
    attackMessage = "player-attack-flamethrower";
    // Create attack flash effect
    host.timer.start("flash-charizard", 0.3, false, 0);
  } else if (attackName === "attack-dragon-claw") {
    attackMessage = "player-attack-dragon-claw";
    // Create attack flash effect
    host.timer.start("flash-charizard", 0.3, false, 0);
  } else if (attackName === "attack-fire-spin") {
    attackMessage = "player-attack-fire-spin";
    // Create attack flash effect
    host.timer.start("flash-charizard", 0.3, false, 0);
  }
  
  // Display the attack message
  host.text.displaySign("player-attack-title", attackMessage);
  
  // Apply damage to Bulbasaur
  bulbasaurHP = max(0, bulbasaurHP - damage);
  
  // Play attack sound - use the pokemon_boom_explosion.mp3 for Charizard's attacks
  const attackSound = host.sound.loadSound({
    name: "FX/pokemon_boom_explosion.mp3",
    loop: false,
    autoplay: true,
    volume: 0.6,
  });
  
  // Flash the Bulbasaur sprite to show damage
  host.timer.start("flash-bulbasaur", 0.3, false, 0);
  
  // Update health displays
  updateHealthBars();
  
  // End player turn and start AI turn after animation delay
  playerTurn = false;
  host.timer.start(attackAnimationTimer, 2, false, 0);
}

// Update aiAttack function
function aiAttack(): void {
  log("AI attacking...");
  
  // Set attack in progress
  attackInProgress = true;
  
  // Determine attack type (no randomness)
  let attackType = (charizardHP + bulbasaurHP) % 3;
  let attackName = "";
  let damage = 0;
  
  // Set attack parameters based on type
  if (attackType === 0) {
    attackName = "opponent-attack-vine-whip";
    damage = 10;
    // Create attack flash effect
    host.timer.start("flash-bulbasaur", 0.3, false, 0);
  } else if (attackType === 1) {
    attackName = "opponent-attack-razor-leaf";
    damage = 15;
    // Create attack flash effect
    host.timer.start("flash-bulbasaur", 0.3, false, 0);
  } else {
    attackName = "opponent-attack-solar-beam";
    damage = 20;
    // Create attack flash effect
    host.timer.start("flash-bulbasaur", 0.3, false, 0);
  }
  
  // Display the attack message
  host.text.displaySign("opponent-attack-title", attackName);
  
  // Apply damage to player
  charizardHP = max(0, charizardHP - damage);
  
  // Play attack sound - use the soft_boom.mp3 for Bulbasaur's attacks
  const attackSound = host.sound.loadSound({
    name: "FX/soft_boom.mp3",
    loop: false,
    autoplay: true,
    volume: 0.6,
  });
  
  // Flash the Charizard sprite to show damage
  host.timer.start("flash-charizard", 0.3, false, 0);
  
  // Update health displays
  updateHealthBars();
  
  // End AI turn and return to player after animation
  playerTurn = true;
  host.timer.start(attackAnimationTimer, 2, false, 0);
}

function updateHealthBars(): void {
  // Since we can't manipulate the sprites directly,
  // we'll update the health information in the battle text
  // We'll show current HP in the battle options title
  log(`Charizard HP: ${charizardHP}/${charizardMaxHP}, Bulbasaur HP: ${bulbasaurHP}/${bulbasaurMaxHP}`);
}

function resetBattle(): void {
  battleActive = false;
  playerTurn = true;
  attackInProgress = false;
  charizardHP = charizardMaxHP;
  bulbasaurHP = bulbasaurMaxHP;
  
  // We don't need to explicitly hide visuals
  // DisplaySign messages auto-hide based on context switches
}

// When a tile collision event occurs, this function is called.
export function tileCollisionEvent(
  tsTileId: i32,
  gid: i32,
  entered: bool,
  column: i32,
  row: i32
): void {}

// Called when a sensor is triggered.
export function sensorEvent(name: string, entered: bool): void {
  log(`Sensor event triggered: ${name}, entered=${entered}`);
  
  if (name === "battle-trigger" && entered && !battleActive) {
    // Log that player entered the battle arena
    log("PLAYER ENTERED BATTLE ARENA! Starting battle sequence...");
    
    // Show message that player has entered the battle arena
    host.text.displaySign("battle-arena-title", "battle-arena-body");
    
    // Start the battle with a slight delay
    host.timer.start("start-battle", 1.5, false, 0);
  }
}

// Called when the game is paused
export function pauseTick(timestep: f32): void {}

// Called every frame.
export function tickRoom(timestep: f32): void {
  if (!battleActive) {
    // Normal game mode - update player position
    player.tick(timestep);
    host.player.setAction(player.action);
    host.player.setPos(player.pos.x, player.pos.y);
    host.filters.setTiltShiftY(tsfid, player.pos.y);
  } else {
    // Battle mode - focus on battle arena
    host.filters.setTiltShiftY(tsfid, -62);
  }
}

// Helper function
function max(a: i32, b: i32): i32 {
  return a > b ? a : b;
}
