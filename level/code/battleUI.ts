import * as host from "@gl/api/w2h/host";
import { BattleManager, BattleState, BattleOption } from "./battle";
import { Pokemon } from "./pokemon";

// Battle UI rendering
export class BattleUI {
  private battleManager: BattleManager;
  private canvasWidth: i32 = 640;
  private canvasHeight: i32 = 480;
  
  // UI element positions
  private playerPokemonX: i32 = 100;
  private playerPokemonY: i32 = 250;
  private opponentPokemonX: i32 = 400;
  private opponentPokemonY: i32 = 150;
  
  // UI elements
  private battleBackgroundId: i32 = -1;
  private playerPokemonSpriteId: i32 = -1;
  private opponentPokemonSpriteId: i32 = -1;
  private playerHealthBarId: i32 = -1;
  private opponentHealthBarId: i32 = -1;
  private battleOptionsPanelId: i32 = -1;
  private moveSelectionPanelId: i32 = -1;
  private messagePanelId: i32 = -1;
  
  constructor(battleManager: BattleManager) {
    this.battleManager = battleManager;
  }
  
  // Initialize UI elements
  initialize(): void {
    // Load battle background
    this.battleBackgroundId = host.drawing.createRect({
      x: 0,
      y: 0,
      width: this.canvasWidth,
      height: this.canvasHeight,
      color: 0x87CEEB, // Light blue
      layer: 0,
    });
    
    // Create battle ground
    const battleGroundId = host.drawing.createRect({
      x: 0,
      y: this.canvasHeight - 150,
      width: this.canvasWidth,
      height: 150,
      color: 0x8B4513, // Brown
      layer: 1,
    });
    
    // Create message panel
    this.messagePanelId = host.drawing.createRect({
      x: 20,
      y: this.canvasHeight - 120,
      width: this.canvasWidth - 40,
      height: 100,
      color: 0xFFFFFF,
      layer: 10,
      cornerRadius: 10,
      borderWidth: 4,
      borderColor: 0x000000,
    });
    
    // Load Pokemon sprites
    this.loadPokemonSprites();
    
    // Create health bars
    this.createHealthBars();
    
    // Create battle options panel (initially hidden)
    this.createBattleOptionsPanel();
    
    // Create move selection panel (initially hidden)
    this.createMoveSelectionPanel();
    
    // Hide UI elements that shouldn't be visible at start
    host.drawing.setVisible(this.battleOptionsPanelId, false);
    host.drawing.setVisible(this.moveSelectionPanelId, false);
  }
  
  // Load Pokemon sprites
  loadPokemonSprites(): void {
    const playerPokemon = this.battleManager.playerPokemon;
    const opponentPokemon = this.battleManager.opponentPokemon;
    
    // Player Pokemon sprite
    this.playerPokemonSpriteId = host.drawing.createSprite({
      name: `Actor/Monsters/${playerPokemon.spriteName}/Idle.png`,
      x: this.playerPokemonX,
      y: this.playerPokemonY,
      width: 100,
      height: 100,
      layer: 5,
    });
    
    // Opponent Pokemon sprite
    this.opponentPokemonSpriteId = host.drawing.createSprite({
      name: `Actor/Monsters/${opponentPokemon.spriteName}/Idle.png`,
      x: this.opponentPokemonX,
      y: this.opponentPokemonY,
      width: 100,
      height: 100,
      layer: 5,
    });
  }
  
  // Create health bars
  createHealthBars(): void {
    const playerPokemon = this.battleManager.playerPokemon;
    const opponentPokemon = this.battleManager.opponentPokemon;
    
    // Player health bar container
    const playerHealthContainer = host.drawing.createRect({
      x: this.playerPokemonX - 30,
      y: this.playerPokemonY - 80,
      width: 160,
      height: 50,
      color: 0xFFFFFF,
      layer: 6,
      cornerRadius: 5,
      borderWidth: 2,
      borderColor: 0x000000,
    });
    
    // Player Pokemon name
    const playerNameText = host.drawing.createText({
      text: playerPokemon.name,
      x: this.playerPokemonX - 20,
      y: this.playerPokemonY - 75,
      size: 16,
      color: 0x000000,
      layer: 7,
    });
    
    // Player health bar
    const playerHealthBg = host.drawing.createRect({
      x: this.playerPokemonX - 20,
      y: this.playerPokemonY - 55,
      width: 140,
      height: 15,
      color: 0x808080,
      layer: 7,
    });
    
    this.playerHealthBarId = host.drawing.createRect({
      x: this.playerPokemonX - 20,
      y: this.playerPokemonY - 55,
      width: 140,
      height: 15,
      color: 0x00FF00,
      layer: 8,
    });
    
    // Player HP text
    const playerHpText = host.drawing.createText({
      text: `HP: ${playerPokemon.currentHp}/${playerPokemon.maxHp}`,
      x: this.playerPokemonX,
      y: this.playerPokemonY - 35,
      size: 12,
      color: 0x000000,
      layer: 7,
    });
    
    // Opponent health bar container
    const opponentHealthContainer = host.drawing.createRect({
      x: this.opponentPokemonX - 30,
      y: this.opponentPokemonY - 80,
      width: 160,
      height: 50,
      color: 0xFFFFFF,
      layer: 6,
      cornerRadius: 5,
      borderWidth: 2,
      borderColor: 0x000000,
    });
    
    // Opponent Pokemon name
    const opponentNameText = host.drawing.createText({
      text: opponentPokemon.name,
      x: this.opponentPokemonX - 20,
      y: this.opponentPokemonY - 75,
      size: 16,
      color: 0x000000,
      layer: 7,
    });
    
    // Opponent health bar
    const opponentHealthBg = host.drawing.createRect({
      x: this.opponentPokemonX - 20,
      y: this.opponentPokemonY - 55,
      width: 140,
      height: 15,
      color: 0x808080,
      layer: 7,
    });
    
    this.opponentHealthBarId = host.drawing.createRect({
      x: this.opponentPokemonX - 20,
      y: this.opponentPokemonY - 55,
      width: 140,
      height: 15,
      color: 0x00FF00,
      layer: 8,
    });
    
    // Opponent HP text
    const opponentHpText = host.drawing.createText({
      text: `HP: ${opponentPokemon.currentHp}/${opponentPokemon.maxHp}`,
      x: this.opponentPokemonX,
      y: this.opponentPokemonY - 35,
      size: 12,
      color: 0x000000,
      layer: 7,
    });
  }
  
  // Create battle options panel
  createBattleOptionsPanel(): void {
    // Battle options panel container
    this.battleOptionsPanelId = host.drawing.createRect({
      x: this.canvasWidth - 200,
      y: this.canvasHeight - 150,
      width: 180,
      height: 140,
      color: 0xFFFFFF,
      layer: 11,
      cornerRadius: 10,
      borderWidth: 2,
      borderColor: 0x000000,
    });
    
    // Fight option
    const fightOptionId = host.drawing.createRect({
      x: this.canvasWidth - 190,
      y: this.canvasHeight - 140,
      width: 160,
      height: 30,
      color: 0xFF0000,
      layer: 12,
      cornerRadius: 5,
    });
    
    const fightTextId = host.drawing.createText({
      text: "FIGHT",
      x: this.canvasWidth - 120,
      y: this.canvasHeight - 130,
      size: 16,
      color: 0xFFFFFF,
      layer: 13,
    });
    
    // Pokemon option
    const pokemonOptionId = host.drawing.createRect({
      x: this.canvasWidth - 190,
      y: this.canvasHeight - 100,
      width: 160,
      height: 30,
      color: 0x00FF00,
      layer: 12,
      cornerRadius: 5,
    });
    
    const pokemonTextId = host.drawing.createText({
      text: "POKEMON",
      x: this.canvasWidth - 120,
      y: this.canvasHeight - 90,
      size: 16,
      color: 0xFFFFFF,
      layer: 13,
    });
    
    // Run option
    const runOptionId = host.drawing.createRect({
      x: this.canvasWidth - 190,
      y: this.canvasHeight - 60,
      width: 160,
      height: 30,
      color: 0x0000FF,
      layer: 12,
      cornerRadius: 5,
    });
    
    const runTextId = host.drawing.createText({
      text: "RUN",
      x: this.canvasWidth - 120,
      y: this.canvasHeight - 50,
      size: 16,
      color: 0xFFFFFF,
      layer: 13,
    });
  }
  
  // Create move selection panel
  createMoveSelectionPanel(): void {
    const playerPokemon = this.battleManager.playerPokemon;
    
    // Move selection panel container
    this.moveSelectionPanelId = host.drawing.createRect({
      x: this.canvasWidth - 250,
      y: this.canvasHeight - 180,
      width: 230,
      height: 170,
      color: 0xFFFFFF,
      layer: 11,
      cornerRadius: 10,
      borderWidth: 2,
      borderColor: 0x000000,
    });
    
    // Create move buttons (up to 4 moves)
    const moveCount = Math.min(playerPokemon.moves.length, 4);
    
    for (let i = 0; i < moveCount; i++) {
      const move = playerPokemon.moves[i];
      const row = i % 2;
      const col = Math.floor(i / 2);
      
      const moveButtonId = host.drawing.createRect({
        x: this.canvasWidth - 240 + col * 110,
        y: this.canvasHeight - 170 + row * 40,
        width: 100,
        height: 30,
        color: this.getTypeColor(move.type),
        layer: 12,
        cornerRadius: 5,
      });
      
      const moveTextId = host.drawing.createText({
        text: move.name,
        x: this.canvasWidth - 190 + col * 110,
        y: this.canvasHeight - 160 + row * 40,
        size: 14,
        color: 0xFFFFFF,
        layer: 13,
      });
    }
    
    // Back button
    const backButtonId = host.drawing.createRect({
      x: this.canvasWidth - 240,
      y: this.canvasHeight - 80,
      width: 210,
      height: 30,
      color: 0x808080,
      layer: 12,
      cornerRadius: 5,
    });
    
    const backTextId = host.drawing.createText({
      text: "BACK",
      x: this.canvasWidth - 135,
      y: this.canvasHeight - 70,
      size: 16,
      color: 0xFFFFFF,
      layer: 13,
    });
  }
  
  // Get color based on Pokemon type
  getTypeColor(type: string): u32 {
    switch (type) {
      case "fire": return 0xFF4500;      // Red/Orange
      case "water": return 0x1E90FF;     // Blue
      case "grass": return 0x32CD32;     // Green
      case "electric": return 0xFFD700;  // Yellow
      case "normal": return 0xA9A9A9;    // Gray
      case "poison": return 0x800080;    // Purple
      case "ground": return 0xD2B48C;    // Tan
      case "flying": return 0x87CEEB;    // Light Blue
      case "psychic": return 0xFF1493;   // Pink
      case "bug": return 0x9ACD32;       // Yellow Green
      case "rock": return 0xA52A2A;      // Brown
      case "ghost": return 0x483D8B;     // Dark Blue
      case "dragon": return 0x7B68EE;    // Purple/Blue
      default: return 0x808080;          // Gray
    }
  }
  
  // Update the UI based on battle state
  update(): void {
    // Update health bars
    this.updateHealthBars();
    
    // Update message panel
    this.updateMessagePanel();
    
    // Show/hide UI elements based on battle state
    this.updateUIVisibility();
  }
  
  // Update health bars
  updateHealthBars(): void {
    const playerPokemon = this.battleManager.playerPokemon;
    const opponentPokemon = this.battleManager.opponentPokemon;
    
    // Update player health bar
    const playerHealthPercentage = playerPokemon.currentHp / playerPokemon.maxHp;
    const playerHealthWidth = 140 * playerHealthPercentage;
    
    host.drawing.setWidth(this.playerHealthBarId, playerHealthWidth);
    
    // Update health bar color based on remaining HP
    if (playerHealthPercentage > 0.5) {
      host.drawing.setColor(this.playerHealthBarId, 0x00FF00); // Green
    } else if (playerHealthPercentage > 0.2) {
      host.drawing.setColor(this.playerHealthBarId, 0xFFFF00); // Yellow
    } else {
      host.drawing.setColor(this.playerHealthBarId, 0xFF0000); // Red
    }
    
    // Update opponent health bar
    const opponentHealthPercentage = opponentPokemon.currentHp / opponentPokemon.maxHp;
    const opponentHealthWidth = 140 * opponentHealthPercentage;
    
    host.drawing.setWidth(this.opponentHealthBarId, opponentHealthWidth);
    
    // Update health bar color based on remaining HP
    if (opponentHealthPercentage > 0.5) {
      host.drawing.setColor(this.opponentHealthBarId, 0x00FF00); // Green
    } else if (opponentHealthPercentage > 0.2) {
      host.drawing.setColor(this.opponentHealthBarId, 0xFFFF00); // Yellow
    } else {
      host.drawing.setColor(this.opponentHealthBarId, 0xFF0000); // Red
    }
  }
  
  // Update message panel
  updateMessagePanel(): void {
    // Get the most recent message
    if (this.battleManager.messages.length > 0) {
      const latestMessage = this.battleManager.messages[this.battleManager.messages.length - 1];
      
      // Update message text
      // In a real implementation, you'd maintain a text element ID and update it
      // For simplicity, we'll clear existing text and create a new one
      
      // Create or update text element
      const messageTextId = host.drawing.createText({
        text: latestMessage.text,
        x: 40,
        y: this.canvasHeight - 80,
        size: 18,
        color: 0x000000,
        layer: 11,
      });
    }
  }
  
  // Update UI visibility based on battle state
  updateUIVisibility(): void {
    switch (this.battleManager.currentState) {
      case BattleState.PLAYER_TURN:
        // Show battle options if no option selected
        if (this.battleManager.selectedOption === null) {
          host.drawing.setVisible(this.battleOptionsPanelId, true);
          host.drawing.setVisible(this.moveSelectionPanelId, false);
        } 
        // Show move selection if FIGHT option is selected
        else if (this.battleManager.selectedOption === BattleOption.FIGHT) {
          host.drawing.setVisible(this.battleOptionsPanelId, false);
          host.drawing.setVisible(this.moveSelectionPanelId, true);
        }
        break;
        
      case BattleState.OPPONENT_TURN:
      case BattleState.EXECUTING_MOVE:
        // Hide battle options and move selection during opponent's turn or move execution
        host.drawing.setVisible(this.battleOptionsPanelId, false);
        host.drawing.setVisible(this.moveSelectionPanelId, false);
        break;
        
      case BattleState.BATTLE_END:
        // Hide all battle UI elements on battle end
        host.drawing.setVisible(this.battleOptionsPanelId, false);
        host.drawing.setVisible(this.moveSelectionPanelId, false);
        break;
    }
  }
  
  // Handle player input
  handleInput(x: f32, y: f32): void {
    // Convert input coordinates to check against UI elements
    const inputX = x * this.canvasWidth;
    const inputY = y * this.canvasHeight;
    
    // Handle battle option selection
    if (this.battleManager.currentState === BattleState.PLAYER_TURN && 
        this.battleManager.selectedOption === null) {
      // Check if clicking on FIGHT option
      if (inputX >= this.canvasWidth - 190 && inputX <= this.canvasWidth - 30 &&
          inputY >= this.canvasHeight - 140 && inputY <= this.canvasHeight - 110) {
        this.battleManager.selectOption(BattleOption.FIGHT);
      }
      // Check if clicking on POKEMON option
      else if (inputX >= this.canvasWidth - 190 && inputX <= this.canvasWidth - 30 &&
               inputY >= this.canvasHeight - 100 && inputY <= this.canvasHeight - 70) {
        this.battleManager.selectOption(BattleOption.POKEMON);
      }
      // Check if clicking on RUN option
      else if (inputX >= this.canvasWidth - 190 && inputX <= this.canvasWidth - 30 &&
               inputY >= this.canvasHeight - 60 && inputY <= this.canvasHeight - 30) {
        this.battleManager.selectOption(BattleOption.RUN);
      }
    }
    // Handle move selection
    else if (this.battleManager.currentState === BattleState.PLAYER_TURN && 
             this.battleManager.selectedOption === BattleOption.FIGHT) {
      // Check for move clicks (up to 4 moves)
      const moveCount = Math.min(this.battleManager.playerPokemon.moves.length, 4);
      
      for (let i = 0; i < moveCount; i++) {
        const row = i % 2;
        const col = Math.floor(i / 2);
        
        if (inputX >= this.canvasWidth - 240 + col * 110 && 
            inputX <= this.canvasWidth - 140 + col * 110 &&
            inputY >= this.canvasHeight - 170 + row * 40 && 
            inputY <= this.canvasHeight - 140 + row * 40) {
          this.battleManager.selectMove(i);
          break;
        }
      }
      
      // Check if clicking on BACK button
      if (inputX >= this.canvasWidth - 240 && inputX <= this.canvasWidth - 30 &&
          inputY >= this.canvasHeight - 80 && inputY <= this.canvasHeight - 50) {
        // Reset selection
        this.battleManager.selectedOption = null;
      }
    }
  }
  
  // Clean up UI elements
  cleanUp(): void {
    // Clean up all UI elements when battle is done
    host.drawing.remove(this.battleBackgroundId);
    host.drawing.remove(this.playerPokemonSpriteId);
    host.drawing.remove(this.opponentPokemonSpriteId);
    host.drawing.remove(this.playerHealthBarId);
    host.drawing.remove(this.opponentHealthBarId);
    host.drawing.remove(this.battleOptionsPanelId);
    host.drawing.remove(this.moveSelectionPanelId);
    host.drawing.remove(this.messagePanelId);
    
    // Other elements would need to be cleaned up as well
    // For a complete implementation, you'd need to track all created drawing IDs
  }
} 