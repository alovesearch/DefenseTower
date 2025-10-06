// js/screens/LevelScreen.js
import { BaseScreen } from "./BaseScreen.js";
import { GameEngine } from "../game/GameEngine.js";
import { LevelData } from "../data/LevelData.js";

export class LevelScreen extends BaseScreen {
  constructor(container, manager) {
    super(container, manager);
    this.gameEngine = null;
    this.levelData = null;
  }

  async init({ levelId = 1, faction = "light" }) {
    this.container.innerHTML = `
      <div class="level-screen" style="width:100%;height:100%;position:relative;background:#000;">
        <canvas id="game-canvas" style="width:100%;height:100%;display:block;"></canvas>
        <div id="game-ui" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:10;">
          <div id="top-ui" style="position:absolute;top:10px;left:10px;right:10px;display:flex;justify-content:space-between;pointer-events:auto;">
            <div id="resources" style="display:flex;gap:20px;color:white;font-size:1.2em;">
              <div id="coins">💰 100</div>
              <div id="lives">❤️ 20</div>
              <div id="wave">🌊 Волна 0/2</div>
            </div>
            <div id="controls" style="display:flex;gap:10px;">
              <button id="start-wave" style="padding:10px 20px;background:#4CAF50;color:white;border:none;border-radius:5px;cursor:pointer;">Начать волну</button>
              <button id="pause-btn" style="padding:10px 20px;background:#FF9800;color:white;border:none;border-radius:5px;cursor:pointer;">⏸️</button>
            </div>
          </div>
          <div id="tower-panel" style="position:absolute;bottom:10px;left:10px;right:10px;display:flex;gap:10px;justify-content:center;pointer-events:auto;">
            <button class="tower-btn" data-tower="archer">🏹 Лучник (50)</button>
            <button class="tower-btn" data-tower="warrior">⚔️ Воин (75)</button>
            <button class="tower-btn" data-tower="mage">🔮 Маг (100)</button>
          </div>
        </div>
      </div>
    `;

    // Загружаем данные уровня
    this.levelData = LevelData.getLevel(levelId, faction);
    
    // Инициализируем игровой движок
    const canvas = document.getElementById("game-canvas");
    this.gameEngine = new GameEngine(canvas, this.levelData, faction);
    
    // Настраиваем обработчики событий
    this.setupEventHandlers();
    
    // Запускаем игру
    await this.gameEngine.start();
  }

  setupEventHandlers() {
    // Кнопка начала волны
    document.getElementById("start-wave").onclick = () => {
      this.gameEngine.startNextWave();
    };

    // Кнопка паузы
    document.getElementById("pause-btn").onclick = () => {
      this.gameEngine.togglePause();
    };

    // Кнопки башен
    document.querySelectorAll(".tower-btn").forEach(btn => {
      btn.onclick = () => {
        const towerType = btn.dataset.tower;
        this.gameEngine.setTowerMode(towerType);
      };
    });

    // Клики по канвасу для размещения башен
    const canvas = document.getElementById("game-canvas");
    canvas.onclick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.gameEngine.handleCanvasClick(x, y);
    };
  }

  async destroy() {
    if (this.gameEngine) {
      this.gameEngine.destroy();
    }
    this.container.innerHTML = "";
  }
}