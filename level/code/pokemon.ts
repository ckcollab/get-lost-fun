// Pokemon type system
export enum PokemonType {
  NORMAL = "normal",
  FIRE = "fire",
  WATER = "water",
  GRASS = "grass",
  ELECTRIC = "electric",
  ICE = "ice",
  FIGHTING = "fighting",
  POISON = "poison",
  GROUND = "ground",
  FLYING = "flying",
  PSYCHIC = "psychic",
  BUG = "bug",
  ROCK = "rock",
  GHOST = "ghost",
  DRAGON = "dragon",
}

// Status conditions
export enum StatusCondition {
  NONE = "none",
  BURN = "burn",
  FREEZE = "freeze",
  PARALYSIS = "paralysis",
  POISON = "poison",
  SLEEP = "sleep",
}

// Move category (physical or special)
export enum MoveCategory {
  PHYSICAL = "physical",
  SPECIAL = "special",
  STATUS = "status",
}

// Move definition
export class Move {
  name: string;
  type: PokemonType;
  power: i32;
  accuracy: i32;
  category: MoveCategory;
  statusEffect: StatusCondition;
  statusChance: i32; // 0-100 percentage

  constructor(
    name: string,
    type: PokemonType,
    power: i32,
    accuracy: i32,
    category: MoveCategory,
    statusEffect: StatusCondition = StatusCondition.NONE,
    statusChance: i32 = 0
  ) {
    this.name = name;
    this.type = type;
    this.power = power;
    this.accuracy = accuracy;
    this.category = category;
    this.statusEffect = statusEffect;
    this.statusChance = statusChance;
  }
}

// Pokemon class
export class Pokemon {
  name: string;
  types: PokemonType[];
  spriteName: string;
  level: i32;
  
  // Base stats
  maxHp: i32;
  attack: i32;
  defense: i32;
  spAttack: i32;
  spDefense: i32;
  speed: i32;
  
  // Battle stats
  currentHp: i32;
  status: StatusCondition;
  
  // Moves
  moves: Move[];

  constructor(
    name: string,
    types: PokemonType[],
    spriteName: string,
    level: i32,
    maxHp: i32,
    attack: i32,
    defense: i32,
    spAttack: i32,
    spDefense: i32,
    speed: i32,
    moves: Move[]
  ) {
    this.name = name;
    this.types = types;
    this.spriteName = spriteName;
    this.level = level;
    this.maxHp = maxHp;
    this.attack = attack;
    this.defense = defense;
    this.spAttack = spAttack;
    this.spDefense = spDefense;
    this.speed = speed;
    this.currentHp = maxHp;
    this.status = StatusCondition.NONE;
    this.moves = moves;
  }

  isAlive(): boolean {
    return this.currentHp > 0;
  }

  takeDamage(amount: i32): void {
    this.currentHp = Math.max(0, this.currentHp - amount);
  }

  heal(amount: i32): void {
    this.currentHp = Math.min(this.maxHp, this.currentHp + amount);
  }

  setStatus(status: StatusCondition): void {
    this.status = status;
  }
}

// Type effectiveness chart
export function getTypeEffectiveness(attackType: PokemonType, defenderType: PokemonType): f32 {
  // 0 = immune, 0.5 = not very effective, 1 = normal, 2 = super effective
  
  // Default effectiveness
  let effectiveness: f32 = 1.0;
  
  switch (attackType) {
    case PokemonType.NORMAL:
      if (defenderType === PokemonType.ROCK || defenderType === PokemonType.STEEL) effectiveness = 0.5;
      if (defenderType === PokemonType.GHOST) effectiveness = 0;
      break;
    case PokemonType.FIRE:
      if (defenderType === PokemonType.GRASS || defenderType === PokemonType.ICE || 
          defenderType === PokemonType.BUG) effectiveness = 2.0;
      if (defenderType === PokemonType.WATER || defenderType === PokemonType.ROCK || 
          defenderType === PokemonType.DRAGON) effectiveness = 0.5;
      break;
    case PokemonType.WATER:
      if (defenderType === PokemonType.FIRE || defenderType === PokemonType.GROUND || 
          defenderType === PokemonType.ROCK) effectiveness = 2.0;
      if (defenderType === PokemonType.WATER || defenderType === PokemonType.GRASS || 
          defenderType === PokemonType.DRAGON) effectiveness = 0.5;
      break;
    case PokemonType.GRASS:
      if (defenderType === PokemonType.WATER || defenderType === PokemonType.GROUND || 
          defenderType === PokemonType.ROCK) effectiveness = 2.0;
      if (defenderType === PokemonType.FIRE || defenderType === PokemonType.GRASS || 
          defenderType === PokemonType.POISON || defenderType === PokemonType.FLYING || 
          defenderType === PokemonType.BUG || defenderType === PokemonType.DRAGON) effectiveness = 0.5;
      break;
    case PokemonType.ELECTRIC:
      if (defenderType === PokemonType.WATER || defenderType === PokemonType.FLYING) effectiveness = 2.0;
      if (defenderType === PokemonType.GRASS || defenderType === PokemonType.ELECTRIC || 
          defenderType === PokemonType.DRAGON) effectiveness = 0.5;
      if (defenderType === PokemonType.GROUND) effectiveness = 0;
      break;
    default:
      effectiveness = 1.0;
  }
  
  return effectiveness;
}

// Create some predefined moves
export function createBasicMoves(): Map<string, Move> {
  const moves = new Map<string, Move>();
  
  // Basic moves
  moves.set("tackle", new Move("Tackle", PokemonType.NORMAL, 40, 100, MoveCategory.PHYSICAL));
  moves.set("scratch", new Move("Scratch", PokemonType.NORMAL, 40, 100, MoveCategory.PHYSICAL));
  moves.set("growl", new Move("Growl", PokemonType.NORMAL, 0, 100, MoveCategory.STATUS));
  
  // Fire moves
  moves.set("ember", new Move("Ember", PokemonType.FIRE, 40, 100, MoveCategory.SPECIAL, StatusCondition.BURN, 10));
  moves.set("flamethrower", new Move("Flamethrower", PokemonType.FIRE, 90, 100, MoveCategory.SPECIAL, StatusCondition.BURN, 10));
  
  // Water moves
  moves.set("watergun", new Move("Water Gun", PokemonType.WATER, 40, 100, MoveCategory.SPECIAL));
  moves.set("bubble", new Move("Bubble", PokemonType.WATER, 40, 100, MoveCategory.SPECIAL));
  
  // Grass moves
  moves.set("vinewhip", new Move("Vine Whip", PokemonType.GRASS, 45, 100, MoveCategory.PHYSICAL));
  moves.set("razorleaf", new Move("Razor Leaf", PokemonType.GRASS, 55, 95, MoveCategory.PHYSICAL));
  
  // Electric moves
  moves.set("thundershock", new Move("Thunder Shock", PokemonType.ELECTRIC, 40, 100, MoveCategory.SPECIAL, StatusCondition.PARALYSIS, 10));
  moves.set("thunderbolt", new Move("Thunderbolt", PokemonType.ELECTRIC, 90, 100, MoveCategory.SPECIAL, StatusCondition.PARALYSIS, 10));
  
  return moves;
}

// Create predefined Pokemon
export function createStarterPokemon(): Map<string, Pokemon> {
  const pokemon = new Map<string, Pokemon>();
  const moves = createBasicMoves();
  
  // Fire starter (Dragon-like)
  pokemon.set("flamander", new Pokemon(
    "Flamander",
    [PokemonType.FIRE],
    "Flam2",  // Sprite name from the art directory
    5,
    39,  // HP
    52,  // Attack
    43,  // Defense
    60,  // Sp. Attack
    50,  // Sp. Defense
    65,  // Speed
    [
      moves.get("scratch"),
      moves.get("growl"),
      moves.get("ember"),
    ]
  ));
  
  // Water starter (Axolot-like)
  pokemon.set("aquaxol", new Pokemon(
    "Aquaxol",
    [PokemonType.WATER],
    "AxolotBlue",  // Sprite name from the art directory
    5,
    44,  // HP
    48,  // Attack
    65,  // Defense
    50,  // Sp. Attack
    64,  // Sp. Defense
    43,  // Speed
    [
      moves.get("tackle"),
      moves.get("watergun"),
      moves.get("bubble"),
    ]
  ));
  
  // Grass starter (Slime-like)
  pokemon.set("leafslime", new Pokemon(
    "Leafslime",
    [PokemonType.GRASS],
    "Slime4",  // Sprite name from the art directory
    5,
    45,  // HP
    49,  // Attack
    49,  // Defense
    65,  // Sp. Attack
    65,  // Sp. Defense
    45,  // Speed
    [
      moves.get("tackle"),
      moves.get("growl"),
      moves.get("vinewhip"),
    ]
  ));
  
  return pokemon;
} 