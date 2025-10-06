import { ScreenManager } from "./screenManager.js";
import { LoadingScreen } from "./screens/LoadingScreen.js";
import { MainMenuScreen } from "./screens/MainMenuScreen.js";
import { MapScreen } from "./screens/MapScreen.js";
import { LevelScreen } from "./screens/LevelScreen.js";
import { SettingsScreen } from "./screens/SettingsScreen.js";

window.addEventListener("load", () => {
  const container = document.getElementById("game-container");
  const manager = new ScreenManager(container);

  // Регистрация экранов
  manager.registerScreen("loading-screen", LoadingScreen);
  manager.registerScreen("main-menu", MainMenuScreen);
  manager.registerScreen("map-screen", MapScreen);
  manager.registerScreen("level-screen", LevelScreen);
  manager.registerScreen("settings-screen", SettingsScreen);

  console.log("ScreenManager initialized with screens:", Array.from(manager.screens.keys()));

  // 🔁 Показ загрузочного экрана
  manager.switchTo("loading-screen", { nextScreen: "main-menu" });

  // 🧱 Регистрация Service Worker (для PWA)
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js").catch(console.error);
  }
});ror);
  }
});
