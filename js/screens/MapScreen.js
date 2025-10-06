// js/screens/MapScreen.js
import { BaseScreen } from "./BaseScreen.js";
import { SettingsScreen } from "./SettingsScreen.js";

export class MapScreen extends BaseScreen {
  async init({ faction }) {
    this.faction = faction;
    this.container.innerHTML = `
      <div class="map-screen" style="width:100%;height:100%;background:linear-gradient(135deg, #2c3e50, #34495e);color:white;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;">
        <div class="map-header" style="font-size:2em;margin-bottom:20px;text-align:center;">
          <div>Карта мира</div>
          <div style="font-size:0.6em;margin-top:10px;color:#bdc3c7;">Вы выбрали сторону: ${faction === "light" ? "Свет" : "Тьма"}</div>
        </div>
        
        <div class="levels-container" style="display:flex;flex-wrap:wrap;gap:20px;justify-content:center;max-width:800px;">
          <div class="level-card" data-level="1" style="width:150px;height:150px;background:linear-gradient(45deg, #e74c3c, #f39c12);border-radius:15px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;transition:transform 0.3s ease;box-shadow:0 5px 15px rgba(0,0,0,0.3);">
            <div style="font-size:2em;margin-bottom:10px;">🏰</div>
            <div style="font-size:1.2em;font-weight:bold;">Уровень 1</div>
            <div style="font-size:0.8em;opacity:0.8;">Первый уровень</div>
          </div>
          
          <div class="level-card locked" data-level="2" style="width:150px;height:150px;background:linear-gradient(45deg, #7f8c8d, #95a5a6);border-radius:15px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:not-allowed;opacity:0.5;box-shadow:0 5px 15px rgba(0,0,0,0.3);">
            <div style="font-size:2em;margin-bottom:10px;">🔒</div>
            <div style="font-size:1.2em;font-weight:bold;">Уровень 2</div>
            <div style="font-size:0.8em;opacity:0.8;">Заблокирован</div>
          </div>
          
          <div class="level-card locked" data-level="3" style="width:150px;height:150px;background:linear-gradient(45deg, #7f8c8d, #95a5a6);border-radius:15px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:not-allowed;opacity:0.5;box-shadow:0 5px 15px rgba(0,0,0,0.3);">
            <div style="font-size:2em;margin-bottom:10px;">🔒</div>
            <div style="font-size:1.2em;font-weight:bold;">Уровень 3</div>
            <div style="font-size:0.8em;opacity:0.8;">Заблокирован</div>
          </div>
        </div>
        
        <div class="map-controls" style="position:absolute;top:20px;right:20px;display:flex;gap:10px;">
          <button id="settings-btn" style="padding:10px 15px;font-size:1.2em;border:none;border-radius:8px;background:rgba(0,0,0,0.7);color:#3498db;cursor:pointer;border:2px solid #3498db;transition:all 0.3s ease;">⚙️</button>
          <button id="back-to-menu-btn" style="padding:10px 15px;font-size:1.2em;border:none;border-radius:8px;background:rgba(0,0,0,0.7);color:#e74c3c;cursor:pointer;border:2px solid #e74c3c;transition:all 0.3s ease;">🏠</button>
        </div>
      </div>
    `;

    // Добавляем обработчики событий
    this.bindEvents();
  }

  bindEvents() {
    // Кнопка настроек
    document.getElementById("settings-btn").onclick = () => {
      screenManager.switchTo('settings-screen', {}, true, true);
    };

    // Кнопка возврата в меню
    document.getElementById("back-to-menu-btn").onclick = () => {
      screenManager.switchTo('main-menu', {}, true);
    };

    // Карточки уровней
    document.querySelectorAll('.level-card:not(.locked)').forEach(card => {
      card.addEventListener('click', () => {
        const levelId = parseInt(card.dataset.level);
        this.startLevel(levelId);
      });
      
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'scale(1.05)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'scale(1)';
      });
    });
  }

  async startLevel(levelId) {
    console.log(`Starting level ${levelId}`);
    await screenManager.switchTo('level-screen', { levelId: levelId });
  }

  async destroy() {
    this.container.innerHTML = "";
  }
}nerHTML = "";
  }
}
