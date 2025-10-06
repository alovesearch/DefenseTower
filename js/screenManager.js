// js/screenManager.js
export class ScreenManager {
  constructor(container) {
    this.container = container;
    this.currentScreen = null;
    this.screens = new Map();
    this.transitionInProgress = false;
  }

  registerScreen(name, ScreenClass) {
    this.screens.set(name, ScreenClass);
    console.log(`Screen controller registered: ${name}`);
  }

  async show(ScreenClass, data = {}) {
    if (this.transitionInProgress) {
      console.log("Transition already in progress");
      return;
    }

    this.transitionInProgress = true;

    if (this.currentScreen) {
      await this.currentScreen.destroy();
      this.container.innerHTML = "";
    }

    this.currentScreen = new ScreenClass(this.container, this);
    await this.currentScreen.init(data);
    
    console.log(`Switched to screen: ${ScreenClass.name}`);
    this.transitionInProgress = false;
  }

  async switchTo(screenName, data = {}) {
    const ScreenClass = this.screens.get(screenName);
    if (ScreenClass) {
      await this.show(ScreenClass, data);
    } else {
      console.error(`Screen not found: ${screenName}`);
    }
  }
}t(data);
  }
}
