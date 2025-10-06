// js/screens/SettingsScreen.js
import { BaseScreen } from "./BaseScreen.js";

export class SettingsScreen extends BaseScreen {
  async init() {
    this.container.innerHTML = `
      <div class="settings-screen" style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;color:white;background:rgba(0,0,0,0.8);backdrop-filter:blur(5px);">
        <div class="settings-content" style="background:rgba(255,255,255,0.1);padding:40px;border-radius:15px;backdrop-filter:blur(10px);max-width:500px;width:90%;">
          <h2 style="margin-bottom:30px;text-align:center;font-size:28px;">Настройки</h2>
          
          <div class="settings-section" style="margin-bottom:20px;">
            <h3 style="margin-bottom:15px;color:#3498db;">Звук</h3>
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
              <label style="flex:1;">Громкость музыки:</label>
              <input type="range" min="0" max="100" value="50" style="flex:1;">
            </div>
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
              <label style="flex:1;">Громкость звуков:</label>
              <input type="range" min="0" max="100" value="70" style="flex:1;">
            </div>
          </div>
          
          <div class="settings-section" style="margin-bottom:20px;">
            <h3 style="margin-bottom:15px;color:#3498db;">Графика</h3>
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
              <label style="flex:1;">Качество графики:</label>
              <select style="flex:1;padding:5px;border-radius:5px;background:#333;color:white;border:1px solid #555;">
                <option value="low">Низкое</option>
                <option value="medium" selected>Среднее</option>
                <option value="high">Высокое</option>
              </select>
            </div>
            <div style="display:flex;align-items:center;gap:10px;">
              <input type="checkbox" id="fullscreen" style="transform:scale(1.2);">
              <label for="fullscreen">Полноэкранный режим</label>
            </div>
          </div>
          
          <div class="settings-section" style="margin-bottom:30px;">
            <h3 style="margin-bottom:15px;color:#3498db;">Игровой процесс</h3>
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
              <input type="checkbox" id="auto-pause" checked style="transform:scale(1.2);">
              <label for="auto-pause">Автопауза при потере фокуса</label>
            </div>
            <div style="display:flex;align-items:center;gap:10px;">
              <input type="checkbox" id="show-tutorials" checked style="transform:scale(1.2);">
              <label for="show-tutorials">Показывать подсказки</label>
            </div>
          </div>
          
          <div class="settings-buttons" style="display:flex;gap:15px;justify-content:center;">
            <button id="close-settings"
                    style="padding:12px 24px;font-size:16px;background:linear-gradient(45deg, #e74c3c, #f39c12);border:none;border-radius:8px;cursor:pointer;color:white;transition:transform 0.2s ease;">
                    Закрыть
            </button>
            <button id="reset-settings"
                    style="padding:12px 24px;font-size:16px;background:linear-gradient(45deg, #7f8c8d, #95a5a6);border:none;border-radius:8px;cursor:pointer;color:white;transition:transform 0.2s ease;">
                    Сбросить
            </button>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    // Кнопка закрытия
    document.getElementById("close-settings").onclick = () => {
      screenManager.closeModal();
    };

    // Кнопка сброса настроек
    document.getElementById("reset-settings").onclick = () => {
      this.resetSettings();
    };

    // Добавляем эффекты наведения
    document.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'scale(1.05)';
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'scale(1)';
      });
    });
  }

  resetSettings() {
    // Сбрасываем все настройки к значениям по умолчанию
    document.querySelector('input[type="range"]').value = 50;
    document.querySelectorAll('input[type="range"]')[1].value = 70;
    document.querySelector('select').value = 'medium';
    document.getElementById('fullscreen').checked = false;
    document.getElementById('auto-pause').checked = true;
    document.getElementById('show-tutorials').checked = true;
    
    console.log('Settings reset to default');
  }

  async destroy() {
    this.container.innerHTML = "";
  }
}.innerHTML = "";
  }
}
