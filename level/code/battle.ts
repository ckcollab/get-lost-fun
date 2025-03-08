import * as host from "@gl/api/w2h/host";
import { Pokemon, Move, getTypeEffectiveness, MoveCategory, StatusCondition } from "./pokemon";

// Battle state
export enum BattleState {
  NOT_STARTED,
  INTRO,
  PLAYER_TURN,
  OPPONENT_TURN,
  EXECUTING_MOVE,
  BATTLE_END,
}

// Battle result
export enum BattleResult {
  ONGOING,
  PLAYER_WIN,
  OPPONENT_WIN,
  FLED,
}

// Battle options
export enum BattleOption {
  FIGHT = "fight",
  POKEMON = "pokemon",
  BAG = "bag",
  RUN = "run",
}

// Battle messages
export class BattleMessage {
  text: string;
  duration: i32;
  startTime: i32;

  constructor(text: string, duration: i32, startTime: i32 = 0) {
    this.text = text;
    this.duration = duration;
    this.startTime = startTime;
  }

  isExpired(currentTime: i32): boolean {
    return currentTime - this.startTime > this.duration;
  }
}

// Battle manager
export class BattleManager {
  playerPokemon: Pokemon;
  opponentPokemon: Pokemon;
  currentState: BattleState;
  battleResult: BattleResult;
  selectedOption: BattleOption | null;
  selectedMoveIndex: i32;
  isPlayerFirst: boolean;
  turnCounter: i32;
  messages: BattleMessage[];
  currentTime: i32;
  
  constructor(playerPokemon: Pokemon, opponentPokemon: Pokemon) {
    this.playerPokemon = playerPokemon;
    this.opponentPokemon = opponentPokemon;
    this.currentState = BattleState.NOT_STARTED;
    this.battleResult = BattleResult.ONGOING;
    this.selectedOption = null;
    this.selectedMoveIndex = -1;
    this.isPlayerFirst = playerPokemon.speed >= opponentPokemon.speed;
    this.turnCounter = 0;
    this.messages = [];
    this.currentTime = 0;
  }

  // Start battle
  startBattle(): void {
    this.currentState = BattleState.INTRO;
    this.addMessage(`A wild ${this.opponentPokemon.name} appeared!`, 2000);
    this.addMessage(`Go! ${this.playerPokemon.name}!`, 2000);
    
    // Determine who goes first based on speed
    this.isPlayerFirst = this.playerPokemon.speed >= this.opponentPokemon.speed;
    
    // After intro messages, move to player's turn
    setTimeout(() => {
      this.currentState = BattleState.PLAYER_TURN;
    }, 4000);
  }

  // Process player's selected battle option
  selectOption(option: BattleOption): void {
    if (this.currentState !== BattleState.PLAYER_TURN) return;
    
    this.selectedOption = option;
    
    switch (option) {
      case BattleOption.FIGHT:
        // Show move selection UI (handled by UI rendering)
        break;
      case BattleOption.RUN:
        // 75% chance to run successfully
        if (Math.random() < 0.75) {
          this.battleResult = BattleResult.FLED;
          this.currentState = BattleState.BATTLE_END;
          this.addMessage("Got away safely!", 2000);
        } else {
          this.addMessage("Can't escape!", 1500);
          this.selectedOption = null; // Reset option
        }
        break;
      // Other options would be implemented here
      default:
        this.selectedOption = null;
        break;
    }
  }

  // Select a move to use
  selectMove(moveIndex: i32): void {
    if (this.currentState !== BattleState.PLAYER_TURN || this.selectedOption !== BattleOption.FIGHT) return;
    if (moveIndex < 0 || moveIndex >= this.playerPokemon.moves.length) return;
    
    this.selectedMoveIndex = moveIndex;
    this.executePlayerMove();
  }

  // Execute player's selected move
  executePlayerMove(): void {
    const move = this.playerPokemon.moves[this.selectedMoveIndex];
    this.currentState = BattleState.EXECUTING_MOVE;
    
    this.addMessage(`${this.playerPokemon.name} used ${move.name}!`, 1500);
    
    // Check if move hits (based on accuracy)
    if (Math.random() * 100 > move.accuracy) {
      this.addMessage("But it missed!", 1500);
    } else {
      // Calculate and apply damage
      const damage = this.calculateDamage(move, this.playerPokemon, this.opponentPokemon);
      
      if (damage > 0) {
        this.opponentPokemon.takeDamage(damage);
        
        // Check effectiveness
        let effectiveness: f32 = 1.0;
        for (let i = 0; i < this.opponentPokemon.types.length; i++) {
          effectiveness *= getTypeEffectiveness(move.type, this.opponentPokemon.types[i]);
        }
        
        if (effectiveness > 1.5) {
          this.addMessage("It's super effective!", 1500);
        } else if (effectiveness < 0.5) {
          this.addMessage("It's not very effective...", 1500);
        } else if (effectiveness === 0) {
          this.addMessage("It had no effect!", 1500);
        }
        
        // Apply status effects
        if (move.statusEffect !== StatusCondition.NONE && Math.random() * 100 <= move.statusChance) {
          this.opponentPokemon.setStatus(move.statusEffect);
          this.addMessage(`${this.opponentPokemon.name} was ${move.statusEffect}!`, 1500);
        }
      }
    }
    
    // Check if battle is over
    if (!this.opponentPokemon.isAlive()) {
      this.battleResult = BattleResult.PLAYER_WIN;
      this.currentState = BattleState.BATTLE_END;
      this.addMessage(`${this.opponentPokemon.name} fainted!`, 2000);
      this.addMessage("You won the battle!", 2000);
      return;
    }
    
    // Move to opponent's turn
    setTimeout(() => {
      this.currentState = BattleState.OPPONENT_TURN;
      this.executeOpponentMove();
    }, 2000);
  }

  // Execute opponent's move
  executeOpponentMove(): void {
    this.currentState = BattleState.EXECUTING_MOVE;
    
    // AI selects a random move
    const moveIndex = Math.floor(Math.random() * this.opponentPokemon.moves.length);
    const move = this.opponentPokemon.moves[moveIndex];
    
    this.addMessage(`${this.opponentPokemon.name} used ${move.name}!`, 1500);
    
    // Check if move hits
    if (Math.random() * 100 > move.accuracy) {
      this.addMessage("But it missed!", 1500);
    } else {
      // Calculate and apply damage
      const damage = this.calculateDamage(move, this.opponentPokemon, this.playerPokemon);
      
      if (damage > 0) {
        this.playerPokemon.takeDamage(damage);
        
        // Check effectiveness
        let effectiveness: f32 = 1.0;
        for (let i = 0; i < this.playerPokemon.types.length; i++) {
          effectiveness *= getTypeEffectiveness(move.type, this.playerPokemon.types[i]);
        }
        
        if (effectiveness > 1.5) {
          this.addMessage("It's super effective!", 1500);
        } else if (effectiveness < 0.5) {
          this.addMessage("It's not very effective...", 1500);
        } else if (effectiveness === 0) {
          this.addMessage("It had no effect!", 1500);
        }
        
        // Apply status effects
        if (move.statusEffect !== StatusCondition.NONE && Math.random() * 100 <= move.statusChance) {
          this.playerPokemon.setStatus(move.statusEffect);
          this.addMessage(`${this.playerPokemon.name} was ${move.statusEffect}!`, 1500);
        }
      }
    }
    
    // Check if battle is over
    if (!this.playerPokemon.isAlive()) {
      this.battleResult = BattleResult.OPPONENT_WIN;
      this.currentState = BattleState.BATTLE_END;
      this.addMessage(`${this.playerPokemon.name} fainted!`, 2000);
      this.addMessage("You lost the battle!", 2000);
      return;
    }
    
    // Back to player's turn
    setTimeout(() => {
      this.turnCounter++;
      this.currentState = BattleState.PLAYER_TURN;
      this.selectedOption = null;
      this.selectedMoveIndex = -1;
    }, 2000);
  }

  // Calculate damage for a move
  calculateDamage(move: Move, attacker: Pokemon, defender: Pokemon): i32 {
    // If it's a status move, it doesn't do damage
    if (move.category === MoveCategory.STATUS) return 0;
    
    // Basic damage formula (simplified from Pokemon games)
    // ((2 * Level / 5 + 2) * Power * A/D / 50) + 2) * modifiers
    
    const level = attacker.level;
    const power = move.power;
    
    // Get the appropriate attack and defense stats
    let attackStat: i32;
    let defenseStat: i32;
    
    if (move.category === MoveCategory.PHYSICAL) {
      attackStat = attacker.attack;
      defenseStat = defender.defense;
    } else {
      attackStat = attacker.spAttack;
      defenseStat = defender.spDefense;
    }
    
    // Base damage calculation
    let damage = Math.floor(((2 * level / 5 + 2) * power * attackStat / defenseStat) / 50) + 2;
    
    // Apply STAB (Same Type Attack Bonus)
    let stab: f32 = 1.0;
    for (let i = 0; i < attacker.types.length; i++) {
      if (attacker.types[i] === move.type) {
        stab = 1.5;
        break;
      }
    }
    
    // Apply type effectiveness
    let typeEffect: f32 = 1.0;
    for (let i = 0; i < defender.types.length; i++) {
      typeEffect *= getTypeEffectiveness(move.type, defender.types[i]);
    }
    
    // Random factor (85-100%)
    const randomFactor = 0.85 + (Math.random() * 0.15);
    
    // Final damage calculation
    damage = Math.floor(damage * stab * typeEffect * randomFactor);
    
    return damage;
  }

  // Add a message to the battle log
  addMessage(text: string, duration: i32): void {
    const message = new BattleMessage(text, duration, this.currentTime);
    this.messages.push(message);
  }
  
  // Update battle state
  update(timestep: f32): void {
    this.currentTime += timestep;
    
    // Remove expired messages
    this.messages = this.messages.filter(msg => !msg.isExpired(this.currentTime));
    
    // Other time-based updates would go here
  }
} 