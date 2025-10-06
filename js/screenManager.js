// js/screenManager.js
export class ScreenManager {
  constructor(container) {
    this.container = container;
    this.currentScreen = null;
  }

  async show(ScreenClass, data = {}) {
    if (this.currentScreen) {
      await this.currentScreen.destroy();
      this.container.innerHTML = "";
    }

    this.currentScreen = new ScreenClass(this.container, this);
    await this.currentScreen.init(data);
  }
}
