// js/game/UIManager.js
export class UIManager {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
  }

  update() {
    this.updateResources();
    this.updateWaveInfo();
    this.updateButtons();
  }

  updateResources() {
    const coinsElement = document.getElementById("coins");
    const livesElement = document.getElementById("lives");
    
    if (coinsElement) {
      coinsElement.textContent = `💰 ${this.gameEngine.gameState.coins}`;
    }
    
    if (livesElement) {
      livesElement.textContent = `❤️ ${this.gameEngine.gameState.lives}`;
    }
  }

  updateWaveInfo() {
    const waveElement = document.getElementById("wave");
    const startWaveBtn = document.getElementById("start-wave");
    
    if (waveElement) {
      const currentWave = this.gameEngine.gameState.currentWave;
      const totalWaves = this.gameEngine.gameState.totalWaves;
      waveElement.textContent = `🌊 Волна ${currentWave}/${totalWaves}`;
    }
    
    if (startWaveBtn) {
      const canStartWave = this.gameEngine.waveManager.currentWaveIndex < this.gameEngine.waveManager.waves.length;
      const waveInProgress = this.gameEngine.waveManager.waveInProgress;
      
      if (waveInProgress) {
        startWaveBtn.textContent = "Волна идет...";
        startWaveBtn.disabled = true;
      } else if (canStartWave) {
        startWaveBtn.textContent = "Начать волну";
        startWaveBtn.disabled = false;
      } else {
        startWaveBtn.textContent = "Все волны завершены";
        startWaveBtn.disabled = true;
      }
    }
  }

  updateButtons() {
    const pauseBtn = document.getElementById("pause-btn");
    
    if (pauseBtn) {
      if (this.gameEngine.gameState.isPaused) {
        pauseBtn.textContent = "▶️";
        pauseBtn.style.background = "#4CAF50";
      } else {
        pauseBtn.textContent = "⏸️";
        pauseBtn.style.background = "#FF9800";
      }
    }
    
    // Обновляем кнопки башен
    const towerButtons = document.querySelectorAll(".tower-btn");
    towerButtons.forEach(btn => {
      const towerType = btn.dataset.tower;
      const canAfford = this.canAffordTower(towerType);
      
      if (canAfford) {
        btn.style.opacity = "1";
        btn.style.cursor = "pointer";
      } else {
        btn.style.opacity = "0.5";
        btn.style.cursor = "not-allowed";
      }
    });
  }

  canAffordTower(towerType) {
    // Импортируем TowerData здесь, чтобы избежать циклических зависимостей
    const towerCosts = {
      archer: 50,
      warrior: 75,
      mage: 100
    };
    
    const cost = towerCosts[towerType];
    return this.gameEngine.gameState.coins >= cost;
  }

  showMessage(text, duration = 3000) {
    const message = document.createElement("div");
    message.textContent = text;
    message.style.cssText = `
      position: absolute;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      font-size: 1.2em;
      z-index: 1000;
      pointer-events: none;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
      if (document.body.contains(message)) {
        document.body.removeChild(message);
      }
    }, duration);
  }

  showGameOver() {
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2000;
    `;
    
    overlay.innerHTML = `
      <div style="text-align: center; color: white;">
        <h1 style="font-size: 3em; margin-bottom: 20px;">Игра окончена!</h1>
        <p style="font-size: 1.5em; margin-bottom: 30px;">Счет: ${this.gameEngine.gameState.score}</p>
        <button id="restart-btn" style="padding: 15px 30px; font-size: 1.2em; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">Начать заново</button>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    document.getElementById("restart-btn").onclick = () => {
      location.reload();
    };
  }

  showVictory() {
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2000;
    `;
    
    overlay.innerHTML = `
      <div style="text-align: center; color: white;">
        <h1 style="font-size: 3em; margin-bottom: 20px; color: #FFD700;">Победа!</h1>
        <p style="font-size: 1.5em; margin-bottom: 30px;">Счет: ${this.gameEngine.gameState.score}</p>
        <button id="next-level-btn" style="padding: 15px 30px; font-size: 1.2em; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">Следующий уровень</button>
        <button id="menu-btn" style="padding: 15px 30px; font-size: 1.2em; background: #FF9800; color: white; border: none; border-radius: 5px; cursor: pointer;">В меню</button>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    document.getElementById("next-level-btn").onclick = () => {
      // Переход к следующему уровню
      location.reload();
    };
    
    document.getElementById("menu-btn").onclick = () => {
      this.gameEngine.manager.switchTo("main-menu");
    };
  }
}