// js/screens/LoadingScreen.js
import { BaseScreen } from "./BaseScreen.js";
import { loadAssets } from "../utils/loader.js";

export class LoadingScreen extends BaseScreen {
  async init({ nextScreen, data }) {
    this.container.innerHTML = `
      <div class="loading-screen" style="display:flex;justify-content:center;align-items:center;height:100%;color:white;flex-direction:column;">
        <img src="img/loading-bg.png" style="width:100%;height:100%;object-fit:cover;position:absolute;z-index:0;">
        <div style="position:relative;z-index:1;font-size:2em;">Подготовка игры...</div>
      </div>
    `;

    console.log("Loading screen loaded");

    // 🔧 Загрузка ресурсов
    await loadAssets(["img/main.png"]);

    // Имитация загрузки
    setTimeout(() => {
      this.manager.switchTo(nextScreen, data);
    }, 1000);
  }

  async destroy() {
    this.container.innerHTML = "";
  }
}r.innerHTML = "";
  }
}
