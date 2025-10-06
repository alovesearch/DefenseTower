// js/screens/BaseScreen.js
export class BaseScreen {
  constructor(container, manager) {
    this.container = container;
    this.manager = manager;
  }

  async init() {}
  async destroy() {}
}
