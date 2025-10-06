// js/game/GameEngine.js
import { WaveManager } from "./WaveManager.js";
import { TowerManager } from "./TowerManager.js";
import { EnemyManager } from "./EnemyManager.js";
import { HeroManager } from "./HeroManager.js";
import { UIManager } from "./UIManager.js";

export class GameEngine {
  constructor(canvas, levelData, faction) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.levelData = levelData;
    this.faction = faction;
    
    // Игровое состояние
    this.gameState = {
      coins: levelData.startingCoins,
      lives: levelData.startingLives,
      score: 0,
      isPaused: false,
      isGameOver: false,
      currentWave: 0,
      totalWaves: levelData.waves.length
    };
    
    // Менеджеры систем
    this.waveManager = new WaveManager(this, levelData.waves);
    this.towerManager = new TowerManager(this, levelData.towerSpots);
    this.enemyManager = new EnemyManager(this, levelData.paths);
    this.heroManager = new HeroManager(this, levelData.heroPosition);
    this.uiManager = new UIManager(this);
    
    // Режим строительства
    this.buildMode = null;
    this.selectedTowerType = null;
    
    // Анимация
    this.lastTime = 0;
    this.animationId = null;
    
    this.setupCanvas();
  }

  setupCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    
    // Обработка изменения размера
    window.addEventListener("resize", () => {
      const rect = this.canvas.getBoundingClientRect();
      this.canvas.width = rect.width;
      this.canvas.height = rect.height;
    });
  }

  async start() {
    console.log("Starting game engine...");
    this.gameLoop();
    this.uiManager.update();
  }

  gameLoop(currentTime = 0) {
    if (this.gameState.isGameOver) return;
    
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    
    if (!this.gameState.isPaused) {
      this.update(deltaTime);
    }
    
    this.render();
    this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
  }

  update(deltaTime) {
    // Обновляем все системы
    this.waveManager.update(deltaTime);
    this.enemyManager.update(deltaTime);
    this.towerManager.update(deltaTime);
    this.heroManager.update(deltaTime);
    
    // Проверяем условия победы/поражения
    this.checkGameConditions();
  }

  render() {
    // Очищаем канвас
    this.ctx.fillStyle = "#1a1a1a";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Рисуем дороги
    this.renderPaths();
    
    // Рисуем башни
    this.towerManager.render(this.ctx);
    
    // Рисуем противников
    this.enemyManager.render(this.ctx);
    
    // Рисуем героя
    this.heroManager.render(this.ctx);
    
    // Рисуем режим строительства
    this.renderBuildMode();
  }

  renderPaths() {
    this.ctx.strokeStyle = "#8B4513";
    this.ctx.lineWidth = 40;
    this.ctx.lineCap = "round";
    
    this.levelData.paths.forEach(path => {
      this.ctx.beginPath();
      this.ctx.moveTo(path.start.x, path.start.y);
      if (path.control) {
        this.ctx.quadraticCurveTo(path.control.x, path.control.y, path.end.x, path.end.y);
      } else {
        this.ctx.lineTo(path.end.x, path.end.y);
      }
      this.ctx.stroke();
    });
  }

  renderBuildMode() {
    if (!this.buildMode) return;
    
    this.ctx.fillStyle = "rgba(0, 255, 0, 0.3)";
    this.ctx.fillRect(this.buildMode.x - 15, this.buildMode.y - 15, 30, 30);
    
    this.ctx.strokeStyle = "#00FF00";
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(this.buildMode.x - 15, this.buildMode.y - 15, 30, 30);
  }

  setTowerMode(towerType) {
    this.selectedTowerType = towerType;
    this.buildMode = { x: 0, y: 0 };
    console.log(`Selected tower: ${towerType}`);
  }

  handleCanvasClick(x, y) {
    if (this.selectedTowerType && this.buildMode) {
      this.buildMode.x = x;
      this.buildMode.y = y;
      
      // Проверяем, можно ли построить башню здесь
      if (this.towerManager.canBuildTower(x, y, this.selectedTowerType)) {
        this.towerManager.buildTower(x, y, this.selectedTowerType);
        this.buildMode = null;
        this.selectedTowerType = null;
      }
    }
  }

  startNextWave() {
    this.waveManager.startNextWave();
  }

  togglePause() {
    this.gameState.isPaused = !this.gameState.isPaused;
    this.uiManager.update();
  }

  addCoins(amount) {
    this.gameState.coins += amount;
    this.uiManager.update();
  }

  spendCoins(amount) {
    if (this.gameState.coins >= amount) {
      this.gameState.coins -= amount;
      this.uiManager.update();
      return true;
    }
    return false;
  }

  loseLife(amount = 1) {
    this.gameState.lives -= amount;
    this.uiManager.update();
    
    if (this.gameState.lives <= 0) {
      this.gameOver();
    }
  }

  addScore(points) {
    this.gameState.score += points;
    this.uiManager.update();
  }

  checkGameConditions() {
    // Проверяем победу
    if (this.waveManager.isAllWavesComplete() && this.enemyManager.getEnemyCount() === 0) {
      this.victory();
    }
  }

  gameOver() {
    this.gameState.isGameOver = true;
    console.log("Game Over!");
    // Здесь можно показать экран поражения
  }

  victory() {
    console.log("Victory!");
    // Здесь можно показать экран победы
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}