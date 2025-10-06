// js/screens/MapScreen.js
import { BaseScreen } from "./BaseScreen.js";
import { SettingsScreen } from "./SettingsScreen.js";

export class MapScreen extends BaseScreen {
  async init({ faction }) {
    this.container.innerHTML = `
      <div class="map-screen" style="width:100%;height:100%;background:#111;color:white;display:flex;flex-direction:column;align-items:center;justify-content:center;">
        <div class="map-header" style="font-size:2em;margin-bottom:20px;">Вы выбрали сторону: ${faction === "light" ? "Свет" : "Тьма"}</div>
        <button id="settings-btn" style="padding:10px 20px;font-size:1.2em;border:none;border-radius:8px;background:#444;color:white;cursor:pointer;">⚙️ Настройки</button>
      </div>
    `;

    document.getElementById("settings-btn").onclick = () => {
      this.manager.show(SettingsScreen);
    };
  }

  async destroy() {
    this.container.innerHTML = "";
  }
}
