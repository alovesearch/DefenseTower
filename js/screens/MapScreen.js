// js/screens/MapScreen.js
import { BaseScreen } from "./BaseScreen.js";
import { SettingsScreen } from "./SettingsScreen.js";

export class MapScreen extends BaseScreen {
  async init({ faction }) {
    this.container.innerHTML = `
      <div class="map-screen" style="width:100%;height:100%;background:#111;color:white;display:flex;flex-direction:column;align-items:center;justify-content:center;">
        <div class="map-header" style="font-size:2em;margin-bottom:20px;">Вы выбрали сторону: ${faction === "light" ? "Свет" : "Тьма"}</div>
        <div style="display:flex;gap:20px;margin-bottom:20px;">
          <button id="start-level-btn" style="padding:15px 30px;font-size:1.2em;border:none;border-radius:8px;background:#4CAF50;color:white;cursor:pointer;">🎮 Начать уровень 1</button>
          <button id="settings-btn" style="padding:15px 30px;font-size:1.2em;border:none;border-radius:8px;background:#444;color:white;cursor:pointer;">⚙️ Настройки</button>
        </div>
        <div style="font-size:1em;color:#888;text-align:center;max-width:600px;">
          <p>Добро пожаловать в Tower Defense!</p>
          <p>Защитите эльфийскую деревню от нападения орков.</p>
          <p>Стройте башни, уничтожайте врагов и защищайте героя!</p>
        </div>
      </div>
    `;

    document.getElementById("start-level-btn").onclick = () => {
      this.manager.switchTo("level-screen", { levelId: 1, faction: faction });
    };

    document.getElementById("settings-btn").onclick = () => {
      this.manager.switchTo("settings-screen");
    };
  }

  async destroy() {
    this.container.innerHTML = "";
  }
}