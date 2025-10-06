// js/screens/MainMenuScreen.js
import { BaseScreen } from "./BaseScreen.js";
import { MapScreen } from "./MapScreen.js";

export class MainMenuScreen extends BaseScreen {
  async init() {
    this.container.innerHTML = `
      <div class="main-menu" style="width:100%;height:100%;position:relative;">
        <img src="img/main.png" id="main-bg" style="width:100%;height:100%;object-fit:cover;">
        <div id="start-text"
             style="position:absolute;bottom:10%;width:100%;text-align:center;color:white;font-size:2em;cursor:pointer;text-shadow:0 0 5px black;">
             Нажмите, чтобы начать игру
        </div>
      </div>
    `;

    const startText = document.getElementById("start-text");
    startText.onclick = () => {
      startText.remove();
      this.showSides();
    };
  }

  showSides() {
    const overlay = document.createElement("div");
    overlay.className = "sides-overlay";
    overlay.style.cssText = `
      position:absolute;top:0;left:0;width:100%;height:100%;display:flex;
    `;
    overlay.innerHTML = `
      <div class="side light" style="flex:1;display:flex;justify-content:center;align-items:center;color:white;font-size:2em;background:rgba(255,255,255,0.1);cursor:pointer;">Свет</div>
      <div class="side dark" style="flex:1;display:flex;justify-content:center;align-items:center;color:white;font-size:2em;background:rgba(0,0,0,0.4);cursor:pointer;">Тьма</div>
    `;
    this.container.appendChild(overlay);

    overlay.querySelectorAll(".side").forEach(side => {
      side.onclick = () => this.selectSide(side);
    });
  }

  selectSide(side) {
    const other = [...side.parentElement.children].find(s => s !== side);
    other.style.filter = "brightness(0.5)";
    if (!side.querySelector(".confirm")) {
      const btn = document.createElement("button");
      btn.textContent = "Подтвердить";
      btn.className = "confirm";
      btn.style.cssText = `
        display:block;margin-top:20px;padding:10px 20px;
        background:gold;border:none;border-radius:10px;cursor:pointer;
        font-      btn.onclick = () =>
        this.manager.switchTo("map-screen", { faction: side.classList.contains("light") ? "light" : "dark" });ide.classList.contains("light") ? "light" : "dark" });
    }
  }

  async destroy() {
    this.container.innerHTML = "";
  }
}
