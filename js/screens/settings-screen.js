/**
 * Контроллер экрана настроек
 */
class SettingsScreenController {
    constructor() {
        this.settingsElement = document.getElementById('settings-screen');
        this.backToMenuBtn = document.getElementById('back-to-menu');
        
        this.bindEvents();
    }
    
    /**
     * Загружает экран
     * @param {Object} data - Данные для загрузки
     */
    async load(data = {}) {
        console.log('Settings screen loaded');
    }
    
    /**
     * Активирует экран
     * @param {Object} data - Данные для активации
     */
    async activate(data = {}) {
        console.log('Settings screen activated');
    }
    
    /**
     * Деактивирует экран
     */
    async deactivate() {
        console.log('Settings screen deactivated');
    }
    
    /**
     * Выгружает экран
     */
    async unload() {
        console.log('Settings screen unloaded');
    }
    
    /**
     * Привязывает события
     */
    bindEvents() {
        this.backToMenuBtn.addEventListener('click', () => {
            this.goBackToMenu();
        });
    }
    
    /**
     * Возвращается в главное меню
     */
    async goBackToMenu() {
        await screenManager.switchTo('main-menu');
    }
}

// Регистрируем контроллер экрана настроек
document.addEventListener('DOMContentLoaded', () => {
    const settingsScreenController = new SettingsScreenController();
    screenManager.registerScreen('settings-screen', settingsScreenController);
});