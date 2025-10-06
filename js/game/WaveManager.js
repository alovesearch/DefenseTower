// js/game/WaveManager.js
import { EnemyData } from "../data/EnemyData.js";

export class WaveManager {
  constructor(gameEngine, waves) {
    this.gameEngine = gameEngine;
    this.waves = waves;
    this.currentWaveIndex = 0;
    this.currentWave = null;
    this.waveInProgress = false;
    this.spawnTimer = 0;
    this.enemyIndex = 0;
  }

  update(deltaTime) {
    if (this.waveInProgress && this.currentWave) {
      this.spawnTimer += deltaTime;
      
      if (this.spawnTimer >= this.currentWave.enemies[this.enemyIndex].delay) {
        this.spawnEnemy();
        this.spawnTimer = 0;
        this.enemyIndex++;
        
        // Проверяем, закончилась ли волна
        if (this.enemyIndex >= this.currentWave.enemies.length) {
          this.waveInProgress = false;
          this.currentWaveIndex++;
          this.enemyIndex = 0;
          this.gameEngine.gameState.currentWave = this.currentWaveIndex;
          this.gameEngine.uiManager.update();
        }
      }
    }
  }

  startNextWave() {
    if (this.currentWaveIndex >= this.waves.length) {
      console.log("All waves completed!");
      return;
    }
    
    this.currentWave = this.waves[this.currentWaveIndex];
    this.waveInProgress = true;
    this.spawnTimer = 0;
    this.enemyIndex = 0;
    
    console.log(`Starting wave ${this.currentWaveIndex + 1}`);
    this.gameEngine.uiManager.update();
  }

  spawnEnemy() {
    const enemyData = this.currentWave.enemies[this.enemyIndex];
    const enemy = EnemyData.getEnemy(enemyData.type);
    
    // Добавляем противника в менеджер противников
    this.gameEngine.enemyManager.addEnemy(enemy);
    
    console.log(`Spawned ${enemy.name}`);
  }

  isAllWavesComplete() {
    return this.currentWaveIndex >= this.waves.length && !this.waveInProgress;
  }

  getCurrentWave() {
    return this.currentWave;
  }

  getWaveProgress() {
    if (!this.currentWave) return 0;
    return this.enemyIndex / this.currentWave.enemies.length;
  }
}