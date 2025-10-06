// js/screens/SettingsScreen.js
import { BaseScreen } from "./BaseScreen.js";
import { MainMenuScreen } from "./MainMenuScreen.js";

export class SettingsScreen extends BaseScreen {
  async init() {
    this.container.innerHTML = `
      <div class="settings-screen" style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;color:white;background:#222;">
        <h2 style="margin-bottom:30px;">Настройки</h2>
        <button id="back-to-menu"
                style="padding:10px 20px;font-size:1.2em;background:gold;border:none;border-radius:10px;cursor:pointer;">
                🏠 Главный экран
        </button>
      </div>
    `;

    document.getElementById("back-to-menu").onclick = () => {
      this.manager.show(MainMenuScreen);
    };
  }

  async destroy() {
    this.container.innerHTML = "";
  }
}
