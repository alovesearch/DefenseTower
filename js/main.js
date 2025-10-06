import { ScreenManager } from "./screenManager.js";
import { LoadingScreen } from "./screens/LoadingScreen.js";
import { MainMenuScreen } from "./screens/MainMenuScreen.js";

window.addEventListener("load", () => {
  const container = document.getElementById("game-container");
  const manager = new ScreenManager(container);

  // 🔁 Показ загрузочного экрана
  manager.show(LoadingScreen, { nextScreen: MainMenuScreen });

  // 🧱 Регистрация Service Worker (для PWA)
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js").catch(console.error);
  }
});
